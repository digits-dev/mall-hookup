<?php

namespace App\Models\AdmModels;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdmPrivilegesRoles extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'is_visible',
        'is_create',
        'is_read',
        'is_edit',
        'is_delete',
        'id_adm_privileges',
        'id_adm_modules',
        'created_at',
        'updated_at',
    ];
}
