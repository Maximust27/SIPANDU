<?php

namespace App\Http\Controllers\Kader;

use App\Http\Controllers\Controller;
use App\Models\Child;
use App\Models\Measurement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
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
            
            // Analisis dasar berbasis status DB (bukan hardcoded template)
            $aiDetection = null;
            $aiRecommendation = null;
            
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

        $hasApiKey = !empty(config('services.gemini.key'));

        return Inertia::render('Kader/AIMonitoring', [
            'riskyChildren'  => $riskyChildren->map($formatChild)->values(),
            'normalChildren' => $normalChildren->map($formatChild)->values(),
            'noDataChildren' => $noDataChildren->map($formatChild)->values(),
            'regionStats'    => $regionStats,
            'hasApiKey'      => $hasApiKey,
            'summary' => [
                'total'       => $children->count(),
                'risiko'      => $riskyChildren->count(),
                'normal'      => $normalChildren->count(),
                'belumData'   => $noDataChildren->count(),
            ],
        ]);
    }

    /**
     * Analisis AI untuk satu anak tertentu via Gemini API
     */
    public function analyze(Request $request, $childId)
    {
        $kader = Auth::user();
        
        $child = Child::with(['measurements' => function ($q) {
            $q->where('is_verified', true)->latest('measured_at')->limit(6);
        }, 'parent'])->findOrFail($childId);

        $apiKey = config('services.gemini.key');

        if (empty($apiKey)) {
            // Fallback: analisis berbasis aturan sederhana
            return response()->json($this->ruleBasedAnalysis($child));
        }

        // Bangun konteks medis untuk prompt AI
        $lastM = $child->measurements->first();
        $measurementHistory = '';
        foreach ($child->measurements as $idx => $m) {
            $measurementHistory .= "  - Tanggal: {$m->measured_at->format('d M Y')}, Usia: {$m->age_in_months} bln, BB: {$m->weight} kg, TB: {$m->height} cm";
            if ($m->head_circumference) {
                $measurementHistory .= ", LK: {$m->head_circumference} cm";
            }
            $measurementHistory .= ", Status Gizi: {$m->status_gizi}, Status Tinggi: {$m->status_tinggi}";
            if ($m->z_score_bbu) {
                $measurementHistory .= ", Z-Score BB/U: {$m->z_score_bbu}";
            }
            if ($m->z_score_tbu) {
                $measurementHistory .= ", Z-Score TB/U: {$m->z_score_tbu}";
            }
            $measurementHistory .= "\n";
        }

        $prompt = "Kamu adalah ahli gizi dan dokter anak yang berpengalaman di Indonesia. Analisis data pertumbuhan anak berikut dan berikan output dalam format JSON.

DATA ANAK:
- Nama: {$child->name}
- Jenis Kelamin: {$child->gender}
- Usia: {$child->age_display} ({$child->age_in_months} bulan)
- Nama Ibu: {$child->parent?->name}

RIWAYAT PENGUKURAN (terbaru ke terlama):
{$measurementHistory}

TUGAS:
1. Analisis tren pertumbuhan anak berdasarkan data riwayat pengukuran di atas.
2. Identifikasi masalah spesifik (jika ada) seperti stunting, gizi kurang/buruk, penurunan BB, dll.
3. Berikan rekomendasi penanganan yang spesifik dan actionable untuk kader posyandu.

FORMAT OUTPUT (JSON saja, tanpa markdown/backtick):
{\"detection\": \"Penjelasan singkat 2-3 kalimat tentang kondisi anak berdasarkan data.\", \"recommendation\": \"Rekomendasi spesifik 2-3 kalimat untuk penanganan oleh kader.\"}";

        try {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={$apiKey}";
            $payload = [
                'contents' => [
                    [
                        'role' => 'user',
                        'parts' => [['text' => $prompt]],
                    ],
                ],
                'generationConfig' => [
                    'temperature' => 0.4,
                    'maxOutputTokens' => 1024,
                    'responseMimeType' => 'application/json',
                    'thinkingConfig' => [
                        'thinkingBudget' => 0,
                    ],
                ],
            ];

            // Coba hingga 3x jika terkena rate limit (429)
            $response = null;
            for ($attempt = 1; $attempt <= 3; $attempt++) {
                $response = Http::timeout(30)->post($url, $payload);
                if ($response->status() !== 429) break;
                if ($attempt < 3) sleep(2 * $attempt); // backoff: 2s, 4s
            }

            if ($response->successful()) {
                $data = $response->json();
                $text = $data['candidates'][0]['content']['parts'][0]['text'] ?? '';

                // Bersihkan response dari markdown backtick jika ada
                $text = preg_replace('/```json\s*/i', '', $text);
                $text = preg_replace('/```\s*/', '', $text);
                $text = trim($text);

                $parsed = json_decode($text, true);

                if ($parsed && isset($parsed['detection']) && isset($parsed['recommendation'])) {
                    return response()->json([
                        'aiDetection' => $parsed['detection'],
                        'aiRecommendation' => $parsed['recommendation'],
                        'source' => 'gemini',
                    ]);
                }

                // Jika parsing JSON gagal, gunakan teks mentah
                return response()->json([
                    'aiDetection' => $text,
                    'aiRecommendation' => 'Silakan konsultasikan hasil analisis di atas dengan tenaga medis untuk penanganan lebih lanjut.',
                    'source' => 'gemini',
                ]);
            }

            Log::warning('Gemini API error in analyze', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            // Jika rate-limited, berikan fallback + pesan khusus
            $fallback = $this->ruleBasedAnalysis($child);
            if ($response->status() === 429) {
                $fallback['source'] = 'rule-based (kuota API habis)';
            }
            return response()->json($fallback);

        } catch (\Exception $e) {
            Log::error('Gemini API exception in analyze', ['message' => $e->getMessage()]);
            return response()->json($this->ruleBasedAnalysis($child));
        }
    }

    /**
     * Analisis fallback berbasis aturan jika API Gemini tidak tersedia
     */
    private function ruleBasedAnalysis(Child $child): array
    {
        $lastM = $child->measurements->first();
        $weight = $lastM?->weight ?? 0;
        $height = $lastM?->height ?? 0;
        $ageMonths = $child->age_in_months;

        $detection = "Perkembangan normal. Pertumbuhan sesuai dengan kurva WHO.";
        $recommendation = "Lanjutkan pemberian gizi seimbang, pastikan imunisasi dasar lengkap, dan ikuti posyandu rutin bulan depan.";

        if ($lastM) {
            $isStunted = $lastM->isStunted();
            $isNutrition = $lastM->isNutritionProblem();

            if ($isStunted && $isNutrition) {
                $detection = "Mengalami pertumbuhan berat badan stagnan/menurun di bawah standar dan tinggi badan berada di bawah kurva normal (-2 SD). Terdeteksi ganda stunting & gizi kurang/buruk.";
                $recommendation = "Segera rujuk ke Puskesmas/Dokter Anak. Lakukan intervensi PMT Pemulihan tinggi protein hewani (susu, telur, daging) selama 90 hari.";
            } elseif ($isStunted) {
                $detection = "Tinggi badan ({$height} cm) berada di bawah garis -2 SD kurva WHO. Terdeteksi risiko " . strtolower($lastM->status_tinggi) . ".";
                $recommendation = "Evaluasi pola asuh & sanitasi lingkungan. Berikan PMT protein hewani setiap hari, dan rutin pantau pertumbuhan tinggi badan.";
            } elseif ($isNutrition) {
                $detection = "Berat badan ({$weight} kg) tidak mencukupi untuk usia {$ageMonths} bulan. Terdeteksi " . strtolower($lastM->status_gizi) . ".";
                $recommendation = "Evaluasi frekuensi & porsi makan anak. Tambahkan lemak sehat (minyak/santan) dan tingkatkan asupan kalori & protein harian.";
            }
        }

        return [
            'aiDetection' => $detection,
            'aiRecommendation' => $recommendation,
            'source' => 'rule-based',
        ];
    }
}
