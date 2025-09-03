import { Link, router, usePage } from '@inertiajs/react';
import React, { useRef, useState, useEffect } from 'react'
import { useTheme } from '../../Context/ThemeContext';
import useThemeStyles from '../../Hooks/useThemeStyles';

const BreadCrumbs = () => {
    const {theme} = useTheme();
    const { auth } = usePage().props;
    const { iconThemeColor, primayActiveColor } = useThemeStyles(theme);
    const [icon, setIcon] = useState(null);
    const [title, setTitle] = useState(null);
 
    useEffect(() => {
              
        if ((auth.module[0]) === 'profile') {
            setIcon('fa-solid fa-user');
            setTitle('Profile');
        }
        else if ((auth.module[0]) === 'edit_profile') {
            setIcon('fa-solid fa-user');
            setTitle('Edit Profile');
        } 
        else if ((auth.module[0]) === 'change_password') {
            setIcon('fa-solid fa-key');
            setTitle('Change Password');
        } 
        else {
            setTitle(auth.module[0].name || null);
            setIcon(auth.module[0].icon || null);
        }
        

    }, [auth]); 
  return (
   <>
    <div className={`shadow-menus select-none flex space-y-2 md:space-y-0 flex-col ${theme === 'bg-skin-black' ?  theme + ' border-skin-black-light' : 'bg-white'} border  md:flex-row lg:flex-row rounded-lg justify-between px-4 py-3 font-poppins mb-3`}>
        <div className="space-x-3 flex items-center">
            <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center ${theme == 'bg-skin-white' && 'border border-skin-black-light bg-skin-black'}  ${theme === 'bg-skin-black' ? 'bg-skin-black-light' : theme}`}>
                <i className={`${icon} text-base md:text-lg text-white `}></i>
            </div>
            <span className={`font-bold text-base md:text-xl ${theme === 'bg-skin-black' ? 'text-gray-400': 'text-skin-blue-secondary'} `}>{title}</span>
        </div>
        <div className={`flex items-center ${theme === 'bg-skin-black' ? 'text-gray-300' : 'text-black'} text-xs space-x-2`}>
            {title != 'Dashboard' && 
                <>
                    <i className={`fa-solid fa-chart-simple text-xs ${iconThemeColor}`}></i>
                    <Link href='/dashboard'>Dashboard</Link>
                    <span>&gt;</span>
                    <span className="text-gray-500">{title}</span>
                </>
            }
        </div>
    </div>
   </>
  )
}


export default BreadCrumbs