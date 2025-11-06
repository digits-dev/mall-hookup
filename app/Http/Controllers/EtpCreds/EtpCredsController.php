<?php
namespace App\Http\Controllers\EtpCreds;
use App\Models\EtpCreds;
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;
use DB;

class EtpCredsController extends Controller{
    public function getIndex(){
      $data = ['etp_creds' => DB::table('etp_creds')->first(),];
        return Inertia::render("EtpCreds/EtpCreds",$data);
    }

  public function addSave(Request $request) {
        
        $request->validate([
            'store_id' => 'required|string',
            'etp_ip' => 'required|string|max:255',
            'etp_database_name' => 'required|string|max:255',
        ]);

        $data = [
            'store_id' => $request->store_id,
            'etp_ip' => $request->etp_ip,
            'etp_database_name' => $request->etp_database_name,
        ];

        EtpCreds::create($data);
    
      
        return redirect ('/etp_creds');
    }

    public function update(Request $request)
        {
            $request->validate([
                'store_id' => 'required|string',
                'etp_ip' => 'required|string|max:255',
                'etp_database_name' => 'required|string|max:255',
            ]);

            $data = [
                'store_id' => $request->store_id,
                'etp_ip' => $request->etp_ip,
                'etp_database_name' => $request->etp_database_name,
            ];

            $etpCred = EtpCreds::first();

            if ($etpCred) {
                $etpCred->update($data);
            } else {
                EtpCreds::create($data);
            }

            return redirect('/etp_creds')->with('success', 'ETP Credentials saved successfully.');
        }

}
?>