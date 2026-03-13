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
        Schema::create('institutions', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Nama institusi
            $table->enum('type', ['pesantren', 'umum', 'madrasah']); // Jenis institusi
            $table->string('education_level'); // RA, MI, MTs, MA, TK, SD, SMP, SMA, SMK
            $table->text('address')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('email')->nullable();
            $table->string('logo')->nullable();
            $table->string('website')->nullable();
            $table->string('npsn', 20)->nullable(); // Nomor Pokok Sekolah Nasional
            $table->string('nss', 20)->nullable(); // Nomor Statistik Sekolah
            $table->text('vision')->nullable(); // Visi
            $table->text('mission')->nullable(); // Misi
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        // Tambahkan kolom institution_id ke tabel users
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('institution_id')->nullable()->after('id')->constrained('institutions')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['institution_id']);
            $table->dropColumn('institution_id');
        });

        Schema::dropIfExists('institutions');
    }
};
