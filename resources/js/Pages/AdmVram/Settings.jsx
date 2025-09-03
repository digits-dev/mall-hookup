import React, { useState } from 'react'
import useThemeStyles from '../../Hooks/useThemeStyles';
import { useTheme } from '../../Context/ThemeContext';
import DashboardSettings from './AppSettings/DashboardSettings';
import { Head } from '@inertiajs/react';

const Settings = ({privileges, embedded_dashboards, dashboard_button_data}) => {

    const { theme } = useTheme();
    const { textColor, sideBarBgColor } = useThemeStyles(theme);
    const [activeTab, setActiveTab] = useState("tab1");

    const tabs = [
        { id: "tab1", image: "/images/others/dashboard-icon.png", label: "Dashboard Settings" },
    ]

    return (
        <>
            <Head title='App Settings'/>
            <div className={`w-full mx-auto ${sideBarBgColor} ${textColor} shadow-menus rounded-lg overflow-hidden`}>
                <div className={`flex  ${theme == 'bg-skin-blue' ? 'bg-gray-200': 'bg-black/20'}`}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center justify-center px-5 py-3 font-medium text-sm transition-colors focus:outline-none ${
                                activeTab === tab.id
                                ? `${sideBarBgColor} rounded-t-lg`
                                : "text-muted-foreground text-gray-600 hover:text-foreground hover:bg-gray-300 "
                            }`}
                        >
                            <img
                                src={tab.image}
                                className={`w-4 h-4 md:w-5 md:h-5 md:mr-2 cursor-pointer duration-500 
                                ${
                                    activeTab === tab.id
                                    ? "opacity-100"
                                    : "opacity-50"
                                }`}
                            />
                            
                            <div className="hidden md:block">{tab.label}</div>
                        </button>        
                    ))}
                </div>
                <div className="px-3 py-2">
                    {activeTab === "tab1" && (
                        <DashboardSettings privileges={privileges} embedded_dashboards={embedded_dashboards} dashboard_button_data={dashboard_button_data}/>
                    )}
                </div>
            </div>
        </>
    )
}

export default Settings