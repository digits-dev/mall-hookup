<?php

namespace App\Models\AdmModels;

use app\Helpers\CommonHelpers;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdmPrivileges extends Model
{
    use HasFactory;

    public const SUPERADMIN = 1;
    public const MDSGTMIMFS = 2;
    public const MDSGTL = 3;
    public const MDSGTM = 4;
    public const COSTACCTG = 5;
    public const ACCTGTL = 6;
    public const SALESACCTG = 7;
    public const ICTL = 8;
    public const ICTM = 9;
    public const ARTL = 10;
    public const LTL = 11;
    public const ECOMMTL = 12;
    public const ECOMMTM = 13;
    public const ECOMMTMOPS = 14;
    public const BRANDTL = 15;
    public const BRANDTM = 16;
    public const CONCEPTTL = 17;
    public const CONCEPTTM = 18;
    public const RTLOPSTL = 19;
    public const RTLOPSTM = 20;
    public const FRATL = 21;
    public const FRAMDSG = 22;
    public const FRAOPS = 23;
    public const FRAOWNER = 24;
    public const DISTRITL = 25;
    public const DISTRITM = 26;
    public const DISTRISALES = 27;
    public const SVCTL = 28;
    public const SVCTM = 29;
    public const RMATL = 30;
    public const RMATM = 31;
    public const AUD = 32;
    public const WIMSTL = 33;
    public const WIMSTM = 34;
    public const TRAINING = 35;
    public const WHSTL = 36;
    public const WHSTM = 37;
    public const PURCHASINGTL = 38;
    public const PURCHASINGTM = 39;
    public const MDSGGASHAPONTL = 40;
    public const MDSGGASHAPONTM = 41;

    protected $guarded = [];

    public function scopeGetData($query){
        return $query;
    }
    
    protected $fillable = [
        'id',
        'name',
        'is_superadmin',
        'theme_color',
        'created_at',
        'updated_at'
    ];

    protected $filterable = [
        'name',
        'is_superadmin',
        'theme_color',
        'created_at',
        'updated_at'
    ];

    public function scopeSearchAndFilter($query, $request){

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($query) use ($search) {
                foreach ($this->filterable as $field) {
                    if ($field === 'created_by') {
                        $query->orWhereHas('getCreatedBy', function ($query) use ($search) {
                            $query->where('name', 'LIKE', "%$search%");
                        });
                    }
                    elseif (in_array($field, ['created_at', 'updated_at'])) {
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
}
