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
        // PPDB Pendaftaran
        Schema::create('ppdb_pendaftaran', function (Blueprint $table) {
            $table->id();
            $table->string('no_pendaftaran')->unique();
            $table->foreignId('tahun_ajaran_id')->constrained('tahun_ajaran')->onDelete('cascade');
            $table->foreignId('jenjang_id')->constrained('jenjang')->onDelete('cascade');
            $table->foreignId('jurusan_id')->nullable()->constrained('jurusan')->onDelete('set null');

            // Data Calon Siswa
            $table->string('nama_lengkap');
            $table->string('nisn', 10)->nullable();
            $table->string('nik', 16)->nullable();
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->text('alamat');
            $table->string('email')->nullable();
            $table->string('no_hp', 15)->nullable();

            // Data Orang Tua
            $table->string('nama_ayah');
            $table->string('nama_ibu');
            $table->string('pekerjaan_ayah')->nullable();
            $table->string('pekerjaan_ibu')->nullable();
            $table->string('no_hp_ortu', 15);
            $table->integer('penghasilan_ortu')->nullable();

            // Jalur Pendaftaran
            $table->enum('jalur', ['zonasi', 'prestasi', 'afirmasi', 'perpindahan'])->default('zonasi');

            // Status
            $table->enum('status', ['daftar', 'verifikasi', 'lulus', 'tidak_lulus', 'daftar_ulang'])->default('daftar');

            // User Account
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');

            $table->timestamps();
        });

        // PPDB Dokumen
        Schema::create('ppdb_dokumen', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppdb_pendaftaran_id')->constrained('ppdb_pendaftaran')->onDelete('cascade');
            $table->enum('jenis_dokumen', ['akta_lahir', 'kk', 'ijazah', 'skl', 'pas_foto', 'raport', 'sertifikat']);
            $table->string('nama_file');
            $table->string('path');
            $table->boolean('is_verified')->default(false);
            $table->timestamps();
        });

        // PPDB Seleksi
        Schema::create('ppdb_seleksi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppdb_pendaftaran_id')->constrained('ppdb_pendaftaran')->onDelete('cascade');
            $table->decimal('nilai_rapor', 5, 2)->nullable();
            $table->decimal('nilai_tes', 5, 2)->nullable();
            $table->decimal('nilai_wawancara', 5, 2)->nullable();
            $table->decimal('total_nilai', 5, 2)->nullable();
            $table->integer('ranking')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();
        });

        // PPDB Pembayaran
        Schema::create('ppdb_pembayaran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ppdb_pendaftaran_id')->constrained('ppdb_pendaftaran')->onDelete('cascade');
            $table->enum('jenis_pembayaran', ['formulir', 'daftar_ulang', 'seragam', 'spp_awal']);
            $table->integer('jumlah');
            $table->enum('status_bayar', ['belum', 'lunas'])->default('belum');
            $table->string('bukti_bayar')->nullable();
            $table->date('tanggal_bayar')->nullable();
            $table->timestamps();
        });

        // PPDB Pengumuman
        Schema::create('ppdb_pengumuman', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tahun_ajaran_id')->constrained('tahun_ajaran')->onDelete('cascade');
            $table->string('judul');
            $table->text('isi');
            $table->date('tanggal_pengumuman');
            $table->boolean('is_published')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ppdb_pengumuman');
        Schema::dropIfExists('ppdb_pembayaran');
        Schema::dropIfExists('ppdb_seleksi');
        Schema::dropIfExists('ppdb_dokumen');
        Schema::dropIfExists('ppdb_pendaftaran');
    }
};
