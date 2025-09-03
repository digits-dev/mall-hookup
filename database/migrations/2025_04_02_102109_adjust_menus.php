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
        Schema::table('adm_menuses', function (Blueprint $table) {
            $table->string('menu_type')->default('User')->after('slug');
        });
        Schema::table('adm_admin_menuses', function (Blueprint $table) {
            $table->string('menu_type')->default('Admin')->after('slug');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('adm_menuses', function (Blueprint $table) {
            $table->dropColumn('menu_type');
        });
        Schema::table('adm_admin_menuses', function (Blueprint $table) {
            $table->dropColumn('menu_type');
        });
    }
};
