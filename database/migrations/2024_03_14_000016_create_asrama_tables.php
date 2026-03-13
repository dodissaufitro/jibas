<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel Asrama
        Schema::create('asrama', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->string('nama_asrama');
            $table->enum('jenis', ['putra', 'putri']);
            $table->integer('kapasitas');
            $table->integer('terisi')->default(0);
            $table->foreignId('pengurus_id')->nullable()->constrained('users')->onDelete('set null');
            $table->text('alamat')->nullable();
            $table->json('fasilitas')->nullable();
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->timestamps();
            
            $table->index(['institution_id', 'jenis']);
        });

        // Tabel Kamar Asrama
        Schema::create('kamar_asrama', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('asrama_id')->constrained('asrama')->onDelete('cascade');
            $table->string('nomor_kamar', 50);
            $table->integer('lantai');
            $table->integer('kapasitas');
            $table->integer('terisi')->default(0);
            $table->json('fasilitas')->nullable();
            $table->enum('status', ['tersedia', 'penuh', 'perbaikan'])->default('tersedia');
            $table->timestamps();
            
            $table->index(['asrama_id', 'lantai']);
        });

        // Tabel Penghuni Asrama
        Schema::create('penghuni_asrama', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->foreignId('asrama_id')->constrained('asrama')->onDelete('cascade');
            $table->foreignId('kamar_id')->constrained('kamar_asrama')->onDelete('cascade');
            $table->date('tanggal_masuk');
            $table->date('tanggal_keluar')->nullable();
            $table->enum('status', ['aktif', 'keluar'])->default('aktif');
            $table->text('keterangan')->nullable();
            $table->timestamps();
            
            $table->index(['siswa_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penghuni_asrama');
        Schema::dropIfExists('kamar_asrama');
        Schema::dropIfExists('asrama');
    }
};
