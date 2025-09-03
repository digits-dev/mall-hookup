import React, { useState } from 'react'
import { useTheme } from '../../../Context/ThemeContext';
import Modal from '../../../Components/Modal/Modal';
import useThemeStyles from '../../../Hooks/useThemeStyles';
import DashboardSettingsAction from './DashboardSettingsAction';
import { Eye, FileX2, Pencil } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import EmbeddedDashboardViewModal from '../../../Components/Modal/EmbeddedDashboardViewModal';
import axios from 'axios';

const DashboardSettings = ({privileges, embedded_dashboards, dashboard_button_data}) => {
    const { theme } = useTheme();
    const [defaultDashboard, setDefaultDashboard] = useState(dashboard_button_data?.has_default_dashboard);
    const [embeddedDashboard, setEmbeddedDashboard] = useState(dashboard_button_data?.has_embedded_dashboard);
    const [loading, setLoading] = useState(false);
    const [action, setAction] = useState(null);
    const { textColorActive } = useThemeStyles(theme);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [embeddedDashboardData, setEmbeddedDashboardData] = useState({
        id: "",
        name: "",
        description: "",
        url: "",
        logo: "",
        status: "",
    });

    const handleModalClick = () => {
        setIsModalOpen(!isModalOpen);
    }

    const handleDefaultDashboardToggle = async (optionData) => {
        if (loading) return;
    
        setLoading(true);
        setDefaultDashboard(optionData);
    
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json',
            },
          };
          const response = await axios.post('/settings/update_default_dashboard', { option: optionData }, config);
        } catch (error) {
          console.log(error);
          setDefaultDashboard(optionData == "Yes" ? 'No' : 'Yes');
        
        } finally {
          setLoading(false);
        }
    };

    const handleEmbeddedDashboardToggle = async (optionData) => {
        if (loading) return;
    
        setLoading(true);
        setEmbeddedDashboard(optionData);
    
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json',
            },
          };
          const response = await axios.post('/settings/update_embedded_dashboard_button', { option: optionData }, config);
        } catch (error) {
          console.log(error);
          setEmbeddedDashboard(optionData == "Yes" ? 'No' : 'Yes');
        
        } finally {
          setLoading(false);
        }
    };

    const EmbedDashboardCard = ({id, name, description, privileges, status, created_at, updated_at, url, logo}) => {
        const createdAt = new Date(created_at);
        const updateAt = updated_at ? new Date(updated_at) : null;
        const CreatedtimeAgo = formatDistanceToNow(createdAt, { addSuffix: true });
        const UpdatedtimeAgo = formatDistanceToNow(updateAt, { addSuffix: true });

        return (
            <div className='border p-3 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between'>
                <div className='flex items-center'>
                    <img src={`../storage/${logo}`} className="bg-white mr-4 ml-2 w-5 h-5 md:w-8 md:h-8 object-cover"/>
                    <div>
                        <div className='flex items-center'>
                            <p className='font-semibold mr-2 text-sm md:text-base'>{name}</p>
                            <p className={`text-[10px] md:text-xs font-semibold ${status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'} text-white px-2 py-0.5 rounded-full`}>{status == 'ACTIVE' ? 'Active' : 'Inactive'}</p>
                        </div>
                        <p className='text-xs text-gray-500'>{description}</p>
                        {updated_at ? <p className='text-[10px] md:text-xs text-gray-500'>Last Updated: {UpdatedtimeAgo}</p> : <p className='text-xs text-gray-500'>Created: {CreatedtimeAgo}</p>}
                        <div className='flex flex-wrap gap-1 mt-1 items-center'>
                            {privileges && privileges?.map((privilege, index)=>(
                                <p key={privilege.get_privilege?.name + index} className='text-[8px] text-nowrap bg-cyan-400 text-white px-2  py-0.5 rounded-full font-semibold'>{privilege.get_privilege?.name}</p>
                            ))}
                        </div>
                    </div>
                </div>
                <div className='flex items-center mt-2 md:mt-0'>
                    <EmbeddedDashboardViewModal url={url}/>
                    <div 
                        className='cursor-pointer p-2 rounded-full hover:bg-gray-200' 
                        onClick={()=>{
                            handleModalClick(); 
                            setAction('View');
                            setEmbeddedDashboardData({
                                id: id,
                                name: name,
                                privileges: privileges,
                                description: description,
                                url: url,
                                logo: logo,
                                status: status,
                            });
                        }}
                    >
                        <Eye className='w-4 h-4 text-gray-500'/>
                    </div>
                    <div 
                        className='cursor-pointer p-2 rounded-full hover:bg-gray-200'
                        onClick={()=>{
                            handleModalClick(); 
                            setAction('Update');
                            setEmbeddedDashboardData({
                                id: id,
                                name: name,
                                privileges: privileges,
                                description: description,
                                url: url,
                                logo: logo,
                                status: status,
                            });
                        }}
                    >
                        <Pencil className='w-4 h-4 text-gray-500'/>
                    </div>
                </div>
            </div>
        )
    }

  return (
    <>
        <div className='py-2'>
            <p className='text-xs mb-2 font-medium'>Welcome to your Dashboard Settings! Customize your experience and make everything just the way you like it</p>
            <div className='p-4 border-2 rounded-lg'>
                <div className='md:grid md:grid-cols-2 md:gap-2 space-y-2 md:space-y-0'>
                    {dashboard_button_data.has_default_dashboard &&
                        <div className='select-none'>
                            <label className={`block text-xs font-bold ${theme === 'bg-skin-black' ? ' text-gray-400' : 'text-gray-700'}  font-poppins`}>Add Default Dashboard?</label>
                            <div className="relative rounded-lg mt-1 flex space-x-1 overflow-hidden border-2 bg-gray-300">
                                <div
                                    className={`absolute ${theme} rounded-md h-full w-1/2 transition-all ${loading && 'opacity-70'} duration-300 ${
                                    defaultDashboard === "Yes" ? "left-0" : "left-1/2"}`}
                                >
                                </div>
                                <button
                                    disabled={loading}
                                    className={` flex-1 py-2 z-10 outline-none text-sm font-medium
                                    ${defaultDashboard === "Yes" ? "text-white" : "text-black/50"}`}
                                    onClick={()=>handleDefaultDashboardToggle("Yes")}
                                >
                                    Yes
                                </button>
                                <button
                                    disabled={loading}
                                    className={`flex-1 py-2 z-10 outline-none text-sm font-medium
                                    ${defaultDashboard == "No" ? "text-white" : "text-black/50"}`}
                                    onClick={()=>handleDefaultDashboardToggle("No")}
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    }
                    {dashboard_button_data?.has_embedded_dashboard &&
                        <div className='select-none'>
                            <label className={`block text-xs font-bold ${theme === 'bg-skin-black' ? ' text-gray-400' : 'text-gray-700'}  font-poppins`}>Add Embedded Dashboard?</label>
                            <div className="relative rounded-lg mt-1 flex space-x-1 overflow-hidden border-2 bg-gray-300">
                                <div
                                    className={`absolute ${theme} rounded-md h-full w-1/2 transition-all ${loading && 'opacity-70'} duration-300 ${
                                    embeddedDashboard === "Yes" ? "left-0" : "left-1/2"}`}
                                >
                                </div>
                                <button
                                    disabled={loading}
                                    className={` flex-1 py-2 z-10 outline-none text-sm font-medium
                                    ${embeddedDashboard === "Yes" ? "text-white" : "text-black/50"}`}
                                    onClick={()=>handleEmbeddedDashboardToggle("Yes")}
                                >
                                    Yes
                                </button>
                                <button
                                    disabled={loading}
                                    className={`flex-1 py-2 z-10 outline-none text-sm font-medium
                                    ${embeddedDashboard == "No" ? "text-white" : "text-black/50"}`}
                                    onClick={()=>handleEmbeddedDashboardToggle("No")}
                                >
                                    No
                                </button>
                            </div>
                        </div> 
                    }
                </div>
                {embeddedDashboard == "Yes" &&
                    <div className='mt-5'>
                        <div className='flex flex-col md:flex-row justify-between md:items-center'>
                            <div>
                                <p className='text-base font-semibold'>Embedded Dashboards</p>
                                <p className='text-xs '>Manage your embedded analytics dashboards</p>
                            </div>
                            {embedded_dashboards?.length != 0 && 
                                <button className={`${theme} text-white w-fit mt-2 md:mt-0 font-semibold text-[10px] md:text-xs px-3 py-2 rounded-lg hover:opacity-70`} 
                                    onClick={()=>{
                                        handleModalClick(); 
                                        setAction('Add');
                                        setEmbeddedDashboardData({
                                            id: "",
                                            name: "",
                                            description: "",
                                            url: "",
                                            logo: "",
                                            status: "",
                                        });
                                    }}
                                >Embed New       
                                </button>
                            }
                        </div>
                        {embedded_dashboards?.length != 0 ?
                            <div className='mt-2 max-h-96 overflow-y-auto space-y-1 scrollbar-none'>  
                                {embedded_dashboards && embedded_dashboards.map((dashboard, index)=>(
                                    <EmbedDashboardCard 
                                        key={dashboard?.name + index} 
                                        name={dashboard?.name}
                                        description={dashboard?.description}
                                        privileges={dashboard?.get_dashboard_privileges}
                                        status={dashboard?.status}
                                        created_at={dashboard?.created_at}
                                        updated_at={dashboard?.updated_at}
                                        url={dashboard?.url}
                                        id={dashboard?.id}
                                        logo={dashboard?.logo}
                                    />
                                ))}  
                                
                            </div>
                            :
                            <div className='mt-2 border-2 border-dashed rounded-lg p-10 flex flex-col items-center justify-center'>
                                <FileX2 className="h-8 w-8 text-muted-foreground" />
                                <div className="text-sm font-medium mt-2">No Dashboard available</div>
                                <div className="text-xs md:text-start text-center text-muted-foreground">There are no records to display at this time.</div>
                                <button className={`${theme} text-white mt-3 font-semibold text-xs px-3 py-2 rounded-lg hover:opacity-70`} 
                                    onClick={()=>{
                                        handleModalClick(); 
                                        setAction('Add');
                                        setEmbeddedDashboardData({
                                            id: "",
                                            name: "",
                                            description: "",
                                            url: "",
                                            logo: "",
                                            status: "",
                                        });
                                    }}
                                >Add New Embedded Dashboard     
                                </button>
                            </div> 
                        }
                        
                    </div>
                }
            </div>
        </div>
        <Modal
            theme={theme}
            show={isModalOpen}
            onClose={handleModalClick}
            title={
                action == "Add"
                    ? "Add Embedded Dashboard"
                    : action == "Update"
                    ? "Update Embedded Dashboard"
                    : "Embedded Dashboard Information"
            }
            width="2xl"
            fontColor={textColorActive}
            btnIcon="fa fa-edit"
        >
           <DashboardSettingsAction privileges={privileges} action={action} initialData={embeddedDashboardData} onClose={handleModalClick}/>
        </Modal>
  
    </>
  )
}

export default DashboardSettings