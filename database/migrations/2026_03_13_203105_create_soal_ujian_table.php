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
        Schema::create('soal_ujian', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ujian_id')->constrained('ujian')->onDelete('cascade');
            $table->integer('nomor_soal');
            $table->enum('tipe_soal', ['pilihan_ganda', 'essay', 'benar_salah', 'menjodohkan'])->default('pilihan_ganda');
            $table->text('pertanyaan');
            $table->text('opsi_a')->nullable();
            $table->text('opsi_b')->nullable();
            $table->text('opsi_c')->nullable();
            $table->text('opsi_d')->nullable();
            $table->text('opsi_e')->nullable();
            $table->string('jawaban_benar')->nullable(); // A, B, C, D, E atau text untuk essay
            $table->text('pembahasan')->nullable();
            $table->string('file_soal')->nullable(); // untuk gambar/file pendukung soal
            $table->decimal('bobot', 5, 2)->default(1.00); // bobot nilai per soal
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('soal_ujian');
    }
};
