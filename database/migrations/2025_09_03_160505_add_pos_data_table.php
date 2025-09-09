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
       Schema::create('pos_data', function (Blueprint $table) {
            $table->id();
            $table->string('contract_number')->nullable();
            $table->string('contract_key')->nullable();
            $table->string('pos_no')->nullable();
            $table->string('company_code')->nullable();
            $table->date('date_of_transaction')->nullable(); 
            $table->decimal('total_sales', 18, 2)->nullable(); 
            $table->integer('transaction_count')->nullable(); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pos_data');
    }
};