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
        Schema::create('adm_notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('adm_user_id')->constrained()->onDelete('cascade'); // Link to the user
            $table->string('type')->default('info'); // 'info', 'success', 'error', etc.
            $table->string('title')->nullable();
            $table->string('content')->nullable();
            $table->string('url')->nullable();
            $table->boolean('is_read')->default(0); // To track if the notification has been read
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adm_notifications');
    }
};
