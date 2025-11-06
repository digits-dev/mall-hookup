<?php

namespace app\Helpers;

use App\Models\AdmAdminMenus;
use App\Models\AdmModels\AdmMenus;
use App\Models\LogSystemError;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Request;

class CommonHelpers {

    public static function getMainControllerFiles() {
        $controllers = glob(__DIR__.'/../../app/Http/Controllers/Admin/*.php');
        $result = [];
        foreach ($controllers as $file) {
            $result[] = str_replace('.php', '', basename($file));
        }
        return $result;
    }

    public static function LogSystemError($module_name, $error_details){
        LogSystemError::create([
            'module_name' => $module_name,
            'error_details' => $error_details,
            'created_by' => self::myId(),
            'created_at' => now(),
        ]);
    }

    public static function getOthersControllerFiles() {
        $controllers = glob(__DIR__.'/../../app/Http/Controllers/*/*.php');
        $result = [];
        foreach ($controllers as $file) {
            $parsedUrl = parse_url($file);

            // Extract the path component
            $path = $parsedUrl['path'];
            
            // Get the directory path
            $directoryPath = dirname($path);
            
            // Get the folder name immediately preceding the basename
            $precedingFolder = basename($directoryPath);
            $result[] = str_replace('.php', '', $precedingFolder ."\\". basename($file));
        }
        return $result;
    }

    public static function getLivewireControllerFiles() {
        $controllers = glob(__DIR__.'/../../app/Livewire/Component/ModuleContents/*/*.php');
        $livewireFolder = glob(__DIR__.'/../../app/Livewire/Component/ModuleContents/*');
        $result = [];
      
        foreach ($controllers as $file) {
            $parsedUrl = parse_url($file);

            // Extract the path component
            $path = $parsedUrl['path'];
            
            // Get the directory path
            $directoryPath = dirname($path);
            
            // Get the folder name immediately preceding the basename
            $precedingFolder = basename($directoryPath);
     
            $result[] = str_replace('.php', '', $precedingFolder. "\\" .basename($file));
        }
        return $result;
    }

    public static function isSuperadmin(){
        return Session::get('admin_is_superadmin');
    }

    public static function myId(){
        return Session::get('admin_id');
    }

    public static function myPrivilegeId()
    {
        return Session::get('admin_privileges');
    }

    public static function myThemeColor()
    {
        return Session::get('theme_color');
    }

    public static function sidebarDashboard(){
        $menu = DB::table('adm_menuses')->where('is_dashboard', 1)->where('is_active', 1)->first();
        if($menu){
            switch ($menu->type) {
                case 'Route':
                    $url = route($menu->path);
                    break;
                default:
                case 'URL':
                    $url = $menu->path;
                    break;
                case 'Controller & Method':
                    $url = action($menu->path);
                    break;
                case 'Module':
                case 'Statistic':
                    $url = self::adminPath($menu->path);
                    break;
            }
            @$menu->url = $url;
        }
    
        return $menu;
    }


    public static function adminPath($path = null)
    {
        return url(config('ad_url.ADMIN_PATH').'/'.$path);
    }

    

    //ADMIN
    public static function routeController($prefix, $controller, $namespace = null){
        $prefix = trim($prefix, '/').'/';
        $namespace = ($namespace) ?: 'App\Http\Controllers\Admin';
   
        try {
            Route::get($prefix, ['uses' => $controller.'@getIndex', 'as' => $controller.'GetIndex']);

            $controller_class = new \ReflectionClass($namespace.'\\'.$controller);
            $controller_methods = $controller_class->getMethods(\ReflectionMethod::IS_PUBLIC);
            $wildcards = '/{one?}/{two?}/{three?}/{four?}/{five?}';
            foreach ($controller_methods as $method) {

                if ($method->class != 'Illuminate\Routing\Controller' && $method->name != 'getIndex') {
                    if (substr($method->name, 0, 3) == 'get') {
                        $method_name = substr($method->name, 3);
                        $slug = array_filter(preg_split('/(?=[A-Z])/', $method_name));
                        $slug = strtolower(implode('-', $slug));
                        $slug = ($slug == 'index') ? '' : $slug;
                        Route::get($prefix.$slug.$wildcards, ['uses' => $controller.'@'.$method->name, 'as' => $controller.'Get'.$method_name]);
                    } elseif (substr($method->name, 0, 4) == 'post') {
                        $method_name = substr($method->name, 4);
                        $slug = array_filter(preg_split('/(?=[A-Z])/', $method_name));
                        Route::post($prefix.strtolower(implode('-', $slug)).$wildcards, [
                            'uses' => $controller.'@'.$method->name,
                            'as' => $controller.'Post'.$method_name,
                        ]);
                    }
                }
            }
        } catch (\Exception $e) {

        }
    }
    //ROUTE
    public static function routeLivewireController($prefix, $controller, $namespace = null){
        $prefix = trim($prefix, '/').'/';
        $namespace = ($namespace) ?: 'App\Livewire\Component\ModuleContents';
   
        try {
            Route::get($prefix, ['uses' => $controller.'@index', 'as' => $controller.'GetIndex']);

            $controller_class = new \ReflectionClass($namespace.'\\'.$controller);
            $controller_methods = $controller_class->getMethods(\ReflectionMethod::IS_PUBLIC);
            $wildcards = '/{one?}/{two?}/{three?}/{four?}/{five?}';
            foreach ($controller_methods as $method) {
                if ($method->class != 'Illuminate\Routing\Controller' && $method->name != 'index') {
                    if (substr($method->name, 0, 3) == 'get') {
                        $method_name = substr($method->name, 3);
                        $slug = array_filter(preg_split('/(?=[A-Z])/', $method_name));
                        $slug = strtolower(implode('-', $slug));
                        $slug = ($slug == 'index') ? '' : $slug;
                        Route::get($prefix.$slug.$wildcards, ['uses' => $controller.'@'.$method->name, 'as' => $controller.'Get'.$method_name]);
                    } elseif (substr($method->name, 0, 4) == 'post') {
                        $method_name = substr($method->name, 4);
                        $slug = array_filter(preg_split('/(?=[A-Z])/', $method_name));
                        Route::post($prefix.strtolower(implode('-', $slug)).$wildcards, [
                            'uses' => $controller.'@'.$method->name,
                            'as' => $controller.'Post'.$method_name,
                        ]);
                    }
                }
            }
        } catch (\Exception $e) {

        }
    }

