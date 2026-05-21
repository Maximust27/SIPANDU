<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class Child extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'posyandu_id',
        'nik',
        'name',
        'gender',
        'birth_date',
        'birth_place',
        'birth_weight',
        'birth_height',
        'father_name',
        'mother_name',
        'photo',
        'status',
    ];

    protected $casts = [
        'birth_date'   => 'date',
        'birth_weight' => 'decimal:2',
        'birth_height' => 'decimal:2',
    ];

    // =========================================================================
    // RELASI
    // =========================================================================

    /**
     * Orang tua (Bunda) dari anak ini
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Posyandu tempat anak terdaftar
     */
    public function posyandu(): BelongsTo
    {
        return $this->belongsTo(Posyandu::class, 'posyandu_id');
    }

    /**
     * Riwayat pengukuran anak ini
     */
    public function measurements(): HasMany
    {
        return $this->hasMany(Measurement::class);
    }

    /**
     * Pengukuran terakhir (verified)
     */
    public function latestMeasurement(): HasMany
    {
        return $this->hasMany(Measurement::class)
                    ->where('is_verified', true)
                    ->latest('measured_at');
    }

    /**
     * Pengukuran yang menunggu verifikasi dari Kader
     */
    public function pendingMeasurements(): HasMany
    {
        return $this->hasMany(Measurement::class)
                    ->where('is_verified', false);
    }

    /**
     * Antrian posyandu anak ini
     */
    public function queues(): HasMany
    {
        return $this->hasMany(Queue::class);
    }

    // =========================================================================
    // HELPER METHODS
    // =========================================================================

    /**
     * Hitung umur dalam bulan
     */
    public function getAgeInMonthsAttribute(): int
    {
        return (int) Carbon::parse($this->birth_date)->diffInMonths(now());
    }

    /**
     * Format tampilan umur
     */
    public function getAgeDisplayAttribute(): string
    {
        $birth = Carbon::parse($this->birth_date);
        $diff  = $birth->diff(now());
        if ($diff->y > 0) {
            return $diff->y . ' Tahun ' . $diff->m . ' Bulan';
        }
        return $diff->m . ' Bulan';
    }
}