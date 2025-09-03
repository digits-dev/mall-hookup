import React, { useState } from 'react'
import { useTheme } from '../../Context/ThemeContext';
import useThemeStyles from '../../Hooks/useThemeStyles';
import EmptyAnim from '../../../../public/Animations/empty-anim.json';
import ContentPanel from '../../Components/Table/ContentPanel';
import Lottie from 'lottie-react';
import DashboardNotAvailable from './DashboardNotAvailable';

const EmbeddedDashboard = ({embedded_dashboards}) => {
    const { theme } = useTheme();
    const { textColor, sideBarBgColor } = useThemeStyles(theme);
    const [activeTab, setActiveTab] = useState(embedded_dashboards[0]?.id)

  return (
    <>
        {embedded_dashboards.length != 0 ? 
            <div className={`w-full mx-auto ${sideBarBgColor} mt-5 shadow-menus rounded-lg overflow-hidden`}>
                <div className={`flex  ${theme == 'bg-skin-blue' ? 'bg-gray-200': 'bg-black/20'} overflow-auto w-full scrollbar-none`}>
                    {embedded_dashboards?.map((tab) => (
                        <button
                            key={tab?.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center justify-center px-6 py-3 font-medium text-sm transition-colors focus:outline-none ${
                                activeTab === tab.id
                                ? `${sideBarBgColor} rounded-t-lg`
                                : "text-muted-foreground text-gray-600 hover:text-foreground hover:bg-gray-300 "
                            }`}
                        >
                                <img
                                    src={`../storage/${tab.logo}`}
                                    className={`w-4 h-4 md:w-5 md:h-5 md:mr-2 cursor-pointer duration-500 
                                    ${
                                        activeTab === tab.id
                                        ? "opacity-100"
                                        : "opacity-50"
                                    }`}
                                />
                            
                            <div className="hidden md:block text-nowrap">{tab.name}</div>
                        </button>        
                    ))}
                    
                </div>
                <div className="px-3 py-2">

                    {embedded_dashboards?.map((dashboard, index) => (
                        activeTab === dashboard.id && (
                            <div key={index} style={{ position: 'relative', width: '100%', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                                <iframe
                                    title={dashboard.name}
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                    src={dashboard.url}
                                    frameBorder="0"
                                    allowFullScreen={true}
                                ></iframe>
                            </div>
                        )      
                    ))}
                    
                </div>
            </div>
            :
            <></>

        }
    </>
    
  )
}

export default EmbeddedDashboard