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
        Schema::create('etp_creds', function (Blueprint $table) {
            $table->id();
            $table->string('store_id')->nullable();
            $table->string('etp_ip')->nullable();
            $table->string('etp_database_name')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('etp_creds');
    }
};