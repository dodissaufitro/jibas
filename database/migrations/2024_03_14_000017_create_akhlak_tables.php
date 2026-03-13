<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel Pembinaan Akhlak
        Schema::create('pembinaan_akhlak', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->foreignId('pembina_id')->constrained('users')->onDelete('cascade');
            $table->enum('jenis_pembinaan', ['peringatan', 'bimbingan', 'penghargaan']);
            $table->string('kategori'); // ibadah, adab, kedisiplinan, kebersihan
            $table->text('deskripsi');
            $table->text('tindak_lanjut')->nullable();
            $table->date('tanggal');
            $table->enum('status', ['proses', 'selesai'])->default('proses');
            $table->timestamps();
            
            $table->index(['siswa_id', 'jenis_pembinaan']);
        });

        // Tabel Penilaian Akhlak
        Schema::create('penilaian_akhlak', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->foreignId('semester_id')->constrained('semester')->onDelete('cascade');
            $table->string('aspek'); // kejujuran, tanggung_jawab, disiplin, sopan_santun, kebersihan
            $table->enum('nilai', ['A', 'B', 'C', 'D']);
            $table->text('catatan')->nullable();
            $table->timestamps();
            
            $table->unique(['siswa_id', 'semester_id', 'aspek']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penilaian_akhlak');
        Schema::dropIfExists('pembinaan_akhlak');
    }
};
