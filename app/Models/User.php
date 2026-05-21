<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'role',
        'status',
        'address',
        'kabupaten',
        'kecamatan',
        'kelurahan',
        'posyandu_id',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    // =========================================================================
    // RELASI
    // =========================================================================

    /**
     * Anak-anak milik user (role: pengguna/Bunda)
     */
    public function children(): HasMany
    {
        return $this->hasMany(Child::class, 'user_id');
    }

    /**
     * Posyandu tempat kader bertugas (role: kader)
     */
    public function posyandu(): BelongsTo
    {
        return $this->belongsTo(Posyandu::class, 'posyandu_id');
    }

    /**
     * Pengukuran yang pernah diinput oleh kader ini
     */
    public function measurementsRecorded(): HasMany
    {
        return $this->hasMany(Measurement::class, 'kader_id');
    }

    // =========================================================================
    // HELPER METHODS
    // =========================================================================

    /**
     * Cek apakah user adalah admin
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Cek apakah user adalah kader
     */
    public function isKader(): bool
    {
        return $this->role === 'kader';
    }

    /**
     * Cek apakah user adalah pengguna (Bunda)
     */
    public function isPengguna(): bool
    {
        return $this->role === 'pengguna';
    }

    /**
     * Cek apakah akun aktif
     */
    public function isAktif(): bool
    {
        return $this->status === 'aktif';
    }
}
