<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MallHookupApi extends Model
{
    use HasFactory;

    protected $table = 'mall_hookup_api';
    
     protected $fillable = [
        'pos_supplier_url',
        'pos_supplier_retrieve_url',
        'pos_supplier_api_key',
        'pos_supplier_retrieve_api_key',
        'secret_key',
    ];
}