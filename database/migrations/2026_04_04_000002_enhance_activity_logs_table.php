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
        Schema::table('activity_logs', function (Blueprint $table) {
            $table->enum('severity', ['info', 'warning', 'critical'])->default('info')->after('action');
            $table->text('metadata')->nullable()->after('new_values')->comment('Additional JSON metadata');
            $table->string('module')->nullable()->after('model')->comment('Module/feature name');
            // Note: index(['user_id', 'created_at']) already exists from 2024_01_01_000008 migration
            $table->index(['model', 'model_id']);
            $table->index(['action', 'severity']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('activity_logs', function (Blueprint $table) {
            // Don't drop index(['user_id', 'created_at']) - existed before this migration
            $table->dropIndex(['model', 'model_id']);
            $table->dropIndex(['action', 'severity']);
            $table->dropColumn(['severity', 'metadata', 'module']);
        });
    }
};
