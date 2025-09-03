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
        Schema::create('adm_embedded_dashboard_privileges', function (Blueprint $table) {
            $table->id();
            $table->integer('adm_embedded_dashboard_id')->nullable();
            $table->integer('adm_privileges_id')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adm_embedded_dashboard_privileges');
    }
};
