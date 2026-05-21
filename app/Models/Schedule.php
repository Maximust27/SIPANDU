<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Schedule extends Model
{
    use HasFactory;

    protected $fillable = [
        'posyandu_id',
        'kader_id',
        'scheduled_date',
        'time_start',
        'time_end',
        'agenda',
        'status',
    ];

    protected $casts = [
        'scheduled_date' => 'date',
    ];

    /**
     * Posyandu penyelenggara jadwal ini
     */
    public function posyandu(): BelongsTo
    {
        return $this->belongsTo(Posyandu::class);
    }

    /**
     * Kader penanggungjawab jadwal ini
     */
    public function kader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'kader_id');
    }

    /**
     * Daftar antrian dalam jadwal ini
     */
    public function queues(): HasMany
    {
        return $this->hasMany(Queue::class);
    }

    /**
     * Scope: jadwal yang akan datang
     */
    public function scopeUpcoming($query)
    {
        return $query->where('scheduled_date', '>=', now()->toDateString())
                     ->where('status', 'upcoming')
                     ->orderBy('scheduled_date');
    }

    /**
     * Scope: jadwal yang sedang berlangsung hari ini
     */
    public function scopeToday($query)
    {
        return $query->whereDate('scheduled_date', today());
    }
}
