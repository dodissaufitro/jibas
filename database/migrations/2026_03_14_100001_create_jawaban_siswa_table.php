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
        Schema::create('jawaban_siswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ujian_siswa_id')->constrained('ujian_siswa')->cascadeOnDelete();
            $table->foreignId('soal_ujian_id')->constrained('soal_ujian')->cascadeOnDelete();
            $table->string('jawaban')->nullable(); // A, B, C, D, E untuk pilihan ganda
            $table->text('jawaban_essay')->nullable(); // untuk soal essay
            $table->boolean('is_benar')->default(false);
            $table->decimal('nilai', 5, 2)->default(0);
            $table->timestamps();

            // Unique constraint: satu siswa hanya bisa menjawab soal yang sama sekali per ujian
            $table->unique(['ujian_siswa_id', 'soal_ujian_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jawaban_siswa');
    }
};
