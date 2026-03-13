<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel Pengurus OSIS
        Schema::create('pengurus_osis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->foreignId('tahun_ajaran_id')->constrained('tahun_ajaran')->onDelete('cascade');
            $table->enum('jabatan', ['ketua', 'wakil', 'sekretaris', 'bendahara', 'seksi']);
            $table->string('seksi')->nullable(); // pendidikan, olahraga, seni, dll
            $table->date('periode_mulai');
            $table->date('periode_selesai');
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->timestamps();
            
            $table->index(['tahun_ajaran_id', 'status']);
        });

        // Tabel Kegiatan OSIS
        Schema::create('kegiatan_osis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->string('nama_kegiatan');
            $table->enum('kategori', ['bakti_sosial', 'lomba', 'seminar', 'upacara', 'lainnya']);
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->string('tempat')->nullable();
            $table->foreignId('penanggung_jawab_id')->constrained('users')->onDelete('cascade');
            $table->integer('anggaran')->default(0);
            $table->integer('realisasi_anggaran')->default(0);
            $table->text('deskripsi')->nullable();
            $table->text('hasil')->nullable();
            $table->json('dokumentasi')->nullable();
            $table->enum('status', ['rencana', 'berlangsung', 'selesai'])->default('rencana');
            $table->timestamps();
            
            $table->index(['tanggal_mulai', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kegiatan_osis');
        Schema::dropIfExists('pengurus_osis');
    }
};
