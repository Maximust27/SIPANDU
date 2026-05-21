<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('posyandu', function (Blueprint $table) {
            $table->id();
            $table->string('name');                         // Nama posyandu, misal: "Posyandu Melati 1"
            $table->string('kelurahan')->nullable();
            $table->string('kecamatan')->nullable();
            $table->string('kabupaten')->default('Cilacap');
            $table->text('address')->nullable();            // Alamat lengkap posyandu
            $table->string('contact')->nullable();          // Nomor HP posyandu / ketua
            $table->integer('quota_per_session')->default(50); // Kuota antrian per sesi
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('posyandu');
    }
};
