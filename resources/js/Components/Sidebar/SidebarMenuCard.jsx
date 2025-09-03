import { Link, router } from '@inertiajs/react';
import React, { useState } from 'react'
import useThemeStyles from '../../Hooks/useThemeStyles';
import { useTheme } from '../../Context/ThemeContext';

const SidebarMenuCard = ({menuTitle = 'Sample Menu', icon = 'fa-solid fa-chart-simple', href, isMenuActive, onClick, setActiveChildMenu}) => {
  const {theme} = useTheme();
  const { 
            sidebarHoverTextColor,
            sidebarHoverMenuBgColor, 
            sidebarHoverMenuBorderColor,
            sidebarActiveTextColor,
            sideBarTextColor,
            sidebarActiveMenuBgColor,
            sidebarActiveMenuBorderColor,
            sidebarBorderColor,
        } = useThemeStyles(theme);


  const [loading, setLoading] = useState(false);

  router.on("start", () => setLoading(true));
  router.on("finish", () => setLoading(false));


  return (
    <Link 
      onClick={(e) => {
        if (loading) {
            e.preventDefault(); // Prevent navigation
            return;
        }
        onClick();
        setActiveChildMenu(null);
    }}
      disabled={true}
      href={'/' + href} 
      className={`cursor-pointer select-none px-3 py-2.5 overflow-hidden flex ${sideBarTextColor} items-center border-2 ${sidebarBorderColor} rounded-xl ${isMenuActive && sidebarActiveMenuBorderColor + ' ' + sidebarActiveMenuBgColor + ' ' + sidebarActiveTextColor } ${sidebarHoverMenuBgColor} ${sidebarHoverMenuBorderColor} ${sidebarHoverTextColor}`}>
        <div className='w-5 h-5  flex items-center justify-center mr-2 flex-shrink-0'>
            <i className={icon}></i>
        </div>
        <p className={`font-bold flex-shrink-0 text-xs`}>{menuTitle}</p>
    </Link>
  )
}

export default SidebarMenuCard