<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EtpCreds extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'store_id',
        'etp_ip',
        'etp_database_name',
    ];
}