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
        Schema::create('ujian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mata_pelajaran_id')->constrained('mata_pelajaran')->cascadeOnDelete();
            $table->foreignId('guru_id')->constrained('guru')->cascadeOnDelete();
            $table->foreignId('kelas_id')->constrained('kelas')->cascadeOnDelete();
            $table->foreignId('tahun_ajaran_id')->constrained('tahun_ajaran')->cascadeOnDelete();
            $table->foreignId('semester_id')->constrained('semester')->cascadeOnDelete();
            $table->string('judul_ujian');
            $table->enum('jenis_ujian', ['UTS', 'UAS', 'Harian', 'Quiz', 'Praktek', 'Tugas', 'Lainnya'])->default('Harian');
            $table->dateTime('tanggal_ujian');
            $table->integer('durasi_menit')->default(90);
            $table->decimal('bobot', 5, 2)->default(100.00);
            $table->decimal('kkm', 5, 2)->default(75.00);
            $table->text('keterangan')->nullable();
            $table->enum('status', ['dijadwalkan', 'berlangsung', 'selesai', 'batal'])->default('dijadwalkan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ujian');
    }
};
