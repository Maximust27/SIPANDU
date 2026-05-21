<?php

namespace App\Http\Controllers\Kader;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\Measurement;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AIMonitoringController extends Controller
{
    /**
     * Tampilkan halaman AI Monitoring dengan data anak berisiko dari DB
     */
    public function index()
    {
        $kader = Auth::user();

        $query = Child::with(['measurements' => function ($q) {
            $q->where('is_verified', true)->latest('measured_at');
        }, 'parent']);

        if ($kader->posyandu_id) {
            $query->where('posyandu_id', $kader->posyandu_id);
        } elseif ($kader->kelurahan) {
            $query->whereHas('parent', fn($q) => $q->where('kelurahan', $kader->kelurahan));
        }

        $children = $query->get();

        // Pisahkan anak berdasarkan risiko
        $riskyChildren = $children->filter(function ($child) {
            $lastM = $child->measurements->first();
            if (!$lastM) return false;
            return $lastM->isStunted() || $lastM->isNutritionProblem();
        });

        $normalChildren = $children->filter(function ($child) {
            $lastM = $child->measurements->first();
            return $lastM && !$lastM->isStunted() && !$lastM->isNutritionProblem();
        });

        $noDataChildren = $children->filter(fn($c) => $c->measurements->isEmpty());

        // Group by Kelurahan untuk live wilayah stats
        $regionStats = [];
        $grouped = $children->groupBy(function($c) {
            return $c->parent?->kelurahan ?? 'Lainnya';
        });
        
        foreach ($grouped as $kelurahan => $kids) {
            $tinggi = 0;
            $sedang = 0;
            $normal = 0;
            foreach ($kids as $child) {
                $lastM = $child->measurements->first();
                if (!$lastM) continue;
                if ($lastM->isStunted()) {
                    $tinggi++;
                } elseif ($lastM->isNutritionProblem()) {
                    $sedang++;
                } else {
                    $normal++;
                }
            }
            if ($tinggi + $sedang + $normal > 0) {
                $color = 'rose';
                if ($tinggi === 0 && $sedang > 0) $color = 'orange';
                if ($tinggi === 0 && $sedang === 0) $color = 'emerald';
                
                $regionStats[] = [
                    'rt' => 'Kel. ' . $kelurahan,
                    'rw' => '',
                    'tinggi' => $tinggi,
                    'sedang' => $sedang,
                    'normal' => $normal,
                    'color' => $color
                ];
            }
        }
        
        if (empty($regionStats)) {
            $regionStats[] = [
                'rt' => 'Wilayah Umum',
                'rw' => '',
                'tinggi' => 0,
                'sedang' => 0,
                'normal' => 0,
                'color' => 'emerald'
            ];
        }

        $formatChild = function($child) {
            $lastM = $child->measurements->first();
            $weight = $lastM?->weight ?? 0;
            $height = $lastM?->height ?? 0;
            $ageMonths = $child->age_in_months;
            
            $aiDetection = "Perkembangan normal. Pertumbuhan sesuai dengan kurva WHO.";
            $aiRecommendation = "Lanjutkan pemberian gizi seimbang, pastikan imunisasi dasar lengkap, dan ikuti posyandu rutin bulan depan.";
            
            if ($lastM) {
                $isStunted = $lastM->isStunted();
                $isNutrition = $lastM->isNutritionProblem();
                
                if ($isStunted && $isNutrition) {
                    $aiDetection = "Mengalami pertumbuhan berat badan stagnan/menurun di bawah standar dan tinggi badan berada di bawah kurva normal (-2 SD). Terdeteksi ganda stunting & gizi kurang/buruk.";
                    $aiRecommendation = "Segera rujuk ke Puskesmas/Dokter Anak. Lakukan intervensi PMT Pemulihan tinggi protein hewani (susu, telur, daging) selama 90 hari.";
                } elseif ($isStunted) {
                    $aiDetection = "Tinggi badan (" . $height . " cm) berada di bawah garis -2 SD kurva WHO. Terdeteksi risiko " . strtolower($lastM->status_tinggi) . ".";
                    $aiRecommendation = "Evaluasi pola asuh & sanitasi lingkungan. Berikan PMT protein hewani setiap hari, dan rutin pantau pertumbuhan tinggi badan.";
                } elseif ($isNutrition) {
                    $aiDetection = "Berat badan (" . $weight . " kg) tidak mencukupi untuk usia " . $ageMonths . " bulan. Terdeteksi " . strtolower($lastM->status_gizi) . ".";
                    $aiRecommendation = "Evaluasi frekuensi & porsi makan anak. Tambahkan lemak sehat (minyak/santan) dan tingkatkan asupan kalori & protein harian.";
                }
            }
            
            return [
                'id'           => $child->id,
                'name'         => $child->name,
                'gender'       => $child->gender,
                'ageStr'       => $child->age_display,
                'ageMonths'    => $ageMonths,
                'motherName'   => $child->parent?->name,
                'phone'        => $child->parent?->phone,
                'region'       => 'Kel. ' . ($child->parent?->kelurahan ?? 'Umum'),
                'lastWeight'   => $weight,
                'lastHeight'   => $height,
                'statusGizi'   => $lastM?->status_gizi,
                'statusTinggi' => $lastM?->status_tinggi,
                'zScoreBbu'    => $lastM?->z_score_bbu,
                'zScoreTbu'    => $lastM?->z_score_tbu,
                'lastMeasured' => $lastM?->measured_at?->format('d M Y') ?? '-',
                'riskLevel'    => $lastM?->isStunted() ? 'Tinggi' : 
                                  ($lastM?->isNutritionProblem() ? 'Sedang' : 'Rendah'),
                'aiDetection'  => $aiDetection,
                'aiRecommendation' => $aiRecommendation,
            ];
        };

        return Inertia::render('Kader/AIMonitoring', [
            'riskyChildren'  => $riskyChildren->map($formatChild)->values(),
            'normalChildren' => $normalChildren->map($formatChild)->values(),
            'noDataChildren' => $noDataChildren->map($formatChild)->values(),
            'regionStats'    => $regionStats,
            'summary' => [
                'total'       => $children->count(),
                'risiko'      => $riskyChildren->count(),
                'normal'      => $normalChildren->count(),
                'belumData'   => $noDataChildren->count(),
            ],
        ]);
    }
}
