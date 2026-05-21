<?php

namespace App\Services;

/**
 * Kalkulasi Status Gizi Balita berdasarkan Standar WHO 2006
 * Menggunakan metode z-score (Standard Deviation Score)
 *
 * Referensi: WHO Child Growth Standards
 * https://www.who.int/tools/child-growth-standards
 */
class StatusGiziCalculator
{
    /**
     * Tabel Median (M) dan SD WHO untuk BB/U (Weight-for-Age)
     * Format: age_months => ['male' => [M, SD_neg, SD_pos], 'female' => [M, SD_neg, SD_pos]]
     * SD_neg = SD di bawah median | SD_pos = SD di atas median
     */
    private static array $weightForAge = [
        0  => ['male' => [3.3, 0.39, 0.48], 'female' => [3.2, 0.38, 0.45]],
        1  => ['male' => [4.5, 0.52, 0.64], 'female' => [4.2, 0.48, 0.59]],
        2  => ['male' => [5.6, 0.62, 0.77], 'female' => [5.1, 0.57, 0.71]],
        3  => ['male' => [6.4, 0.69, 0.87], 'female' => [5.8, 0.64, 0.81]],
        4  => ['male' => [7.0, 0.75, 0.96], 'female' => [6.4, 0.70, 0.90]],
        5  => ['male' => [7.5, 0.80, 1.03], 'female' => [6.9, 0.75, 0.97]],
        6  => ['male' => [7.9, 0.84, 1.10], 'female' => [7.3, 0.79, 1.04]],
        7  => ['male' => [8.3, 0.88, 1.16], 'female' => [7.6, 0.83, 1.10]],
        8  => ['male' => [8.6, 0.92, 1.22], 'female' => [7.9, 0.87, 1.17]],
        9  => ['male' => [8.9, 0.95, 1.27], 'female' => [8.2, 0.90, 1.23]],
        10 => ['male' => [9.2, 0.97, 1.32], 'female' => [8.5, 0.93, 1.28]],
        11 => ['male' => [9.4, 1.00, 1.37], 'female' => [8.7, 0.96, 1.33]],
        12 => ['male' => [9.6, 1.02, 1.41], 'female' => [8.9, 0.99, 1.38]],
        15 => ['male' => [10.3, 1.09, 1.52], 'female' => [9.6, 1.06, 1.50]],
        18 => ['male' => [11.0, 1.16, 1.63], 'female' => [10.2, 1.13, 1.61]],
        21 => ['male' => [11.5, 1.22, 1.72], 'female' => [10.9, 1.19, 1.71]],
        24 => ['male' => [12.1, 1.28, 1.82], 'female' => [11.5, 1.26, 1.81]],
        27 => ['male' => [12.6, 1.34, 1.91], 'female' => [12.0, 1.32, 1.92]],
        30 => ['male' => [13.0, 1.39, 1.98], 'female' => [12.5, 1.38, 2.01]],
        33 => ['male' => [13.5, 1.45, 2.07], 'female' => [13.0, 1.44, 2.10]],
        36 => ['male' => [13.9, 1.50, 2.16], 'female' => [13.5, 1.50, 2.21]],
        39 => ['male' => [14.3, 1.55, 2.24], 'female' => [13.9, 1.55, 2.30]],
        42 => ['male' => [14.7, 1.61, 2.33], 'female' => [14.3, 1.61, 2.40]],
        45 => ['male' => [15.1, 1.66, 2.42], 'female' => [14.8, 1.67, 2.50]],
        48 => ['male' => [15.5, 1.72, 2.51], 'female' => [15.2, 1.73, 2.60]],
        51 => ['male' => [15.9, 1.77, 2.60], 'female' => [15.6, 1.79, 2.70]],
        54 => ['male' => [16.3, 1.83, 2.70], 'female' => [16.1, 1.85, 2.81]],
        57 => ['male' => [16.7, 1.89, 2.80], 'female' => [16.5, 1.92, 2.92]],
        60 => ['male' => [17.2, 1.95, 2.91], 'female' => [17.0, 1.99, 3.04]],
    ];

