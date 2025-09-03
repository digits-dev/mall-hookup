<?php

namespace Database\Seeders;

use App\Models\AdmModels\AdmMenus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdmMenusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run() {
        $menus = [
            [
                'name'              => 'Dashboard',
                'type'              => 'Route',
                'path'              => 'Dashboard\DashboardControllerGetIndex',
                'slug'              => 'dashboard',
                'icon'              => 'fa-solid fa-chart-simple',
                'parent_id'         => 0,
                'is_active'         => 1,
                'is_dashboard'      => 1,
                'id_adm_privileges' => 1,
                'sorting'           => 1
            ],
        ];

        foreach ($menus as $menu) {
            AdmMenus::updateOrCreate(
                ['name' => $menu['name']],
                $menu
            );
        }


    }

   

}