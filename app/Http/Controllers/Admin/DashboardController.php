<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Child;
use App\Models\Measurement;
use App\Models\Posyandu;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // ---- Statistik Utama ----
        $totalBunda   = User::where('role', 'pengguna')->count();
        $totalKader   = User::where('role', 'kader')->count();
        $totalAnak    = Child::count();
        $totalPosyandu = Posyandu::where('status', 'aktif')->count();

        // ---- Data Gizi ----
        $latestMeasurements = DB::table('measurements')
            ->whereIn('id', function ($query) {
                $query->select(DB::raw('MAX(id)'))
                      ->from('measurements')
                      ->where('is_verified', true)
                      ->groupBy('child_id');
            })
            ->get();

        $giziStats = [
            'gizi_buruk'  => $latestMeasurements->where('status_gizi', 'Gizi Buruk')->count(),
            'gizi_kurang' => $latestMeasurements->where('status_gizi', 'Gizi Kurang')->count(),
            'gizi_baik'   => $latestMeasurements->where('status_gizi', 'Gizi Baik (Normal)')->count(),
            'gizi_lebih'  => $latestMeasurements->where('status_gizi', 'Gizi Lebih')->count(),
        ];

        $stuntingStats = [
            'stunted'        => $latestMeasurements->where('status_tinggi', 'Pendek (Stunted)')->count(),
            'severelyStunted' => $latestMeasurements->where('status_tinggi', 'Sangat Pendek (Severely Stunted)')->count(),
            'normal'         => $latestMeasurements->whereIn('status_tinggi', ['Normal', 'Tinggi'])->count(),
        ];

        // ---- Akun Nonaktif ----
        $akunNonaktif = User::where('status', 'nonaktif')->count();

        // ---- Pengguna Terbaru ----
        $recentUsers = User::whereIn('role', ['pengguna', 'kader'])
            ->latest()
            ->take(5)
            ->get(['id', 'name', 'role', 'email', 'created_at']);

        // ---- Distribusi Gizi per Kecamatan ----
        $giziPerWilayah = User::where('role', 'pengguna')
            ->whereNotNull('kecamatan')
            ->select('kecamatan', DB::raw('count(*) as total_bunda'))
            ->groupBy('kecamatan')
            ->take(8)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'totalBunda'    => $totalBunda,
                'totalKader'    => $totalKader,
                'totalAnak'     => $totalAnak,
                'totalPosyandu' => $totalPosyandu,
                'akunNonaktif'  => $akunNonaktif,
            ],
            'giziStats'      => $giziStats,
            'stuntingStats'  => $stuntingStats,
            'recentUsers'    => $recentUsers,
            'giziPerWilayah' => $giziPerWilayah,
        ]);
    }
}
