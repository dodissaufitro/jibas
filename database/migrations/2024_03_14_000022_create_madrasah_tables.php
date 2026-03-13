<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel Nilai Agama
        Schema::create('nilai_agama', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->foreignId('semester_id')->constrained('semester')->onDelete('cascade');
            $table->enum('mata_pelajaran', ['quran_hadits', 'aqidah_akhlak', 'fiqh', 'ski', 'bahasa_arab']);
            $table->json('hafalan_surat')->nullable();
            $table->float('nilai_tugas')->default(0);
            $table->float('nilai_uts')->default(0);
            $table->float('nilai_uas')->default(0);
            $table->float('nilai_praktik')->default(0);
            $table->float('nilai_akhir')->default(0);
            $table->string('predikat', 10)->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();
            
            $table->unique(['siswa_id', 'semester_id', 'mata_pelajaran']);
        });

        // Tabel Evaluasi Ibadah
        Schema::create('evaluasi_ibadah', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->string('periode', 20); // bulanan
            $table->integer('bulan');
            $table->integer('tahun');
            $table->float('shalat_fardhu')->default(0); // persentase
            $table->float('shalat_dhuha')->default(0);
            $table->float('shalat_tahajud')->default(0);
            $table->float('membaca_quran')->default(0);
            $table->float('hafalan_quran')->default(0);
            $table->integer('puasa_sunnah')->default(0);
            $table->integer('infaq_sedekah')->default(0);
            $table->integer('kegiatan_keagamaan')->default(0);
            $table->float('nilai_total')->default(0);
            $table->string('predikat', 50)->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();
            
            $table->unique(['siswa_id', 'bulan', 'tahun']);
        });

        // Tabel Kegiatan Keagamaan
        Schema::create('kegiatan_keagamaan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->string('nama_kegiatan');
            $table->enum('jenis', ['pengajian', 'peringatan_hari_besar', 'pesantren_kilat', 'maulid', 'isra_miraj', 'lainnya']);
            $table->string('pembicara')->nullable();
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->time('waktu')->nullable();
            $table->string('tempat')->nullable();
            $table->foreignId('penanggung_jawab_id')->constrained('users')->onDelete('cascade');
            $table->integer('target_peserta')->default(0);
            $table->integer('jumlah_peserta')->default(0);
            $table->text('deskripsi')->nullable();
            $table->text('materi')->nullable();
            $table->json('dokumentasi')->nullable();
            $table->enum('status', ['rencana', 'berlangsung', 'selesai'])->default('rencana');
            $table->timestamps();
            
            $table->index(['tanggal_mulai', 'jenis']);
        });

        // Tabel Peserta Kegiatan
        Schema::create('peserta_kegiatan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('kegiatan_id')->constrained('kegiatan_keagamaan')->onDelete('cascade');
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->enum('status_kehadiran', ['hadir', 'tidak_hadir', 'izin']);
            $table->integer('nilai_partisipasi')->nullable();
            $table->text('catatan')->nullable();
            $table->timestamps();
            
            $table->unique(['kegiatan_id', 'siswa_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peserta_kegiatan');
        Schema::dropIfExists('kegiatan_keagamaan');
        Schema::dropIfExists('evaluasi_ibadah');
        Schema::dropIfExists('nilai_agama');
    }
};
