<?php

namespace App\Http\Controllers\Kader;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChildController extends Controller
{
    /**
     * Menampilkan halaman kelola data anak & orang tua dengan mock data (Tanpa Database).
     */
    public function index()
    {
        // Mock data agar halaman ChildrenManagement bisa langsung tampil rapi tanpa error database
        $mockChildren = [
            [
                'id' => 1,
                'name' => 'Leon Alfarizi',
                'nik' => '3301021203240001',
                'gender' => 'Laki-laki',
                'birth_date' => '2024-03-12',
                'age_str' => '2 Tahun 3 Bln',
                'father_name' => 'Ahmad Faisal',
                'mother_name' => 'Sarah Amelia',
                'phone' => '081234567890',
                'address' => 'Balai Desa Sukamaju, RT 02/RW 03, Cilacap',
                'status' => 'Terverifikasi',
                'pending_verification' => null,
                'history' => [
                    ['id' => 101, 'date' => '2026-05-10', 'weight' => 12.4, 'height' => 88.5, 'head_circulation' => 48.2, 'notes' => 'Imunisasi DPT Lanjutan, gizi sangat baik'],
                    ['id' => 102, 'date' => '2026-04-12', 'weight' => 12.0, 'height' => 87.5, 'head_circulation' => 48.0, 'notes' => 'Pengukuran rutin bulanan'],
                    ['id' => 103, 'date' => '2026-03-15', 'weight' => 11.5, 'height' => 86.5, 'head_circulation' => 47.8, 'notes' => 'Pengukuran rutin bulanan']
                ]
            ],
            [
                'id' => 2,
                'name' => 'Ayesha Zahra',
                'nik' => '3301020510250002',
                'gender' => 'Perempuan',
                'birth_date' => '2025-10-05',
                'age_str' => '7 Bulan',
                'father_name' => 'Rian Hidayat',
                'mother_name' => 'Nisa Rahmawati',
                'phone' => '085799881122',
                'address' => 'Balai Desa Sukamaju, RT 01/RW 03, Cilacap',
                'status' => 'Butuh Verifikasi',
                'pending_verification' => [
                    'weight' => 7.8,
                    'height' => 68.2,
                    'head_circulation' => 43.5,
                    'date' => '2026-05-18',
                    'submitted_by' => 'Bunda (User Input)'
                ],
                'history' => [
                    ['id' => 201, 'date' => '2026-04-10', 'weight' => 7.5, 'height' => 67.0, 'head_circulation' => 43.0, 'notes' => 'Imunisasi BCG, sehat'],
                    ['id' => 202, 'date' => '2026-03-12', 'weight' => 7.0, 'height' => 65.5, 'head_circulation' => 42.5, 'notes' => 'Pengukuran rutin']
                ]
            ],
            [
                'id' => 3,
                'name' => 'Bima Satria',
                'nik' => '3301021812230003',
                'gender' => 'Laki-laki',
                'birth_date' => '2023-12-18',
                'age_str' => '2 Tahun 5 Bln',
                'father_name' => 'Doni Setiawan',
                'mother_name' => 'Dina Lestari',
                'phone' => '081399887766',
                'address' => 'Balai Desa Sukamaju, RT 03/RW 03, Cilacap',
                'status' => 'Terverifikasi',
                'pending_verification' => null,
                'history' => [
                    ['id' => 301, 'date' => '2026-05-08', 'weight' => 14.2, 'height' => 92.0, 'head_circulation' => 50.1, 'notes' => 'Sehat walafiat, aktif']
                ]
            ]
        ];

        return Inertia::render('Kader/ChildrenManagement', [
            'initialChildren' => $mockChildren
        ]);
    }

    /**
     * Simulasi menyimpan data balita & orang tua baru ke database.
     */
    public function store(Request $request)
    {
        return redirect()->back()->with('message', 'Simulasi: Data anak berhasil didaftarkan (Tanpa Database)!');
    }

    /**
     * Simulasi memperbarui data profil balita & orang tua.
     */
    public function update(Request $request, $id)
    {
        return redirect()->back()->with('message', 'Simulasi: Data profil anak berhasil diperbarui (Tanpa Database)!');
    }

    /**
     * Simulasi menyetujui atau menolak input pengukuran mandiri dari Bunda.
     */
    public function verify(Request $request, $id)
    {
        $message = $request->status === 'approve' 
            ? 'Simulasi: Pengukuran berhasil disetujui (Tanpa Database)!' 
            : 'Simulasi: Pengukuran berhasil ditolak (Tanpa Database)!';

        return redirect()->back()->with('message', $message);
    }
}