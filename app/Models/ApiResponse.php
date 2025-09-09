<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApiResponse extends Model
{
    use HasFactory;
    
      protected $fillable = [
        'id',
        'pos_data_id',
        'payload',
        'status',
        'message',
        'data',
        'raw_response',
        'created_at',
        'updated_at',
    ];
}