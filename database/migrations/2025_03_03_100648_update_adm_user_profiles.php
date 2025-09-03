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
        Schema::table('adm_user_profiles', function (Blueprint $table) {
            $table->dropColumn('ext');
            $table->dropColumn('archived');
            $table->string('status', 10)->default('ACTIVE')->after('file_name');
            $table->timestamp('deleted_at')->nullable()->after('updated_at');
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('adm_user_profiles', function (Blueprint $table) {
            $table->dropColumn('status');
            $table->dropColumn('deleted_at');
            $table->string('ext')->nullable()->after('file_name');
            $table->date('archived')->nullable()->after('created_by');
        });
    }
};
