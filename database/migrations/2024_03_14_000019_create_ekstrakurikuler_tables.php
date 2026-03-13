<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel Ekstrakurikuler
        Schema::create('ekstrakurikuler', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->string('nama_ekskul');
            $table->enum('kategori', ['olahraga', 'seni', 'sains', 'bahasa', 'keagamaan']);
            $table->foreignId('pembina_id')->constrained('users')->onDelete('cascade');
            $table->json('jadwal')->nullable(); // {hari, waktu}
            $table->string('tempat')->nullable();
            $table->integer('kuota');
            $table->integer('terisi')->default(0);
            $table->integer('biaya')->default(0);
            $table->text('deskripsi')->nullable();
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->timestamps();

            $table->index(['institution_id', 'kategori']);
        });

        // Tabel Anggota Ekstrakurikuler
        Schema::create('anggota_ekskul', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('ekstrakurikuler_id')->constrained('ekstrakurikuler')->onDelete('cascade');
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->foreignId('tahun_ajaran_id')->constrained('tahun_ajaran')->onDelete('cascade');
            $table->date('tanggal_daftar');
            $table->enum('jabatan', ['ketua', 'wakil', 'sekretaris', 'anggota'])->default('anggota');
            $table->enum('status', ['aktif', 'keluar'])->default('aktif');
            $table->float('nilai_akhir')->nullable();
            $table->string('predikat', 10)->nullable();
            $table->timestamps();

            $table->unique(['ekstrakurikuler_id', 'siswa_id', 'tahun_ajaran_id'], 'anggota_ekskul_unique');
        });

        // Tabel Kegiatan Ekstrakurikuler
        Schema::create('kegiatan_ekskul', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('ekstrakurikuler_id')->constrained('ekstrakurikuler')->onDelete('cascade');
            $table->string('nama_kegiatan');
            $table->enum('jenis', ['latihan_rutin', 'lomba', 'pentas', 'studi_banding']);
            $table->date('tanggal');
            $table->string('tempat')->nullable();
            $table->text('deskripsi')->nullable();
            $table->text('hasil')->nullable();
            $table->json('dokumentasi')->nullable();
            $table->timestamps();

            $table->index(['ekstrakurikuler_id', 'tanggal']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kegiatan_ekskul');
        Schema::dropIfExists('anggota_ekskul');
        Schema::dropIfExists('ekstrakurikuler');
    }
};
