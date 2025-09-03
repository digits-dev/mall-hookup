import React, { useContext, useState } from 'react'
import SidebarMenuCard from './SidebarMenuCard'
import SidebarMenuCardMultiple from './SidebarMenuCardMultiple'
import { usePage } from '@inertiajs/react';
import { NavbarContext } from "../../Context/NavbarContext";

const UserSidebar = ({activeMenu, setActiveMenu, activeChildMenu, setActiveChildMenu}) => {
    const { auth } = usePage().props;
    const user_menus  = auth.sessions.user_menus
    const { setTitle } = useContext(NavbarContext);


    const handleMenuClick = (menuTitle, type) => {
        if (type === 'Route'){
            setActiveMenu(menuTitle);
            setTitle(menuTitle);
        }else {
            setActiveMenu((prev) => (prev === menuTitle ? null : menuTitle));
        }
      
       
    };

    const handleChildMenuClick = (childTitle, parentTitle) => {
        setActiveChildMenu(childTitle);
        setActiveMenu(parentTitle);
        setTitle(childTitle);
    };


  return (
    <div className='m-5'>
        <p className='text-xs font-bold text-gray-400 mb-5'>MENU</p>
        <div className='space-y-2'>
            {
                user_menus && user_menus.map((menu, index)=>{
                    if (menu.type === 'Route'){
                        return <SidebarMenuCard 
                                    href={menu.slug} 
                                    key={index} 
                                    menuTitle={menu.name} 
                                    icon={menu.icon}
                                    setActiveChildMenu={setActiveChildMenu}
                                    isMenuActive={activeMenu === menu.name} 
                                    onClick={() => handleMenuClick(menu.name, menu.type)}
                                />
                    }
                    else
                    {
                        return <SidebarMenuCardMultiple 
                                    key={index}
                                    menuTitle={menu.name} 
                                    icon={menu.icon} 
                                    childMenus={menu.children} 
                                    isMenuActive={activeMenu === menu.name || (menu.children && menu.children.some(child => child.name === activeMenu))}
                                    isChildMenuActive={activeChildMenu}
                                    isMenuOpen={activeMenu === menu.name}
                                    onMenuClick={() => handleMenuClick(menu.name)}
                                    onChildMenuClick={handleChildMenuClick}
                                />

                    }
                }) 

            }
            
        </div>
    </div>
  )
}

export default UserSidebar