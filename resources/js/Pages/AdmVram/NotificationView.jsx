import React, { useContext, useEffect } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import ContentPanel from '../../Components/Table/ContentPanel';
import { NavbarContext } from '../../Context/NavbarContext';
import { formatDistanceToNowStrict } from 'date-fns';
import { CheckCircle, ChevronsRight, CircleX, Info, TriangleAlert } from 'lucide-react';
import Button from '../../Components/Table/Buttons/Button';
import { useTheme } from '../../Context/ThemeContext';
import useThemeStyles from '../../Hooks/useThemeStyles';


const NotificationsView = ({ page_title, notification }) => {
    const { setTitle } = useContext(NavbarContext);
    const { theme } = useTheme();
    const { textColor, primayActiveColor,  textColorActive} = useThemeStyles(theme);
    useEffect(() => {
        setTimeout(()=>{
            setTitle(page_title);
        });
    }, [page_title]);

    const createdAt = new Date(notification?.created_at);
    const updateAt = notification?.updated_at ? new Date(notification?.updated_at) : null;
    const CreatedtimeAgo = formatDistanceToNowStrict(createdAt, { addSuffix: true });
    const UpdatedtimeAgo = formatDistanceToNowStrict(updateAt, { addSuffix: true });


    return (
    <>
        <Head title={page_title} />
        <ContentPanel>
            <div className='border-[1px] p-4 rounded-md'>
                <div className='flex items-center'>
                    <div className='flex-1'>
                        <p className='font-semibold'>{notification?.title}</p>
                        <p className='text-[10px] md:text-xs text-gray-400'>Received: {CreatedtimeAgo}</p>
                    </div>
                    <div className=''>
                        {notification?.type === 'info' && <Info className='w-6 h-6 text-blue-500'/>}
                        {notification?.type === 'success' && <CheckCircle className='w-6 h-6 text-green-500'/>}
                        {notification?.type === 'error' && <CircleX className='w-6 h-6 text-red-500'/>}
                        {notification?.type === 'warning' && <TriangleAlert className='w-6 h-6 text-yellow-500'/>}
                    </div>
                </div>
                <div className='bg-gray-100 mt-5 p-3 rounded-md'>
                    <p className='text-xs text-gray-700'>{notification?.content}</p>
                    {notification.url && <Link href={notification.url} className='justify-end text-gray-600 text-xs flex mt-3 items-center'>Go to Link <ChevronsRight className=' ml-2 w-3 h-3'/></Link>}
                </div>
                <div className="flex space-x-1 justify-end mt-4">
                  <Button
                      type="link"
                      href="/dashboard"
                      extendClass={`${theme === "bg-skin-white"? primayActiveColor: theme}`}
                      fontColor={textColorActive}
                  >
                    <span>Go to Dashboard</span>
                  </Button>
                  <Button
                      type="link"
                      href="/notifications/view_all"
                      extendClass={`${theme === "bg-skin-white"? primayActiveColor: theme}`}
                      fontColor={textColorActive}
                  >
                    <span>View All Notifications</span>
                  </Button>
              </div>
            </div>
        </ContentPanel>
    </>
    );
};

export default NotificationsView;
