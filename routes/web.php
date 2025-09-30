<?php

use App\Helpers\CommonHelpers;
use App\Http\Controllers\AccountingItemMasterHistories\AccountingItemMasterHistoriesController;
use App\Http\Controllers\AccountingItemMasters\AccountingItemMastersController;
use App\Http\Controllers\ActionTypes\ActionTypesController;
use App\Http\Controllers\Admin\AdminApiController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Admin\MenusController;
use App\Http\Controllers\Admin\ModulsController;
use App\Http\Controllers\Admin\AdminUsersController;
use App\Http\Controllers\Admin\PrivilegesController;
use App\Http\Controllers\Admin\AnnouncementsController;
use App\Http\Controllers\Admin\SettingsController;
use App\Http\Controllers\Admin\NotificationsController;
use App\Http\Controllers\Admin\AdmRequestController;
use App\Http\Controllers\Admin\LogsController;
use App\Http\Controllers\Admin\SystemErrorLogsController;
use App\Http\Controllers\AdminBrands\AdminBrandsController;
use App\Http\Controllers\AdminBrandTypes\AdminBrandTypesController;
use App\Http\Controllers\AdminCategories\AdminCategoriesController;
use App\Http\Controllers\AdminClassifications\AdminClassificationsController;
use App\Http\Controllers\AdminColors\AdminColorsController;
use App\Http\Controllers\AdminCurrencies\AdminCurrenciesController;
use App\Http\Controllers\AdminIncoterms\AdminIncotermsController;
use App\Http\Controllers\AdminInventories\AdminInventoriesController;
use App\Http\Controllers\AdminItemMasterAccountingApprovals\AdminItemMasterAccountingApprovalsController;
use App\Http\Controllers\AdminItemMasterApprovals\AdminItemMasterApprovalsController;
use App\Http\Controllers\AdminItemMasterCostHistories\AdminItemMasterCostHistoriesController;
use App\Http\Controllers\AdminItemMasterHistories\AdminItemMasterHistoriesController;
use App\Http\Controllers\AdminItemMasters\AdminItemMastersController;
use App\Http\Controllers\AdminMarginCategories\AdminMarginCategoriesController;
use App\Http\Controllers\AdminModelSpecifics\AdminModelSpecificsController;
use App\Http\Controllers\AdminSizes\AdminSizesController;
use App\Http\Controllers\AdminSkuLegends\AdminSkuLegendsController;
use App\Http\Controllers\AdminSkuStatuses\AdminSkuStatusesController;
use App\Http\Controllers\AdminStoreCategories\AdminStoreCategoriesController;
use App\Http\Controllers\AdminSubCategories\AdminSubCategoriesController;
use App\Http\Controllers\AdminSubClassifications\AdminSubClassificationsController;
use App\Http\Controllers\AdminSuppliers\AdminSuppliersController;
use App\Http\Controllers\AdminUoms\AdminUomsController;
use App\Http\Controllers\AdminVendors\AdminVendorsController;
use App\Http\Controllers\AdminVendorTypes\AdminVendorTypesController;
use App\Http\Controllers\AdminWarehouseCategories\AdminWarehouseCategoriesController;
use App\Http\Controllers\AdminWarranties\AdminWarrantiesController;
use App\Http\Controllers\Api\ApiController;
use App\Http\Controllers\AppleLobClasses\AppleLobClassesController;
use App\Http\Controllers\AppleLobs\AppleLobsController;
use App\Http\Controllers\AppleModels\AppleModelsController;
use App\Http\Controllers\BrandDirections\BrandDirectionsController;
use App\Http\Controllers\BrandGroups\BrandGroupsController;
use App\Http\Controllers\BrandMarketings\BrandMarketingsController;
use App\Http\Controllers\Brands\BrandsController;
use App\Http\Controllers\BtoItemMasterApprovals\BtoItemMasterApprovalsController;
use App\Http\Controllers\Categories\CategoriesController;
use App\Http\Controllers\Classifications\ClassificationsController;
use App\Http\Controllers\Colors\ColorsController;
use App\Http\Controllers\Counters\CountersController;
use App\Http\Controllers\Currencies\CurrenciesController;
use App\Http\Controllers\Identifiers\IdentifiersController;
use App\Http\Controllers\InventoryTypes\InventoryTypesController;
use App\Http\Controllers\Incoterms\IncotermsController;
use App\Http\Controllers\ItemPlatforms\ItemPlatformsController;
use App\Http\Controllers\ItemPromoTypes\ItemPromoTypesController;
use App\Http\Controllers\ItemSegmentations\ItemSegmentationsController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\EcommMarginMatrices\EcommMarginMatricesController;
use App\Http\Controllers\GashaponBrands\GashaponBrandsController;
use App\Http\Controllers\GashaponCategories\GashaponCategoriesController;
use App\Http\Controllers\GashaponCountries\GashaponCountriesController;
use App\Http\Controllers\GashaponIncoterms\GashaponIncotermsController;
use App\Http\Controllers\GashaponInventoryTypes\GashaponInventoryTypesController;
use App\Http\Controllers\GashaponItemMasterAccountingApprovals\GashaponItemMasterAccountingApprovalsController;
use App\Http\Controllers\GashaponItemMasters\GashaponItemMastersController;
use App\Http\Controllers\GashaponModels\GashaponModelsController;
use App\Http\Controllers\GashaponProductTypes\GashaponProductTypesController;
use App\Http\Controllers\GashaponSkuStatuses\GashaponSkuStatusesController;
use App\Http\Controllers\GashaponUoms\GashaponUomsController;
use App\Http\Controllers\GashaponVendorGroups\GashaponVendorGroupsController;
use App\Http\Controllers\GashaponVendorTypes\GashaponVendorTypesController;
use App\Http\Controllers\ItemMasters\ItemMastersController;
use App\Http\Controllers\ItemMasterApprovals\ItemMasterApprovalsController;
use App\Http\Controllers\ItemMasterHistories\ItemMasterHistoriesController;
use App\Http\Controllers\GashaponItemMasterApprovals\GashaponItemMasterApprovalsController;
use App\Http\Controllers\GashaponItemMasterCostHistories\GashaponItemMasterCostHistoriesController;
use App\Http\Controllers\GashaponItemMasterHistories\GashaponItemMasterHistoriesController;
use App\Http\Controllers\GashaponSubCategories\GashaponSubCategoriesController;
use App\Http\Controllers\ItemMasterAccountingApprovals\ItemMasterAccountingApprovalsController;
use App\Http\Controllers\ItemMasterCostHistories\ItemMasterCostHistoriesController;
use App\Http\Controllers\ItemMasterModuleImports\ItemMasterModuleImportsController;
use App\Http\Controllers\RmaItemMasters\RmaItemMastersController;
use App\Http\Controllers\RmaItemMasterApprovals\RmaItemMasterApprovalsController;
use App\Http\Controllers\RmaItemMasterHistories\RmaItemMasterHistoriesController;
use App\Http\Controllers\ItemSerials\ItemSerialsController;
use App\Http\Controllers\MarginCategories\MarginCategoriesController;
use App\Http\Controllers\MarginMatrices\MarginMatricesController;
use App\Http\Controllers\ModelSpecifics\ModelSpecificsController;
use App\Http\Controllers\ModuleHeaders\ModuleHeadersController;
use App\Http\Controllers\ObsCategories\ObsCategoriesController;
use App\Http\Controllers\ObsInventoryTypes\ObsInventoryTypesController;
use App\Http\Controllers\Platforms\PlatformsController;
use App\Http\Controllers\PromoTypes\PromoTypesController;
use App\Http\Controllers\RmaCategories\RmaCategoriesController;
use App\Http\Controllers\RmaClassifications\RmaClassificationsController;
use App\Http\Controllers\RmaItemMasterAccountingApprovals\RmaItemMasterAccountingApprovalsController;
use App\Http\Controllers\RmaItemMasterCostHistories\RmaItemMasterCostHistoriesController;
use App\Http\Controllers\RmaMarginCategories\RmaMarginCategoriesController;
use App\Http\Controllers\RmaModelSpecifics\RmaModelSpecificsController;
use App\Http\Controllers\RmaStoreCategories\RmaStoreCategoriesController;
use App\Http\Controllers\RmaSubClassifications\RmaSubClassificationsController;
use App\Http\Controllers\RmaUoms\RmaUomsController;
use App\Http\Controllers\Segmentations\SegmentationsController;
use App\Http\Controllers\ServiceCenterCategories\ServiceCenterCategoriesController;
use App\Http\Controllers\ServiceCenterClassifications\ServiceCenterClassificationsController;
use App\Http\Controllers\ServiceCenterItemMasterAccountingApprovals\ServiceCenterItemMasterAccountingApprovalsController;
use App\Http\Controllers\ServiceCenterItemMasterApprovals\ServiceCenterItemMasterApprovalsController;
use App\Http\Controllers\ServiceCenterItemMasterCostHistories\ServiceCenterItemMasterCostHistoriesController;
use App\Http\Controllers\ServiceCenterItemMasterHistories\ServiceCenterItemMasterHistoriesController;
use App\Http\Controllers\ServiceCenterItemMasters\ServiceCenterItemMastersController;
use App\Http\Controllers\ServiceCenterMarginCategories\ServiceCenterMarginCategoriesController;
use App\Http\Controllers\ServiceCenterModelSpecifics\ServiceCenterModelSpecificsController;
use App\Http\Controllers\ServiceCenterSubClassifications\ServiceCenterSubClassificationsController;
use App\Http\Controllers\ServiceCenterUoms\ServiceCenterUomsController;
use App\Http\Controllers\Sizes\SizesController;
use App\Http\Controllers\SkuClassifications\SkuClassificationsController;
use App\Http\Controllers\SkuLegends\SkuLegendsController;
use App\Http\Controllers\SkuStatuses\SkuStatusesController;
use App\Http\Controllers\StoreCategories\StoreCategoriesController;
use App\Http\Controllers\SubCategories\SubCategoriesController;
use App\Http\Controllers\SubClassifications\SubClassificationsController;
use App\Http\Controllers\SupportTypes\SupportTypesController;
use App\Http\Controllers\TableSettings\TableSettingsController;
use App\Http\Controllers\Uoms\UomsController;
use App\Http\Controllers\Users\ChangePasswordController;
use App\Http\Controllers\Users\ProfilePageController;
use App\Http\Controllers\VendorGroups\VendorGroupsController;
use App\Http\Controllers\Vendors\VendorsController;
use App\Http\Controllers\VendorTypes\VendorTypesController;
use App\Http\Controllers\WarehouseCategories\WarehouseCategoriesController;
use App\Http\Controllers\Warranties\WarrantiesController;
use Illuminate\Support\Facades\Log;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', [LoginController::class, 'index']);
Route::get('login', [LoginController::class, 'index'])->name('login');
Route::get('/reset_password', [ResetPasswordController::class, 'getIndex'])->name('reset_password');
Route::post('/send_resetpass_email', [ResetPasswordController::class, 'sendResetPasswordInstructions']);
Route::get('/reset_password_email/{email}', [ResetPasswordController::class, 'getResetIndex'])->name('reset_password_email');
Route::post('/send_resetpass_email/reset', [ResetPasswordController::class, 'resetPassword']);
Route::post('post_login', [LoginController::class, 'authenticate'])->name('post_login');
Route::get('/appname', [SettingsController::class, 'getAppname'])->name('app-name');
Route::get('/applogo', [SettingsController::class, 'getApplogo'])->name('app-logo');
Route::get('/login-details', [SettingsController::class, 'getLoginDetails'])->name('app-login-details');

