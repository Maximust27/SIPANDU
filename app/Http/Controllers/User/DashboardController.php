<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Child;
use App\Models\Measurement;
use App\Models\Schedule;
use App\Models\Queue;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        // Ambil data anak dari database milik user yang sedang login
        $childrenDb = Child::where('user_id', $user->id)->get();

        // Transformasi data agar sesuai tampilan Dashboard
        // PENTING: Variabel dinamakan $dataAnak untuk dikirim ke React
        $dataAnak = $childrenDb->map(function ($child) {
            // 1. Hitung Umur (Tahun & Bulan)
            $birthDate = Carbon::parse($child->birth_date);
            $diff = $birthDate->diff(Carbon::now());
            $ageDisplay = $diff->y . ' Tahun ' . $diff->m . ' Bulan';

            // 2. Ambil Pengukuran Terakhir (Berat & Tinggi)
            $lastMeasurement = Measurement::where('child_id', $child->id)
                ->where('is_verified', true)
                ->latest('measured_at')
                ->first();

            // 4. Ambil Berat/Tinggi (Prioritas pengukuran terakhir, fallback ke berat lahir)
            $weight = $lastMeasurement ? $lastMeasurement->weight : ($child->birth_weight ?? 0);
            $height = $lastMeasurement ? $lastMeasurement->height : ($child->birth_height ?? 0);
            
            $statusGizi = $lastMeasurement ? $lastMeasurement->status_gizi : 'Belum Ada Data';
            $statusTinggi = $lastMeasurement ? $lastMeasurement->status_tinggi : 'Belum Ada Data';

            $isStunted = str_contains(strtolower($statusTinggi), 'stunted') || str_contains(strtolower($statusTinggi), 'pendek');
            $isGiziBuruk = str_contains(strtolower($statusGizi), 'buruk') || str_contains(strtolower($statusGizi), 'kurang');

            $aiRisk = $isStunted ? 'Berisiko Stunting' : ($isGiziBuruk ? 'Masalah Gizi' : ($lastMeasurement ? 'Normal / Aman' : 'Belum Ada Data'));
            
            $aiInsight = '';
            if ($isStunted) {
                $aiInsight = 'Perhatian! Tinggi badan si kecil berada di bawah kurva standar WHO (risiko stunting). Disarankan pemberian protein hewani harian dan konsultasi ke dokter atau kader posyandu.';
            } elseif ($isGiziBuruk) {
                $aiInsight = 'Perhatian! Berat badan si kecil kurang optimal untuk usianya. Disarankan pemberian makanan tambahan (PMT) kaya energi dan protein.';
            } elseif ($lastMeasurement) {
                $aiInsight = 'Kenaikan berat badan dan tinggi badan si kecil terpantau optimal dan berada dalam kurva hijau standar WHO. Pertahankan pola makan bergizi seimbang.';
            } else {
                $aiInsight = 'Belum ada data pengukuran yang terverifikasi. Silakan kunjungi Posyandu terdekat untuk melakukan penimbangan dan pengukuran pertama.';
            }

            return [
                'id' => $child->id,
                'name' => $child->name,
                'age_display' => $ageDisplay,
                'gender' => $child->gender,
                'last_weight' => number_format($weight, 1),
                'last_height' => number_format($height, 1),
                'status' => $statusGizi,
                'status_tinggi' => $statusTinggi,
                'ai_risk' => $aiRisk,
                'ai_insight' => $aiInsight,
                'has_measurement' => $lastMeasurement !== null
            ];
        });

        // Jadwal posyandu terdekat
        $nextScheduleObj = Schedule::with('posyandu')
            ->where('status', 'upcoming')
            ->where('scheduled_date', '>=', now()->toDateString())
            ->where(function($query) use ($user) {
                if ($user->posyandu_id) {
                    $query->where('posyandu_id', $user->posyandu_id);
                }
                $query->orWhereHas('posyandu', fn($q) => $q->where('kelurahan', $user->kelurahan));
            })
            ->orderBy('scheduled_date')
            ->first();

        $nextSchedule = $nextScheduleObj ? [
            'date_display' => Carbon::parse($nextScheduleObj->scheduled_date)->translatedFormat('d F Y'),
            'time' => substr($nextScheduleObj->time_start, 0, 5) . ' - ' . substr($nextScheduleObj->time_end, 0, 5),
            'location' => $nextScheduleObj->posyandu?->name ?? 'Posyandu',
            'agenda' => $nextScheduleObj->agenda,
        ] : null;

        // Ambil tiket antrian aktif (jika ada) untuk anak-anak milik user pada jadwal berikutnya
        $activeQueue = null;
        if ($nextScheduleObj && $childrenDb->isNotEmpty()) {
            $childIds = $childrenDb->pluck('id');
            $activeQueueObj = Queue::where('schedule_id', $nextScheduleObj->id)
                ->whereIn('child_id', $childIds)
                ->whereIn('status', ['menunggu', 'diperiksa'])
                ->first();

            if ($activeQueueObj) {
                $activeQueue = [
                    'ticket_code' => $activeQueueObj->ticket_code,
                    'queue_number' => $activeQueueObj->queue_number,
                    'status' => $activeQueueObj->status,
                    'child_name' => $activeQueueObj->child?->name,
                ];
            }
        }

        return Inertia::render('User/Dashboard', [
            'dataAnak' => $dataAnak,
            'next_schedule' => $nextSchedule,
            'activeQueue' => $activeQueue,
            'articles' => [
                ['title' => 'Pentingnya MPASI Tepat Waktu', 'category' => 'Gizi'],
                ['title' => 'Jadwal Imunisasi Dasar Lengkap', 'category' => 'Kesehatan'],
                ['title' => 'Stimulasi Motorik Halus Balita', 'category' => 'Edukasi'],
            ]
        ]);
    }
}