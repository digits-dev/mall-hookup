<?php

namespace App\Http\Controllers\Dashboard;

use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Models\PosData;
use App\Models\ApiResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use DateTime;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Request;
use Carbon\Carbon;

class DashboardController extends Controller
{

    public function getIndex(): Response
    {

        $data = [];
        $data['api_responses'] = DB::table('pos_data')
            ->leftJoin('api_responses', 'pos_data.id', 'api_responses.pos_data_id')
            ->select('pos_data.*', 'api_responses.*', 'api_responses.created_at as api_created_at')
            ->orderBy('api_responses.id', 'desc')
            ->get();
        $data['posData'] = DB::table('pos_data')->get();
        
        return Inertia::render('Dashboard/DataSyncDashboard', $data);
    }

    public function getPosData() {

        $posData = DB::connection('sqlsrv')->select("SET NOCOUNT ON; exec [RptSpESalesSummaryReport_BIR] 100,'0572',20240929,20240929")[0];

        $totalSales = $posData->GrossTotalAmt + $posData->Discount + $posData->Returns - $posData->VatTotalAmt;
        $transactionCount = $posData->DocRangeTo - $posData->DocRangeFrom;

        $date = DateTime::createFromFormat("Ymd", $posData->CreateDate);
        $formattedDate = $date->format("Y-m-d");
        $dateOfTransaction = $date->format("m/d/Y");

       $posDataModel = PosData::where('date_of_transaction', $formattedDate)
        ->where('total_sales', $totalSales)
        ->where('transaction_count', $transactionCount)
        ->first();

        if (!$posDataModel) {
            $posDataModel = PosData::create([
                'contract_number'     => 'BP01-2000000000009',
                'contract_key'        => 'EYYASWNRXM02M0L7EYYP0HSOUBMMTA',
                'pos_no'              => 'POS-0001',
                'company_code'        => $posData->CompanyName,
                'date_of_transaction' => $formattedDate,
                'total_sales'         => $totalSales,
                'transaction_count'   => $transactionCount,
            ]);
        }

        $data = [
            'Contractno' => 'BP01-2000000000009',
            'GenerateKey'    =>  'EYYASWNRXM02M0L7EYYP0HSOUBMMTA',
            'POSNO'           =>  'POS-0001',
            'CompanyNameCol'    =>  $posData->CompanyName,
            'TransactionDateCol' => $dateOfTransaction,
            'TotalSalesCol'     => $totalSales,
            // 'VattableSalesCol'  =>  $posData->VatableTotalAmt,
            // 'VATExemptSalesCol' => $posData->SalesVatExmptAmt,
            'TransactionCount'  => $transactionCount,
        ];
        
    $response = Http::withOptions(['verify' => false])
    ->withHeaders([
        'apiKey'    => config('services.mall_hookup.pos_supplier_api_key'),
        'secretKey' => config('services.mall_hookup.secrey_key'),
    ])
    ->asForm()
    ->post(config('services.mall_hookup.pos_supplier_url'), $data);


        $rawResponse = $response->body();
        $clean = preg_replace('/[[:cntrl:]]/', '', $rawResponse);

        $responseArray = json_decode($clean, true);


      ApiResponse::create([
            'pos_data_id'  => $posDataModel->id,
            'payload'      => json_encode($data),
            'status'       =>  $responseArray['status'] == 200 ? 'success' : 'failed',
            'message'      => $responseArray['message'] ?? null,
            'data'         => json_encode($response->json($data)),
            'raw_response' => json_encode($responseArray),
        ]);

      return response()->json($responseArray);

    }

    public function POSSupplierRetrieve (Request $request) {
        $posData = PosData::where('id', $request->pos_data_id)->first();
        $dateOfTransaction = Carbon::parse($posData->date_of_transaction)->format("m/d/Y");

        
        $data = [
            'Contractno' => $posData->contract_number,
            'GenerateKey'    =>  $posData->contract_key,
            'POSNO'           =>  $posData->pos_no,
            'CompanyNameCol'    =>  $posData->company_code,
            'TransactionDateCol' => $dateOfTransaction,
        ];

          $response = Http::withOptions(['verify' => false])
            ->withHeaders([
                'apiKey'    => config('services.mall_hookup.pos_supplier_retrieve_api_key'),
                'secretKey' => config('services.mall_hookup.secrey_key'),
            ])
            ->asForm()
            ->post(config('services.mall_hookup.pos_supplier_retrieve_url'), $data);

         $rawResponse = $response->body();
        $clean = preg_replace('/[[:cntrl:]]/', '', $rawResponse);

        $responseArray = json_decode($clean, true);
        
         return response()->json($responseArray);


    }
}