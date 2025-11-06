<?php
namespace App\Http\Controllers\StoreCreds;
use App\Models\StoreCreds;
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;
use DB;

class StoreCredsController extends Controller{
    
    public function getIndex(){
            $data = ['store_creds' => StoreCreds::first()];
        return Inertia::render("StoreCreds/StoreCreds", $data);
    }

      public function addSave(Request $request) {
        
        $request->validate([
            'contract_number' => 'required|string',
            'contract_key' => 'required|string|max:255',
            'pos_no' => 'required|string|max:255',
            'company_code' => 'required|string|max:255',
        ]);

        $data = [
            'contract_number' => $request->contract_number,
            'contract_key' => $request->contract_key,
            'pos_no' => $request->pos_no,
            'company_code' => $request->company_code,
        ];

        StoreCreds::create($data);
    
      
        return redirect ('/store_creds');
    }

    public function update(Request $request)
        {
            $request->validate([
                'contract_number' => 'required|string',
                'contract_key' => 'required|string|max:255',
                'pos_no' => 'required|string|max:255',
                'company_code' => 'required|string|max:255',
            ]);

            $data = [
                'contract_number' => $request->contract_number,
                'contract_key' => $request->contract_key,
                'pos_no' => $request->pos_no,
                'company_code' => $request->company_code,
            ];

            $storeCreds = StoreCreds::first();

            if ($storeCreds) {
                $storeCreds->update($data);
            } else {
                StoreCreds::create($data);
            }

            return redirect('/store_creds')->with('success', 'Store Credentials saved successfully.');
        }
}
?>