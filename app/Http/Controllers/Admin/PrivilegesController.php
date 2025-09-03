<?php

namespace App\Http\Controllers\Admin;

use App\Exports\SubmasterExport;
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Models\AdmModels\AdmModules;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use App\Models\AdmModels\AdmPrivileges;
use App\Models\AdmModels\AdmPrivilegesRoles;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

class PrivilegesController extends Controller{
    private $table_name;
    private $primary_key;
    private $sortBy;
    private $sortDir;
    private $perPage;
    
    public function __construct() {
        $this->table_name  =  'adm_privileges';
        $this->primary_key = 'id';
        $this->sortBy = request()->get('sortBy', 'adm_privileges.id');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
    }

    public function getAllData(){
        $query = AdmPrivileges::query();
        $filter = $query->searchAndFilter(request());
        $result = $filter->orderBy($this->sortBy, $this->sortDir);
        return $result;
    }

    public function getIndex(){
        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }

        $data = [];
        $data['tableName'] = 'adm_privileges';
        $data['page_title'] = 'Privileges';
        $data['privileges'] = self::getAllData()->paginate($this->perPage)->withQueryString();
        $data['queryParams'] = request()->query();
        return Inertia::render('AdmVram/Privileges',$data);
    }

    public function createPrivilegesView(){
        if(!CommonHelpers::isCreate()) {
            return Inertia::render('Errors/RestrictionPage');
        }

        $data = [];
        $data['action'] = 'Create';
        $data['privilege'] = [];
        $data['modules_data'] = AdmModules::where('is_protected', 0)
        ->get()
        ->map(function ($module) {
            return [
                'id' => $module->id,
                'name' => $module->name,
                'permissions' => [
                    'view' => false,
                    'create' => false,
                    'read' => false,
                    'update' => false,
                    'delete' => false,
                ],
            ];
        });
       
        return Inertia::render('AdmVram/PrivilegesForm', $data);
    }

    public function editPrivilegeView($id){

        if(!CommonHelpers::isCreate()) {
            return Inertia::render('Errors/RestrictionPage');
        }

        $data = [];
        $data['action'] = 'Update';
        $data['privilege'] = AdmPrivileges::find($id);
        $data['modules_data'] = AdmModules::with(['permissions' => function ($query) use ($id) {
            $query->where('id_adm_privileges', $id);
        }])
        ->where('is_protected', 0)
        ->get()
        ->map(function ($module) {
            return [
                'id' => $module->id,
                'name' => $module->name,
                'permissions' => [
                    'view' => (bool)optional($module->permissions)->is_visible,
                    'create' => (bool)optional($module->permissions)->is_create,
                    'read' => (bool)optional($module->permissions)->is_read,
                    'update' => (bool)optional($module->permissions)->is_edit,
                    'delete' => (bool)optional($module->permissions)->is_delete,
                ],
            ];
        });
       
        return Inertia::render('AdmVram/PrivilegesForm', $data);
        
    }

    public function editPrivilege(Request $request){

        $validatedFields = $request->validate([
            'privilege_name' => 'required|string',
            'theme_color' => 'required',
        ]);

        try {

            DB::beginTransaction();

            $privilege = AdmPrivileges::find($request->id);
            $privilegeExist = AdmPrivileges::where('name', $request->privilege_name)->exists();
    
            if ($request->privilege_name !== $privilege->name) {
                if (!$privilegeExist) {
                    $privilege->name = $validatedFields['privilege_name'];
                } else {
                    return back()->withErrors(['privilege_name' => 'Privilege Name already exists']);
                }
            }

            $privilege->theme_color = $validatedFields['theme_color'];
            $privilege->is_superadmin = $request->is_superadmin === 'Yes' ? 1 : 0;
            $privilege->save();

            if ($request->is_superadmin === 'No'){
                foreach ($request->modules as $module){

                    AdmPrivilegesRoles::updateOrCreate(
                        [
                            'id_adm_modules' => $module['id'],
                            'id_adm_privileges' => $privilege->id,
                        ],
                        [
                            'is_visible' => $module['permissions']['view'] ? 1 : 0,
                            'is_create' => $module['permissions']['create'] ? 1 : 0,
                            'is_read' => $module['permissions']['read'] ? 1 : 0,
                            'is_edit' => $module['permissions']['update'] ? 1 : 0,
                            'is_delete' => $module['permissions']['delete'] ? 1 : 0,
                        ]
                    );
                    
                }
            }

            DB::commit();

            return redirect('privileges')->with(['message' => 'Privilege Update Success!', 'type' => 'success']);

        }

        catch (\Exception $e) {
            DB::rollBack();
            CommonHelpers::LogSystemError('Privileges', $e->getMessage());
            return redirect('privileges')->with(['message' => 'Privileges Update Failed!', 'type' => 'error']);
        }

    }

    public function createPrivilege(Request $request){

        $validatedFields = $request->validate([
            'privilege_name' => 'required|string|unique:adm_privileges,name',
            'theme_color' => 'required',
        ]);

        try {

            DB::beginTransaction();

            $privilege = AdmPrivileges::create([
                "name" => $validatedFields['privilege_name'],
                "is_superadmin" => $request->is_superadmin === 'Yes' ? 1 : 0,
                "theme_color" => $validatedFields['theme_color'],
            ]);

            if ($request->is_superadmin === 'No'){
                foreach ($request->modules as $module){
    
                    AdmPrivilegesRoles::updateOrCreate(
                        [
                            'id_adm_modules' => $module['id'],
                            'id_adm_privileges' => $privilege->id,
                        ],
                        [
                            'is_visible' => $module['permissions']['view'] ? 1 : 0,
                            'is_create' => $module['permissions']['create'] ? 1 : 0,
                            'is_read' => $module['permissions']['read'] ? 1 : 0,
                            'is_edit' => $module['permissions']['update'] ? 1 : 0,
                            'is_delete' => $module['permissions']['delete'] ? 1 : 0,
                        ]
                    );
                    
                }
            }
            
            DB::commit();

            return redirect('privileges')->with(['message' => 'Privilege Creation Success!', 'type' => 'success']);

        }

        catch (\Exception $e) {
            DB::rollBack();
            CommonHelpers::LogSystemError('Privileges', $e->getMessage());
            return redirect('privileges')->with(['message' => 'Privileges Creation Failed!', 'type' => 'error']);
        }
    }

    public function export()
    {

        $headers = [
            'Id',
            'Name',
            'Type',
        ];

        $columns = [
            'id',
            'name',
            'is_superadmin',
        ];

        $filename = "Privileges - " . date ('Y-m-d H:i:s');
        $query = self::getAllData();
        return Excel::download(new SubmasterExport($query, $headers, $columns), $filename . '.xlsx');

    }

}

?>