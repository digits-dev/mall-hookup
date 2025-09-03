<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ApiKeys;
use App\Models\ApiRateLimits;
use App\Models\ApiLogs;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;


class ApiController extends Controller
{
   
    public function getTokenFromSecret(Request $request){

        $apiKey = $request->header('X-API-KEY');

        if (!$apiKey) {
            return response()->json(['error' => 'Missing API Key'], 400);
        }

        $key = ApiKeys::where('secret_key', $apiKey)
            ->where('status', ApiKeys::STATUS_ACTIVE)
            ->first();

        if (!$key) {
            return response()->json(['error' => 'Invalid API Key'], 401);
        }

        $token = Str::random(60);
        Cache::put("api_token:$token", $key->id, now()->addHour());

        return response()->json([
            'access_token' => $token,
            'expires_in' => 3600,
            'token_type' => 'Bearer'
        ]);
    }

    // Check if API Key is valid
    public static function isValidApiToken(Request $request)
    {
        $token = $request->bearerToken();

        // Require ONLY Bearer token for all requests
        return $token && Cache::has("api_token:$token");
    }

    // Rate Limiting
    public static function isRateLimited(Request $request, $api){
        $ip = $request->ip();
        $userId = $request->user()->id ?? null;

        $rate = ApiRateLimits::where('api_id', $api->id)
            ->where(function ($query) use ($userId, $ip) {
                $query->where('user_id', $userId)->orWhere('ip_address', $ip);
            })
            ->first();

        if (!$rate) {
            ApiRateLimits::create([
                'api_id' => $api->id,
                'user_id' => $userId,
                'ip_address' => $ip,
                'requests_made' => 1,
                'reset_time' => Carbon::now()->addMinute(),
            ]);
            return true;
        }

        if ($api->has_rate_limit) {
            if ($rate->requests_made >= $api->rate_limit) {
                return false;
            } 
        }

        $rate->increment('requests_made');
        return true;  

      
    }

    // Log API Requests
    public static function logRequest(Request $request, $apiId, $response){
        ApiLogs::create([
            'api_id' => $apiId,
            'user_id' => $request->user()->id ?? null,
            'method' => $request->method(),
            'ip_address' => $request->ip(),
            'request_data' => json_encode($request->all()),
            'response_data' => json_encode($response),
            'status_code' => 200,
            'headers' => json_encode($request->headers->all()),
        ]);
    }

