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
use Carbon\CarbonPeriod;
use Illuminate\Support\Facades\Log;
use App\Models\EtpCreds;
use App\Models\StoreCreds;
use App\Models\MallHookupApi;

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

    private function sendMallHookupRequest(array $data, string $type = 'supplier')
    {
        $mallHookupApi = MallHookupApi::first();

        $urlKey  = "pos_{$type}_url";
        $apiKey  = "pos_{$type}_api_key";

        return Http::withOptions(['verify' => false])
            ->withHeaders([
                'apiKey'    => $mallHookupApi?->$apiKey ?? config("services.mall_hookup.$apiKey"),
                'secretKey' => $mallHookupApi?->secret_key ?? config('services.mall_hookup.secret_key'),
            ])
            ->asForm()
            ->post($mallHookupApi?->$urlKey ?? config("services.mall_hookup.$urlKey"), $data);
    }

    public function getPosData() {

        $storeId = EtpCreds::value('store_id');
        $storeCreds = StoreCreds::first();

        if (empty($storeId) || !$storeCreds) {
            return response()->json([
                'status'  => 400,
                'message' => 'Missing store credentials. Please set up store ID and store credentials before proceeding.',
                'data'    => [],
            ], 400);
        }

        // exec [RptSpESalesSummaryReport_BIR] 100,'{$storeId}','{$today}','{$today}'");
        $today = now()->format('Ymd');
        $posData = DB::connection('sqlsrv')->select("
        SET NOCOUNT ON; 
        exec [RptSpESalesSummaryReport_BIR] 100,'{$storeId}','20250514','20250514'");

            if (empty($posData)) {
                return response()->json([
                    'status'  => 404,
                    'message' => "No POS data found for today ({$today}).",
                    'data'    => [],
                ]);
            }

        $posData = $posData[0];

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
                'contract_number'     => $storeCreds->contract_number,
                'contract_key'        => $storeCreds->contract_key,
                'pos_no'              => $storeCreds->pos_no,
                'company_code'        => $storeCreds->company_code,
            ]
        );

        if ($posDataModel->status === 'success') {
            return response()->json([
                'status'  => 200,
                'message' => 'Already successfully pushed. Cannot re-run.',
            ]);
        }

        $data = [
            'Contractno' => $storeCreds->contract_number,
            'GenerateKey'    =>  $storeCreds->contract_key,
            'POSNO'           =>  $storeCreds->pos_no,
            'CompanyNameCol'    =>   $storeCreds->company_code,
            'TransactionDateCol' => $dateOfTransaction,
            'TotalSalesCol'     => $totalSales,
            'TransactionCount'  => $transactionCount,
        ];

        $response = $this->sendMallHookupRequest($data);

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
    
    public function resyncYesterday()
    {
        $storeId = EtpCreds::value('store_id');
        $storeCreds = StoreCreds::first();

        if (empty($storeId) || !$storeCreds) {
                Log::info("Missing store credentials. Please set up store ID and store credentials before proceeding.");
                return [
                    'status'  => 404,
                    'message' => "Missing store credentials. Please set up store ID and store credentials before proceeding."
                ];
        }

        $yesterday = Carbon::yesterday()->format('Y-m-d');

        // Check if POS data exists
        $posData = PosData::where('date_of_transaction', $yesterday)->first();

        if (!$posData) {
            // Pull from SQL Server if missing
            $sqlDate = Carbon::yesterday()->format('Ymd');
            $sqlData = DB::connection('sqlsrv')->select("
                SET NOCOUNT ON; 
                exec [RptSpESalesSummaryReport_BIR] 100,'{$storeId}','{$sqlDate}','{$sqlDate}'
            ");

            if (empty($sqlData)) {
                Log::info("No POS data found for {$yesterday} on SQL Server.");
                return [
                    'status'  => 404,
                    'message' => "No POS data found for {$yesterday}."
                ];
            }

            $record = $sqlData[0];
            $totalSales = $record->GrossTotalAmt + $record->Discount + $record->Returns - $record->VatTotalAmt;
            $transactionCount = $record->DocRangeTo - $record->DocRangeFrom;

            $posData = PosData::create([
                'date_of_transaction' => $yesterday,
                'total_sales'         => $totalSales,
                'transaction_count'   => $transactionCount,
                'contract_number'     => $storeCreds->contract_number,
                'contract_key'        => $storeCreds->contract_key,
                'pos_no'              => $storeCreds->pos_no,
                'company_code'        => $storeCreds->company_code,
                'status'              => 'pending',
            ]);
        }

        if ($posData->status === 'success') {
            Log::info("Yesterday's sync already succeeded.");
            return [
                'status'  => 200,
                'message' => "Yesterday's sync already succeeded."
            ];
        }

        // Build API payload
        $data = [
            'Contractno'         => $posData->contract_number,
            'GenerateKey'        => $posData->contract_key,
            'POSNO'              => $posData->pos_no,
            'CompanyNameCol'     => $posData->company_code,
            'TransactionDateCol' => Carbon::parse($posData->date_of_transaction)->format('m/d/Y'),
            'TotalSalesCol'      => $posData->total_sales,
            'TransactionCount'   => $posData->transaction_count,
        ];

        $response = $this->sendMallHookupRequest($data);

        $responseArray = json_decode(preg_replace('/[[:cntrl:]]/', '', $response->body()), true);
        $status = $responseArray['status'] == 200 ? 'success' : 'failed';

        // Log attempt
        ApiResponse::create([
            'pos_data_id'  => $posData->id,
            'payload'      => json_encode($data),
            'status'       => $status,
            'message'      => $responseArray['message'] ?? null,
            'data'         => json_encode($response->json($data)),
            'raw_response' => json_encode($responseArray),
        ]);

        // Update pos_data status
        $posData->update(['status' => $status]);

        return $responseArray;
    }

        public function resyncAllFailed()
    {
        $storeCreds = StoreCreds::first();

        if (!$storeCreds) {
            return response()->json([
                'status'  => 400,
                'message' => 'Missing store credentials. Please set up store credentials before proceeding.',
                'data'    => [],
            ], 400);
        }
        
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
                'Contractno' => $storeCreds->contract_number,
                'GenerateKey'    =>  $storeCreds->contract_key,
                'POSNO'           =>  $storeCreds->pos_no,
                'CompanyNameCol'    =>   $storeCreds->company_code,
                'TransactionDateCol'   => Carbon::parse($posData->date_of_transaction)->format('m/d/Y'),
                'TotalSalesCol'        => $posData->total_sales,
                'TransactionCount'     => $posData->transaction_count,
            ];

            $response = $this->sendMallHookupRequest($data);

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

        if ($status == 'success') {
        return response()->json([
            'status'  => 200,
            'message' => 'Resync complete',
            'results' => $results,
        ]);
        }else {
            return response()->json($responseArray);
        }
       
    }

    public function resyncBetweenDates(Request $request)
    {
    // Validate input
    $request->validate([
        'from' => 'required|date',
        'to'   => 'required|date|after_or_equal:from',
    ]);

    $from = Carbon::parse($request->from)->format('Y-m-d');
    $to   = Carbon::parse($request->to)->format('Y-m-d');

    $period = CarbonPeriod::create($from, $to);
    $transactions = collect();

    $storeId = EtpCreds::value('store_id');
    $storeCreds = StoreCreds::first();

    if (empty($storeId) || !$storeCreds) {
        return response()->json([
            'status'  => 400,
            'message' => 'Missing store credentials. Please set up store ID and store credentials before proceeding.',
            'data'    => [],
        ], 400);
    }


    foreach ($period as $date) {
        $formattedDate = $date->format('Y-m-d');

        // Check if POS data exists for this date
        $posData = PosData::where('date_of_transaction', $formattedDate)->first();

        if (!$posData) {
            // Pull missing day from SQL Server
            $sqlDate = $date->format('Ymd');
            $sqlData = DB::connection('sqlsrv')->select("
                SET NOCOUNT ON; 
                exec [RptSpESalesSummaryReport_BIR] 100,'{$storeId}','{$sqlDate}','{$sqlDate}'
            ");

            if (!empty($sqlData)) {
                $record = $sqlData[0];
                $totalSales = $record->GrossTotalAmt + $record->Discount + $record->Returns - $record->VatTotalAmt;
                $transactionCount = $record->DocRangeTo - $record->DocRangeFrom;

                $posData = PosData::create([
                    'date_of_transaction' => $formattedDate,
                    'total_sales'         => $totalSales,
                    'transaction_count'   => $transactionCount,
                    'contract_number'     => $storeCreds->contract_number,
                    'contract_key'        => $storeCreds->contract_key,
                    'pos_no'              => $storeCreds->pos_no,
                    'company_code'        => $storeCreds->company_code,
                    'status'              => 'pending',
                ]);
            }
        }

        if ($posData) {
            $transactions->push($posData);
        }
    }

    if ($transactions->isEmpty()) {
        return response()->json([
            'status'  => 404,
            'message' => "No transactions found between {$from} and {$to}.",
        ]);
    }

    $results = [];

    foreach ($transactions as $posData) {

        $data = [
            'Contractno'         => $posData->contract_number,
            'GenerateKey'        => $posData->contract_key,
            'POSNO'              => $posData->pos_no,
            'CompanyNameCol'     => $posData->company_code,
            'TransactionDateCol' => Carbon::parse($posData->date_of_transaction)->format('m/d/Y'),
            'TotalSalesCol'      => $posData->total_sales,
            'TransactionCount'   => $posData->transaction_count,
        ];

        $response = $this->sendMallHookupRequest($data);

        $responseArray = json_decode(preg_replace('/[[:cntrl:]]/', '', $response->body()), true);
        $status = $responseArray['status'] == 200 ? 'success' : 'failed';

        // Update POS data status
        $posData->update(['status' => $status]);

        // Log attempt in ApiResponse
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
            'status'              => $status,
            'message'             => $responseArray['message'] ?? null,
        ];
    }

    return response()->json([
        'status'  => 200,
        'message' => "Resync complete for transactions between {$from} and {$to}.",
        'results' => $results,
    ]);
}

    public function POSSupplierRetrieve (Request $request) {

        $storeCreds = StoreCreds::first();

        if (!$storeCreds) {
            return response()->json([
                'status'  => 400,
                'message' => 'Missing store credentials. Please set up store credentials before proceeding.',
                'data'    => [],
            ], 400);
        }
        $posData = PosData::where('id', $request->pos_data_id)->first();
        $dateOfTransaction = Carbon::parse($posData->date_of_transaction)->format("m/d/Y");
        
        $data = [
            'Contractno' => $storeCreds->contract_number,
            'GenerateKey'    =>  $storeCreds->contract_key,
            'POSNO'           =>  $storeCreds->pos_no,
            'CompanyNameCol'    =>  $storeCreds->company_code,
            'TransactionDateCol' => $dateOfTransaction,
        ];

        $response = $this->sendMallHookupRequest($data, 'supplier_retrieve');
        
        $rawResponse = $response->body();
        $clean = preg_replace('/[[:cntrl:]]/', '', $rawResponse);

        $responseArray = json_decode($clean, true);
        
         return response()->json($responseArray);

    }
}