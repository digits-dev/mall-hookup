<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        $schedule->command('inspire')->hourly();
        $schedule->command('mysql:backup')->daily()->at('06:00');
        // $schedule->call('\App\Http\Controllers\Dashboard\DashboardController@resyncYesterday')
        //     ->dailyAt('10:50');

        // $schedule->call('\App\Http\Controllers\Dashboard\DashboardController@resyncYesterday')
        //     ->dailyAt('11:50');


    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}