import React, { useEffect, useRef, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import { useTheme } from '../../Context/ThemeContext';
import Button from '../../Components/Table/Buttons/Button';
import colorMap from '../../Components/Notification/ColorMap';
import axios from 'axios';
import useThemeStyles from '../../Hooks/useThemeStyles';
import getAppName from '../../Components/SystemSettings/ApplicationName';
import getAppLogo from '../../Components/SystemSettings/ApplicationLogo';
import useThemeSwalColor from '../../Hooks/useThemeSwalColor';
import Modalv2 from '../../Components/Modal/Modalv2';
import ThemeToggleSwitch from '../../Components/Table/Buttons/ThemeToggleSwitch';
import { Bell } from 'lucide-react';
import NotificationCard from '../../Components/Notification/NotificationCard';
const AppNavbar = () => {
    const { auth } = usePage().props;
    const [showMenu, setShowMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState(auth.notifications || []);
    const [unreadnNotifications, setUnreadnNotifications] = useState(auth.unread_notifications || false);
    const menuRef = useRef(null);
    const {theme, setTheme} = useTheme();
    const {bgColor, calendarDateTimeColor, textColor, textColorActive, borderColor, primayActiveColor } = useThemeStyles(theme);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [showDateTime, setShowDateTime] = useState(false);
    const [appname, setAppname] = useState('');
    const [applogo, setApplogo] = useState('');
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        getAppName().then(appName => {
            setAppname(appName);
        });
        getAppLogo().then(appLogo => {
            setApplogo(appLogo);
        });
    }, [getAppName, getAppLogo]);

    useEffect(() => {
        setNotifications(auth.notifications || []);
      }, [auth.notifications]);

    useEffect(() => {
        setUnreadnNotifications(auth.unread_notifications || false);
    }, [auth.unread_notifications]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDate(new Date());
        }, 1000);

        return () => clearInterval(interval); 
    }, []);

  
   
    const readNotification = async (e, id) => {
        try {
            await axios.post('/notifications/read', {
                notification_id: id,
            });
          
            setNotifications((prevNotifications) =>
                prevNotifications.map((notification) =>
                    notification.id === id ? { ...notification, is_read: true } : notification
                )
            );
            setUnreadnNotifications((prevCount) => Math.max(prevCount - 1, 0));
        } catch (error) {
            console.error('Failed to mark as read:', error.response?.data || error.message);
        }
    };


    


    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setShowMenu(false);
            setShowNotifications(false);
            setShowDateTime(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogoutModalToggle = () => {
        setShowLogoutModal(!showLogoutModal);
    }
    const handleLogout = () => {
        router.post('/logout');
    };

    const getInitials = (fullName) => {
        const names = fullName.split(' ');
        if (names.length === 1) {
            return names[0].charAt(0).toUpperCase();
        }
        const initials = names[0].charAt(0) + names[names.length - 1].charAt(0);
        return initials.toUpperCase();
    };

    const handleToggle = () => {
        setShowMenu(!showMenu);
        setShowNotifications(false);
        setShowDateTime(false);
    };

    const handleToggleNotification = () => {
        setShowNotifications(!showNotifications);
        setShowMenu(false);
        setShowDateTime(false);
    }

    const toggleDateTime= () => {
        setShowDateTime(!showDateTime);
        setShowNotifications(false);
        setShowMenu(false);
    }

    // Get the initial for the color mapping
    const initials = getInitials(auth.user.name);
    const backgroundColor = colorMap[initials.charAt(0)] || theme; 


    return (
        <>
        <div className='flex flex-col lg:flex-row'>
            <div
                className={`${theme == 'bg-skin-blue' ? 'md:bg-none bg-skin-blue ' : 'md:bg-none bg-skin-black'} h-[50px] md:absolute lg:h-[60px] border-b-[1px] w-full lg:w-[296px] ${
                    !['bg-skin-black'].includes(theme) ? 'border-gray-200' : 'border-gray-700'
                }`}
                ref={menuRef}
            >
                    <div className="flex gap-x-4 items-center justify-center lg:justify-start px-[20px] py-[10px] lg:py-[15px]">
                        <Link href='/dashboard'>
                            <img
                                src="/images/others/digits-icon.png"
                                className="w-7 h-7 cursor-pointer duration-500"
                                alt="App Logo"
                            />
                        </Link>
                        <div
                            className={`${
                            theme === 'bg-skin-black'
                                ? 'text-gray-300'
                                : theme === 'bg-skin-white'
                                ? textColor
                                : textColorActive
                            } font-medium`}
                        >
                            <p className="font-semibold text-[15px]">{appname}</p>
                        </div>
                    </div>
            </div>
            <div
                className={`${theme} w-full h-[60px] border-b-[1px] ${!['bg-skin-black'].includes(theme) ? 'border-gray-200' : 'border-gray-700'}  flex items-center justify-end px-5 py-7 select-none shodow-customLight`}
                ref={menuRef}
            >
                <div className="flex items-center gap-3 pl-[16px] py-10">
                    <div className={`flex md:hidden items-center  bg-white/20 rounded-lg p-3 text-white`}
                            onClick={toggleDateTime}
                    >
                        <i className='fa-solid fa-clock text-xl leading-none'></i>
                    </div>
                    <div className='hidden md:flex items-center w-[23rem] bg-white/20 rounded-lg px-4 py-2 text-white'
                    >
                        <i className='fa-solid fa-clock text-[20px] leading-none mr-2'></i>
                        <div className="text-sm font-sm flex items-center justify-center flex-1 leading-none">
                            {currentDate.toLocaleString("en-US", {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                            })}
                        </div>
                    </div>
                    {
                        showDateTime && (
                            <div className='absolute z-90 right-1 top-[113px] md:lg:top-[65px] lg:top-[65px] bg-white p-3 rounded-[5px] pop-up-boxshadow z-[100] w-auto max-h-[390px]'>
                                <div className={`flex items-center justify-center space-x-2 
                                        ${theme === 'bg-skin-white' ? `bg-skin-white-light` : calendarDateTimeColor} 
                                        ${['bg-skin-white','bg-skin-blue','bg-skin-blue-light'].includes(theme) ? 'text-black' : textColor} 
                                        rounded-md px-[10px] py-[9px] lg:px-[20px] shodow-lg cursor-pointer`}
                                        onClick={toggleDateTime}
                                >
                                    <i className='fa fa-calendar-days text-2xl leading-none'></i>
                                    <span className="text-sm font-sm leading-none">
                                        {currentDate.toLocaleString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                        })}
                                    </span>
                                </div>
                            </div>
                        
                        )
                    }
                    <div className="relative cursor-pointer" onClick={handleToggleNotification}>
                        <div
                            className={`flex items-center justify-center ${theme == 'bg-skin-white' ? bgColor : theme } p-3 rounded-full border-[2px] ${borderColor} w-10 h-10`}
                        >
                            <i className={`fa fa-bell ${ textColorActive } text-[19px]`}></i>
                            {
                                unreadnNotifications > 0 && (
                                    <div className={`absolute top-[15px] right-[16px] bg-red-500 ${ textColorActive } text-[10px] font-bold rounded-full w-3 h-3 flex items-center justify-center transform translate-x-1/2 -translate-y-1/2`}>
                                        {unreadnNotifications}
                                    </div>
                                )
                            }
                            
                        </div>
                    </div>

                    {showNotifications && (
                        <div className={`absolute z-90 right-1 top-[113px] md:lg:top-[65px] lg:top-[65px] ${theme === 'bg-skin-black' ? 'bg-skin-black' : 'bg-white' } rounded-[5px] pop-up-boxshadow z-[100] w-[350px] max-h-[390px]`}>
                            <div className="flex justify-between items-center  border-b min-w-75 py-3 px-4">
                                <div className={` ${textColor} flex items-center`}>
                                    <div>
                                        <p className='text-sm font-medium'>Notifications</p>
                                        {notifications.length !== 0 && <p className='text-[10px] text-gray-500'>You have {unreadnNotifications ? unreadnNotifications : '0'} unread notification/s</p>}
                                    </div>
                                </div>
                                <Bell className='w-4 h-4 text-gray-500 mr-2'/>
                            </div>
                            <div className="max-h-[250px] overflow-y-auto overflow-x-hidden p-2">
                                {notifications.length !== 0 ? 
                                    (notifications.map(notification => (
                                        <NotificationCard
                                            key={notification.id}
                                            onClick={readNotification}
                                            notification={notification}
                                        />
                                    ))) 
                                 :
                                    <div className='border border-dashed rounded-md py-5 items-center justify-center flex flex-col'>
                                        <img className='w-10 h-10' src='/images/others/notification-bell.png'/>
                                        <p className={`text-xs ${textColor}`}>You have no notification</p>
                                    </div>
                                }
                            </div>
                            <div className={`${textColor} px-4 py-3 border-t flex justify-end`}>
                                <Link href='/notifications/view_all' disabled={notifications.length === 0} className='text-[10px] px-2 py-1 hover:bg-gray-100 w-fit border rounded-md cursor-pointer'>Show all notifications</Link>
                            </div>
                        </div>
                    
                    )}
                    
                    <div className={`flex items-center gap-4 border-l-[1px] pl-5 py-[8px] ${theme === 'bg-skin-black'?'border-gray-700':'border-gray-200'} cursor-pointer`} 
                        onClick={handleToggle}
                        style={{
                            zIndex: '80'
                        }}>
                            <div
                                className={`w-11 h-11 border-2 border-gray-400 rounded-full overflow-hidden shadow-md`}
                            >
                                {auth.user_profile
                                    ? 
                                    <img src={`/../storage/${auth.user_profile.file_name}`} className="w-full h-full object-cover"/> 
                                    :
                                    <img src="/images/others/user-icon.png" className="w-full h-full object-cover"/>
                                }
                            </div>
                            <p className={`font-poppins ${(theme === 'bg-skin-white' ? textColor : textColorActive) } hidden lg:block`}>
                                <span className="font-poppins text-[15px]">{auth.user.name}</span>
                            </p>
                            <img
                                src="/images/navigation/arrow-down-white.png"
                                className={`w-3 ml-2 hidden  lg:block ${showMenu && "rotate-180"}`}
                            />
                        </div>
                    </div>
                        {showMenu && (
                            <div className={`absolute z-[90] right-1 top-[113px] md:lg:top-[65px] lg:top-[65px] ${theme === 'bg-skin-black' ? 'bg-skin-black text-white' : 'bg-white text-black' } overflow-hidden rounded-[5px] pop-up-boxshadow z-[100] w-[332px]`}
                            >
                                <div className="flex items-center mt-3 justify-center gap-3 border-b-[1px] px-5 pb-2 ">
                                    {auth.user_profile
                                        ? 
                                        <img src={`/../storage/${auth.user_profile.file_name}`} className="w-14 h-14 border-2 border-gray-400 rounded-full object-cover"/> 
                                        :
                                        <img src="/images/others/user-icon.png" className="w-14 h-14 border-2 border-gray-400 rounded-full object-cover"/>
                                    }
                                    <p className={`flex-1 flex flex-col font-poppins ${!['bg-skin-black'].includes(theme) ? textColor : textColorActive}`}>
                                        <span className="font-semibold text-[15px]">{auth.user.name}</span>
                                        <span className="text-[13px]"> {auth.user.email}</span>
                                    </p>
                                    
                                </div>
                                <Link href="/profile" onClick={()=>{setShowMenu(false)}}>
                                    <div className="group flex hover:bg-profile-gradient items-center px-3 py-2 border-b relative overflow-hidden">
                                        <div className="relative z-10 flex items-center">
                                            <div className="w-8 h-8 bg-blue-500 group-hover:bg-white/30 flex items-center rounded-lg justify-center">
                                                <i className="fa-solid fa-user text-sm text-white"></i>
                                            </div>
                                            <p className={`text-sm ml-3 font-medium  ${theme === 'bg-skin-black' ? 'text-white' : 'text-black' } group-hover:text-white`}>
                                                Profile
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                                <Link href="/change_password" onClick={()=>{setShowMenu(false)}}>
                                    <div className="group flex hover:bg-password-gradient items-center px-3 py-2 border-b relative overflow-hidden">
                                        <div className="relative z-10 flex items-center">
                                            <div className="w-8 h-8 bg-yellow-400 group-hover:bg-white/30 flex items-center rounded-lg justify-center">
                                                <i className="fa-solid fa-key text-sm text-white"></i>
                                            </div>
                                            <p className={`text-sm ml-3 font-medium  ${theme === 'bg-skin-black' ? 'text-white' : 'text-black' } group-hover:text-white`}>
                                                Change Password
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                                <div className="group cursor-pointer flex hover:bg-change-theme-gradient items-center px-3 py-2 border-b relative overflow-hidden">
                                    <div className="relative z-10 flex items-center flex-1">
                                        <div className="w-8 h-8 bg-purple-500 group-hover:bg-white/30 flex items-center rounded-lg justify-center">
                                            <i className="fa-solid fa-swatchbook text-sm text-white"></i>
                                        </div>
                                        <p className={`text-sm ml-3 font-medium flex-1 ${theme === 'bg-skin-black' ? 'text-white' : 'text-black' } group-hover:text-white`}>
                                            Change Theme
                                        </p>
                                        <div className=''>
                                        <ThemeToggleSwitch/>

                                        </div>
                                    </div>
                                </div>
                                <div className="group cursor-pointer flex hover:bg-logout-gradient items-center px-3 py-2 relative overflow-hidden" onClick={()=>{handleLogoutModalToggle(); setShowMenu(false);}}>
                                    <div className="relative z-10 flex items-center">
                                        <div className="w-8 h-8 bg-red-500 group-hover:bg-white/30 flex items-center rounded-lg justify-center">
                                            <i className="fa-solid fa-arrow-right-from-bracket text-sm text-white"></i>
                                        </div>
                                        <p className={`text-sm ml-3 font-medium  ${theme === 'bg-skin-black' ? 'text-white' : 'text-black' } group-hover:text-white`}>
                                            Logout
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
            </div>
        </div>
        <Modalv2 
            isOpen={showLogoutModal} 
            setIsOpen={handleLogoutModalToggle}
            title="Confirm Logout"
            confirmButtonName='Logout'
            content="Are you sure you want to log out? You'll need to log in again to access your account"
            onConfirm={handleLogout}
        />      
        </>
    );
};

export default AppNavbar;