    /**
     * Tabel Median (M) dan SD WHO untuk TB/U (Height-for-Age)
     * Format: age_months => ['male' => [M, SD], 'female' => [M, SD]]
     */
    private static array $heightForAge = [
        0  => ['male' => [49.9, 1.89], 'female' => [49.1, 1.86]],
        3  => ['male' => [61.4, 2.29], 'female' => [60.0, 2.29]],
        6  => ['male' => [67.6, 2.53], 'female' => [65.7, 2.60]],
        9  => ['male' => [72.0, 2.67], 'female' => [70.1, 2.80]],
        12 => ['male' => [75.7, 2.79], 'female' => [74.0, 2.93]],
        15 => ['male' => [79.1, 2.89], 'female' => [77.5, 3.02]],
        18 => ['male' => [82.3, 3.03], 'female' => [80.7, 3.19]],
        21 => ['male' => [85.1, 3.14], 'female' => [83.7, 3.31]],
        24 => ['male' => [87.8, 3.27], 'female' => [86.4, 3.45]],
        27 => ['male' => [90.3, 3.36], 'female' => [89.0, 3.57]],
        30 => ['male' => [92.7, 3.46], 'female' => [91.4, 3.68]],
        33 => ['male' => [94.9, 3.55], 'female' => [93.8, 3.78]],
        36 => ['male' => [96.1, 3.78], 'female' => [95.1, 3.94]],
        39 => ['male' => [97.9, 3.84], 'female' => [96.9, 4.01]],
        42 => ['male' => [99.9, 3.91], 'female' => [98.7, 4.08]],
        45 => ['male' => [101.8, 3.98], 'female' => [100.5, 4.16]],
        48 => ['male' => [103.3, 4.05], 'female' => [102.7, 4.23]],
        51 => ['male' => [105.3, 4.13], 'female' => [104.5, 4.31]],
        54 => ['male' => [107.2, 4.21], 'female' => [106.4, 4.40]],
        57 => ['male' => [109.1, 4.30], 'female' => [108.3, 4.49]],
        60 => ['male' => [110.0, 4.38], 'female' => [110.2, 4.59]],
    ];

    /**
     * Hitung semua status gizi untuk satu sesi pengukuran
     *
     * @param float $weight   Berat badan (kg)
     * @param float|null $height  Tinggi badan (cm)
     * @param float|null $headCirc  Lingkar kepala (cm)
     * @param int $ageMonths  Umur dalam bulan
     * @param string $gender  'Laki-laki' atau 'Perempuan'
     * @return array
     */
    public static function calculate(float $weight, ?float $height, ?float $headCirc, int $ageMonths, string $gender): array
    {
        $sex = ($gender === 'Laki-laki') ? 'male' : 'female';

        $result = [
            'status_gizi'    => null,
            'status_tinggi'  => null,
            'status_kepala'  => null,
            'z_score_bbu'    => null,
            'z_score_tbu'    => null,
        ];

        // --- 1. Hitung z-score BB/U (Weight-for-Age) ---
        if ($ageMonths <= 60) {
            $wfaData = self::interpolate(self::$weightForAge, $ageMonths, $sex);
            if ($wfaData) {
                [$median, $sdNeg, $sdPos] = $wfaData;
                $sd = ($weight < $median) ? $sdNeg : $sdPos;
                $zScore = ($sd > 0) ? round(($weight - $median) / $sd, 2) : 0;
                $result['z_score_bbu'] = $zScore;
                $result['status_gizi'] = self::classifyWeightForAge($zScore);
            }
        }

        // --- 2. Hitung z-score TB/U (Height-for-Age) ---
        if ($height && $ageMonths <= 60) {
            $hfaData = self::interpolateSimple(self::$heightForAge, $ageMonths, $sex);
            if ($hfaData) {
                [$median, $sd] = $hfaData;
                $zScore = ($sd > 0) ? round(($height - $median) / $sd, 2) : 0;
                $result['z_score_tbu'] = $zScore;
                $result['status_tinggi'] = self::classifyHeightForAge($zScore);
            }
        }

        // --- 3. Klasifikasi Lingkar Kepala (simplified) ---
        if ($headCirc) {
            $result['status_kepala'] = self::classifyHeadCircumference($headCirc, $ageMonths, $sex);
        }

        return $result;
    }

