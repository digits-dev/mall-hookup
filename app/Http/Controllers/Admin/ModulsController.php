<?php

namespace App\Http\Controllers\Admin;
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\AdmModels\AdmModules;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;
// use File;
use Inertia\Inertia;

class ModulsController extends Controller{
 
    private $sortBy;
    private $sortDir;
    private $perPage;

    public function __construct() {
        $this->sortBy = request()->get('sortBy', 'adm_modules.id');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
    }

    public function getAllData(){
        $query = AdmModules::query();
        $filter = $query->searchAndFilter(request());
        $result = $filter->orderBy($this->sortBy, $this->sortDir);
        return $result;
    }

    public function getIndex(){

        $data = [];
        $data['tableName'] = 'adm_modules';
        $data['page_title'] = 'Module Generator';
        $data['modules'] = self::getAllData()->paginate($this->perPage)->withQueryString();
        $data['queryParams'] = request()->query();
        $data['database_tables'] = self::getAllTables();

        
        return Inertia::render('AdmVram/ModuleGenerator/ModuleGenerator', $data);
    }
    

    public function createModule(Request $request){

        $request->validate([
            'table_name' => 'required',
            'name' => 'required',
            'path' => 'required',
            'icon' => 'required',
        ]);

        if (!CommonHelpers::isCreate()) {
            return Inertia::render('Errors/RestrictionPage');
        }
             //CREATE FILE
            $viewFolderName = str_replace(' ', '', ucwords(str_replace('_', ' ', $request->table_name)));
            $folderName = $viewFolderName;
            $contentName = $viewFolderName.'Controller';
     
            if(file_exists(base_path('app/Http/Controllers/'.$folderName.'/'.$contentName.'.php'))){
                return back()->with(['message' => 'Controller already exist', 'type' => 'error']);
   
            }else{
                //MAKE FOLDER
                $folder = base_path('app/Http/Controllers/'.$folderName);
                File::makeDirectory($folder, $mode = 0777, true, true);
                //MAKE FILE CONTENT
                $path = base_path("app/Http/Controllers/$folderName/");
                $php = self::controllerContent($contentName,$folderName);
                $php = trim($php);
                file_put_contents($path.$contentName.'.php', $php);
                //MAKE FOLDER VIEW CONTENT
                $makeFolderViewContent = base_path('resources/js/Pages/'.$folderName);
                File::makeDirectory($makeFolderViewContent, $mode = 0777, true, true);

                //MAKE FILE CONTROLLER
                $pathViewController = base_path("resources/js/Pages/".$folderName."/");
                $viewContent = self::viewContent($folderName);
                $viewContent = trim($viewContent);
                file_put_contents($pathViewController.$folderName.'.jsx', $viewContent);

                //CREATE MODULE
                DB::table('adm_modules')->updateOrInsert([
                        'name'         => $request->name,
                        'path'         => $request->path,
                        'controller'   => $folderName."\\".$contentName
                    ],
                    [
                        'name'         => $request->name,
                        'icon'         => $request->icon,
                        'path'         => $request->path,
                        'table_name'   => $request->table_name,
                        'controller'   => $folderName."\\".$contentName,
                        'is_protected' => 0,
                        'is_active'    => 1,
                        'created_at'   => date('Y-m-d H:i:s')
                    ]
                );
                //CREATE MENUS
                $isExist = DB::table('adm_menuses')->where('name',$request->name)->where('path',$folderName."\\".$contentName.'GetIndex')->exists();
                if(!$isExist){
                    $menusId = DB::table('adm_menuses')->insertGetId([
                        'name'                => $request->name,
                        'type'                => 'Route',
                        'icon'                => $request->icon,
                        'path'                => $folderName."\\".$contentName.'GetIndex',
                        'slug'                => $request->path,
                        'color'               => NULL,
                        'parent_id'           => 0,
                        'is_active'           => 1,
                        'is_dashboard'        => 0,
                        'id_adm_privileges'    => 1,
                        'sorting'             => 0,
                        'created_at'          => date('Y-m-d H:i:s')
                    ]);
                    //CREATE MENUS PRIVILEGE
                    DB::table('adm_menus_privileges')->insert(['id_adm_menus' => $menusId, 'id_adm_privileges' => CommonHelpers::myPrivilegeId()]);
                }
            }

            return back()->with(['message' => 'Module Creation Success!', 'type' => 'success']);
    }

    public function controllerContent($controllerName, $finalViewFileName){
            $content = '<?php
                            namespace App\Http\Controllers\\' . $finalViewFileName . ';
                            use App\Helpers\CommonHelpers;
                            use App\Http\Controllers\Controller;
                            use Illuminate\Http\Request;
                            use Illuminate\Http\RedirectResponse;
                            use Illuminate\Support\Facades\Auth;
                            use Illuminate\Support\Facades\Session;
                            use Inertia\Inertia;
                            use Inertia\Response;
                            use DB;

                            class '.$controllerName.' extends Controller{
                                public function getIndex(){
                                    return Inertia::render("'.$finalViewFileName.'/'.$finalViewFileName.'");
                                }
                            }
                        ?>';

            return $content;
    }

    public function viewContent($name){
        $content = "
                    import { Head, Link, router, usePage } from '@inertiajs/react';
                    import React, { useState } from 'react';
                    import ContentPanel from '../../Components/Table/ContentPanel';
                    const ".$name." = () => {
                        return(
                            <>
                                <ContentPanel>
                                    <div>This is ".$name." module table area</div>
                                </ContentPanel>
                            </>
                        );
                    };

                    export default ".$name.";
                    ";
        return $content;
    }

    public function getAllTables()
    {
        $databaseName = config('database.connections.mysql.database');
        $tables = DB::select("SELECT table_name FROM information_schema.tables WHERE table_schema = ?", [$databaseName]);
    
        $database_tables = [];
    
        $excludedTables = [  
            'adm_logs',
            'adm_admin_menuses',
            'adm_menus_privileges',
            'adm_embedded_dashboard_privileges',
            'adm_menuses',
            'adm_modules',
            'adm_privileges',
            'adm_embedded_dashboards',
            'adm_notifications',
            'adm_privileges_roles',
            'adm_settings',
            'failed_jobs',
            'jobs',
            'password_reset_tokens',
            'personal_access_tokens',
            'job_batches',
            'migrations',
            'adm_password_histories',
            'adm_user_profiles',
            'adm_users',
            'announcement_user',
            'announcements',
            'api_configurations',
            'api_keys',
            'api_logs',
            'api_rate_limits',
        ];
    
        foreach ($tables as $table) {
            $tableName = $table->TABLE_NAME;
    
            // Skip if table is in excluded list
            if (in_array($tableName, $excludedTables)) {
                continue;
            }
    
            $database_tables[] = [
                'label' => $tableName,
                'value' => $tableName
            ];
        }
    
        return $database_tables;
    }

}

?>