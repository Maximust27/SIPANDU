<?php

namespace App\Http\Controllers\Kader;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\Measurement;
use App\Models\Queue;
use App\Models\Schedule;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $kader = Auth::user();

        // Statistik wilayah kader
        $childQuery = Child::query();
        if ($kader->posyandu_id) {
            $childQuery->where('posyandu_id', $kader->posyandu_id);
        } elseif ($kader->kelurahan) {
            $childQuery->whereHas('parent', fn($q) => $q->where('kelurahan', $kader->kelurahan));
        }

        $totalAnak        = $childQuery->count();
        $butuhVerifikasi  = $childQuery->clone()->where('status', 'Butuh Verifikasi')->count();

        // Jadwal aktif hari ini
        $jadwalHariIni = Schedule::where('kader_id', $kader->id)
            ->whereDate('scheduled_date', today())
            ->first();

        // Total antrian hari ini
        $totalAntrian = $jadwalHariIni
            ? Queue::where('schedule_id', $jadwalHariIni->id)->count()
            : 0;

        $antrianSelesai = $jadwalHariIni
            ? Queue::where('schedule_id', $jadwalHariIni->id)->where('status', 'selesai')->count()
            : 0;

        // Jadwal posyandu berikutnya
        $jadwalBerikutnya = Schedule::where('kader_id', $kader->id)
            ->where('scheduled_date', '>', today())
            ->where('status', 'upcoming')
            ->orderBy('scheduled_date')
            ->first();

        // Daftar antrian aktif hari ini untuk dashboard
        $todayQueues = [];
        if ($jadwalHariIni) {
            $todayQueues = Queue::where('schedule_id', $jadwalHariIni->id)
                ->with('child.parent')
                ->whereIn('status', ['menunggu', 'diperiksa'])
                ->orderBy('queue_number')
                ->take(5)
                ->get()
                ->map(function ($q) {
                    return [
                        'id'         => $q->id,
                        'no'         => $q->ticket_code,
                        'childName'  => $q->child?->name ?? 'Anak tidak dikenal',
                        'motherName' => $q->child?->parent?->name ?? 'Ibu tidak dikenal',
                        'status'     => $q->status === 'diperiksa' ? 'Diperiksa' : 'Menunggu',
                        'agenda'     => $q->agenda ?? 'Pemeriksaan Rutin',
                    ];
                });
        }

        return Inertia::render('Kader/Dashboard', [
            'stats' => [
                'totalAnak'       => $totalAnak,
                'butuhVerifikasi' => $butuhVerifikasi,
                'totalAntrian'    => $totalAntrian,
                'antrianSelesai'  => $antrianSelesai,
            ],
            'jadwalHariIni'    => $jadwalHariIni ? [
                'tanggal'  => $jadwalHariIni->scheduled_date->format('d M Y'),
                'agenda'   => $jadwalHariIni->agenda,
                'jam'      => substr($jadwalHariIni->time_start, 0, 5) . ' - ' . substr($jadwalHariIni->time_end, 0, 5),
            ] : null,
            'jadwalBerikutnya' => $jadwalBerikutnya ? [
                'tanggal' => $jadwalBerikutnya->scheduled_date->format('d M Y'),
                'agenda'  => $jadwalBerikutnya->agenda,
            ] : null,
            'todayQueues'      => $todayQueues,
        ]);
    }
}
