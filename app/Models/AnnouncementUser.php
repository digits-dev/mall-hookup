<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnouncementUser extends Model
{
    use HasFactory;

    protected $table = 'announcement_user';

    protected $fillable = [
        'id',
        'announcement_id',
        'adm_user_id',
        'is_read',
        'created_at',
        'updated_at',
    ];
}
