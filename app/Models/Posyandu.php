<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Posyandu extends Model
{
    use HasFactory;

    protected $table = 'posyandu';

    protected $fillable = [
        'name',
        'kelurahan',
        'kecamatan',
        'kabupaten',
        'address',
        'contact',
        'quota_per_session',
        'status',
    ];

    /**
     * Kader-kader yang bertugas di posyandu ini
     */
    public function kaders(): HasMany
    {
        return $this->hasMany(User::class, 'posyandu_id')
                    ->where('role', 'kader');
    }

    /**
     * Anak-anak yang terdaftar di posyandu ini
     */
    public function children(): HasMany
    {
        return $this->hasMany(Child::class, 'posyandu_id');
    }

    /**
     * Jadwal kegiatan posyandu ini
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    /**
     * Jadwal yang akan datang (upcoming)
     */
    public function upcomingSchedules(): HasMany
    {
        return $this->hasMany(Schedule::class)
                    ->where('scheduled_date', '>=', now()->toDateString())
                    ->where('status', 'upcoming')
                    ->orderBy('scheduled_date');
    }
}
