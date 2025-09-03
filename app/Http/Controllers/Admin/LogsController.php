<?php

namespace App\Http\Controllers\Admin;

use App\Exports\SubmasterExport;
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AdmModels\AdmLogs;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class LogsController extends Controller{

    private $sortBy;
    private $sortDir;
    private $perPage;
    private $table_name;
    private $primary_key;
    
    public function __construct() {
        $this->table_name  =  'adm_logs';
        $this->primary_key = 'id';
        $this->sortBy = request()->get('sortBy', 'adm_logs.created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
    }

    public function getIndex(){

        $query = AdmLogs::query()->with('user');

        $query->when(request('search'), function ($query, $search) {
            $query->where('adm_logs.ipaddress', 'LIKE', "%$search%");
        });


        $logs = $query->orderBy($this->sortBy, $this->sortDir)->paginate($this->perPage)->withQueryString();

        if (!CommonHelpers::isView()) {
            CommonHelpers::redirect(CommonHelpers::adminPath(), 'Denied Access');
        }


        return Inertia::render('AdmVram/Logs', [
            'logs' => $logs,
            'queryParams' => request()->query()
        ]);
    }

    public function export(Request $request)
    {

        try {
            
            $headers = [
                'IP Address',
                'User Agent',
                'Url',
                'Description',
                'User',
                'Log Date',
            ];
    
            $columns = [
                'ipaddress',
                'useragent',
                'url',
                'description',
                'user.name',
            ];
    
            $filename = "Log User Access - " . date ('Y-m-d H:i:s');
            $query = AdmLogs::query()->with('user');
            return Excel::download(new SubmasterExport($query, $headers, $columns), $filename . '.xlsx');

        }

        catch (\Exception $e) {
            CommonHelpers::LogSystemError('Log User Access', $e->getMessage());
        }

    }

}

?>