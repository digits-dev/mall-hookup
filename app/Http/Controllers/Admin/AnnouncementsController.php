<?php

namespace App\Http\Controllers\Admin; 
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AdmModels\AdmLogs;
use Inertia\Inertia;
use App\Models\Announcement;
use App\Models\AdmUser;
use App\Models\AnnouncementUser;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;
class AnnouncementsController extends Controller{

    private $sortBy;
    private $sortDir;
    private $perPage;

    public function __construct() {
        $this->sortBy = request()->get('sortBy', 'announcements.created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
    }

    public function getAllData(){
        $query = Announcement::query()->with(['getCreatedBy', 'getUpdatedBy']);
        $filter = $query->searchAndFilter(request());
        $result = $filter->orderBy($this->sortBy, $this->sortDir);
        return $result;
    }

    public function getIndex(){

        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }

        $data = [];
        $data['page_title'] = 'Announcements';
        $data['queryParams'] = request()->query();
        $data['announcements'] = self::getAllData()->paginate($this->perPage)->withQueryString();

        $data['announcements']->getCollection()->transform(function ($item) {
            $jsonData = json_decode($item->json_data, true) ?? [];

            $item->json_data = $jsonData; 
            return $item;
        });

        return Inertia::render('AdmVram/Announcements/AnnouncementPage', $data);
    }

    // CREATE ANNOUNCEMENT

    public function addAnnouncementForm(){
        if (!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }
        $data = [];
        $data['page_title'] = "Add Announcement";
        $data['action'] = 'Create';
        return Inertia::render('AdmVram/Announcements/AnnouncementForm',$data);
    }

    public function createAnnouncement(Request $request){
        
        $request->validate([
            'name' => 'required|string|unique:announcements,name',
            'title' => 'required|string',
            'description' => 'required|string',
            'variant' => 'required',
            'size' => 'required',
        ]);

        try {

            DB::beginTransaction();

            $data = $data = Arr::except($request->all(), ['id']);
            $file = $request->file('image');
            
            if ($file){

                $fileName = time() . '_' . $file->getClientOriginalName();
                $path = $file->storeAs('announcement_images', $fileName, 'public');
                $data['image'] = $path;
            
            }

            $announcement = Announcement::create([
                'name' => $request->name,
                'json_data' => json_encode($data),
                'status' => 'ACTIVE',
            ]);

            Announcement::where('id', '!=', $announcement->id)
            ->update(['status' => 'INACTIVE']);


            $activeUsers = AdmUser::where('status', 'ACTIVE')->get();

            foreach ($activeUsers as $user) {
                AnnouncementUser::create([
                    'announcement_id' => $announcement->id,
                    'adm_user_id'     => $user->id,
                    'is_read'         => 0,
                ]);
            }

            DB::commit();

            return redirect('announcements')->with(['message' => 'Announcement Creation Success!', 'type' => 'success']);

        }

        catch (\Exception $e) {
            DB::rollBack();
            CommonHelpers::LogSystemError('Announcements', $e->getMessage());
            return back()->with(['message' => 'Announcement Creation Failed!', 'type' => 'error']);
        }

    }

    // UPDATE ANNOUNCEMENT

    public function editAnnouncementForm($id){
        if (!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }

        $data = [];
        $data['page_title'] = "Add Announcement";
        $data['action'] = 'Update';
        $data['update_data'] = Announcement::find($id);

        if ($data['update_data']) {
            $jsonData = json_decode($data['update_data']->json_data, true) ?? [];
            $data['update_data']->json_data = $jsonData;
        }

        return Inertia::render('AdmVram/Announcements/AnnouncementForm',$data);
    }

    public function updateAnnouncement(Request $request){

        $request->validate([
            'name' => 'required|string',
            'title' => 'required|string',
            'description' => 'required|string',
            'variant' => 'required',
            'size' => 'required',
        ]);

        try {

            DB::beginTransaction();

            $announcement = Announcement::find($request->id);
            $data = Arr::except($request->all(), ['id']);
            $file = $request->file('image');


            $announcementNameExist = Announcement::where('name', $request->name)->exists();

            if ($request->name !== $announcement->name) {
                if (!$announcementNameExist) {
                    $announcement->name = $request->name;
                } else {
                    return back()->withErrors(['name' => 'Announcement Name already exists!']);
                }
            }
    
            if ($file){
                if ($announcement->image !== $request->image){
                    $fileName = time() . '_' . $file->getClientOriginalName();
                    $path = $file->storeAs('announcement_images', $fileName, 'public');
                    $data['image'] = $path;
                }
            }

            $announcement->json_data = json_encode($data);
            $announcement->save();

            DB::commit();

            return redirect('announcements')->with(['message' => 'Announcement Update Success!', 'type' => 'success']);

        }

        catch (\Exception $e) {
            DB::rollBack();
            CommonHelpers::LogSystemError('Announcements', $e->getMessage());
            return back()->with(['message' => 'Announcement Update Failed!', 'type' => 'error']);
        }
       
    }

    public function updateAnnouncementIsread(){

        $announcement = Announcement::where('status', 'ACTIVE')->first();
        $announcementUser = AnnouncementUser::where('announcement_id', $announcement->id)
            ->where('adm_user_id', CommonHelpers::myId())
            ->first();

        $announcementUser->is_read = 1;
        $announcementUser->save();

        Session::put('unread_announcement', false);

        return response()->json(['message' => 'Session updated']);
    }

}

?>