Route::group(['middleware' => ['auth', 'web']], function () {

    //ANNOUNCEMENT
    Route::prefix('announcements')->group(function () {
        Route::get('/add_announcement', [AnnouncementsController::class, 'addAnnouncementForm']);
        Route::get('/edit_announcement/{id}', [AnnouncementsController::class, 'editAnnouncementForm']);
        Route::post('/create_announcement', [AnnouncementsController::class, 'createAnnouncement']);
        Route::post('/update_announcement', [AnnouncementsController::class, 'updateAnnouncement']);
        Route::post('/update_announcement_isread', [AnnouncementsController::class, 'updateAnnouncementIsread']);
    });

});

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/get-pos-data', [DashboardController::class, 'getPosData']);
    Route::get('/resync-yesterday', [DashboardController::class, 'resyncYesterday']);
    Route::get('/resync-all-failed', [DashboardController::class, 'resyncAllFailed']);
    Route::post('/resync-between-dates', [DashboardController::class, 'resyncBetweenDates']);
    Route::post('/pos-supplier-retrieve', [DashboardController::class, 'POSSupplierRetrieve']);
    Route::post('/logout', [LoginController::class, 'logout']);
    Route::get('/sidebar', [MenusController::class, 'sidebarMenu'])->name('sidebar');

    //USERS
    Route::prefix('users')->group(function () {
        Route::post('/bulk_action', [AdminUsersController::class, 'bulkActions']);
        Route::post('/create', [AdminUsersController::class, 'create']);
        Route::post('/update', [AdminUsersController::class, 'update']);
        Route::get('/export', [AdminUsersController::class, 'export']);
    });


    //PROFILE PAGE
    Route::get('/profile', [ProfilePageController::class, 'getIndex'])->name('profile_page');
    Route::get('/edit_profile', [ProfilePageController::class, 'getEditProfile']);
    Route::post('/update_profile', [ProfilePageController::class, 'updateProfile']);
    Route::post('/update-theme', [ProfilePageController::class, 'updateTheme'])->name('update-theme');

    //CHANGE PASSWORD

    Route::prefix('change_password')->group(function () {
        Route::get('/', [ChangePasswordController::class, 'getIndex'])->name('change_password');
        Route::post('/update', [ChangePasswordController::class, 'changePassword'])->name('changePassword');
        Route::post('/waive', [ChangePasswordController::class, 'waive']);
    });

    //PRIVILEGES
    Route::prefix('privileges')->group(function () {
        Route::get('/create-privileges', [PrivilegesController::class, 'createPrivilegesView']);
        Route::get('/edit-privileges/{id}', [PrivilegesController::class, 'editPrivilegeView']);
        Route::post('/edit_save', [PrivilegesController::class, 'editPrivilege']);
        Route::post('/create_save', [PrivilegesController::class, 'createPrivilege']);
        Route::get('/export', [PrivilegesController::class, 'export']);
    });
   

    //MODULES
    Route::prefix('module_generator')->group(function () {
        Route::post('/create_module', [ModulsController::class, 'createModule']);
    });
   
  
    //MENUS
    Route::prefix('menu_management')->group(function () {
        Route::post('/create_menu', [MenusController::class, 'createMenu']);
        Route::post('/update_menu', [MenusController::class, 'updateMenu']);
        Route::post('/auto_update_menu', [MenusController::class, 'autoUpdateMenu']);
        Route::get('/edit/{menu}', [MenusController::class, 'editMenu']);
    });

    //APP SETTINGS
    Route::prefix('settings')->group(function () {
        Route::post('/add_embedded_dashboard', [SettingsController::class, 'addEmbeddedDashboard']);
        Route::post('/update_embedded_dashboard', [SettingsController::class, 'updateEmbeddedDashboard']);
        Route::post('/update_default_dashboard', [SettingsController::class, 'updateDefaultDashboard']);
        Route::post('/update_embedded_dashboard_button', [SettingsController::class, 'updateEmbedDashboardButton']);
    });

    //NOTIFICATION
    Route::prefix('notifications')->group(function () {
        Route::post('/read', [NotificationsController::class, 'markAsRead']);
        Route::post('/read_all', [NotificationsController::class, 'markAllAsRead']);
        Route::get('/view/{id}', [NotificationsController::class, 'viewNotification']);
        Route::get('/view_all', [NotificationsController::class, 'viewAllNotification']);
    });

    //FILTER
    Route::get('/filter/privileges', [AdmRequestController::class, 'privilegesFilter'])->name('privileges-filter');
    Route::get('/filter/users', [AdmRequestController::class, 'usersFilter'])->name('users-filter');

    //EXPORT
    Route::post('/request/export', [AdmRequestController::class, 'export'])->name('export');

    //SYSTEM ERROR LOGS
    Route::prefix('system_error_logs')->group(function () {
        Route::get('/export', [SystemErrorLogsController::class, 'export']);
    });

    // LOG USER ACCESS
    Route::prefix('logs')->group(function () {
        Route::get('/export', [LogsController::class, 'export']);
    });

    // API GENERATOR
    Route::prefix('api_generator')->group(function () {
        
        //API Requests
        Route::post('/generate_key', [AdminApiController::class, 'createKey']);

        //API Key Generation
        Route::post('/deactivate_key/{id}', [AdminApiController::class, 'deactivateKey']);
        Route::post('/activate_key/{id}', [AdminApiController::class, 'activateKey']);
        Route::post('/delete_key/{id}', [AdminApiController::class, 'deleteKey']);

        //API Create Generation

        Route::get('/create_api_view', [AdminApiController::class, 'createApiView']);
        Route::post('/create_api', [AdminApiController::class, 'createApi']);
        
        //API Edit
        Route::get('/edit/{id}', [AdminApiController::class, 'editApi']);
        Route::post('/update_api', [AdminApiController::class, 'updateApi']);

        // VIEW API
        Route::get('/view/{id}', [AdminApiController::class, 'viewApi']);

        // BULK ACTIONS
        Route::post('/bulk_action', [AdminApiController::class, 'bulkActions']);
        
       

    });

});

