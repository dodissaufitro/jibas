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
        // Add institution_id to siswa table
        Schema::table('siswa', function (Blueprint $table) {
            $table->foreignId('institution_id')->nullable()->after('user_id')->constrained('institutions')->onDelete('set null');
        });

        // Add institution_id to guru table
        Schema::table('guru', function (Blueprint $table) {
            $table->foreignId('institution_id')->nullable()->after('user_id')->constrained('institutions')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('siswa', function (Blueprint $table) {
            $table->dropForeign(['institution_id']);
            $table->dropColumn('institution_id');
        });

        Schema::table('guru', function (Blueprint $table) {
            $table->dropForeign(['institution_id']);
            $table->dropColumn('institution_id');
        });
    }
};
