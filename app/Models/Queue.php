<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Queue extends Model
{
    use HasFactory;

    protected $fillable = [
        'schedule_id',
        'child_id',
        'user_id',
        'queue_number',
        'ticket_code',
        'agenda',
        'status',
        'called_at',
        'finished_at',
    ];

    protected $casts = [
        'called_at'   => 'datetime',
        'finished_at' => 'datetime',
    ];

    /**
     * Jadwal yang dikaitkan dengan antrian ini
     */
    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }

    /**
     * Data anak yang mengantri
     */
    public function child(): BelongsTo
    {
        return $this->belongsTo(Child::class);
    }

    /**
     * Bunda (User) yang mendaftarkan antriannya
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope: antrian yang masih menunggu
     */
    public function scopeWaiting($query)
    {
        return $query->where('status', 'menunggu');
    }

    /**
     * Scope: antrian yang sedang diperiksa
     */
    public function scopeProcessing($query)
    {
        return $query->where('status', 'diperiksa');
    }
}
