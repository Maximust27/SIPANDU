<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Child extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nik',
        'name',
        'gender',
        'birth_date',
        'birth_place',
        'birth_weight',
        'birth_height',
        'photo',
    ];

    // Mengubah tipe data otomatis (Casting)
    protected $casts = [
        'birth_date' => 'date',
        'birth_weight' => 'decimal:2',
        'birth_height' => 'decimal:2',
    ];

    /**
     * Relasi ke Orang Tua (User)
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relasi ke Riwayat Pengukuran
     */
    public function measurements(): HasMany
    {
        return $this->hasMany(Measurement::class);
    }
}