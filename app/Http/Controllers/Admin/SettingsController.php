<?php

namespace App\Http\Controllers\Admin; 
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Models\AdmEmbeddedDashboard;
use App\Models\AdmEmbeddedDashboardPrivilege;
use App\Models\AdmModels\AdmPrivileges;
use App\Models\AdmModels\AdmSettings;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;


class SettingsController extends Controller{

    public function getIndex(){
        $data = [];
        $data['privileges'] = AdmPrivileges::select('id as value', 'name as label')->get();

        $data['embedded_dashboards'] = AdmEmbeddedDashboard::with(['getDashboardPrivileges.getPrivilege'])->get();

        $data['dashboard_button_data'] = AdmSettings::whereIn('name', ['Default Dashboard', 'Embedded Dashboard'])
        ->get()
        ->mapWithKeys(function ($item) {
            return [$item->content => $item->content_input_type];
        })
        ->toArray();

        return Inertia::render('AdmVram/Settings',$data);
    }

    public function addEmbeddedDashboard(Request $request){
        
        $validatedFields = $request->validate([
            'name' => 'required|string|unique:adm_embedded_dashboards,name',
            'description' => 'required|string|max:60',
            'url' => 'required|string',
            'privileges' => 'required',
            'logo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);


        try {

            DB::beginTransaction();

            $file = $request->file('logo');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $path = $file->storeAs('embedded_dashboard_logos', $fileName, 'public');

            $embeddedDashboard = AdmEmbeddedDashboard::create([
                'name' => $validatedFields['name'], 
                'description' => $validatedFields['description'],   
                'url' => $validatedFields['url'], 
                'logo' => $path, 
                'status' => 'ACTIVE',
                'created_by' => CommonHelpers::myId(),
            ]);

            foreach($validatedFields['privileges'] as $privilege){

                AdmEmbeddedDashboardPrivilege::create([
                    'adm_embedded_dashboard_id' => $embeddedDashboard->id, 
                    'adm_privileges_id' => $privilege['value'],   
                ]);
                
            }

            DB::commit();

            return back()->with(['message' => 'Embedded Dashboard Creation Success!', 'type' => 'success']);

        }

        catch (\Exception $e) {
            DB::rollBack();
            CommonHelpers::LogSystemError('App Settings - Dashboard Settings', $e->getMessage());
            return back()->with(['message' => 'Embedded Dashboard Creation Failed!', 'type' => 'error']);
        }

    }

    public function updateEmbeddedDashboard(Request $request){
     
        $validatedFields = $request->validate([
            'name' => 'required|string',
            'description' => 'required|string|max:60',
            'url' => 'required|string',
            'privileges' => 'required',
            'status' => 'required'
        ]);

        $embeddedDashboard = AdmEmbeddedDashboard::find($request->id);

        if ($embeddedDashboard->logo !== $request->logo){
            $request->validate([
                'logo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            ]);
        }

        try {
            

            DB::beginTransaction();

            // FOR UPDATING NEW PRIVILEGE
            $currentPrivileges = AdmEmbeddedDashboardPrivilege::where('adm_embedded_dashboard_id', $request->id)
            ->pluck('adm_privileges_id')
            ->toArray();

            $newPrivileges = collect($request->privileges)->pluck('value')->toArray();
            $privilegesToDelete = array_diff($currentPrivileges, $newPrivileges);

            // DELETING PRIVILEGE/S
            AdmEmbeddedDashboardPrivilege::where('adm_embedded_dashboard_id', $request->id)
            ->whereIn('adm_privileges_id', $privilegesToDelete)
            ->delete();

            $privilegesToAdd = array_diff($newPrivileges, $currentPrivileges);

            // PREPARING NEW RECORDS FOR INSERT
            $newRecords = array_map(function($privilegeId) use ($request) {
                return [
                    'adm_embedded_dashboard_id' => $request->id,
                    'adm_privileges_id' => $privilegeId,
                ];
            }, $privilegesToAdd);
        
            // INSERT NEW PRIVILEGE
            if (!empty($newRecords)) {
                AdmEmbeddedDashboardPrivilege::insert($newRecords);
            }

            $embeddedDashboardNameExist = AdmEmbeddedDashboard::where('name', $validatedFields['name'])->exists();

            if ($request->name !== $embeddedDashboard->name) {
                if (!$embeddedDashboardNameExist) {
                    $embeddedDashboard->name = $validatedFields['name'];
                } else {
                    return back()->withErrors(['name' => 'Dashboard Name already exists!']);
                }
            }

            if ($embeddedDashboard->logo !== $request->logo){
                $file = $request->file('logo');
                $fileName = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('embedded_dashboard_logos', $fileName, 'public');

                $embeddedDashboard->logo = $path;
            }

            $embeddedDashboard->description = $validatedFields['description'];
            $embeddedDashboard->url = $validatedFields['url'];
            $embeddedDashboard->status = $validatedFields['status'];

            $embeddedDashboard->save();

            DB::commit();

            return back()->with(['message' => 'Embedded Dashboard Update Success!', 'type' => 'success']);

        }

        catch (\Exception $e) {
            DB::rollBack();
            CommonHelpers::LogSystemError('App Settings - Dashboard Settings', $e->getMessage());
            return back()->with(['message' => 'Embedded Dashboard Update Failed!', 'type' => 'error']);
        }

    }

    // AXIOS REQUESTS

    public function updateDefaultDashboard(Request $request){
   
        $option = $request['option'];

        AdmSettings::where('name', 'Default Dashboard')->update([
            'content_input_type' => $option,      
        ]);
       
        return response()->json(["message"=>"Default Dashboard changed!", "status"=>"success"]);
        
    }

    public function updateEmbedDashboardButton(Request $request){
   
        $option = $request['option'];

        AdmSettings::where('name', 'Embedded Dashboard')->update([
            'content_input_type' => $option,      
        ]);
       
        return response()->json(["message"=>"Embedded Dashboard changed!", "status"=>"success"]);
        
    }
   
}

?>