    /**
     * Interpolasi linear untuk tabel BB/U (3 nilai: median, sd_neg, sd_pos)
     */
    private static function interpolate(array $table, int $age, string $sex): ?array
    {
        $ages = array_keys($table);

        // Cari exact match dulu
        if (isset($table[$age][$sex])) {
            return $table[$age][$sex];
        }

        // Interpolasi antara dua titik terdekat
        $lower = null;
        $upper = null;
        foreach ($ages as $a) {
            if ($a <= $age) $lower = $a;
            if ($a > $age && $upper === null) $upper = $a;
        }

        if ($lower === null || $upper === null) {
            return $table[array_key_first($table)][$sex] ?? null;
        }

        $ratio = ($age - $lower) / ($upper - $lower);
        $lData = $table[$lower][$sex];
        $uData = $table[$upper][$sex];

        return [
            $lData[0] + $ratio * ($uData[0] - $lData[0]),
            $lData[1] + $ratio * ($uData[1] - $lData[1]),
            $lData[2] + $ratio * ($uData[2] - $lData[2]),
        ];
    }

    /**
     * Interpolasi linear untuk tabel TB/U (2 nilai: median, sd)
     */
    private static function interpolateSimple(array $table, int $age, string $sex): ?array
    {
        $ages = array_keys($table);

        if (isset($table[$age][$sex])) {
            return $table[$age][$sex];
        }

        $lower = null;
        $upper = null;
        foreach ($ages as $a) {
            if ($a <= $age) $lower = $a;
            if ($a > $age && $upper === null) $upper = $a;
        }

        if ($lower === null || $upper === null) {
            return $table[array_key_first($table)][$sex] ?? null;
        }

        $ratio = ($age - $lower) / ($upper - $lower);
        $lData = $table[$lower][$sex];
        $uData = $table[$upper][$sex];

        return [
            $lData[0] + $ratio * ($uData[0] - $lData[0]),
            $lData[1] + $ratio * ($uData[1] - $lData[1]),
        ];
    }

    /**
     * Klasifikasi status gizi berdasarkan z-score BB/U
     * Standar Kemenkes RI / WHO
     */
    private static function classifyWeightForAge(float $z): string
    {
        if ($z < -3)      return 'Gizi Buruk';
        if ($z < -2)      return 'Gizi Kurang';
        if ($z <= 1)      return 'Gizi Baik (Normal)';
        if ($z <= 2)      return 'Berisiko Gizi Lebih';
        return 'Gizi Lebih';
    }

    /**
     * Klasifikasi status tinggi berdasarkan z-score TB/U
     */
    private static function classifyHeightForAge(float $z): string
    {
        if ($z < -3)  return 'Sangat Pendek (Severely Stunted)';
        if ($z < -2)  return 'Pendek (Stunted)';
        if ($z <= 2)  return 'Normal';
        return 'Tinggi';
    }

    /**
     * Klasifikasi lingkar kepala (simplified, tidak pakai z-score penuh)
     * Referensi: Nellhaus Pediatric Chart (estimasi)
     */
    private static function classifyHeadCircumference(float $hc, int $ageMonths, string $sex): string
    {
        // Median lingkar kepala per usia (estimasi sederhana)
        $medians = [
            0  => ['male' => 34.5, 'female' => 33.9],
            3  => ['male' => 40.5, 'female' => 39.5],
            6  => ['male' => 43.3, 'female' => 42.2],
            12 => ['male' => 46.5, 'female' => 45.4],
            18 => ['male' => 47.9, 'female' => 46.9],
            24 => ['male' => 49.0, 'female' => 47.9],
            36 => ['male' => 50.0, 'female' => 49.0],
            48 => ['male' => 50.7, 'female' => 49.8],
            60 => ['male' => 51.1, 'female' => 50.2],
        ];

        // Cari median terdekat
        $closest = 0;
        foreach (array_keys($medians) as $a) {
            if ($a <= $ageMonths) $closest = $a;
        }

        $median = $medians[$closest][$sex] ?? 47.0;
        $sd = 1.5; // Approx SD

        $z = ($hc - $median) / $sd;

        if ($z < -2) return 'Kecil (Mikrosefali)';
        if ($z > 2)  return 'Besar (Makrosefali)';
        return 'Normal';
    }
}
