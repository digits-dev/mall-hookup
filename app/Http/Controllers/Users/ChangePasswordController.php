<?php

namespace App\Http\Controllers\Users;

use app\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Models\AdmPasswordHistories;
use App\Models\AdmUser;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class ChangePasswordController extends Controller
{

    public function getIndex()
    {
        return Inertia::render('AdmVram/ChangePassword');
    }

    public function changePassword(Request $request){

        $user = AdmUser::find(CommonHelpers::myId());
        $passwordHistories = AdmPasswordHistories::where('adm_user_id', CommonHelpers::myId())->get();

        if (Hash::check($request->all()['current_password'], $user->password)){
            
            $request->validate([
                'new_password' => 'required|min:8|regex:/[A-Z]/|regex:/[a-z]/|regex:/[0-9]/|regex:/[^A-Za-z0-9]/',
                'confirm_password' => 'required|same:new_password',
            ]);

            if ($passwordHistories){
                foreach($passwordHistories as $passwordHistory) {
                    if (Hash::check($request->new_password, $passwordHistory->adm_user_old_pass)){
                        return back()->withErrors(['new_password' => 'Your new password must be different from any of your previous passwords']);
                    }
                }
            }

            if (Hash::check($request->new_password, $user->password)){
                return back()->withErrors(['new_password' => 'The new password cannot be the same as the current password']);
            }

            AdmPasswordHistories::insert(['adm_user_id'=>$user->id, 'adm_user_old_pass'=>$user->password, 'created_at'=>now()]);
    
            $user->waiver_count = 0;
            $user->last_password_updated = now();
            $user->password = Hash::make($request->get('new_password'));
            $user->save();

            $data = [
                'message' => "Change Password success, you will be logout in a second",
                'type' => "success"
            ];

            return back()->with($data);
        
        } else {

            $data = [
                'current_password' => "Incorrect Current Password"
            ];
            
            return back()->withErrors($data);
        }

    }

    public function waive() {
        $user = AdmUser::find(CommonHelpers::myId());

        if ($user->waiver_count == 3){
            return back()->withErrors([
               'message' => "Can't waive anymore, you need to change your password"
            ]);
        }

        $user->waiver_count = $user->waiver_count + 1;
        $user->last_password_updated = Carbon::now()->format('Y-m-d');

        $user->save();

        Session::put('check_user', false);
        Session::put('check_user_type', null);

        return back()->with([
            'message' => "Waive Success",
            'type' => 'success'
        ]);
    }
    
}
