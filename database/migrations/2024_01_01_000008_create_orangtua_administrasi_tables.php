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
        // Orang Tua / Wali Murid
        Schema::create('orang_tua', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');

            // Data Ayah
            $table->string('nama_ayah');
            $table->string('nik_ayah', 16)->nullable();
            $table->string('pekerjaan_ayah')->nullable();
            $table->string('pendidikan_ayah')->nullable();
            $table->integer('penghasilan_ayah')->nullable();
            $table->string('no_hp_ayah', 15)->nullable();

            // Data Ibu
            $table->string('nama_ibu');
            $table->string('nik_ibu', 16)->nullable();
            $table->string('pekerjaan_ibu')->nullable();
            $table->string('pendidikan_ibu')->nullable();
            $table->integer('penghasilan_ibu')->nullable();
            $table->string('no_hp_ibu', 15)->nullable();

            // Data Wali (jika ada)
            $table->string('nama_wali')->nullable();
            $table->string('hubungan_wali')->nullable();
            $table->string('no_hp_wali', 15)->nullable();

            $table->text('alamat');
            $table->timestamps();
        });

        // Komunikasi Sekolah - Orang Tua
        Schema::create('komunikasi', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->text('isi');
            $table->enum('jenis', ['pengumuman', 'informasi', 'peringatan', 'undangan']);
            $table->enum('tujuan', ['semua', 'kelas', 'siswa']); // broadcast atau spesifik
            $table->foreignId('kelas_id')->nullable()->constrained('kelas')->onDelete('cascade');
            $table->foreignId('siswa_id')->nullable()->constrained('siswa')->onDelete('cascade');
            $table->boolean('is_published')->default(false);
            $table->date('tanggal_kirim')->nullable();
            $table->foreignId('dibuat_oleh')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        // Surat Masuk
        Schema::create('surat_masuk', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_surat');
            $table->date('tanggal_surat');
            $table->date('tanggal_terima');
            $table->string('asal_surat');
            $table->string('perihal');
            $table->text('isi_ringkas')->nullable();
            $table->string('file_surat')->nullable();
            $table->enum('sifat', ['biasa', 'penting', 'segera', 'rahasia'])->default('biasa');
            $table->foreignId('diterima_oleh')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // Surat Keluar
        Schema::create('surat_keluar', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_surat');
            $table->date('tanggal_surat');
            $table->string('tujuan_surat');
            $table->string('perihal');
            $table->text('isi_ringkas')->nullable();
            $table->string('file_surat')->nullable();
            $table->enum('sifat', ['biasa', 'penting', 'segera', 'rahasia'])->default('biasa');
            $table->foreignId('dibuat_oleh')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // Arsip Digital
        Schema::create('arsip', function (Blueprint $table) {
            $table->id();
            $table->string('nama_dokumen');
            $table->enum('kategori', ['sk', 'surat', 'laporan', 'ijazah', 'sertifikat', 'foto', 'lainnya']);
            $table->text('keterangan')->nullable();
            $table->string('file_path');
            $table->string('file_type'); // pdf, jpg, doc
            $table->integer('file_size'); // dalam bytes
            $table->foreignId('kelas_id')->nullable()->constrained('kelas')->onDelete('set null');
            $table->foreignId('siswa_id')->nullable()->constrained('siswa')->onDelete('set null');
            $table->foreignId('guru_id')->nullable()->constrained('guru')->onDelete('set null');
            $table->foreignId('upload_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });

        // Activity Log
        Schema::create('activity_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('action'); // create, update, delete, login, logout
            $table->string('model')->nullable(); // Siswa, Guru, dll
            $table->bigInteger('model_id')->nullable();
            $table->text('description');
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent')->nullable();
            $table->timestamps();

            // Index untuk query cepat
            $table->index(['user_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activity_logs');
        Schema::dropIfExists('arsip');
        Schema::dropIfExists('surat_keluar');
        Schema::dropIfExists('surat_masuk');
        Schema::dropIfExists('komunikasi');
        Schema::dropIfExists('orang_tua');
    }
};
