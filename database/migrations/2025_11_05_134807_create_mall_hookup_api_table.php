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
        Schema::create('mall_hookup_api', function (Blueprint $table) {
            $table->id();
            $table->string('pos_supplier_url')->nullable();
            $table->string('pos_supplier_retrieve_url')->nullable();
            $table->string('pos_supplier_api_key')->nullable();
            $table->string('pos_supplier_retrieve_api_key')->nullable();
            $table->string('secret_key')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mall_hookup_api');
    }
};