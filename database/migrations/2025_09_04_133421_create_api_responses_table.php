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
     Schema::create('api_responses', function (Blueprint $table) {
        $table->id();
        $table->integer('pos_data_id')->nullable();     
        $table->json('payload')->nullable();      
        $table->string('status')->nullable();     
        $table->text('message')->nullable();     
        $table->json('data')->nullable();          
        $table->json('raw_response')->nullable();   
        $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('api_responses');
    }
};