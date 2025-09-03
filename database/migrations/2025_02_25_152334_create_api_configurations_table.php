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
        Schema::create('api_configurations', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('table_name');
            $table->json('fields');
            $table->json('relations')->nullable();
            $table->json('rules')->nullable();
            $table->longText('sql_parameter')->nullable();
            $table->string('controller_name')->nullable();
            $table->string('endpoint')->unique();
            $table->string('method')->default('ALL');
            $table->string('action_type')->nullable();
            $table->string('auth_type')->default('jwt');
            $table->boolean('enable_logging')->default(true);
            $table->integer('rate_limit')->default(0);
            $table->boolean('has_rate_limit')->default(false);
            $table->tinyInteger('status')->default(1);
            $table->integer('created_by')->nullable();
            $table->integer('updated_by')->nullable();
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
            $table->timestamp('deleted_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('api_configurations');
    }
};
