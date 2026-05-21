<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Measurement extends Model
{
    use HasFactory;

    protected $fillable = [
        'child_id',
        'kader_id',
        'measured_at',
        'age_in_months',
        'weight',
        'height',
        'head_circumference',
        'status_gizi',
        'status_tinggi',
        'status_kepala',
        'z_score_bbu',
        'z_score_tbu',
        'notes',
        'is_verified',
        'verified_at',
    ];

    protected $casts = [
        'measured_at'  => 'date',
        'verified_at'  => 'datetime',
        'weight'       => 'decimal:2',
        'height'       => 'decimal:2',
        'head_circumference' => 'decimal:2',
        'z_score_bbu'  => 'decimal:2',
        'z_score_tbu'  => 'decimal:2',
        'is_verified'  => 'boolean',
    ];

    /**
     * Relasi ke Anak
     */
    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }

    /**
     * Relasi ke Kader yang menginput
     */
    public function kader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'kader_id');
    }

    /**
     * Helper: apakah status menunjukkan stunting?
     */
    public function isStunted(): bool
    {
        return in_array($this->status_tinggi, [
            'Pendek (Stunted)',
            'Sangat Pendek (Severely Stunted)',
        ]);
    }

    /**
     * Helper: apakah status gizi bermasalah?
     */
    public function isNutritionProblem(): bool
    {
        return in_array($this->status_gizi, [
            'Gizi Buruk',
            'Gizi Kurang',
        ]);
    }
}