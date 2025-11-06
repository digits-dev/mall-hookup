<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Helpers\CommonHelpers; 
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;


class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
         try {
        $creds = DB::table('etp_creds')->first();

        if ($creds) {
            config(['database.connections.sqlsrv' => CommonHelpers::getEtpConnectionConfig()]);
        }
    } catch (\Throwable $e) {
        // swallow errors (like if table doesn't exist yet)
    }
    }
}