<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Status akun (aktif/nonaktif) — dikelola Admin
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif')->after('role');
            // Alamat lengkap (dipakai untuk Kader)
            $table->text('address')->nullable()->after('status');
            // FK ke Posyandu — diisi jika role = 'kader'
            $table->unsignedBigInteger('posyandu_id')->nullable()->after('address');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['status', 'address', 'posyandu_id']);
        });
    }
};
