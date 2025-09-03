import React, { useEffect, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import useThemeStyles from "../../Hooks/useThemeStyles";
import { useTheme } from "../../Context/ThemeContext";
import ChangePassModal from "../../Components/Modal/ChangePassModal";
import EmbeddedDashboard from "./EmbeddedDashboard";
import DashboardNotAvailable from "./DashboardNotAvailable";
import AnnouncementModal from "../../Components/Modal/AnnouncementsModal";


const Dashboard = ({dashboard_settings_data, embedded_dashboards }) => {
    const { auth } = usePage().props;
    const { theme } = useTheme();
    const { textColor, sideBarBgColor } = useThemeStyles(theme);
    const { announcement, unread_announcement, admin_privileges } = auth.sessions;
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(unread_announcement);

    return (
        <>
        <div className={`${textColor}`}>
            <Head title="Dashboard" />
            <ChangePassModal/>
            
            {auth.access.isView && auth.access.isRead && 
                <div className="space-y-3">
                    {dashboard_settings_data.has_default_dashboard == 'Yes' && 
                        <>Dashboard Here</>
                    }
                    {dashboard_settings_data.has_embedded_dashboard == 'Yes' && 
                       <EmbeddedDashboard embedded_dashboards={embedded_dashboards}/>
                    }

                    {dashboard_settings_data.has_default_dashboard != 'Yes' && dashboard_settings_data.has_embedded_dashboard != 'Yes' &&
                        <DashboardNotAvailable/>
                    }
                </div>
              
            }
          
        </div>
        {unread_announcement && 
            <AnnouncementModal isOpen={showAnnouncementModal} data={JSON.parse(announcement?.json_data)} setIsOpen={setShowAnnouncementModal} action="View User"/>
        }
        </>
    );
};

export default Dashboard;
