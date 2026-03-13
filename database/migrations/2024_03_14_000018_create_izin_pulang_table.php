<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('izin_pulang', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->enum('jenis_izin', ['pulang', 'sakit', 'keperluan_keluarga', 'acara']);
            $table->timestamp('tanggal_izin');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->string('tujuan');
            $table->string('penjemput_nama');
            $table->string('penjemput_hubungan', 50);
            $table->string('penjemput_telepon', 20);
            $table->text('alasan');
            $table->enum('status', ['pending', 'disetujui', 'ditolak', 'kembali'])->default('pending');
            $table->foreignId('disetujui_oleh')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('tanggal_disetujui')->nullable();
            $table->text('catatan_approval')->nullable();
            $table->timestamp('tanggal_kembali')->nullable();
            $table->boolean('terlambat')->default(false);
            $table->timestamps();
            
            $table->index(['siswa_id', 'status']);
            $table->index('tanggal_mulai');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('izin_pulang');
    }
};
