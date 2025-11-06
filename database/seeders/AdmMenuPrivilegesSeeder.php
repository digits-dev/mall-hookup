<?php

namespace Database\Seeders;

use App\Models\AdmModels\AdmMenusPrivileges;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdmMenuPrivilegesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $menus = [
            [
                'id_adm_menus' => 1,
                'id_adm_privileges' => 1
            ],
            [
                'id_adm_menus' => 2,
                'id_adm_privileges' => 1
            ],
            [
                'id_adm_menus' => 3,
                'id_adm_privileges' => 1
            ],
            [
                'id_adm_menus' => 4,
                'id_adm_privileges' => 1
            ],
            [
                'id_adm_menus' => 5,
                'id_adm_privileges' => 1
            ],
        ];

        foreach ($menus as $menu) {
            AdmMenusPrivileges::updateOrCreate(
                [
                    'id_adm_menus' => $menu['id_adm_menus'],
                    'id_adm_privileges' => $menu['id_adm_privileges'],
                ]
            );
        }
    }
}