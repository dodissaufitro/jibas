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
        // Tahun Ajaran
        Schema::create('tahun_ajaran', function (Blueprint $table) {
            $table->id();
            $table->string('nama'); // 2024/2025
            $table->year('tahun_mulai');
            $table->year('tahun_selesai');
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });

        // Jenjang Pendidikan (TK, SD, SMP, SMA)
        Schema::create('jenjang', function (Blueprint $table) {
            $table->id();
            $table->string('nama'); // TK, SD, SMP, SMA
            $table->string('kode', 10); // TK, SD, SMP, SMA
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // Jurusan (untuk SMA/SMK)
        Schema::create('jurusan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('jenjang_id')->constrained('jenjang')->onDelete('cascade');
            $table->string('nama'); // IPA, IPS, Bahasa
            $table->string('kode', 10);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // Kelas
        Schema::create('kelas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tahun_ajaran_id')->constrained('tahun_ajaran')->onDelete('cascade');
            $table->foreignId('jenjang_id')->constrained('jenjang')->onDelete('cascade');
            $table->foreignId('jurusan_id')->nullable()->constrained('jurusan')->onDelete('set null');
            $table->string('nama'); // X-A, XI IPA 1
            $table->integer('tingkat'); // 1-12
            $table->string('nama_kelas'); // A, B, C
            $table->integer('kapasitas')->default(30);
            $table->foreignId('wali_kelas_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // Mata Pelajaran
        Schema::create('mata_pelajaran', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('kode', 20);
            $table->foreignId('jenjang_id')->constrained('jenjang')->onDelete('cascade');
            $table->integer('kkm')->default(75); // Kriteria Ketuntasan Minimal
            $table->enum('jenis', ['wajib', 'peminatan', 'lintas_minat', 'mulok'])->default('wajib');
            $table->timestamps();
        });

        // Kurikulum
        Schema::create('kurikulum', function (Blueprint $table) {
            $table->id();
            $table->string('nama'); // Kurikulum 2013, Kurikulum Merdeka
            $table->year('tahun');
            $table->boolean('is_active')->default(false);
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kurikulum');
        Schema::dropIfExists('mata_pelajaran');
        Schema::dropIfExists('kelas');
        Schema::dropIfExists('jurusan');
        Schema::dropIfExists('jenjang');
        Schema::dropIfExists('tahun_ajaran');
    }
};
