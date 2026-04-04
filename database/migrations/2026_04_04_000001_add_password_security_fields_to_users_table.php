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
            $table->timestamp('password_changed_at')->nullable()->after('password');
            $table->boolean('force_password_change')->default(false)->after('password_changed_at');
            // Note: last_login_at already exists from 2024_01_01_000009 migration
            $table->string('last_login_ip')->nullable()->after('last_login_at');
            $table->text('password_history')->nullable()->after('last_login_ip')->comment('JSON array of previous password hashes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'password_changed_at',
                'force_password_change',
                // 'last_login_at', // Don't drop - existed before this migration
                'last_login_ip',
                'password_history'
            ]);
        });
    }
};
