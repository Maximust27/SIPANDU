<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('posyandu_id');
            $table->unsignedBigInteger('kader_id');          // Kader penanggungjawab
            $table->date('scheduled_date');
            $table->time('time_start')->default('08:00:00');
            $table->time('time_end')->default('12:00:00');
            $table->text('agenda')->nullable();              // Deskripsi agenda
            $table->enum('status', ['upcoming', 'berlangsung', 'selesai', 'dibatalkan'])->default('upcoming');
            $table->timestamps();

            $table->foreign('posyandu_id')->references('id')->on('posyandu')->onDelete('cascade');
            $table->foreign('kader_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
