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
use Illuminate\Support\Facades\Log;

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
        $data['posData'] = DB::table('pos_data')->orderBy('date_of_transaction', 'desc')->get();
        $data['my_privilege_id'] = CommonHelpers::myPrivilegeId();
        
        return Inertia::render('Dashboard/DataSyncDashboard', $data);
    }

    public function getPosData() {

        $today = now()->format('Ymd');
         $posData = DB::connection('sqlsrv')->select("
            SET NOCOUNT ON; 
            exec [RptSpESalesSummaryReport_BIR] 100,'0572',{$today},{$today}
        ")[0];

        $totalSales = $posData->GrossTotalAmt + $posData->Discount + $posData->Returns - $posData->VatTotalAmt;
        $transactionCount = $posData->DocRangeTo - $posData->DocRangeFrom;

        $date = DateTime::createFromFormat("Ymd", $posData->CreateDate);
        $formattedDate = $date->format("Y-m-d");
        $dateOfTransaction = $date->format("m/d/Y");

         $posDataModel = PosData::firstOrCreate(
            [
                'date_of_transaction' => $formattedDate,
                'total_sales'         => $totalSales,
                'transaction_count'   => $transactionCount,
            ],
            [
                'contract_number'     => 'BP07-2000000000011',
                'contract_key'        => '66BIBZNNR9RGNCDLCW50YASVC23L8L',
                'pos_no'              => 'A1002688',
                'company_code'        => 'BP07',
            ]
        );

        // $existingSuccess = ApiResponse::where('pos_data_id', $posDataModel->id)
        //     ->where('status', 'success')
        //     ->exists();

        // if ($existingSuccess) {
        //     return response()->json([
        //         'status'  => 200,
        //         'message' => 'Already successfully pushed. Cannot re-run.',
        //     ]);
        // }

        if ($posDataModel->status === 'success') {
            return response()->json([
                'status'  => 200,
                'message' => 'Already successfully pushed. Cannot re-run.',
            ]);
        }


        $data = [
            'Contractno' => 'BP07-2000000000011',
            'GenerateKey'    =>  '66BIBZNNR9RGNCDLCW50YASVC23L8L',
            'POSNO'           =>  'A1002688',
            'CompanyNameCol'    =>  'BP07',
            'TransactionDateCol' => $dateOfTransaction,
            'TotalSalesCol'     => $totalSales,
            'TransactionCount'  => $transactionCount,
        ];
        
    $response = Http::withOptions(['verify' => false])
    ->withHeaders([
        'apiKey'    => config('services.mall_hookup.pos_supplier_api_key'),
        'secretKey' => config('services.mall_hookup.secret_key'),
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

        $posDataModel->update([
            'status' => $responseArray['status'] == 200 ? 'success' : 'failed'
        ]);


      return response()->json($responseArray);

    }

    public function resyncYesterday () {
        $yesterday = Carbon::yesterday()->format('Y-m-d');
        $posData = PosData::where('date_of_transaction', $yesterday)->first();

        if (!$posData) {
            Log::info("No POS data found for {$yesterday}.");
            return "No POS data found for {$yesterday}.";
        }

        // $success = ApiResponse::where('pos_data_id', $posData->id)
        //     ->where('status', 'success')
        //     ->exists();
        // if ($success) {
        //    Log::info("Yesterday's sync already succeeded.");
        //     return "Yesterday's sync already succeeded.";
        // }
        
        if ($posData->status === 'success') {
            Log::info("Yesterday's sync already succeeded.");
            return "Yesterday's sync already succeeded.";
        }

        $data = [
            'Contractno'           => $posData->contract_number,
            'GenerateKey'          => $posData->contract_key,
            'POSNO'                => $posData->pos_no,
            'CompanyNameCol'       => $posData->company_code,
            'TransactionDateCol'   => Carbon::parse($posData->date_of_transaction)->format('m/d/Y'),
            'TotalSalesCol'        => $posData->total_sales,
            'TransactionCount'     => $posData->transaction_count,
        ];

        $response = Http::withOptions(['verify' => false])
            ->withHeaders([
                'apiKey'    => config('services.mall_hookup.pos_supplier_api_key'),
                'secretKey' => config('services.mall_hookup.secret_key'),
            ])
            ->asForm()
            ->post(config('services.mall_hookup.pos_supplier_url'), $data);

        $responseArray = json_decode(preg_replace('/[[:cntrl:]]/', '', $response->body()), true);

        ApiResponse::create([
            'pos_data_id'  => $posData->id,
            'payload'      => json_encode($data),
            'status'       => $responseArray['status'] == 200 ? 'success' : 'failed',
            'message'      => $responseArray['message'] ?? null,
            'data'         => json_encode($response->json($data)),
            'raw_response' => json_encode($responseArray),
        ]);

            $posData->update([
            'status' => $responseArray['status'] == 200 ? 'success' : 'failed',
        ]);
        return $responseArray;
    }
    
        public function resyncAllFailed()
    {
        $failedData = PosData::where('status', 'failed')->get();

        if ($failedData->isEmpty()) {
            return response()->json([
                'status' => 200,
                'message' => 'No failed transactions found.',
            ]);
        }

        $results = [];

        foreach ($failedData as $posData) {
            $data = [
                'Contractno'           => $posData->contract_number,
                'GenerateKey'          => $posData->contract_key,
                'POSNO'                => $posData->pos_no,
                'CompanyNameCol'       => $posData->company_code,
                'TransactionDateCol'   => Carbon::parse($posData->date_of_transaction)->format('m/d/Y'),
                'TotalSalesCol'        => $posData->total_sales,
                'TransactionCount'     => $posData->transaction_count,
            ];

            $response = Http::withOptions(['verify' => false])
                ->withHeaders([
                    'apiKey'    => config('services.mall_hookup.pos_supplier_api_key'),
                    'secretKey' => config('services.mall_hookup.secret_key'),
                ])
                ->asForm()
                ->post(config('services.mall_hookup.pos_supplier_url'), $data);

            $responseArray = json_decode(preg_replace('/[[:cntrl:]]/', '', $response->body()), true);
            $status = $responseArray['status'] == 200 ? 'success' : 'failed';

            // update latest status
            $posData->update(['status' => $status]);

            // log attempt in history
            ApiResponse::create([
                'pos_data_id'  => $posData->id,
                'payload'      => json_encode($data),
                'status'       => $status,
                'message'      => $responseArray['message'] ?? null,
                'data'         => json_encode($response->json($data)),
                'raw_response' => json_encode($responseArray),
            ]);

            $results[] = [
                'Date of Transaction' => $posData->date_of_transaction,
                'status'      => $status,
                'message'     => $responseArray['message'] ?? null,
            ];
        }

        return response()->json([
            'status'  => 200,
            'message' => 'Resync complete',
            'results' => $results,
        ]);
    }

    public function resyncBetweenDates(Request $request)
    {
        $request->validate([
            'from' => 'required|date',
            'to'   => 'required|date|after_or_equal:from',
        ]);

        $from = Carbon::parse($request->from)->format('Y-m-d');
        $to   = Carbon::parse($request->to)->format('Y-m-d');

        // Fetch ALL pos_data within the date range
        $transactions = PosData::whereBetween('date_of_transaction', [$from, $to])->get();

        if ($transactions->isEmpty()) {
            return response()->json([
                'status' => 200,
                'message' => "No transactions found between {$from} and {$to}.",
            ]);
        }

        $results = [];

        foreach ($transactions as $posData) {
            $data = [
                'Contractno'           => $posData->contract_number,
                'GenerateKey'          => $posData->contract_key,
                'POSNO'                => $posData->pos_no,
                'CompanyNameCol'       => $posData->company_code,
                'TransactionDateCol'   => Carbon::parse($posData->date_of_transaction)->format('m/d/Y'),
                'TotalSalesCol'        => $posData->total_sales,
                'TransactionCount'     => $posData->transaction_count,
            ];

            $response = Http::withOptions(['verify' => false])
                ->withHeaders([
                    'apiKey'    => config('services.mall_hookup.pos_supplier_api_key'),
                    'secretKey' => config('services.mall_hookup.secret_key'),
                ])
                ->asForm()
                ->post(config('services.mall_hookup.pos_supplier_url'), $data);

            $responseArray = json_decode(preg_replace('/[[:cntrl:]]/', '', $response->body()), true);
            $status = $responseArray['status'] == 200 ? 'success' : 'failed';

            // Update pos_data with the latest status
            $posData->update(['status' => $status]);

            // Save to history table
            ApiResponse::create([
                'pos_data_id'  => $posData->id,
                'payload'      => json_encode($data),
                'status'       => $status,
                'message'      => $responseArray['message'] ?? null,
                'data'         => json_encode($response->json($data)),
                'raw_response' => json_encode($responseArray),
            ]);

            $results[] = [
                 'Date of Transaction' => $posData->date_of_transaction,
                'status'      => $status,
                'message'     => $responseArray['message'] ?? null,
            ];
        }

        return response()->json([
            'status'  => 200,
            'message' => "Resync complete for transactions between {$from} and {$to}.",
            'results' => $results,
        ]);
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
                'secretKey' => config('services.mall_hookup.secret_key'),
            ])
            ->asForm()
            ->post(config('services.mall_hookup.pos_supplier_retrieve_url'), $data);

         $rawResponse = $response->body();
        $clean = preg_replace('/[[:cntrl:]]/', '', $rawResponse);

        $responseArray = json_decode($clean, true);
        
         return response()->json($responseArray);


    }
}