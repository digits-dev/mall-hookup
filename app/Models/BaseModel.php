<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Helpers\CommonHelpers;

class BaseModel extends Model
{
    protected static function boot()
    {
        parent::boot();

        static::created(function ($model) {
            self::logActivity($model, 'CREATE');
        });

        static::updated(function ($model) {
            self::logActivity($model, 'UPDATE');
        });

    }

    protected static function logActivity($model, $action)
    {
        ModuleActivityHistory::create([
            'module_name' => class_basename($model), 
            'action_type' => $action,
            'created_by' => CommonHelpers::myId(),
        ]);
    }
}