    //OTHER ROUTE
    public static function routeOtherController($prefix, $controller, $namespace = null){
        $prefix = trim($prefix, '/').'/';
        $namespace = ($namespace) ?: 'App\Http\Controllers';
   
        try {
            Route::get($prefix, ['uses' => $controller.'@getIndex', 'as' => $controller.'GetIndex']);

            $controller_class = new \ReflectionClass($namespace.'\\'.$controller);
            $controller_methods = $controller_class->getMethods(\ReflectionMethod::IS_PUBLIC);
            $wildcards = '/{one?}/{two?}/{three?}/{four?}/{five?}';
            foreach ($controller_methods as $method) {

                if ($method->class != 'Illuminate\Routing\Controller' && $method->name != 'getIndex') {
                    if (substr($method->name, 0, 3) == 'get') {
                        $method_name = substr($method->name, 3);
                        $slug = array_filter(preg_split('/(?=[A-Z])/', $method_name));
                        $slug = strtolower(implode('-', $slug));
                        $slug = ($slug == 'index') ? '' : $slug;
                        Route::get($prefix.$slug.$wildcards, ['uses' => $controller.'@'.$method->name, 'as' => $controller.'Get'.$method_name]);
                    } elseif (substr($method->name, 0, 4) == 'post') {
                        $method_name = substr($method->name, 4);
                        $slug = array_filter(preg_split('/(?=[A-Z])/', $method_name));
                        Route::post($prefix.strtolower(implode('-', $slug)).$wildcards, [
                            'uses' => $controller.'@'.$method->name,
                            'as' => $controller.'Post'.$method_name,
                        ]);
                    }
                }
            }
        } catch (\Exception $e) {

        }
    }

    public static function isCreate(){
        if (self::isSuperadmin()) {
            return true;
        }

        $session = Session::get('admin_privileges_roles');
        if($session){
            foreach ($session as $v) {
                if ($v->path == self::getModulePath()) {
                    return (bool) $v->is_create;
                }
            }
        }
        
    }

    public static function isView(){
        if (self::isSuperadmin()) {
            return true;
        }

        $session = Session::get('admin_privileges_roles');
        if($session){
            foreach ($session as $v) {
                if ($v->path == self::getModulePath()) {
                    return (bool) $v->is_visible;
                }
            }
        }
        
    }

    public static function isUpdate(){
        if (self::isSuperadmin()) {
            return true;
        }
    
        $session = Session::get('admin_privileges_roles');
        if($session){
            foreach ($session as $v) {
                if ($v->path == self::getModulePath()) {
                    return (bool) $v->is_edit;
                }
            }
        }
        
    }

    public static function isRead(){
        if (self::isSuperadmin()) {
            return true;
        }

        $session = Session::get('admin_privileges_roles');
        if($session){
            foreach ($session as $v) {
                if ($v->path == self::getModulePath()) {
                    return (bool) $v->is_read;
                }
            }
        }
        
    }

    public static function isDelete(){
        if (self::isSuperadmin()) {
            return true;
        }

        $session = Session::get('admin_privileges_roles');
        if($session){
            foreach ($session as $v) {
                if ($v->path == self::getModulePath()) {
                    return (bool) $v->is_delete;
                }
            }
        }
    }


    public static function getModulePath(){
        // Check to position of admin_path
        if(config("ad.ADMIN_PATH")) {
            $adminPathSegments = explode('/', Request::path());
            $no = 1;
            foreach($adminPathSegments as $path) {
                if($path == config("ad.ADMIN_PATH")) {
                    $segment = $no+1;
                    break;
                }
                $no++;
            }
        } else {
            $segment = 1;
        }

        return Request::segment($segment);
    }

