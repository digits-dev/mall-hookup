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
        Schema::table('announcements', function (Blueprint $table) {
            $table->dropColumn('title');
            $table->dropColumn('message');
            $table->string('name')->nullable()->after('id');
            $table->json('json_data')->nullable()->after('name');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('announcements', function (Blueprint $table) {
            $table->dropColumn('name');
            $table->dropColumn('json_data');
            $table->string('title', 255)->nullable()->after('id');
            $table->longText('message')->nullable()->after('title');
        });
    }
};
