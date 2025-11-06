<?php
namespace App\Http\Controllers\MallHookupApi;
use App\Models\MallHookupApi;
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Inertia\Response;
use DB;

class MallHookupApiController extends Controller{
    public function getIndex(){
        $data = ['mall_hookup_api' => MallHookupApi::first()];
        return Inertia::render("MallHookupApi/MallHookupApi", $data);
    }

     public function addSave(Request $request) {
        
        $request->validate([
            'pos_supplier_url' => 'required|string|max:255',
            'pos_supplier_retrieve_url' => 'required|string|max:255',
            'pos_supplier_api_key' => 'required|string|max:255',
            'pos_supplier_retrieve_api_key' => 'required|string|max:255',
            'secret_key' => 'required|string|max:255',
        ]);

        $data = [
            'pos_supplier_url' => $request->pos_supplier_url,
            'pos_supplier_retrieve_url' => $request->pos_supplier_retrieve_url,
            'pos_supplier_api_key' => $request->pos_supplier_api_key,
            'pos_supplier_retrieve_api_key' => $request->pos_supplier_retrieve_api_key,
            'secret_key' => $request->secret_key,
        ];

        MallHookupApi::create($data);
    
      
        return redirect ('/mall_hookup_api');
    }

    public function update(Request $request)
        {
            $request->validate([
                'pos_supplier_url' => 'required|string|max:255',
                'pos_supplier_retrieve_url' => 'required|string|max:255',
                'pos_supplier_api_key' => 'required|string|max:255',
                'pos_supplier_retrieve_api_key' => 'required|string|max:255',
                'secret_key' => 'required|string|max:255',
            ]);

            $data = [
                'pos_supplier_url' => $request->pos_supplier_url,
                'pos_supplier_retrieve_url' => $request->pos_supplier_retrieve_url,
                'pos_supplier_api_key' => $request->pos_supplier_api_key,
                'pos_supplier_retrieve_api_key' => $request->pos_supplier_retrieve_api_key,
                'secret_key' => $request->secret_key,
            ];

            $mallHookupApi = MallHookupApi::first();

            if ($mallHookupApi) {
                $mallHookupApi->update($data);
            } else {
                MallHookupApi::create($data);
            }

            return redirect('/mall_hookup_api')->with('success', 'Store Credentials saved successfully.');
        }
}
?>