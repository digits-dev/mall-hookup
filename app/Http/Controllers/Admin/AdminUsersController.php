<?php

namespace App\Http\Controllers\Admin;

use App\Exports\SubmasterExport;
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Models\AdmModels\AdmPrivileges;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use App\Models\AdmUser;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;

    class AdminUsersController extends Controller{

        private $sortBy;
        private $sortDir;
        private $perPage;

        public function __construct() {
    
            $this->sortBy = request()->get('sortBy', 'adm_users.created_at');
            $this->sortDir = request()->get('sortDir', 'desc');
            $this->perPage = request()->get('perPage', 10);
        }
        
        
        public function getAllData(){
            $query = AdmUser::query()->with(['getCreatedBy', 'privilege']);
            $filter = $query->searchAndFilter(request());
            $result = $filter->orderBy($this->sortBy, $this->sortDir);
            return $result;
        }
    
        public function getIndex(){
            if(!CommonHelpers::isView()) {
                return Inertia::render('Errors/RestrictionPage');
            } 

            $data = [];
            $data['tableName'] = 'adm_users';
            $data['page_title'] = 'Users Management';
            $data['users'] = self::getAllData()->paginate($this->perPage)->withQueryString();
            $data['privileges'] = AdmPrivileges::select('id as value', 'name as label')->get();
            $data['queryParams'] = request()->query();
            
            return Inertia::render('AdmVram/Users', $data);
        }

        public function bulkActions(Request $request){

            if ($request->bulkAction == 'ACTIVE'){
                AdmUser::whereIn('id', $request->selectedIds)->update(['status' => "ACTIVE"]);
            }
            else{
                AdmUser::whereIn('id', $request->selectedIds)->update(['status' => "INACTIVE"]);
            }
    
            $data = [
                'message' => "Update User/s Success!",
                'type' => "success"
            ];
        
            return back()->with($data);
        }

        public function create(Request $request){


            $validatedFields = $request->validate([
                'name' => 'required|string',
                'email' => 'required|email|unique:adm_users,email',
                'password' => 'required|string',
                'id_adm_privileges' => 'required|integer',
                'privilege_name' => 'required|string',
            ]);
    
            try {
    
                AdmUser::create([
                    'name' => $validatedFields['name'], 
                    'email' => $validatedFields['email'],   
                    'password' => Hash::make($validatedFields['password']),
                    'id_adm_privileges' => $validatedFields['id_adm_privileges'], 
                    'status' => 'ACTIVE',
                    'created_by' => CommonHelpers::myId(),
                ]);
    
        
                return back()->with(['message' => 'User Creation Success', 'type' => 'success']);
    
            }
    
            catch (\Exception $e) {
                CommonHelpers::LogSystemError('User Management', $e->getMessage());
                return back()->with(['message' => 'User Creation Failed', 'type' => 'error']);
            }
           
        }
    
        public function update(Request $request){
    
            $validatedFields = $request->validate([
                'name' => 'required|string',
                'email' => 'required|email',
                'password' => 'nullable|string',
                'id_adm_privileges' => 'required|integer',
                'privilege_name' => 'required|string',
                'status' => 'required|string',
            ]);
    
            try {
        
                $user = AdmUser::find($request->id);
    
                if (!$user) {
                    return back()->with(['message' => 'User not found!', 'type' => 'error']);
                }
        
                $emailExist = AdmUser::where('email', $request->email)->exists();
    
                if ($request->email !== $user->email) {
                    if (!$emailExist) {
                        $user->email = $validatedFields['email'];
                    } else {
                        return back()->withErrors(['email' => 'Email already exists']);
                    }
                }

                if ($request->password){
                    if (!Hash::check($validatedFields['password'], $user->password)) {
                        $user->password = Hash::make($validatedFields['password']);
                    }
                }

                $user->name = $validatedFields['name'];
                $user->id_adm_privileges = $validatedFields['id_adm_privileges'];
                $user->status = $validatedFields['status'];
                $user->updated_by = CommonHelpers::myId();
                $user->updated_at = now();
        
                $user->save();
        
                return back()->with(['message' => 'User Updating Success!', 'type' => 'success']);
            }  
    
            catch (\Exception $e) {
    
                CommonHelpers::LogSystemError('Users Management', $e->getMessage());
                return back()->with(['message' => 'User Updating Failed!', 'type' => 'error']);
            }
        }

        public function export()
        {
    
            $headers = [
                'Name',
                'Email',
                'Privilege',
                'Status',
            ];
    
            $columns = [
                'name',
                'email',
                'privilege.name',
                'status',
            ];
    
            $filename = "Users - " . date ('Y-m-d H:i:s');
            $query = self::getAllData();
            return Excel::download(new SubmasterExport($query, $headers, $columns), $filename . '.xlsx');
    
        }

    }

?>