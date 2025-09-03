<?php

namespace App\Models;

use App\Models\AdmModels\AdmPrivileges;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdmEmbeddedDashboardPrivilege extends Model
{
    use HasFactory;

    protected $fillable = [
        "id",
        "adm_embedded_dashboard_id",
        "adm_privileges_id",
    ];

    public $timestamps = false;

    public function getPrivilege(){
        return $this->belongsTo(AdmPrivileges::class, 'adm_privileges_id', 'id',);
    }
}
