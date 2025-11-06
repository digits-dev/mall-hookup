<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdmModulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'name' => 'Notifications',
                'icon' => 'fa fa-cog',
                'path' => 'notifications',
                'table_name' => 'adm_notifications',
                'controller' => 'NotificationsController',
                'is_protected' => 1,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'Privileges',
                'icon' => 'fa fa-crown',
                'path' => 'privileges',
                'table_name' => 'adm_privileges',
                'controller' => 'PrivilegesController',
                'is_protected' => 1,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'Users Management',
                'icon' => 'fa fa-users',
                'path' => 'users',
                'table_name' => 'adm_users',
                'controller' => 'AdminUsersController',
                'is_protected' => 1,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'App Settings',
                'icon' => 'fa fa-cog',
                'path' => 'settings',
                'table_name' => 'adm_settings',
                'controller' => 'SettingsController',
                'is_protected' => 1,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'Module Generator',
                'icon' => 'fa fa-th',
                'path' => 'module_generator',
                'table_name' => 'adm_moduls',
                'controller' => 'ModulsController',
                'is_protected' => 1,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'Menu Management',
                'icon' => 'fa fa-bars',
                'path' => 'menu_management',
                'table_name' => 'adm_menus',
                'controller' => 'MenusController',
                'is_protected' => 1,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'API Generator',
                'icon' => 'fa fa-cloud-download',
                'path' => 'api_generator',
                'table_name' => '',
                'controller' => 'AdminApiController',
                'is_protected' => 1,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'Announcements',
                'icon' => 'fa fa-info-circle',
                'path' => 'announcements',
                'table_name' => 'announcements',
                'controller' => 'AnnouncementsController',
                'is_protected' => 1,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'Log User Access',
                'icon' => 'fa fa-history',
                'path' => 'logs',
                'table_name' => 'adm_logs',
                'controller' => 'LogsController',
                'is_protected' => 1,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'Dashboard',
                'icon' => 'fa-solid fa-chart-simple',
                'path' => 'dashboard',
                'table_name' => 'dashboard',
                'controller' => 'Dashboard\DashboardController',
                'is_protected' => 0,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'System Error Logs',
                'icon' => 'fa fa-history',
                'path' => 'system_error_logs',
                'table_name' => 'log_system_errors',
                'controller' => 'SystemErrorLogsController',
                'is_protected' => 0,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'Module Activity History',
                'icon' => 'fa fa-history',
                'path' => 'module_activity_history',
                'table_name' => 'module_activity_history',
                'controller' => 'ModuleActivityHistoryController',
                'is_protected' => 0,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'ETP Credendials',
                'icon' => 'fa-solid fa-lock',
                'path' => 'etp_creds',
                'table_name' => 'etp_creds',
                'controller' => 'EtpCreds\EtpCredsController',
                'is_protected' => 0,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'Store Credentials',
                'icon' => 'fa-solid fa-credit-card',
                'path' => 'store_creds',
                'table_name' => 'store_creds',
                'controller' => 'StoreCreds\StoreCredsController',
                'is_protected' => 0,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
            ],
            [
                'name' => 'Mall Hookup API',
                'icon' => 'fa-solid fa-diagram-project',
                'path' => 'mall_hookup_api',
                'table_name' => 'mall_hookup_api',
                'controller' => 'MallHookupApi\MallHookupApiController',
                'is_protected' => 0,
                'is_active' => 1,
                'created_at' => date('Y-m-d H:i:s'),
            ],

            // NEW COLUMNS

        ];

        foreach ($data as $module) {
            DB::table('adm_modules')->updateOrInsert(['name' => $module['name']], $module);
        }

    }
}