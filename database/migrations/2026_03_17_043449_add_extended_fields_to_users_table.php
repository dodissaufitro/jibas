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
        Schema::table('users', function (Blueprint $table) {
            // Only add fields that don't exist yet
            // phone, address, is_active, institution_id already exist
            $table->string('nik', 20)->nullable()->after('email');
            $table->enum('jenis_kelamin', ['L', 'P'])->nullable()->after('nik');
            $table->string('tempat_lahir')->nullable()->after('jenis_kelamin');
            $table->date('tanggal_lahir')->nullable()->after('tempat_lahir');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'nik',
                'jenis_kelamin',
                'tempat_lahir',
                'tanggal_lahir',
            ]);
        });
    }
};
