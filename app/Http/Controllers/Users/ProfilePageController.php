<?php

namespace App\Http\Controllers\Users;

use app\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AdmUser;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Models\AdmModels\AdmUserProfiles;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Session;
class ProfilePageController extends Controller
{

    public function getIndex()
    {
        $data = [];
        $data['page_title'] = 'Profile';
        $data['user_info'] = AdmUser::with('privilege')->find(CommonHelpers::myId());
        $data['user_photo'] = AdmUserProfiles::where('status', 'ACTIVE')->where('adm_user_id', CommonHelpers::myId())->first();
        
        return Inertia::render('AdmVram/ProfilePage', $data);
    }

    public function getEditProfile()
    {
        $data = [];
        $data['page_title'] = 'Edit Profile';
        $data['user_info'] = AdmUser::with('privilege')->find(CommonHelpers::myId());
        $data['user_photo'] = AdmUserProfiles::where('status', 'ACTIVE')->where('adm_user_id', CommonHelpers::myId())->first();
        return Inertia::render('AdmVram/EditProfilePage', $data);
    }

    public function updateProfile(Request $request){

        $user_profiles = AdmUserProfiles::where('adm_user_id', CommonHelpers::myId())->get();

        $request->validate([
            'profile_photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $file = $request->file('profile_photo');

        $fileName = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('profile_pictures', $fileName, 'public');

        foreach ($user_profiles as $profile) {
            $profile->status = 'INACTIVE';
            $profile->save();
        }


        AdmUserProfiles::create([
            'adm_user_id' => CommonHelpers::myId(), 
            'file_name' => $path, 
            'created_by' => CommonHelpers::myId(),
        ]);
        
        $data = [
            'message' => "Update Profile information success",
            'type' => "success"
        ];

        return redirect('profile')->with($data);
    }


    public function updateTheme(Request $request){
        $id = CommonHelpers::myId();
        $theme = $request['theme'];
        $update = AdmUser::where('id',$id)->update([
            'theme' => $theme,      
        ]);
        Session::put('dark_theme', $theme);
       
        return response()->json(["message"=>"Theme changed!", "status"=>"success"]);
        
    }
    
}
