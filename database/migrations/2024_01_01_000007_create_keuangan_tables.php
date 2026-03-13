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
        // Jenis Pembayaran
        Schema::create('jenis_pembayaran', function (Blueprint $table) {
            $table->id();
            $table->string('nama'); // SPP, Uang Gedung, Seragam, Kegiatan
            $table->string('kode', 20);
            $table->integer('nominal');
            $table->enum('tipe', ['bulanan', 'tahunan', 'insidental'])->default('bulanan');
            $table->text('keterangan')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Tagihan
        Schema::create('tagihan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->foreignId('jenis_pembayaran_id')->constrained('jenis_pembayaran')->onDelete('cascade');
            $table->string('nomor_tagihan')->unique();
            $table->integer('bulan')->nullable(); // 1-12 (untuk SPP)
            $table->integer('tahun');
            $table->integer('jumlah');
            $table->integer('denda')->default(0);
            $table->integer('total')->default(0); // jumlah + denda
            $table->date('jatuh_tempo');
            $table->enum('status', ['belum_bayar', 'dibayar_sebagian', 'lunas'])->default('belum_bayar');
            $table->text('keterangan')->nullable();
            $table->timestamps();

            // Index untuk query cepat
            $table->index(['siswa_id', 'tahun', 'bulan']);
        });

        // Pembayaran
        Schema::create('pembayaran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tagihan_id')->constrained('tagihan')->onDelete('cascade');
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->string('nomor_pembayaran')->unique();
            $table->date('tanggal_bayar');
            $table->integer('jumlah_bayar');
            $table->enum('metode_pembayaran', ['tunai', 'transfer', 'qris', 'va'])->default('tunai');
            $table->string('bukti_bayar')->nullable();
            $table->string('nomor_referensi')->nullable(); // Nomor transfer/transaksi
            $table->foreignId('diterima_oleh')->nullable()->constrained('users')->onDelete('set null');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });

        // Kas (Buku Kas)
        Schema::create('kas', function (Blueprint $table) {
            $table->id();
            $table->date('tanggal');
            $table->string('nomor_transaksi')->unique();
            $table->enum('jenis', ['masuk', 'keluar']);
            $table->string('kategori'); // SPP, Gaji Guru, Listrik, dll
            $table->text('keterangan');
            $table->integer('jumlah');
            $table->integer('saldo');
            $table->foreignId('pembayaran_id')->nullable()->constrained('pembayaran')->onDelete('set null');
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });

        // Laporan Keuangan
        Schema::create('laporan_keuangan', function (Blueprint $table) {
            $table->id();
            $table->integer('bulan'); // 1-12
            $table->integer('tahun');
            $table->integer('saldo_awal');
            $table->integer('total_pemasukan');
            $table->integer('total_pengeluaran');
            $table->integer('saldo_akhir');
            $table->boolean('is_closed')->default(false);
            $table->foreignId('dibuat_oleh')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            // Index untuk query cepat
            $table->index(['tahun', 'bulan']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('laporan_keuangan');
        Schema::dropIfExists('kas');
        Schema::dropIfExists('pembayaran');
        Schema::dropIfExists('tagihan');
        Schema::dropIfExists('jenis_pembayaran');
    }
};
