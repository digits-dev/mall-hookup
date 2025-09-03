<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ApiController;
use Illuminate\Support\Facades\Schema;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/get-token', [ApiController::class, 'getTokenFromSecret']);

if (!app()->runningInConsole() && Schema::hasTable('api_configurations')) {
    $apiControllers = \App\Models\ApiConfiguration::select('controller_name', 'endpoint')->get();

    foreach ($apiControllers as $controller) {
        $controllerName = '\\App\\Http\\Controllers\\ApiControllers\\' . ltrim($controller->controller_name, '\\');
        Route::match(['get', 'post', 'delete'], "/{$controller->endpoint}/{id?}", [$controllerName, 'handleRequest']);
    }
}


