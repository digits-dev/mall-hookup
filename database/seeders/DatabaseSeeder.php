<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([AdmSeeders::class]);
        $this->call([AdmModulesSeeder::class]);
        $this->call([AdmAdminMenusSeeder::class]);
        $this->call([AdmMenusSeeder::class]);
        $this->call([AdmMenuPrivilegesSeeder::class]);
        $this->call([AdmPrivilegesSeeder::class]);
        $this->call([AdmUsersSeeders::class]);
        $this->call([AdmSettingsSeeder::class]);
    }
}