Route::group([
    'middleware' => ['auth', 'check.user'],
    'prefix' => config('adm_url.ADMIN_PATH'),
    'namespace' => 'App\Http\Controllers',
], function () {

    // Todo: change table
    $modules = [];
    try {
        $modules = DB::table('adm_modules')->whereIn('controller', CommonHelpers::getOthersControllerFiles())->get();
    } catch (\Exception $e) {
        Log::error("Load adm moduls is failed. Caused = " . $e->getMessage());
    }

    foreach ($modules as $v) {
        if (@$v->path && @$v->controller) {
            try {
                CommonHelpers::routeOtherController($v->path, $v->controller, 'app\Http\Controllers');
            } catch (\Exception $e) {
                Log::error("Path = " . $v->path . "\nController = " . $v->controller . "\nError = " . $e->getMessage());
            }
        }
    }
})->middleware('auth');

//ADMIN ROUTE
Route::group([
    'middleware' => ['auth', 'check.user'],
    'prefix' => config('ad_url.ADMIN_PATH'),
    'namespace' => 'App\Http\Controllers\Admin',
], function () {

    // Todo: change table
    if (request()->is(config('ad_url.ADMIN_PATH'))) {
        $menus = DB::table('adm_menuses')->where('is_dashboard', 1)->first();
        if ($menus) {
            Route::get('/', 'Dashboard\DashboardContentGetIndex');
        } else {
            CommonHelpers::routeController('/', 'AdminController', 'App\Http\Controllers\Admin');
        }
    }

    // Todo: change table
    $modules = [];
    try {
        $modules = DB::table('adm_modules')->whereIn('controller', CommonHelpers::getMainControllerFiles())->get();
    } catch (\Exception $e) {
        Log::error("Load ad moduls is failed. Caused = " . $e->getMessage());
    }

    foreach ($modules as $v) {
        if (@$v->path && @$v->controller) {
            try {
                CommonHelpers::routeController($v->path, $v->controller, 'app\Http\Controllers\Admin');
            } catch (\Exception $e) {
                Log::error("Path = " . $v->path . "\nController = " . $v->controller . "\nError = " . $e->getMessage());
            }
        }
    }
})->middleware('auth');