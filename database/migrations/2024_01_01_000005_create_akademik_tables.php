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
        // Siswa
        Schema::create('siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('nis', 20)->unique();
            $table->string('nisn', 10)->unique();
            $table->string('nik', 16)->nullable();
            $table->string('nama_lengkap');
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->text('alamat');
            $table->string('email')->nullable();
            $table->string('no_hp', 15)->nullable();
            $table->string('foto')->nullable();

            // Data Orang Tua
            $table->string('nama_ayah');
            $table->string('nama_ibu');
            $table->string('no_hp_ortu', 15);

            // Data Kelas
            $table->foreignId('kelas_id')->nullable()->constrained('kelas')->onDelete('set null');

            // Status
            $table->enum('status', ['aktif', 'pindah', 'keluar', 'lulus'])->default('aktif');
            $table->date('tanggal_masuk');
            $table->date('tanggal_keluar')->nullable();

            $table->timestamps();
        });

        // Guru / Pegawai
        Schema::create('guru', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('nip', 20)->unique()->nullable();
            $table->string('nik', 16);
            $table->string('nama_lengkap');
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->text('alamat');
            $table->string('email')->nullable();
            $table->string('no_hp', 15);
            $table->string('foto')->nullable();

            // Data Kepegawaian
            $table->enum('jenis_ptk', ['guru', 'kepala_sekolah', 'wakil_kepala', 'staff_tu', 'tenaga_kependidikan']);
            $table->enum('status_kepegawaian', ['pns', 'honorer', 'kontrak']);
            $table->string('pendidikan_terakhir')->nullable();
            $table->string('gelar_depan')->nullable();
            $table->string('gelar_belakang')->nullable();

            // Status
            $table->enum('status', ['aktif', 'non_aktif', 'pensiun'])->default('aktif');
            $table->date('tanggal_masuk');

            $table->timestamps();
        });

        // Guru Mata Pelajaran (Relasi Many to Many)
        Schema::create('guru_mata_pelajaran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('guru_id')->constrained('guru')->onDelete('cascade');
            $table->foreignId('mata_pelajaran_id')->constrained('mata_pelajaran')->onDelete('cascade');
            $table->timestamps();
        });

        // Jadwal Pelajaran
        Schema::create('jadwal_pelajaran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tahun_ajaran_id')->constrained('tahun_ajaran')->onDelete('cascade');
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');
            $table->foreignId('mata_pelajaran_id')->constrained('mata_pelajaran')->onDelete('cascade');
            $table->foreignId('guru_id')->constrained('guru')->onDelete('cascade');
            $table->enum('hari', ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu']);
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->string('ruangan')->nullable();
            $table->timestamps();
        });

        // Semester
        Schema::create('semester', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tahun_ajaran_id')->constrained('tahun_ajaran')->onDelete('cascade');
            $table->enum('semester', ['ganjil', 'genap']);
            $table->boolean('is_active')->default(false);
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->timestamps();
        });

        // Nilai
        Schema::create('nilai', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->foreignId('mata_pelajaran_id')->constrained('mata_pelajaran')->onDelete('cascade');
            $table->foreignId('semester_id')->constrained('semester')->onDelete('cascade');
            $table->foreignId('guru_id')->constrained('guru')->onDelete('cascade');

            // Penilaian
            $table->decimal('nilai_harian', 5, 2)->nullable();
            $table->decimal('nilai_uts', 5, 2)->nullable();
            $table->decimal('nilai_uas', 5, 2)->nullable();
            $table->decimal('nilai_praktik', 5, 2)->nullable();
            $table->decimal('nilai_akhir', 5, 2)->nullable();

            // Sikap
            $table->enum('nilai_sikap', ['A', 'B', 'C', 'D'])->nullable();
            $table->text('catatan')->nullable();

            $table->timestamps();
        });

        // Raport
        Schema::create('raport', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->foreignId('semester_id')->constrained('semester')->onDelete('cascade');
            $table->foreignId('kelas_id')->constrained('kelas')->onDelete('cascade');
            $table->integer('ranking')->nullable();
            $table->decimal('rata_rata', 5, 2)->nullable();
            $table->integer('total_sakit')->default(0);
            $table->integer('total_izin')->default(0);
            $table->integer('total_alpha')->default(0);
            $table->text('catatan_wali_kelas')->nullable();
            $table->boolean('is_published')->default(false);
            $table->date('tanggal_terbit')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('raport');
        Schema::dropIfExists('nilai');
        Schema::dropIfExists('semester');
        Schema::dropIfExists('jadwal_pelajaran');
        Schema::dropIfExists('guru_mata_pelajaran');
        Schema::dropIfExists('guru');
        Schema::dropIfExists('siswa');
    }
};
