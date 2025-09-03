<?php

namespace App\Http\Controllers\Admin; 
use App\Helpers\CommonHelpers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AdmModels\AdmNotifications;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
class NotificationsController extends Controller{

    private $sortBy;
    private $sortDir;
    private $perPage;

    public function __construct() {
        $this->sortBy = request()->get('sortBy', 'adm_notifications.created_at');
        $this->sortDir = request()->get('sortDir', 'desc');
        $this->perPage = request()->get('perPage', 10);
    }

    public function getAllData(){
        $query = AdmNotifications::query()->with(['user']);
        $filter = $query->searchAndFilter(request());
        $result = $filter->orderBy($this->sortBy, $this->sortDir);
        return $result;
    }

    public function getIndex(){

        if(!CommonHelpers::isView()) {
            return Inertia::render('Errors/RestrictionPage');
        }

        $data = [];
        $data['tableName'] = 'adm_notifications';
        $data['page_title'] = 'Notifications';
        $data['adm_notifications'] = self::getAllData()->paginate($this->perPage)->withQueryString();
        $data['queryParams'] = request()->query();
    
        return Inertia::render('AdmVram/Notifications',$data);
    }

    public function markAsRead(Request $request)
    {
        $notification = AdmNotifications::where('id', $request['notification_id'])
            ->where('adm_user_id', CommonHelpers::myId())
            ->firstOrFail();
        
        $notification->update(['is_read' => true]);
        return json_encode(['message'=>'Read successfully!', 'status'=>'success']);
    }

    public function markAllAsRead(Request $request)
    {
        $query = AdmNotifications::where('adm_user_id', CommonHelpers::myId());

        if ($query->exists()) {
            $query->update(['is_read' => true]);
        }
    }

    public function viewNotification($id){
        $data = [];
        $data['page_title'] = 'View Notification';
        $data['notification'] = AdmNotifications::where('id', $id)->firstOrFail();
        return Inertia::render('AdmVram/NotificationView', $data);
    }

    public function viewAllNotification(Request $request){
        $data = [];
        $data['page_title'] = 'View All Notification';
        $data['notifications'] = AdmNotifications::where('adm_user_id', CommonHelpers::myId())->get();
        return Inertia::render('AdmVram/NotificationsViewAll', $data);
    }

}

?>