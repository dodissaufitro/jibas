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
        Schema::create('hafalan_quran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('institution_id')->constrained('institutions')->onDelete('cascade');
            $table->foreignId('siswa_id')->constrained('siswa')->onDelete('cascade');
            $table->integer('juz');
            $table->string('surat', 100);
            $table->integer('ayat_dari');
            $table->integer('ayat_sampai');
            $table->date('tanggal_setoran');
            $table->enum('nilai', ['A', 'B', 'C', 'D']);
            $table->text('keterangan')->nullable();
            $table->foreignId('penguji_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();

            // Indexes for better query performance
            $table->index(['institution_id', 'siswa_id']);
            $table->index(['institution_id', 'juz']);
            $table->index('tanggal_setoran');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hafalan_quran');
    }
};
