<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('children', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');           // FK ke user (Bunda/Pengguna)
            $table->unsignedBigInteger('posyandu_id')->nullable(); // FK ke posyandu terdaftar
            $table->string('nik', 20)->nullable()->unique(); // NIK balita
            $table->string('name');                          // Nama anak
            $table->enum('gender', ['Laki-laki', 'Perempuan']);
            $table->date('birth_date');
            $table->string('birth_place')->nullable();
            $table->decimal('birth_weight', 5, 2)->nullable(); // Berat lahir (kg)
            $table->decimal('birth_height', 5, 2)->nullable(); // Tinggi lahir (cm)
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->string('photo')->nullable();              // Path foto anak
            $table->enum('status', ['Terverifikasi', 'Butuh Verifikasi', 'Belum Terdaftar'])->default('Butuh Verifikasi');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('children');
    }
};