    public static function getCurrentModule()
    {
        $modulepath = self::getModulePath();

        if (Cache::has('moduls_'.$modulepath)) {
            return Cache::get('moduls_'.$modulepath);
        } else {

            $module = DB::table('adm_modules')->where('path', self::getModulePath())->first();

            //supply modulpath instead of $module incase where user decides to create form and custom url that does not exist in cms_moduls table.
            return ($module)?:$modulepath;
        }
    }

    public static function getCurrentMenu()
        {
            return AdmMenus::where('slug', self::getModulePath())->first()
                ?: AdmAdminMenus::where('slug', self::getModulePath())->first();
        }

    public static function getCurrentMethod()
    {
        $action = str_replace("App\Http\Controllers\Admin", "", Route::currentRouteAction());
        $atloc = strpos($action, '@') + 1;
        $method = substr($action, $atloc);

        return $method;
    }

    public static function mainpath($path = null)
    {

        $controllername = str_replace(["\app\Http\Controllers\\", "App\Http\Controllers\\"], "", strtok(Route::currentRouteAction(), '@'));
        $route_url = route($controllername.'GetIndex');

        if ($path) {
            if (substr($path, 0, 1) == '?') {
                return trim($route_url, '/').$path;
            } else {
                return $route_url.'/'.$path;
            }
        } else {
            return trim($route_url, '/');
        }
    }

    public static function livewiremainpath($path = null)
    {

        $controllername = str_replace(["\app\Livewire\Component\ModuleContents\\", "App\Livewire\Component\ModuleContents\\"], "", strtok(Route::currentRouteAction(), '@'));
        $route_url = route($controllername.'GetIndex');

        if ($path) {
            if (substr($path, 0, 1) == '?') {
                return trim($route_url, '/').$path;
            } else {
                return $route_url.'/'.$path;
            }
        } else {
            return trim($route_url, '/');
        }
    }

    public static function redirectBack($message, $type = 'warning')
    {
        if (Request::ajax()) {
            $resp = response()->json(['message' => $message, 'message_type' => $type, 'redirect_url' => $_SERVER['HTTP_REFERER']])->send();
            exit;
        } else {
            $resp = redirect()->back()->with(['message' => $message, 'message_type' => $type]);
            Session::driver()->save();
            $resp->send();
            exit;
        }
    }

    public static function redirect($to, $message, $type = 'warning')
    {

        if (Request::ajax()) {
            $resp = response()->json(['message' => $message, 'message_type' => $type, 'redirect_url' => $to])->send();
            exit;
        } else {
            $resp = redirect($to)->with(['message' => $message, 'message_type' => $type]);
            Session::driver()->save();
            $resp->send();
            exit;
        }

    }

    public static function deleteConfirm($redirectTo)
    {
        echo "swal({   
				title: \"".trans('ad_default.delete_title_confirm')."\",   
				text: \"".trans('ad_default.delete_description_confirm')."\",   
				type: \"warning\",   
				showCancelButton: true,   
				confirmButtonColor: \"#ff0000\",   
				confirmButtonText: \"".trans('ad_default.confirmation_yes')."\",  
				cancelButtonText: \"".trans('ad_default.confirmation_no')."\",  
				closeOnConfirm: false }, 
				function(){  location.href=\"$redirectTo\" });";
    }

    public static function insertLog($description, $details = '') {
        $a                 = array();
        $a['created_at']   = date('Y-m-d H:i:s');
        $a['ipaddress']    = $_SERVER['REMOTE_ADDR'];
        $a['useragent']    = $_SERVER['HTTP_USER_AGENT'];
        $a['url']          = Request::url();
        $a['description']  = $description;
        $a['details']      = $details;
        $a['id_adm_users']  = self::myId();
        DB::table('adm_logs')->insert($a);    
    }

    public static function sendNotification($config = [])
    {
        $content = $config['content'];
        $to = $config['to'];
        $id_adm_users = $config['id_adm_users'];
        $type = $config['type'];
        $id_adm_users = ($id_adm_users) ?: [self::myId()];
        foreach ($id_adm_users as $id) {
            $a = [];
            $a['created_at'] = date('Y-m-d H:i:s');
            $a['adm_user_id'] = $id;
            $a['type'] = $type;
            $a['content'] = $content;
            $a['is_read'] = 0;
            $a['url'] = $to;
            DB::table('adm_notifications')->insert($a);
        }

        return true;
    }

    public static function getEtpConnectionConfig()
    {
        $creds = null;
        try {
            $creds = DB::table('etp_creds')->first();
        } catch (\Throwable $e) {
            // ignore if not available
        }

        return [
            'driver' => 'sqlsrv',
            'host' => $creds->etp_ip ?? env('DB_HOST_ETP', 'localhost'),
            'port' => 1433,
            'database' => $creds->etp_database_name ?? env('DB_DATABASE_ETP', 'forge'),
            'username' => env('DB_USERNAME_ETP', 'forge'),
            'password' => env('DB_DATABASE_PASSWORD_ETP', ''),
            'charset' => 'utf8',
            'prefix' => '',
            'prefix_indexes' => true,
            'trust_server_certificate' => true,
        ];
    }

}