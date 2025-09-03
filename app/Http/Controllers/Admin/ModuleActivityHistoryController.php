<?php

namespace App\Http\Controllers\Admin;

use App\Exports\SubmasterExport;
use app\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Models\ModuleActivityHistory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class ModuleActivityHistoryController extends Controller
{

    private $sortBy;
    private $sortDir;
    private $perPage;

    public function __construct() {
        $this->sortBy = request()->get('sortBy', 'module_activity_history.created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
    }

    public function getAllData(){
        $query = ModuleActivityHistory::query()->with(['getCreatedBy']);
        $filter = $query->searchAndFilter(request());
        $result = $filter->orderBy($this->sortBy, $this->sortDir);
        return $result;
    }


    public function getIndex(){

        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }
        $data = [];
        $data['tableName'] = 'module_activity_history';
        $data['page_title'] = 'System Error Logs';
        $data['module_activity_history'] = self::getAllData()->paginate($this->perPage)->withQueryString();
        $data['queryParams'] = request()->query();

        return Inertia::render('AdmVram/ModuleActivityHistory', $data );
    }

    public function export(Request $request)
    {

            $headers = [
                'Module Name',
                'Error Details',
                'Created By',
                'Created At',
            ];
    
            $columns = [
                'module_name',
                'error_details',
                'getCreatedBy.name',
                'created_at',
            ];
    
            $filename = "System Error Logs - " . date ('Y-m-d H:i:s');
            $query = self::getAllData();
            return Excel::download(new SubmasterExport($query, $headers, $columns), $filename . '.xlsx');

    }
}