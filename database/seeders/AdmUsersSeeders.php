<?php

namespace Database\Seeders;
use App\Models\AdmUser;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AdmUsersSeeders extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        AdmUser::updateOrInsert(['email' => 'superadmin@digits.ph'],
        [
            'name' => 'Super Admin',
            'email' => 'superadmin@digits.ph',
            'password' => bcrypt('qwerty'),
            'id_adm_privileges' => 1
        ]);

    }
}