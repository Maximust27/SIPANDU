<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Child;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AIAssistantController extends Controller
{
    /**
     * Tampilkan halaman AI Health Assistant
     */
    public function index()
    {
        $user = Auth::user();

        // Ambil data anak-anak pengguna beserta pengukuran terakhir
        $children = Child::where('user_id', $user->id)
            ->with(['measurements' => function ($q) {
                $q->where('is_verified', true)->latest('measured_at')->limit(3);
            }])
            ->get()
            ->map(function ($child) {
                $lastM = $child->measurements->first();
                return [
                    'name'       => $child->name,
                    'ageMonths'  => $child->age_in_months,
                    'ageStr'     => $child->age_display,
                    'gender'     => $child->gender,
                    'lastWeight' => $lastM?->weight,
                    'lastHeight' => $lastM?->height,
                    'statusGizi' => $lastM?->status_gizi,
                    'statusTinggi' => $lastM?->status_tinggi,
                ];
            });

        $hasApiKey = !empty(config('services.gemini.key'));

        return Inertia::render('User/AIAssistant', [
            'children'  => $children,
            'hasApiKey' => $hasApiKey,
        ]);
    }

    /**
     * Proses pesan chat dari Bunda ke AI Gemini
     */
    public function chat(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:2000',
        ]);

        $apiKey = config('services.gemini.key');

        if (empty($apiKey)) {
            return response()->json([
                'reply' => 'Maaf, layanan AI belum dikonfigurasi oleh administrator. Silakan hubungi admin untuk mengaktifkan fitur ini dengan menambahkan API Key Gemini di pengaturan server.',
            ]);
        }

        $user = Auth::user();

        // Ambil konteks data anak untuk prompt
        $children = Child::where('user_id', $user->id)
            ->with(['measurements' => function ($q) {
                $q->where('is_verified', true)->latest('measured_at')->limit(3);
            }])
            ->get();

        $childContext = '';
        foreach ($children as $child) {
            $lastM = $child->measurements->first();
            $childContext .= "- {$child->name}, {$child->gender}, usia {$child->age_display} ({$child->age_in_months} bulan)";
            if ($lastM) {
                $childContext .= ", BB: {$lastM->weight} kg, TB: {$lastM->height} cm, Status Gizi: {$lastM->status_gizi}, Status Tinggi: {$lastM->status_tinggi}";
            }
            $childContext .= "\n";
        }

        $systemPrompt = "Kamu adalah 'Dokter AI Sipandu', asisten kesehatan ibu dan anak yang ramah, cerdas, dan informatif. Kamu berbicara dalam Bahasa Indonesia dengan nada hangat dan mendukung.

Konteks data anak pengguna (Bunda {$user->name}):
{$childContext}

Tugas kamu:
- Menjawab pertanyaan seputar kesehatan anak, gizi, MPASI, imunisasi, dan tumbuh kembang.
- Memberikan saran yang personal berdasarkan data anak di atas jika relevan.
- Jika ditanya tentang kondisi medis serius, selalu sarankan konsultasi ke dokter/puskesmas.
- Gunakan bahasa yang mudah dipahami oleh ibu-ibu Indonesia.
- Jawab dengan ringkas tapi informatif (maksimal 3-4 paragraf).
- Jangan mengarang data medis yang tidak kamu ketahui.";

        // Bangun riwayat percakapan dari request
        $history = $request->input('history', []);
        $contents = [];

        foreach ($history as $msg) {
            $contents[] = [
                'role' => $msg['sender'] === 'user' ? 'user' : 'model',
                'parts' => [['text' => $msg['text']]],
            ];
        }

        // Tambahkan pesan terbaru dari user
        $contents[] = [
            'role' => 'user',
            'parts' => [['text' => $request->input('message')]],
        ];

        try {
            $url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={$apiKey}";
            $payload = [
                'system_instruction' => [
                    'parts' => [['text' => $systemPrompt]],
                ],
                'contents' => $contents,
                'generationConfig' => [
                    'temperature' => 0.7,
                    'maxOutputTokens' => 1024,
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
                $reply = $data['candidates'][0]['content']['parts'][0]['text'] ?? 'Maaf, saya tidak dapat memberikan respons saat ini.';

                return response()->json(['reply' => $reply]);
            }

            Log::warning('Gemini API error', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            if ($response->status() === 429) {
                return response()->json([
                    'reply' => 'Maaf, kuota penggunaan AI harian sudah terpakai. Silakan coba lagi dalam beberapa menit atau hubungi admin untuk meningkatkan paket API.',
                ]);
            }

            return response()->json([
                'reply' => 'Maaf, layanan AI sedang mengalami gangguan. Silakan coba lagi dalam beberapa saat.',
            ]);
        } catch (\Exception $e) {
            Log::error('Gemini API exception', ['message' => $e->getMessage()]);

            return response()->json([
                'reply' => 'Maaf, terjadi kesalahan teknis saat menghubungi layanan AI. Silakan coba lagi nanti.',
            ]);
        }
    }
}