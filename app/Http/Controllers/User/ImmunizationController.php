<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Models\Queue;
use App\Models\Child;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ImmunizationController extends Controller
{
    /**
     * Tampilkan halaman imunisasi & jadwal posyandu terdekat
     */
    public function index()
    {
        $user = Auth::user();

        // Jadwal posyandu yang akan datang (di kelurahan user, termasuk yang sedang berlangsung hari ini)
        $upcomingSchedules = Schedule::with('posyandu')
            ->whereIn('status', ['upcoming', 'berlangsung'])
            ->where('scheduled_date', '>=', now()->toDateString())
            ->whereHas('posyandu', fn($q) => $q->where('kelurahan', $user->kelurahan))
            ->orderBy('scheduled_date')
            ->take(5)
            ->get()
            ->map(fn($s) => [
                'id'         => $s->id,
                'date'       => $s->scheduled_date->format('Y-m-d'),
                'date_display' => $s->scheduled_date->translatedFormat('l, d F Y'),
                'time_start' => $s->time_start,
                'time_end'   => $s->time_end,
                'agenda'     => $s->agenda,
                'location'   => $s->posyandu?->name . ', ' . $s->posyandu?->address,
                'posyandu'   => $s->posyandu?->name,
            ]);

        // Anak-anak milik user (untuk pilih antrian)
        $children = Child::where('user_id', $user->id)
            ->get(['id', 'name', 'gender', 'birth_date']);

        // Antrian aktif milik user (tiket yang sudah diambil, termasuk yang sudah selesai hari ini)
        $activeQueues = Queue::with(['schedule.posyandu', 'child'])
            ->where('user_id', $user->id)
            ->whereIn('status', ['menunggu', 'diperiksa', 'selesai'])
            ->whereHas('schedule', fn($q) => $q->where('scheduled_date', '>=', now()->toDateString()))
            ->get()
            ->map(fn($q) => [
                'id'          => $q->id,
                'ticket_code' => $q->ticket_code,
                'child_id'    => $q->child_id,
                'schedule_id' => $q->schedule_id,
                'child_name'  => $q->child?->name,
                'status'      => $q->status,
                'agenda'      => $q->agenda,
                'schedule_date' => $q->schedule?->scheduled_date?->format('d M Y'),
                'posyandu'    => $q->schedule?->posyandu?->name,
            ]);

        return Inertia::render('User/Immunization', [
            'upcomingSchedules' => $upcomingSchedules,
            'children'          => $children,
            'activeQueues'      => $activeQueues,
        ]);
    }

    /**
     * Ambil tiket antrian posyandu
     */
    public function takeQueue(Request $request)
    {
        $request->validate([
            'schedule_id' => 'required|exists:schedules,id',
            'child_id'    => 'required|exists:children,id',
            'agenda'      => 'nullable|string|max:255',
        ]);

        $user     = Auth::user();
        $schedule = Schedule::findOrFail($request->schedule_id);
        $child    = Child::where('id', $request->child_id)
                         ->where('user_id', $user->id)
                         ->firstOrFail();

        // Cek apakah anak sudah punya antrian di jadwal ini
        $existing = Queue::where('schedule_id', $schedule->id)
                         ->where('child_id', $child->id)
                         ->first();

        if ($existing) {
            return redirect()->back()->with('error', "{$child->name} sudah memiliki tiket antrian: {$existing->ticket_code}");
        }

        // Hitung nomor antrian berikutnya
        $nextNumber = Queue::where('schedule_id', $schedule->id)->max('queue_number') + 1;
        $ticketCode = 'A-' . str_pad($nextNumber, 2, '0', STR_PAD_LEFT);

        Queue::create([
            'schedule_id'  => $schedule->id,
            'child_id'     => $child->id,
            'user_id'      => $user->id,
            'queue_number' => $nextNumber,
            'ticket_code'  => $ticketCode,
            'agenda'       => $request->agenda ?? 'Timbang & Ukur',
            'status'       => 'menunggu',
        ]);

        return redirect()->back()->with('success', "Tiket antrian {$ticketCode} untuk {$child->name} berhasil diambil!");
    }
}