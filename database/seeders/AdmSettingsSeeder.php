<?php

namespace Database\Seeders;

use App\Models\AdmModels\AdmSettings;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AdmSettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $settings = [
            [
                'name'                 => 'Default Dashboard',
                'content'              => 'has_default_dashboard',
                'content_input_type'   => 'No',
            ],
            [
                'name'                 => 'Embedded Dashboard',
                'content'              => 'has_embedded_dashboard',
                'content_input_type'   => 'No',
            ],
        ];

        foreach ($settings as $setting) {
            AdmSettings::updateOrCreate(
                ['name' => $setting['name']],
                $setting
            );
        }
    }
}
