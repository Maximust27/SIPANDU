<?php

namespace App\Http\Controllers\Kader;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GrowthMonitoringController extends Controller
{
    /**
     * Menampilkan halaman monitoring pertumbuhan (KMS) dengan data simulasi (Tanpa Database).
     */
    public function index()
    {
        // Data simulasi (mock) terstruktur yang dikirim ke halaman React di Canvas
        $mockChildren = [
            [
                'id' => 1,
                'name' => 'Leon Alfarizi',
                'gender' => 'Laki-laki',
                'ageMonths' => 27,
                'ageStr' => '2 Tahun 3 Bulan',
                'birthDate' => '2024-03-12',
                'motherName' => 'Sarah Amelia',
                'measurements' => [
                    [
                        'id' => 101, 
                        'date' => '2026-05-10', 
                        'weight' => 12.4, 
                        'height' => 88.5, 
                        'headCirc' => 48.2, 
                        'statusGizi' => 'Gizi Baik (Normal)', 
                        'statusTinggi' => 'Normal', 
                        'statusKepala' => 'Normal'
                    ],
                    [
                        'id' => 102, 
                        'date' => '2026-04-12', 
                        'weight' => 12.0, 
                        'height' => 87.5, 
                        'headCirc' => 48.0, 
                        'statusGizi' => 'Gizi Baik (Normal)', 
                        'statusTinggi' => 'Normal', 
                        'statusKepala' => 'Normal'
                    ],
                    [
                        'id' => 103, 
                        'date' => '2026-03-15', 
                        'weight' => 11.5, 
                        'height' => 86.5, 
                        'headCirc' => 47.8, 
                        'statusGizi' => 'Gizi Baik (Normal)', 
                        'statusTinggi' => 'Normal', 
                        'statusKepala' => 'Normal'
                    ]
                ]
            ],
            [
                'id' => 2,
                'name' => 'Ayesha Zahra',
                'gender' => 'Perempuan',
                'ageMonths' => 7,
                'ageStr' => '7 Bulan',
                'birthDate' => '2025-10-05',
                'motherName' => 'Nisa Rahmawati',
                'measurements' => [
                    [
                        'id' => 201, 
                        'date' => '2026-05-18', 
                        'weight' => 7.8, 
                        'height' => 68.2, 
                        'headCirc' => 43.5, 
                        'statusGizi' => 'Gizi Baik (Normal)', 
                        'statusTinggi' => 'Normal', 
                        'statusKepala' => 'Normal'
                    ],
                    [
                        'id' => 202, 
                        'date' => '2026-04-10', 
                        'weight' => 7.5, 
                        'height' => 67.0, 
                        'headCirc' => 43.0, 
                        'statusGizi' => 'Gizi Baik (Normal)', 
                        'statusTinggi' => 'Normal', 
                        'statusKepala' => 'Normal'
                    ],
                    [
                        'id' => 203, 
                        'date' => '2026-03-12', 
                        'weight' => 7.0, 
                        'height' => 65.5, 
                        'headCirc' => 42.5, 
                        'statusGizi' => 'Gizi Baik (Normal)', 
                        'statusTinggi' => 'Normal', 
                        'statusKepala' => 'Normal'
                    ]
                ]
            ],
            [
                'id' => 3,
                'name' => 'Bima Satria',
                'gender' => 'Laki-laki',
                'ageMonths' => 29,
                'ageStr' => '2 Tahun 5 Bulan',
                'birthDate' => '2023-12-18',
                'motherName' => 'Dina Lestari',
                'measurements' => [
                    [
                        'id' => 301, 
                        'date' => '2026-05-08', 
                        'weight' => 9.4, 
                        'height' => 81.0, 
                        'headCirc' => 45.1, 
                        'statusGizi' => 'Gizi Kurang (Waspada)', 
                        'statusTinggi' => 'Pendek (Stunted)', 
                        'statusKepala' => 'Kecil (Mikrosefali)'
                    ]
                ]
            ]
        ];

        return Inertia::render('Kader/GrowthMonitoring', [
            'initialChildren' => $mockChildren
        ]);
    }
}