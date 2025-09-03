<?php

namespace Database\Seeders;

use App\Models\AdmAdminMenus;
use Illuminate\Database\Seeder;


class AdmAdminMenusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $menus = [
            [
                'name'        => 'Privileges',
                'type'        => 'Route',
                'slug'        => 'privileges',
                'icon'        => 'fa fa-crown',
                'parent_id'   => 0,
                'is_active'   => 1,
                'sorting'     => 1
            ],
            [
                'name'        => 'Users Management',
                'type'        => 'Route',
                'slug'        => 'users',
                'icon'        => 'fa fa-users',
                'parent_id'   => 0,
                'is_active'   => 1,
                'sorting'     => 2
            ],
            [
                'name'        => 'Menu Management',
                'type'        => 'Route',
                'slug'        => 'menu_management',
                'icon'        => 'fa fa-bars',
                'parent_id'   => 0,
                'is_active'   => 1,
                'sorting'     => 3
            ],
            [
                'name'        => 'Module Generator',
                'type'        => 'Route',
                'slug'        => 'module_generator',
                'icon'        => 'fa fa-th',
                'parent_id'   => 0,
                'is_active'   => 1,
                'sorting'     => 4
            ],
            [
                'name'        => 'API Generator',
                'type'        => 'Route',
                'slug'        => 'api_generator',
                'icon'        => 'fa fa-code-merge',
                'parent_id'   => 0,
                'is_active'   => 1,
                'sorting'     => 5
            ],
            [
                'name'        => 'Admin Settings',
                'type'        => 'URL',
                'slug'        => 'adm_settings',
                'icon'        => 'fa fa-cogs',
                'parent_id'   => 0,
                'is_active'   => 1,
                'sorting'     => 6
            ],
            [
                'name'        => 'App Settings',
                'type'        => 'Route',
                'slug'        => 'settings',
                'icon'        => 'fa fa-cogs',
                'parent_id'   => 6,
                'is_active'   => 1,
                'sorting'     => 1
            ],
            [
                'name'        => 'Announcements',
                'type'        => 'Route',
                'slug'        => 'announcements',
                'icon'        => 'fa fa-info-circle',
                'parent_id'   => 6,
                'is_active'   => 1,
                'sorting'     => 2
            ],
            [
                'name'        => 'Notifications',
                'type'        => 'Route',
                'slug'        => 'notifications',
                'icon'        => 'fa fa-bell',
                'parent_id'   => 6,
                'is_active'   => 1,
                'sorting'     => 3
            ],
            [
                'name'        => 'Log User Access',
                'type'        => 'Route',
                'slug'        => 'logs',
                'icon'        => 'fa fa-history',
                'parent_id'   => 13,
                'is_active'   => 1,
                'sorting'     => 1
            ],
            [
                'name'        => 'Module Activity History',
                'type'        => 'Route',
                'slug'        => 'module_activity_history',
                'icon'        => 'fa fa-history',
                'parent_id'   => 13,
                'is_active'   => 1,
                'sorting'     => 2
            ],
            [
                'name'        => 'System Error Logs',
                'type'        => 'Route',
                'slug'        => 'system_error_logs',
                'icon'        => 'fa fa-history',
                'parent_id'   => 13,
                'is_active'   => 1,
                'sorting'     => 3
            ],
            [
                'name'        => 'System Logs',
                'type'        => 'URL',
                'slug'        => '##',
                'icon'        => 'fa fa-history',
                'parent_id'   => 0,
                'is_active'   => 1,
                'sorting'     => 7
            ],
        ];

        foreach ($menus as $menu) {
            AdmAdminMenus::updateOrCreate(
                ['name' => $menu['name']],
                $menu
            );
        }
    }
}
