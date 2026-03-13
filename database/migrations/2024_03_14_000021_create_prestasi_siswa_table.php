<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('prestasi_siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained()->onDelete('cascade');
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->enum('jenis', ['akademik', 'non_akademik']);
            $table->string('kategori'); // olimpiade, lomba, kejuaraan, penghargaan
            $table->string('nama_prestasi');
            $table->enum('tingkat', ['sekolah', 'kecamatan', 'kabupaten', 'provinsi', 'nasional', 'internasional']);
            $table->string('peringkat', 50); // juara_1, juara_2, juara_3, harapan_1
            $table->string('penyelenggara');
            $table->date('tanggal');
            $table->string('sertifikat')->nullable(); // file path
            $table->text('keterangan')->nullable();
            $table->timestamps();
            
            $table->index(['siswa_id', 'jenis', 'tingkat']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('prestasi_siswa');
    }
};
