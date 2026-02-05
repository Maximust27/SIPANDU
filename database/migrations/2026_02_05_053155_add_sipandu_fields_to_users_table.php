<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Menambahkan kolom Role (Admin, Kader, Pengguna)
            // Defaultnya 'pengguna' agar aman saat register biasa
            $table->enum('role', ['admin', 'kader', 'pengguna'])
                  ->default('pengguna')
                  ->after('email_verified_at');

            // Menambahkan kolom data diri sesuai form Register
            $table->string('phone')->nullable()->after('password');
            $table->string('kabupaten')->default('Cilacap')->after('phone');
            $table->string('kecamatan')->nullable()->after('kabupaten');
            $table->string('kelurahan')->nullable()->after('kecamatan');
            
            // Opsional: Foto profil jika dibutuhkan nanti
            $table->string('avatar')->nullable()->after('kelurahan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'role', 
                'phone', 
                'kabupaten', 
                'kecamatan', 
                'kelurahan',
                'avatar'
            ]);
        });
    }
};