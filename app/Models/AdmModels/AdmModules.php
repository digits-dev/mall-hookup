<?php

namespace App\Models\AdmModels;

use App\Models\AdmUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdmModules extends Model
{
    use HasFactory;

    public const ITEM_MASTER = 38;
    public const GASHAPON_ITEM_MASTER = 28;
    public const RMA_ITEM_MASTER = 79;
    public const ITEM_MASTER_APPROVAL_ACCOUNTING = 82;
    public const ADMIN_ITEM_MASTER = 92;
    public const SERVICE_CENTER_ITEM_MASTER = 123;


    protected $fillable = [
        "id",
        "name",
        "icon",
        "path",
        "table_name",
        "controller",
        "is_protected",
        "is_active",
        "deleted_at",
        "created_at",
        "updated_at",
    ];

    protected $filterable = [
        "name",
        "table_name",
        "path",
        "controller",
    ];

    public function scopeSearchAndFilter($query, $request){

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($query) use ($search) {
                foreach ($this->filterable as $field) {
            
                    if (in_array($field, ['created_at', 'updated_at'])) {
                        $query->orWhereDate($field, $search);
                    }
                    else {
                        $query->orWhere($field, 'LIKE', "%$search%");
                    }
                }
            });
        }

        foreach ($this->filterable as $field) {
            if ($request->filled($field)) {
                $value = $request->input($field);
                if ($field === 'status') {
                    $query->where($field, '=', $value);
                }
                else{
                    $query->where($field, 'LIKE', "%$value%");
                }
            }
        }
    
        return $query;

    }


    public function permissions(){
        return $this->hasOne(AdmPrivilegesRoles::class, 'id_adm_modules', 'id');
    }
}