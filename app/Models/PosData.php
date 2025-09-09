<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PosData extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'id',
        'contract_number',
        'contract_key',
        'pos_no',
        'company_code',
        'date_of_transaction',
        'total_sales',
        'transaction_count',
        'created_at',
        'updated_at',
    ];
}