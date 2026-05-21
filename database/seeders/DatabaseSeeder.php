<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Posyandu;
use App\Models\Child;
use App\Models\Measurement;
use App\Models\Schedule;
use App\Models\Queue;
use App\Services\StatusGiziCalculator;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // =============================================================
        // 1. AKUN ADMIN
        // =============================================================
        $admin = User::create([
            'name'       => 'Administrator SIPANDU',
            'email'      => 'admin@sipandu.id',
            'phone'      => '081200000001',
            'role'       => 'admin',
            'status'     => 'aktif',
            'kabupaten'  => 'Cilacap',
            'kecamatan'  => 'Cilacap Selatan',
            'kelurahan'  => 'Donan',
            'password'   => Hash::make('password'),
        ]);

        // =============================================================
        // 2. DATA POSYANDU
        // =============================================================
        $posyandu1 = Posyandu::create([
            'name'              => 'Posyandu Melati 1',
            'kelurahan'         => 'Donan',
            'kecamatan'         => 'Cilacap Selatan',
            'kabupaten'         => 'Cilacap',
            'address'           => 'Balai Desa Donan, RT 02/RW 03',
            'contact'           => '082100000010',
            'quota_per_session' => 50,
            'status'            => 'aktif',
        ]);

        $posyandu2 = Posyandu::create([
            'name'              => 'Posyandu Kenanga',
            'kelurahan'         => 'Tegalkamulyan',
            'kecamatan'         => 'Cilacap Selatan',
            'kabupaten'         => 'Cilacap',
            'address'           => 'Jl. Kenanga No. 5, RT 01/RW 02',
            'contact'           => '082100000011',
            'quota_per_session' => 40,
            'status'            => 'aktif',
        ]);

        $posyandu3 = Posyandu::create([
            'name'              => 'Posyandu Mawar',
            'kelurahan'         => 'Sidakaya',
            'kecamatan'         => 'Cilacap Selatan',
            'kabupaten'         => 'Cilacap',
            'address'           => 'Gedung PKK Sidakaya, RT 03/RW 01',
            'contact'           => '082100000012',
            'quota_per_session' => 60,
            'status'            => 'aktif',
        ]);

        // =============================================================
        // 3. AKUN KADER (1 posyandu bisa banyak kader)
        // =============================================================
        $kader1 = User::create([
            'name'        => 'Siti Aminah',
            'email'       => 'kader1@sipandu.id',
            'phone'       => '081300000002',
            'role'        => 'kader',
            'status'      => 'aktif',
            'kabupaten'   => 'Cilacap',
            'kecamatan'   => 'Cilacap Selatan',
            'kelurahan'   => 'Donan',
            'address'     => 'Jl. Melati No. 10, Donan, Cilacap',
            'posyandu_id' => $posyandu1->id,
            'password'    => Hash::make('password'),
        ]);

        $kader2 = User::create([
            'name'        => 'Rani Wulandari',
            'email'       => 'kader2@sipandu.id',
            'phone'       => '081300000003',
            'role'        => 'kader',
            'status'      => 'aktif',
            'kabupaten'   => 'Cilacap',
            'kecamatan'   => 'Cilacap Selatan',
            'kelurahan'   => 'Donan',
            'address'     => 'Jl. Cendana No. 5, Donan, Cilacap',
            'posyandu_id' => $posyandu1->id,
            'password'    => Hash::make('password'),
        ]);

        $kader3 = User::create([
            'name'        => 'Dewi Rahayu',
            'email'       => 'kader3@sipandu.id',
            'phone'       => '081300000004',
            'role'        => 'kader',
            'status'      => 'aktif',
            'kabupaten'   => 'Cilacap',
            'kecamatan'   => 'Cilacap Selatan',
            'kelurahan'   => 'Tegalkamulyan',
            'address'     => 'Jl. Kenanga No. 2, Tegalkamulyan',
            'posyandu_id' => $posyandu2->id,
            'password'    => Hash::make('password'),
        ]);

        // =============================================================
        // 4. AKUN PENGGUNA (BUNDA) + ANAK + PENGUKURAN
        // =============================================================
        $bundaData = [
            [
                'bunda' => [
                    'name' => 'Sarah Amelia', 'email' => 'sarah@sipandu.id',
                    'phone' => '081234567890', 'kelurahan' => 'Donan',
                ],
                'anak' => [
                    'name' => 'Leon Alfarizi', 'gender' => 'Laki-laki',
                    'birth_date' => '2024-03-12', 'birth_weight' => 3.2, 'birth_height' => 50.0,
                    'father_name' => 'Ahmad Faisal', 'mother_name' => 'Sarah Amelia',
                    'posyandu_id' => $posyandu1->id,
                ],
                'pengukuran' => [
                    ['date' => '2026-03-15', 'w' => 11.5, 'h' => 86.5, 'hc' => 47.8],
                    ['date' => '2026-04-12', 'w' => 12.0, 'h' => 87.5, 'hc' => 48.0],
                    ['date' => '2026-05-10', 'w' => 12.4, 'h' => 88.5, 'hc' => 48.2],
                ],
            ],
            [
                'bunda' => [
                    'name' => 'Nisa Rahmawati', 'email' => 'nisa@sipandu.id',
                    'phone' => '085799881122', 'kelurahan' => 'Donan',
                ],
                'anak' => [
                    'name' => 'Ayesha Zahra', 'gender' => 'Perempuan',
                    'birth_date' => '2025-10-05', 'birth_weight' => 2.9, 'birth_height' => 49.0,
                    'father_name' => 'Rian Hidayat', 'mother_name' => 'Nisa Rahmawati',
                    'posyandu_id' => $posyandu1->id,
                ],
                'pengukuran' => [
                    ['date' => '2026-03-12', 'w' => 7.0, 'h' => 65.5, 'hc' => 42.5],
                    ['date' => '2026-04-10', 'w' => 7.5, 'h' => 67.0, 'hc' => 43.0],
                    ['date' => '2026-05-18', 'w' => 7.8, 'h' => 68.2, 'hc' => 43.5],
                ],
            ],
            [
                'bunda' => [
                    'name' => 'Dina Lestari', 'email' => 'dina@sipandu.id',
                    'phone' => '081399887766', 'kelurahan' => 'Donan',
                ],
                'anak' => [
                    'name' => 'Bima Satria', 'gender' => 'Laki-laki',
                    'birth_date' => '2023-12-18', 'birth_weight' => 3.5, 'birth_height' => 51.0,
                    'father_name' => 'Doni Setiawan', 'mother_name' => 'Dina Lestari',
                    'posyandu_id' => $posyandu1->id,
                ],
                'pengukuran' => [
                    ['date' => '2026-03-10', 'w' => 8.8, 'h' => 79.0, 'hc' => 44.5],
                    ['date' => '2026-04-08', 'w' => 9.1, 'h' => 80.0, 'hc' => 44.8],
                    ['date' => '2026-05-08', 'w' => 9.4, 'h' => 81.0, 'hc' => 45.1],
                ],
            ],
            [
                'bunda' => [
                    'name' => 'Putri Anggraini', 'email' => 'putri@sipandu.id',
                    'phone' => '082133445566', 'kelurahan' => 'Tegalkamulyan',
                ],
                'anak' => [
                    'name' => 'Rafi Ardian', 'gender' => 'Laki-laki',
                    'birth_date' => '2024-07-20', 'birth_weight' => 3.1, 'birth_height' => 49.5,
                    'father_name' => 'Bayu Ardian', 'mother_name' => 'Putri Anggraini',
                    'posyandu_id' => $posyandu2->id,
                ],
                'pengukuran' => [
                    ['date' => '2026-03-20', 'w' => 8.2, 'h' => 71.5, 'hc' => 44.0],
                    ['date' => '2026-05-20', 'w' => 8.8, 'h' => 73.5, 'hc' => 44.8],
                ],
            ],
            [
                'bunda' => [
                    'name' => 'Fitriana', 'email' => 'fitri@sipandu.id',
                    'phone' => '083177665544', 'kelurahan' => 'Tegalkamulyan',
                ],
                'anak' => [
                    'name' => 'Zahra Nadia', 'gender' => 'Perempuan',
                    'birth_date' => '2023-08-14', 'birth_weight' => 2.7, 'birth_height' => 47.5,
                    'father_name' => 'Farid Rahman', 'mother_name' => 'Fitriana',
                    'posyandu_id' => $posyandu2->id,
                ],
                'pengukuran' => [
                    ['date' => '2026-03-14', 'w' => 9.5, 'h' => 80.0, 'hc' => 46.0],
                    ['date' => '2026-04-14', 'w' => 9.8, 'h' => 80.5, 'hc' => 46.2],
                    ['date' => '2026-05-14', 'w' => 9.9, 'h' => 80.5, 'hc' => 46.5],
                ],
            ],
        ];

        foreach ($bundaData as $data) {
            $bunda = User::create([
                'name'       => $data['bunda']['name'],
                'email'      => $data['bunda']['email'],
                'phone'      => $data['bunda']['phone'],
                'role'       => 'pengguna',
                'status'     => 'aktif',
                'kabupaten'  => 'Cilacap',
                'kecamatan'  => 'Cilacap Selatan',
                'kelurahan'  => $data['bunda']['kelurahan'],
                'password'   => Hash::make('password'),
            ]);

            $child = Child::create([
                'user_id'      => $bunda->id,
                'posyandu_id'  => $data['anak']['posyandu_id'],
                'name'         => $data['anak']['name'],
                'gender'       => $data['anak']['gender'],
                'birth_date'   => $data['anak']['birth_date'],
                'birth_weight' => $data['anak']['birth_weight'],
                'birth_height' => $data['anak']['birth_height'],
                'father_name'  => $data['anak']['father_name'],
                'mother_name'  => $data['anak']['mother_name'],
                'status'       => 'Terverifikasi',
            ]);

            // Buat pengukuran dengan status gizi otomatis (WHO z-score)
            foreach ($data['pengukuran'] as $p) {
                $ageMonths = (int) Carbon::parse($child->birth_date)->diffInMonths(Carbon::parse($p['date']));
                $giziResult = StatusGiziCalculator::calculate(
                    weight:    $p['w'],
                    height:    $p['h'],
                    headCirc:  $p['hc'],
                    ageMonths: $ageMonths,
                    gender:    $child->gender
                );

                Measurement::create([
                    'child_id'           => $child->id,
                    'kader_id'           => $kader1->id,
                    'measured_at'        => $p['date'],
                    'age_in_months'      => $ageMonths,
                    'weight'             => $p['w'],
                    'height'             => $p['h'],
                    'head_circumference' => $p['hc'],
                    'status_gizi'        => $giziResult['status_gizi'],
                    'status_tinggi'      => $giziResult['status_tinggi'],
                    'status_kepala'      => $giziResult['status_kepala'],
                    'z_score_bbu'        => $giziResult['z_score_bbu'],
                    'z_score_tbu'        => $giziResult['z_score_tbu'],
                    'is_verified'        => true,
                    'verified_at'        => Carbon::parse($p['date'])->addDay(),
                ]);
            }
        }

        // =============================================================
        // 5. JADWAL POSYANDU + ANTRIAN
        // =============================================================
        $schedule = Schedule::create([
            'posyandu_id'    => $posyandu1->id,
            'kader_id'       => $kader1->id,
            'scheduled_date' => Carbon::now()->addDays(7)->format('Y-m-d'),
            'time_start'     => '08:00:00',
            'time_end'       => '12:00:00',
            'agenda'         => 'Pemantauan Tumbuh Kembang & Imunisasi Rutin Bulanan',
            'status'         => 'upcoming',
        ]);

        // Jadwal hari ini (berlangsung)
        $scheduleToday = Schedule::create([
            'posyandu_id'    => $posyandu1->id,
            'kader_id'       => $kader1->id,
            'scheduled_date' => Carbon::today()->format('Y-m-d'),
            'time_start'     => '08:00:00',
            'time_end'       => '12:00:00',
            'agenda'         => 'Posyandu Bulanan - Timbang & Imunisasi',
            'status'         => 'berlangsung',
        ]);

        // Buat antrian demo untuk jadwal hari ini
        $anakList = Child::where('posyandu_id', $posyandu1->id)->get();
        $counter  = 1;
        foreach ($anakList as $anak) {
            Queue::create([
                'schedule_id'  => $scheduleToday->id,
                'child_id'     => $anak->id,
                'user_id'      => $anak->user_id,
                'queue_number' => $counter,
                'ticket_code'  => 'A-' . str_pad($counter, 2, '0', STR_PAD_LEFT),
                'agenda'       => 'Timbang & Ukur',
                'status'       => $counter === 1 ? 'selesai' : ($counter === 2 ? 'diperiksa' : 'menunggu'),
                'called_at'    => $counter <= 2 ? now() : null,
                'finished_at'  => $counter === 1 ? now() : null,
            ]);
            $counter++;
        }

        $this->command->info('✅ Seeder selesai! Akun yang bisa dipakai:');
        $this->command->table(
            ['Role', 'Email', 'Password'],
            [
                ['Admin',  'admin@sipandu.id',  'password'],
                ['Kader',  'kader1@sipandu.id', 'password'],
                ['Kader',  'kader2@sipandu.id', 'password'],
                ['Kader',  'kader3@sipandu.id', 'password'],
                ['Bunda',  'sarah@sipandu.id',  'password'],
                ['Bunda',  'nisa@sipandu.id',   'password'],
                ['Bunda',  'dina@sipandu.id',   'password'],
            ]
        );
    }
}
