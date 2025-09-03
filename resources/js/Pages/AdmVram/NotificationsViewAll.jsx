import React, { useContext, useEffect, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ContentPanel from '../../Components/Table/ContentPanel';
import { NavbarContext } from '../../Context/NavbarContext';
import { CheckCircle, CircleX, Info, TriangleAlert, Bell, CheckCheck, X, ChevronsRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useTheme } from '../../Context/ThemeContext';
import useThemeStyles from '../../Hooks/useThemeStyles';
import axios from 'axios';
import { useToast } from '../../Context/ToastContext';

const NotificationsViewAll = ({ page_title, notifications }) => {
    const { setTitle } = useContext(NavbarContext);
    const { theme } = useTheme();
    const { textColor } = useThemeStyles(theme);
    const { handleToast } = useToast();

    const [notifs, setNotifs] = useState(notifications);

    const [selectedNotif, setSelecetedNotif] = useState({
        id: "",
        adm_user_id: "",
        type: "",
        title: "",
        content: "",
        is_read: "",
        url: "",
        created_at: "",
        updated_at: "",
    })

    const createdAt = selectedNotif.created_at ? new Date(selectedNotif.created_at) : null;
    const selectedCreateTimeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

    useEffect(() => {
        setTitle(page_title);
    }, [page_title, setTitle]);

    const truncateText = (text, maxLength) => {
        if (!text) return '';
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    const markAllAsRead = async () => {
        try {
            await axios.post(
                '/notifications/read_all',
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer your_access_token',
                    },
                }
            );

            setNotifs((prev) =>
                prev.map((notif) => ({ ...notif, is_read: 1 }))
            );

        } catch (error) {
            handleToast('Failed to update notification automatically', 'error');
        }
    };

    const markAsRead = async ($id, $index) => {
        try {
            await axios.post(
                '/notifications/read',
                { notification_id: $id },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer your_access_token',
                    },
                }
            );

            setNotifs((prev) =>
                prev.map((notif, i) =>
                    i === $index ? { ...notif, is_read: 1 } : notif
                )
            );

        } catch (error) {
            handleToast('Failed to update notification automatically', 'error');
        }
    };

    return (
        <>
            <Head title={page_title} />
            <ContentPanel>
                <div className='flex flex-col md:flex-row select-none space-y-3 md:space-y-0 h-[70vh]'>
                    <div className='flex flex-col border rounded-lg md:w-[30%]'>
                        <div className='flex items-center border-b px-2.5 py-3.5'>
                            <Bell className='w-5 h-5 text-gray-600 mr-2'/>
                            <span className='font-semibold'>Notifications</span>
                        </div>
                        <div className='space-y-2 p-2 flex-1'>
                            {notifications.length !== 0 ? 
                                (notifs.map((notification, index) =>{
                                    const createdAt = new Date(notification?.created_at);
                                    const CreatedtimeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

                                    return  <button className={`flex p-2 ${theme == 'bg-skin-blue' ? 'hover:bg-gray-100' : 'hover:bg-white/10'} ${selectedNotif.id == notification.id && 'bg-gray-100'} w-full  items-center rounded-md`} key={index}
                                                onClick={()=>{
                                                    setSelecetedNotif({
                                                        id: notification.id,
                                                        adm_user_id: notification.adm_user_id,
                                                        type: notification.type,
                                                        title: notification.title,
                                                        content: notification.content,
                                                        is_read: notification.is_read,
                                                        url: notification.url,
                                                        created_at: notification.created_at,
                                                        updated_at: notification.updated_at,
                                                    });
                                                    markAsRead(notification.id, index);
                                                }}>
                                                <div className='px-2 mb-4'>
                                                    {notification?.type === 'info' && <Info className='w-4 h-4 text-blue-500'/>}
                                                    {notification?.type === 'success' && <CheckCircle className='w-4 h-4 text-green-500'/>}
                                                    {notification?.type === 'error' && <CircleX className='w-4 h-4 text-red-500'/>}
                                                    {notification?.type === 'warning' && <TriangleAlert className='w-4 h-4 text-yellow-500'/>}
                                                </div>
                                                <div className='flex-1 ml-1 flex flex-col items-start'>
                                                    <p className={`text-xs font-medium ${notification?.is_read == 0 ? textColor : 'text-gray-500'}`}>{notification?.title}</p>
                                                    <p className='text-[10px] text-start text-gray-600'>{truncateText(notification?.content, 50)}</p>
                                                    <p className='text-[8px] md:text-[10px] text-gray-400'>{CreatedtimeAgo}</p>
                                                </div>
                                                {notification?.is_read == 0 && <div className='w-1.5 h-1.5 bg-green-500 rounded-full mr-1'/>}
                                            </button>
                                   
                                   
                                })) 
                                :
                                <div className='h-full border border-dashed rounded-md py-5 items-center justify-center flex flex-col'>
                                    <img className='w-10 h-10' src='/images/others/notification-bell.png'/>
                                    <p className={`text-xs ${textColor}`}>You have no notification</p>
                                </div>
                            }
                        </div>
                        <div className='border-t p-2 justify-end flex'>
                            <button className='flex px-3 rounded-md items-center py-2 border hover:bg-gray-100' onClick={()=> markAllAsRead()}>
                                <CheckCheck className='w-3 h-3 mr-1'/>
                                <span className='text-[10px]'>Mark all as read</span>
                            </button>
                        </div>
                    </div>
                    <div className='border p-3 rounded-lg md:w-[70%] h-full md:ml-2'>
                        {selectedNotif.id ? 
                            <>
                                <div className='flex items-center'>
                                    <div className='flex-1'>
                                        <p className='font-semibold'>{selectedNotif?.title}</p>
                                        <p className='text-[10px] md:text-xs text-gray-400'>Received: {selectedCreateTimeAgo}</p>
                                    </div>
                                    <div className=''>
                                        {selectedNotif?.type === 'info' && <Info className='w-6 h-6 text-blue-500'/>}
                                        {selectedNotif?.type === 'success' && <CheckCircle className='w-6 h-6 text-green-500'/>}
                                        {selectedNotif?.type === 'error' && <CircleX className='w-6 h-6 text-red-500'/>}
                                        {selectedNotif?.type === 'warning' && <TriangleAlert className='w-6 h-6 text-yellow-500'/>}
                                    </div>
                                    
                                </div>
                                <div className='bg-gray-100 mt-5 p-3 rounded-md flex flex-col'>
                                    <p className='text-xs text-gray-700'>{selectedNotif?.content}</p>
                                    {selectedNotif.url && <Link href={selectedNotif.url} className='justify-end text-gray-600 text-xs flex mt-3 items-center'>Go to Link <ChevronsRight className=' ml-2 w-3 h-3'/></Link>}
                                </div>
                            </>
                            :
                            <>
                                <div className='flex flex-col h-full'>
                                    <div>
                                        <p className='font-semibold'>No notification selected</p>
                                        <p className='text-[10px] md:text-xs text-gray-400'>Click on a notification to view details</p>
                                    </div>
                                    <div className='flex flex-col items-center justify-center h-full'>
                                        <div className='bg-gray-200 rounded-full p-4 mb-4'>
                                            <Bell className='h-10 w-10 text-gray-600'/>
                                        </div>
                                        <p className='text-xs'>Select a notification from the list to view its details here</p>
                                    </div>
                                </div>
                            </>
                        }
                        
                    </div>
                </div>
            </ContentPanel>
        </>
    );
};

export default NotificationsViewAll;
