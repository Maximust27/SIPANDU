<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('measurements', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('child_id');
            $table->unsignedBigInteger('kader_id')->nullable(); // Siapa yang menginput
            $table->date('measured_at');
            $table->integer('age_in_months');
            $table->decimal('weight', 5, 2);               // Berat badan (kg)
            $table->decimal('height', 5, 2)->nullable();   // Tinggi badan (cm)
            $table->decimal('head_circumference', 5, 2)->nullable(); // Lingkar kepala (cm)

            // Status Gizi (dihitung otomatis via WHO z-score)
            $table->string('status_gizi')->nullable();         // BB/U: Gizi Buruk, Kurang, Baik, Lebih
            $table->string('status_tinggi')->nullable();       // TB/U: Sangat Pendek, Pendek, Normal, Tinggi
            $table->string('status_kepala')->nullable();       // LK: Mikrosefali, Normal, Makrosefali
            $table->decimal('z_score_bbu', 5, 2)->nullable(); // Nilai z-score BB/U
            $table->decimal('z_score_tbu', 5, 2)->nullable(); // Nilai z-score TB/U

            $table->text('notes')->nullable();
            // Alur verifikasi: Bunda input (false) → Kader verifikasi (true)
            $table->boolean('is_verified')->default(false);
            $table->timestamp('verified_at')->nullable();

            $table->timestamps();

            $table->foreign('child_id')->references('id')->on('children')->onDelete('cascade');
            $table->foreign('kader_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('measurements');
    }
};
