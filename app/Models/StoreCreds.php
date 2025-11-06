<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoreCreds extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'contract_number',
        'contract_key',
        'pos_no',
        'company_code',
    ];
}