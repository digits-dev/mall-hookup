<?php

namespace App\Models;

use app\Helpers\CommonHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdmEmbeddedDashboard extends Model
{
    use HasFactory;

    public static function boot()
    {
        parent::boot();
        static::creating(function($model)
        {
            $model->created_by = CommonHelpers::myId();
            $model->updated_at = null;
        });
        static::updating(function($model)
        {
            $model->updated_by = CommonHelpers::myId();
        });
    }

    protected $fillable = [
        "id",
        "name",
        "description",
        "url",
        "logo",
        "status",
        "privilege_ids",
        "created_by",
        "updated_by",
        "created_at",
        "updated_at",
    ];

    public function getDashboardPrivileges(){
        return $this->hasMany(AdmEmbeddedDashboardPrivilege::class, 'adm_embedded_dashboard_id', 'id',);
    }
}
