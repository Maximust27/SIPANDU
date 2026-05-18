<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Child;
use App\Models\Measurement;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Ambil data anak dari database milik user yang sedang login
        $childrenDb = Child::where('user_id', Auth::id())->get();

        // Transformasi data agar sesuai tampilan Dashboard
        // PENTING: Variabel dinamakan $dataAnak untuk dikirim ke React
        $dataAnak = $childrenDb->map(function ($child) {
            // 1. Hitung Umur (Tahun & Bulan)
            $birthDate = Carbon::parse($child->birth_date);
            $diff = $birthDate->diff(Carbon::now());
            $ageDisplay = $diff->y . ' Tahun ' . $diff->m . ' Bulan';

            // 2. Ambil Pengukuran Terakhir (Berat & Tinggi)
            $lastMeasurement = Measurement::where('child_id', $child->id)
                ->latest('measured_at')
                ->first();

            // 3. Tentukan Status Gizi (Ambil dari pengukuran atau default)
            $status = $lastMeasurement ? ucfirst($lastMeasurement->status_gizi) : 'Belum Ada Data';
            
            // 4. Ambil Berat/Tinggi (Prioritas pengukuran terakhir, fallback ke berat lahir)
            $weight = $lastMeasurement ? $lastMeasurement->weight : ($child->birth_weight ?? 0);
            $height = $lastMeasurement ? $lastMeasurement->height : ($child->birth_height ?? 0);

            return [
                'id' => $child->id,
                'name' => $child->name,
                'age_display' => $ageDisplay,
                'gender' => $child->gender,
                'last_weight' => $weight,
                'last_height' => $height,
                'status' => $status
            ];
        });

        return Inertia::render('User/Dashboard', [
            // KITA KIRIM DENGAN NAMA 'dataAnak' AGAR TIDAK ERROR DI REACT
            'dataAnak' => $dataAnak, 
            'next_schedule' => 'Senin, 12 Februari 2026', 
            'articles' => [
                ['title' => 'Pentingnya MPASI Tepat Waktu', 'category' => 'Gizi'],
                ['title' => 'Jadwal Imunisasi Dasar Lengkap', 'category' => 'Kesehatan'],
            ]
        ]);
    }
}