    public static function generateApiController(string $controllerName){

        // Sanitize and validate controller name (basic protection)
        $controllerName = preg_replace('/[^A-Za-z0-9]/', '', $controllerName);
        if (!$controllerName || !preg_match('/^[A-Z][A-Za-z0-9]+$/', $controllerName)) {
            return response()->json(['error' => 'Invalid controller name'], 400);
        }

        $directory = app_path('Http/Controllers/ApiControllers');
        $filePath = $directory . '/' . $controllerName . '.php';

        // Ensure directory exists
        if (!File::exists($directory)) {
            File::makeDirectory($directory, 0755, true);
        }

        // Prevent overwrite
        if (File::exists($filePath)) {
            return response()->json(['message' => 'Controller already exists.'], 200);
        }

            $controllerCode = <<<PHP
            <?php

            namespace App\Http\Controllers\ApiControllers;

            use App\Http\Controllers\Api\ApiController;
            use App\Http\Controllers\Controller;
            use App\Models\ApiConfiguration;
            use Exception;
            use Illuminate\Database\Eloquent\ModelNotFoundException;
            use Illuminate\Database\QueryException;
            use Illuminate\Support\Facades\Validator;
            use Illuminate\Http\Request;
            use Illuminate\Support\Facades\Crypt;
            use Illuminate\Support\Facades\DB;

            class {$controllerName} extends Controller
            {
                public function handleRequest(Request \$request)
                {
                    try {
                        \$api = ApiConfiguration::where('endpoint', \$request->segment(2))->firstOrFail();

                        if (!\$api->status) {
                            return response()->json(['error' => 'API Inactive'], 403);
                        }

                        if (!ApiController::isValidApiToken(\$request)) {
                            return response()->json(['error' => 'Unauthorized API Token'], 401);
                        }

                        if (!ApiController::isRateLimited(\$request, \$api)) {
                            return response()->json(['error' => 'Too Many Requests'], 429);
                        }

                        \$method = strtoupper(\$request->method());
                        \$table = \$api->table_name;
                        \$fields = is_array(\$api->fields) ? \$api->fields : json_decode(\$api->fields, true) ?? [];
                        \$rules = is_array(\$api->rules) ? \$api->rules : json_decode(\$api->rules, true) ?? [];

                        if (!is_array(\$fields) || !is_array(\$rules)) {
                            return response()->json(['error' => 'Invalid API configuration'], 500);
                        }

                        if (\$api->method !== 'ALL' && \$api->method !== \$method) {
                            return response()->json(['error' => 'Method Not Allowed'], 405);
                        }

                        if (\$method === 'GET') {
                            try {
                                \$fields = array_map(function (\$field) use (\$table) {
                                    return "\$table.\$field";
                                }, \$fields);

                                \$query = DB::table(\$table)->select(\$fields);
                                \$relationships = is_string(\$api->relations) ? json_decode(\$api->relations, true) : \$api->relations;

                                if (!empty(\$relationships) && is_array(\$relationships)) {
                                    foreach (\$relationships as \$alias => \$relation) {
                                        if (isset(\$relation['table'], \$relation['column'], \$relation['column_get'])) {
                                            \$joinAlias = "{\$relation['table']}_{\$alias}";
                                            \$query->leftJoin("{\$relation['table']} as {\$joinAlias}", "{\$joinAlias}.{\$relation['column']}", '=', "\$table.\$alias")
                                                ->addSelect("{\$joinAlias}.{\$relation['column_get']} as {\$alias}_{\$relation['column_get']}");
                                        }
                                    }
                                }

                                if (!empty(\$api->sql_parameter)) {
                                    \$query->whereRaw(\$api->sql_parameter);
                                }

                                \$limit = min(\$request->input('limit', 50), 100);
                                \$offset = max(\$request->input('offset', 0), 0);
                                \$query->limit(\$limit)->offset(\$offset);

                                \$initial_response = \$query->get();
                                \$response = Crypt::encryptString(\$initial_response);

                                \$log_data = collect(\$initial_response)->map(function (\$item) {
                                    unset(\$item->password, \$item->token);
                                    return \$item;
                                });

                                if (\$api->enable_logging) {
                                    ApiController::logRequest(\$request, \$api->id, \$log_data);
                                }

                                return response()->json([
                                    'success' => true,
                                    'data' => \$initial_response,
                                    'message' => \$api->name . ' retrieved successfully',
                                ], 200);
                            } catch (\Exception \$e) {
                                return response()->json(['success' => false, 'error' => \$e->getMessage()], 500);
                            }
                        } elseif (\$method === 'POST') {
                            \$id = \$request->route('id');

                            \$validator = Validator::make(\$request->all(), \$rules);
                            if (\$validator->fails()) {
                                return response()->json([
                                    'success' => false,
                                    'message' => 'Validation failed',
                                    'errors' => \$validator->errors()
                                ], 422);
                            }

                            \$data = \$request->only(\$fields);

                            if (\$id) {
                                if (empty(\$data)) {
                                    return response()->json([
                                        'success' => false,
                                        'message' => 'No fields provided for update.'
                                    ], 400);
                                }

                                \$affectedRows = DB::table(\$table)->where('id', \$id)->update(\$data);

                                if (\$affectedRows) {
                                    if (\$api->enable_logging) {
                                        ApiController::logRequest(\$request, \$api->id, \$affectedRows);
                                    }

                                    return response()->json([
                                        'success' => true,
                                        'message' => 'Data updated successfully'
                                    ], 200);
                                } else {
                                    return response()->json([
                                        'success' => false,
                                        'message' => 'No records updated. Either ID is incorrect or data remains unchanged.'
                                    ], 400);
                                }
                            } else {
                                \$newId = DB::table(\$table)->insertGetId(\$data);

                                if (\$api->enable_logging) {
                                    ApiController::logRequest(\$request, \$api->id, \$newId);
                                }

                                return response()->json([
                                    'success' => true,
                                    'message' => 'Data created successfully',
                                    'id' => \$newId
                                ], 201);
                            }
                        } elseif (\$method === 'DELETE') {
                            \$id = \$request->route('id');
                            if (!\$id) {
                                return response()->json([
                                    'success' => false,
                                    'message' => 'ID is required for deleting data.'
                                ], 400);
                            }

                            \$deleted = DB::table(\$table)->where('id', \$id)->delete();

                            if (\$deleted) {
                                if (\$api->enable_logging) {
                                    ApiController::logRequest(\$request, \$api->id, \$deleted);
                                }

                                return response()->json([
                                    'success' => true,
                                    'message' => 'Data deleted successfully'
                                ], 200);
                            } else {
                                return response()->json([
                                    'success' => false,
                                    'message' => 'No record found with the given ID.'
                                ], 404);
                            }
                        } else {
                            return response()->json([
                                'success' => false,
                                'message' => 'Invalid Request'
                            ], 400);
                        }

                        return response()->json(\$response);
                    } catch (ModelNotFoundException \$e) {
                        return response()->json(['error' => 'API Endpoint Not Found'], 404);
                    } catch (QueryException \$e) {
                        return response()->json(['error' => 'Database Error: ' . \$e->getMessage()], 500);
                    } catch (Exception \$e) {
                        return response()->json(['error' => 'Server Error: ' . \$e->getMessage()], 500);
                    }
                }
            }
            PHP;

            File::put($filePath, $controllerCode);

            return response()->json(['message' => "{$controllerName} created."]);
    }


}
