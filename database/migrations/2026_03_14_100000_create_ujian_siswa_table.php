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
        Schema::create('ujian_siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ujian_id')->constrained('ujian')->cascadeOnDelete();
            $table->foreignId('siswa_id')->constrained('siswa')->cascadeOnDelete();
            $table->dateTime('waktu_mulai')->nullable();
            $table->dateTime('waktu_selesai')->nullable();
            $table->integer('durasi_pengerjaan')->nullable(); // dalam menit
            $table->decimal('nilai', 5, 2)->nullable();
            $table->integer('jumlah_benar')->default(0);
            $table->integer('jumlah_salah')->default(0);
            $table->integer('jumlah_kosong')->default(0);
            $table->enum('status', ['belum_mulai', 'sedang_mengerjakan', 'selesai', 'tidak_hadir'])->default('belum_mulai');
            $table->text('catatan')->nullable();
            $table->timestamps();

            // Unique constraint: satu siswa hanya bisa mengerjakan ujian yang sama sekali
            $table->unique(['ujian_id', 'siswa_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ujian_siswa');
    }
};
