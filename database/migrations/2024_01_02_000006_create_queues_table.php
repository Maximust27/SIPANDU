<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('queues', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('schedule_id');
            $table->unsignedBigInteger('child_id');
            $table->unsignedBigInteger('user_id');           // Bunda yang mendaftar antrian
            $table->integer('queue_number');                  // Nomor urut: 1, 2, 3, dst.
            $table->string('ticket_code', 10);               // Kode tiket: A-01, A-02, dst.
            $table->string('agenda')->nullable();             // Keperluan: Timbang, Imunisasi, dll.
            $table->enum('status', ['menunggu', 'diperiksa', 'selesai', 'tidak_hadir'])->default('menunggu');
            $table->timestamp('called_at')->nullable();       // Waktu dipanggil kader
            $table->timestamp('finished_at')->nullable();     // Waktu selesai diperiksa
            $table->timestamps();

            $table->foreign('schedule_id')->references('id')->on('schedules')->onDelete('cascade');
            $table->foreign('child_id')->references('id')->on('children')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            // Satu anak tidak bisa antri 2x di jadwal yang sama
            $table->unique(['schedule_id', 'child_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('queues');
    }
};
