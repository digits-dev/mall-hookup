<?php

namespace App\Models\AdmModels;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\AdmUser;

class AdmNotifications extends Model
{
    use HasFactory;

    
    protected $fillable = [
        'id',
        'adm_user_id',
        'type',
        'title',
        'content',
        'url',
        'is_read',
        'created_at',
        'updated_at',
    ];


    protected $filterable = [
        'adm_user_id',
        'type',
        'content',
        'url',
        'is_read',
        'created_at',
        'updated_at',
    ];


    public function scopeSearchAndFilter($query, $request){

        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($query) use ($search) {
                foreach ($this->filterable as $field) {
                    if ($field === 'adm_user_id') {
                        $query->orWhereHas('user', function ($query) use ($search) {
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

    public function user() {
        return $this->belongsTo(AdmUser::class, 'adm_user_id', 'id');
    }


    public static function createNotification(array $data): self
    {
        $data['title'] = $data['title'] ?? 'Untitled';

        return self::create($data);
    }



    
}
