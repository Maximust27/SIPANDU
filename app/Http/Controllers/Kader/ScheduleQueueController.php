<?php

namespace App\Http\Controllers\Kader;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Queue;
use App\Models\Child;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ScheduleQueueController extends Controller
{
    /**
     * Tampilkan halaman jadwal & antrian dengan data real dari DB
     */
    public function index()
    {
        $kader = Auth::user();

        // Jadwal aktif kader ini (upcoming atau berlangsung hari ini)
        $activeSchedule = Schedule::with(['posyandu', 'queues.child.parent'])
            ->where('kader_id', $kader->id)
            ->whereIn('status', ['upcoming', 'berlangsung'])
            ->where('scheduled_date', '>=', now()->toDateString())
            ->orderBy('scheduled_date')
            ->first();

        // Data antrian untuk jadwal aktif
        $queues = [];
        if ($activeSchedule) {
            $queues = $activeSchedule->queues->sortBy('queue_number')->map(function ($q) {
                return [
                    'id'         => $q->id,
                    'no'         => $q->ticket_code,
                    'childName'  => $q->child?->name,
                    'motherName' => $q->child?->parent?->name,
                    'status'     => ucfirst($q->status),
                    'time'       => $q->called_at ? $q->called_at->format('H:i') : '-',
                    'agenda'     => $q->agenda,
                ];
            })->values();
        }

        // Semua jadwal kader (riwayat)
        $allSchedules = Schedule::where('kader_id', $kader->id)
            ->withCount('queues')
            ->orderByDesc('scheduled_date')
            ->take(10)
            ->get()
            ->map(fn($s) => [
                'id'             => $s->id,
                'date'           => $s->scheduled_date->format('Y-m-d'),
                'time_start'     => $s->time_start,
                'time_end'       => $s->time_end,
                'agenda'         => $s->agenda,
                'status'         => $s->status,
                'total_antrian'  => $s->queues_count,
            ]);

        return Inertia::render('Kader/ScheduleQueue', [
            'activeSchedule' => $activeSchedule ? [
                'id'       => $activeSchedule->id,
                'date'     => $activeSchedule->scheduled_date->format('Y-m-d'),
                'agenda'   => $activeSchedule->agenda,
                'location' => $activeSchedule->posyandu?->name . ', ' . $activeSchedule->posyandu?->address,
            ] : null,
            'initialQueues'  => $queues,
            'allSchedules'   => $allSchedules,
        ]);
    }

    /**
     * Buat jadwal posyandu baru
     */
    public function store(Request $request)
    {
        $kader = Auth::user();

        $request->validate([
            'date'       => 'required|date|after_or_equal:today',
            'timeStart'  => 'required',
            'timeEnd'    => 'required|after:timeStart',
            'agenda'     => 'required|string|max:500',
            'location'   => 'nullable|string|max:255',
        ]);

        Schedule::create([
            'posyandu_id'    => $kader->posyandu_id,
            'kader_id'       => $kader->id,
            'scheduled_date' => $request->date,
            'time_start'     => $request->timeStart,
            'time_end'       => $request->timeEnd,
            'agenda'         => $request->agenda,
            'status'         => 'upcoming',
        ]);

        return redirect()->back()->with('success', 'Jadwal posyandu berhasil dibuat dan notifikasi terkirim.');
    }

    /**
     * Panggil nomor antrian (ubah status jadi 'diperiksa')
     */
    public function callQueue(Request $request, $queueId)
    {
        $queue = Queue::findOrFail($queueId);

        // Set yang sedang diperiksa sebelumnya jadi selesai otomatis
        Queue::where('schedule_id', $queue->schedule_id)
             ->where('status', 'diperiksa')
             ->update(['status' => 'selesai', 'finished_at' => now()]);

        $queue->update([
            'status'    => 'diperiksa',
            'called_at' => now(),
        ]);

        return redirect()->back()->with('success', "Memanggil antrian {$queue->ticket_code}.");
    }

    /**
     * Selesaikan pemeriksaan antrian
     */
    public function finishQueue(Request $request, $queueId)
    {
        $queue = Queue::findOrFail($queueId);

        $queue->update([
            'status'      => 'selesai',
            'finished_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Pemeriksaan selesai, kehadiran tercatat.');
    }
}
