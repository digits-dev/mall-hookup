<?php

namespace App\Models\AdmModels;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdmSettings extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'name',
        'content',
        'content_input_type',
        'dataenum',
        'helper',
        'group_setting',
        'label',
        'created_at',
        'updated_at',
    ];
}
