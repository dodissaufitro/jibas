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
        // Presensi Siswa
        Schema::create('presensi_siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');
            $table->date('tanggal');
            $table->enum('status', ['hadir', 'sakit', 'izin', 'alpha'])->default('hadir');
            $table->time('jam_masuk')->nullable();
            $table->time('jam_keluar')->nullable();
            $table->text('keterangan')->nullable();
            $table->foreignId('input_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            // Index untuk query cepat
            $table->index(['siswa_id', 'tanggal']);
        });

        // Presensi Guru
        Schema::create('presensi_guru', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')->constrained('guru')->onDelete('cascade');
            $table->date('tanggal');
            $table->enum('status', ['hadir', 'sakit', 'izin', 'alpha', 'dinas_luar'])->default('hadir');
            $table->time('jam_masuk')->nullable();
            $table->time('jam_keluar')->nullable();
            $table->text('keterangan')->nullable();
            $table->string('bukti_foto')->nullable();
            $table->timestamps();

            // Index untuk query cepat
            $table->index(['guru_id', 'tanggal']);
        });

        // Rekap Presensi Bulanan Siswa
        Schema::create('rekap_presensi_siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->integer('bulan'); // 1-12
            $table->integer('tahun');
            $table->integer('total_hadir')->default(0);
            $table->integer('total_sakit')->default(0);
            $table->integer('total_izin')->default(0);
            $table->integer('total_alpha')->default(0);
            $table->decimal('persentase_hadir', 5, 2)->default(0);
            $table->timestamps();

            // Index untuk query cepat
            $table->index(['siswa_id', 'tahun', 'bulan']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rekap_presensi_siswa');
        Schema::dropIfExists('presensi_guru');
        Schema::dropIfExists('presensi_siswa');
    }
};
