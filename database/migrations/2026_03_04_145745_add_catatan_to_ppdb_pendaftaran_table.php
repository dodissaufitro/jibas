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
        Schema::table('ppdb_pendaftaran', function (Blueprint $table) {
            // Add catatan column
            $table->text('catatan')->nullable()->after('status');

            // Fix jalur enum
            $table->enum('jalur', ['reguler', 'prestasi', 'afirmasi', 'perpindahan'])->default('reguler')->change();

            // Fix status enum
            $table->enum('status', ['pending', 'verifikasi', 'lulus', 'tidak_lulus'])->default('pending')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ppdb_pendaftaran', function (Blueprint $table) {
            $table->dropColumn('catatan');
            $table->enum('jalur', ['zonasi', 'prestasi', 'afirmasi', 'perpindahan'])->default('zonasi')->change();
            $table->enum('status', ['daftar', 'verifikasi', 'lulus', 'tidak_lulus', 'daftar_ulang'])->default('daftar')->change();
        });
    }
};
