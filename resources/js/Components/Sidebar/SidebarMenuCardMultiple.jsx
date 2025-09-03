import { Link, router } from '@inertiajs/react';
import React, { useEffect, useState } from 'react'
import useThemeStyles from '../../Hooks/useThemeStyles';
import { useTheme } from '../../Context/ThemeContext';

const SidebarMenuCardMultiple = ({menuTitle = 'Sample Menu', icon = 'fa-solid fa-chart-simple', isMenuOpen , onMenuClick, onChildMenuClick, isMenuActive, isChildMenuActive, childMenus}) => {

    const {theme} = useTheme();

    const [loading, setLoading] = useState(false);

    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

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
  

      const colors = ['text-green-400', 'text-red-400', 'text-blue-400', 'text-yellow-400', 'text-purple-400']; 
      
  return (
    <div>
        {/* PARENT */}
        <div className={`cursor-pointer select-none px-3 py-2.5 overflow-hidden flex ${sideBarTextColor} items-center border-2 ${sidebarBorderColor} rounded-xl ${isMenuActive && sidebarActiveMenuBorderColor + ' ' + sidebarActiveMenuBgColor + ' ' + sidebarActiveTextColor } ${sidebarHoverMenuBgColor} ${sidebarHoverMenuBorderColor} ${sidebarHoverTextColor}`}
            onClick={onMenuClick}
        >
            <div className='w-5 h-5  flex items-center justify-center mr-2 flex-shrink-0'>
                <i className={icon}></i>
            </div>
            <p className={`text-xs font-bold text-nowrap flex-1`}>{menuTitle}</p>
            <div className={`w-5 h-5  flex items-center justify-center transition-full duration-300 ${isMenuOpen ? '-rotate-180': ''}`}>
                <i className="fa-solid fa-caret-down text-xs"></i> 
            </div>
        </div>
        {/* CHILD */}
        <div className={`${isMenuOpen ? 'max-h-[100rem] opacity-100' : 'max-h-0 opacity-0'} flex flex-col ${sideBarTextColor} space-y-1 transition-all duration-500 ml-6 border-l-2 overflow-hidden `}>
            {childMenus && childMenus.map((child_menu, index)=>{

                const colorClass = colors[index % colors.length];
                return <Link href={'/' + child_menu.slug}
                            onClick={(e) => {
                                if (loading) {
                                    e.preventDefault(); // Prevent navigation
                                    return;
                                }
                                onChildMenuClick(child_menu.name, menuTitle)
                            }}
                            key={child_menu.name + index} 
                            className={`p-1 flex items-center flex-1 ml-1 cursor-pointer border ${sidebarBorderColor} rounded-lg first:mt-1 ${sidebarHoverMenuBgColor} ${sidebarHoverMenuBorderColor} ${sidebarHoverTextColor} ${isChildMenuActive == child_menu.name && sidebarActiveMenuBorderColor + ' ' + sidebarActiveMenuBgColor + ' ' + sidebarActiveTextColor  }`}>
                                <div className='w-5 h-5 flex items-center justify-center mr-1 flex-shrink-0'>
                                    <i className={`fa-solid fa-circle text-[7px] ${colorClass}`}></i>
                                </div>
                                <span className={`text-[10.5px] font-semibold flex-1 text-nowrap`}>{child_menu.name}</span>
                        </Link>
            })}
        </div>
    </div>
    
  )
}

export default SidebarMenuCardMultiple