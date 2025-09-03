<?php

namespace App\Http\Controllers\Admin;

use App\Exports\SubmasterExport;
use app\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Models\LogSystemError;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class SystemErrorLogsController extends Controller
{

    private $sortBy;
    private $sortDir;
    private $perPage;

    public function __construct() {
        $this->sortBy = request()->get('sortBy', 'log_system_errors.created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
    }

    public function getAllData(){
        $query = LogSystemError::query()->with(['getCreatedBy', 'getUpdatedBy']);
        $filter = $query->searchAndFilter(request());
        $result = $filter->orderBy($this->sortBy, $this->sortDir);
        return $result;
    }


    public function getIndex(){

        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }
        $data = [];
        $data['tableName'] = 'log_system_errors';
        $data['page_title'] = 'System Error Logs';
        $data['log_system_errors'] = self::getAllData()->paginate($this->perPage)->withQueryString();
        $data['queryParams'] = request()->query();

        return Inertia::render('AdmVram/SystemErrorLogs', $data );
    }

    public function export(Request $request)
    {

        try {

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

        catch (\Exception $e) {
            CommonHelpers::LogSystemError('Gashapon UOMs', $e->getMessage());
        }

    }
}
