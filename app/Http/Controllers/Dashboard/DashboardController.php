<?php

namespace App\Http\Controllers\Dashboard;

use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use App\Models\AdmEmbeddedDashboard;
use App\Models\AdmEmbeddedDashboardPrivilege;
use App\Models\AdminCategory;
use App\Models\AdminClassification;
use App\Models\AdminItemMaster;
use App\Models\AdminItemMasterHistory;
use App\Models\AdminSubClassification;
use App\Models\AdmModels\AdmSettings;
use App\Models\Brands;
use App\Models\Classifications;
use App\Models\GashaponBrands;
use App\Models\GashaponCategories;
use App\Models\GashaponItemMaster;
use App\Models\GashaponItemMasterHistory;
use App\Models\GashaponProductTypes;
use App\Models\ItemMaster;
use App\Models\ItemMasterHistory;
use App\Models\RmaCategories;
use App\Models\RmaClassifications;
use App\Models\RmaItemMaster;
use App\Models\RmaItemMasterHistory;
use App\Models\RmaSubClassifications;
use App\Models\ServiceCenterCategories;
use App\Models\ServiceCenterClassifications;
use App\Models\ServiceCenterItemMaster;
use App\Models\ServiceCenterItemMasterHistory;
use App\Models\ServiceCenterSubClassifications;
use App\Models\SubClassifications;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{

    public function getIndex(): Response
    {

        $data = [];

        $data['dashboard_settings_data'] = AdmSettings::whereIn('name', ['Default Dashboard', 'Embedded Dashboard'])
        ->get()
        ->mapWithKeys(function ($item) {
            return [$item->content => $item->content_input_type];
        })
        ->toArray();

        $dashboard_privilege = AdmEmbeddedDashboardPrivilege::where('adm_privileges_id',  CommonHelpers::myPrivilegeId())
                ->pluck('adm_embedded_dashboard_id');

        $data['embedded_dashboards'] = AdmEmbeddedDashboard::whereIn('id', $dashboard_privilege)
            ->where('status', 'ACTIVE')
            ->get();

        
        return Inertia::render('Dashboard/Dashboard', $data);
    }
}
