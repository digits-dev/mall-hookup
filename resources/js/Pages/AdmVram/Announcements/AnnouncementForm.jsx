import React, { useState } from 'react'
import ContentPanel from '../../../Components/Table/ContentPanel'
import { useTheme } from '../../../Context/ThemeContext';
import InputComponent from '../../../Components/Forms/Input';
import { Head, useForm } from '@inertiajs/react';
import TextArea from '../../../Components/Forms/TextArea';
import CustomSelect from '../../../Components/Dropdown/CustomSelect';
import ToggleSwitch from '../../../Components/Table/Buttons/ToggleSwitch';
import Buttonv2 from '../../../Components/Table/Buttons/Buttonv2';
import { Bell, Calendar, CircleCheck, CircleCheckBig, Eye, ImageIcon, Info, Trash2, TriangleAlert, X } from 'lucide-react';
import ImageInput from '../../../Components/Forms/ImageInput';
import SliderInput from '../../../Components/Forms/SliderInput';
import AnnouncementModal from '../../../Components/Modal/AnnouncementsModal';
import Button from '../../../Components/Table/Buttons/Button';
import useThemeStyles from '../../../Hooks/useThemeStyles';
import Modalv2 from '../../../Components/Modal/Modalv2';
import { useToast } from '../../../Context/ToastContext';

const AnnouncementForm = ({action, update_data}) => {
    const { theme } = useTheme();
    const { handleToast } = useToast();
    const { textColorActive } = useThemeStyles(theme);
    const [selectedTab, setSelectedTab] = useState('Basic Settings');
    const [confirmModal, setConfirmModal] = useState(false);
    const [actionButtonError, setActionButtonError] = useState(null);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [imageError, setImageError] = useState(null);
    const [isImageEdited, setIsImageEdited] = useState(false);

    const handleConfirmModalToggle = () => {
        setConfirmModal(!confirmModal);
    }

    const { data, setData, processing, reset, post, errors } = useForm({
        id: action == 'Create' ? "" : update_data.id,
        name: action == 'Create' ? "" : update_data.json_data.name,
        title: action == 'Create' ? "New Announcement" : update_data.json_data.title,
        description: action == 'Create' ? "We've just released a new feature that we think you'll love. Check it out now!" : update_data.json_data.description,
        description_center: action == 'Create' ? true : update_data.json_data.description_center,
        variant: action == 'Create' ? "Default" : update_data.json_data.variant,
        size: action == 'Create' ? "Small" : update_data.json_data.size,
        show_new_badge: action == 'Create' ? false : update_data.json_data.show_new_badge,
        actions: action == 'Create' ? [{ label: "Dismiss", type: 'Dismiss', style: "Default", url: null }] : update_data.json_data.actions,
        image: action == 'Create' ? "" : update_data.json_data.image,
        auto_dismiss: action == 'Create' ? false : update_data.json_data.auto_dismiss,
        close_button: action == 'Create' ? true : update_data.json_data.close_button,
        auto_dismiss_duration: action == 'Create' ? "" : update_data.json_data.auto_dismiss_duration,
        confetti_effect: action == 'Create' ? false : update_data.json_data.confetti_effect,
        once_per_user: action == 'Create' ? true : update_data.json_data.once_per_user,
    });
    
    const tabs = ['Basic Settings', 'Actions', 'Advanced'];
    const variants = [
        { value: 'Default', label:'Default'},
        { value: 'Info', label:'Info' },
        { value: 'Warning', label:'Warning' },
        { value: 'Success', label:'Success' },
        { value: 'Event', label:'Event' },
    ];
    const sizes = [
        { value: 'Small',label: 'Small' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Large', label: 'Large' },
    ];


    const addAction = () => {
        if (data.actions.length >= 4) {
            setActionButtonError("You can have a maximum of 4 action buttons");
            return;
        }
        else {
            setActionButtonError(null);
        }
    
        setData("actions", [...data.actions, { label: "New Action", style: "Default", type: "Dismiss", url: null }]);
    };
    
    const removeAction = (index) => {
        if (data.actions.length <= 4) {
            setActionButtonError(null);
        }
        setData("actions", data.actions.filter((_, i) => i !== index));
    };
    
    const updateAction = (index, updates) => {
        const updatedActions = data.actions.map((action, i) =>
            i === index ? { ...action, ...updates } : action
        );
        setData("actions", updatedActions);
    };


    const handleSubmit = () => {

        if (action === "Create"){
            post('/announcements/create_announcement', {
                onSuccess: (data) => {
                    const { message, type, menus } = data.props.auth.sessions;
                    handleToast(message, type);
                },
                onError: (error) => {
                }
            });
        }

        if (action === "Update"){
            post('/announcements/update_announcement', {
                onSuccess: (data) => {
                    const { message, type, menus } = data.props.auth.sessions;
                    handleToast(message, type);
                },
                onError: (error) => {
                }
            });
        }
        

    }

  return (
    <>
        <Head title='Announcement Configuration'/>
        <ContentPanel>
            <div className='flex items-center'>
                <img src="/images/others/promotion.png" className="w-6 h-6 duration-500"/>
                <p className={`${theme === 'bg-skin-black' ? ' text-white' : 'text-black/90'} font-semibold text-lg ml-3`}>{action == 'Create' ? 'Announcement Creator' : 'Update Announcement'}</p>
            </div>
            <div className='flex flex-col-reverse md:flex-row mt-4 select-none gap-2 md:gap-0'>
                {/* CREATE CONTAINER */}
                <div className='border-2 p-4 rounded-lg md:w-[60%] h-fit'>
                    <p className='text-xs text-gray-500'>Customize your announcement and preview it in real-time</p>
                    {/* TAB SWITCHES */}
                    <div className='flex mt-2 bg-gray-200 p-1 rounded-md'>
                        {tabs.map((tab, index) => (
                            <button key={index} onClick={()=> setSelectedTab(tab)} className={`flex-1 text-[10px] rounded-md md:text-xs font-medium py-2 ${selectedTab == tab ? 'bg-white' : 'text-gray-600'}`}>{tab}</button>
                        ))}
                    </div>
                    {/* TABS */}
                    {selectedTab == 'Basic Settings' && 
                        <div className='mt-5 space-y-3 md:space-y-4'>
                            <InputComponent
                                value={data.name}
                                displayName="Announcement Name"
                                placeholder="Add Announcement Name"
                                onError={errors.name}
                                onChange={(e)=> setData("name", e.target.value)}
                            />
                            <InputComponent
                                value={data.title}
                                displayName="Announcement Title"
                                placeholder="Add Title"
                                onError={errors.title}
                                onChange={(e)=> setData("title", e.target.value)}
                            />
                            <TextArea 
                                value={data.description}
                                displayName="Description"
                                placeholder="Add Description"
                                rows="3"
                                onError={errors.description}
                                onChange={(e)=> setData("description", e.target.value)}
                            />
                            <ToggleSwitch
                                label="Align Description to Center?"
                                value={data.description_center}
                                onChange={(e) => setData('description_center', e)}
                            />
                            <div className='space-y-3 md:flex md:space-x-4 md:space-y-0 '>
                                <CustomSelect
                                    key={`variant1-${data.variant}`} 
                                    addMainClass="flex-1"
                                    name="Variant"
                                    placeholder="Select Variant"
                                    options={variants}
                                    onError={errors.variant}
                                    value={variants.find(option => option.value === data.variant)}
                                    onChange={(e)=>setData('variant', e.value)}
                                />
                                <CustomSelect
                                    key={`variant2-${data.size}`} 
                                    addMainClass="flex-1"
                                    name="Size"
                                    placeholder="Select Size"
                                    options={sizes}
                                    onError={errors.size}
                                    value={sizes.find(option => option.value === data.size)}
                                    onChange={(e)=>setData('size', e.value)}
                                />
                            </div>
                            <ToggleSwitch
                                label={<p>Show <span className='font-semibold'>"NEW"</span> badge</p>}
                                value={data.show_new_badge}
                                onChange={(e) => setData('show_new_badge', e)}
                            />
                        
                        </div>
                    }
                    {selectedTab == 'Actions' && 
                        <>
                            <div className='mt-5 flex justify-between'>
                                <p className={`${theme == 'bg-skin-black' ? 'text-white' : 'text-black' } md:text-base text-sm font-medium`}>Action Buttons</p>
                                <Buttonv2 name="Add Action Button" onClick={addAction} />
                            </div>
                            <div className='mt-3 space-y-3'>
                                {data.actions.length == 0 ? 
                                    <div className='border-2 rounded-lg px-2 py-3 md:py-6 text-[10px] md:text-sm text-gray-400  text-center border-dashed'>No actions added. Click "Add Action Button" to create a button.</div> 
                                :
                                    data.actions?.map((action, index) => (
                                        <div key={index} className='flex items-center px-3 py-2 gap-2 rounded-lg border'>
                                            <InputComponent
                                                displayName="Label"
                                                addClass="flex-1"
                                                value={action.label}
                                                placeholder="Label"
                                                onChange={(e) => updateAction(index, { label: e.target.value })}
                                            />
                                            <CustomSelect
                                                name="Style"
                                                addMainClass="flex-1"
                                                options={[
                                                    { value: 'Default', label: 'Default' },
                                                    { value: 'Secondary', label: 'Secondary' },
                                                    { value: 'Outline', label: 'Outline' },
                                                    { value: 'Ghost', label: 'Ghost' },
                                                    { value: 'Destructive', label: 'Destructive' },
                                                ]}
                                                value={{ value: action.style, label: action.style }}
                                                onChange={(e) => updateAction(index, { style: e.value })}
                                            />
                                            <CustomSelect
                                                name="Type"
                                                addMainClass="flex-1"
                                                options={[
                                                    { value: 'Dismiss', label: 'Dismiss' },
                                                    { value: 'Redirect', label: 'Redirect' },
                                                ]}
                                                value={{ value: action.type, label: action.type }}
                                                onChange={(e) => updateAction(index, { type: e.value })}
                                            />
                                            {action.type == 'Redirect' && 
                                                <InputComponent
                                                    displayName="URL"
                                                    addClass="flex-1"
                                                    value={action.url}
                                                    placeholder="Enter URL"
                                                    onChange={(e) => updateAction(index, { url: e.target.value })}
                                                />
                                            }
                                            
                                            <button
                                                onClick={() => removeAction(index)}
                                                className="text-gray-500 hover:underline hover:bg-red-200 hover:text-red-500 p-2 rounded-full text-xs"
                                            >
                                                <Trash2 className='w-4 h-4'/>
                                            </button>
                                        </div>
                                    ))
                                }
                                
                            </div>
                            {actionButtonError && <p className='text-[10px] md:text-xs font-medium mt-2'>Error: <span className='text-red-500'>{actionButtonError}</span></p>}
                            
                        </>
                    }
                    {selectedTab == 'Advanced' && 
                        <div className='mt-5 space-y-3 md:space-y-4'>
                            <ImageInput 
                                displayName="Image (optional)"
                                name="image"
                                action={action}
                                isImageEdited={isImageEdited}
                                setIsImageEdited={setIsImageEdited}
                                setData={setData}
                                value={data.image}
                            />
                            <div className='flex items-center justify-between'>
                                <div>
                                    <p className={`${theme == 'bg-skin-black' ? 'text-white' : 'text-black' } text-xs font-medium`}>Auto-dismiss</p>
                                    {data.auto_dismiss ? <p className='text-[10px] text-gray-500'>Closes after {data.auto_dismiss_duration} seconds</p> : <p className='text-[10px] text-gray-500'>disabled</p>}
                                </div>
                                <ToggleSwitch
                                    value={data.auto_dismiss}
                                    onChange={(e) => setData((prev) => ({
                                        ...prev,
                                        auto_dismiss: e,
                                        auto_dismiss_duration: e ? 3 : 0,
                                    }))}
                                />
                            </div>
                            {data.auto_dismiss && 
                                <SliderInput
                                    min={3}
                                    max={10}
                                    defaultValue={action == 'Create' ? 3 : data.auto_dismiss_duration}
                                    onChange={(val) => setData('auto_dismiss_duration', val)}
                                />
                            }
                            <ToggleSwitch
                                value={data.close_button}
                                onChange={(e) => setData('close_button', e)}
                                label="Show close button (X)"
                            />
                            <ToggleSwitch
                                value={data.confetti_effect}
                                onChange={(e) => setData('confetti_effect', e)}
                                label="Show confetti effect"
                            />
                            <ToggleSwitch
                                value={data.once_per_user}
                                onChange={(e) => setData('once_per_user', e)}
                                label="Show only once per user"
                            />
                            
                        </div>
                    }

                    <div className='mt-5 flex justify-between'>
                        <Buttonv2 name="Reset" fontWeight='font-medium' onClick={()=> {reset(); setIsImageEdited(false)}}/>
                        <Buttonv2 name="Show Announcement" icon="fa-regular fa-bell" fontWeight='font-medium' onClick={()=>setShowAnnouncementModal(true)}/>
                    </div>
                </div>
                {/* VIEW CONTAINER */}
                <div className='border-2 p-4 rounded-lg md:w-[40%] h-fit md:ml-2'>
                    <div className={`flex items-center ${theme == 'bg-skin-black' ? 'text-white' : 'text-black' }`}>
                        <Eye className='w-5 h-5 mr-2'/>
                        <p className='font-bold'>Preview</p>
                    </div>
                    <div className='relative border-2 mt-4 border-dashed rounded-lg flex flex-col items-center px-5 py-7 bg-white'>
                        {data.close_button && 
                            <div className='absolute top-3 right-3 hover:bg-red-200 p-1 rounded-full hover:text-red-500 cursor-pointer'>
                                <X className='w-4 h-4'/>
                            </div>
                        }
                        <div className='flex items-center justify-center space-x-2'>
                            {data.variant == 'Default' && <Bell className='w-5 h-5 text-black'/>}
                            {data.variant == 'Info' && <Info className='w-5 h-5 text-blue-500'/>}
                            {data.variant == 'Warning' && <TriangleAlert className='w-5 h-5 text-yellow-500'/>}
                            {data.variant == 'Success' && <CircleCheckBig className='w-5 h-5 text-green-500'/>}
                            {data.variant == 'Event' && <Calendar className='w-5 h-5 text-violet-500'/>}
                            <p className='font-medium'>{data.title}</p>
                            {data.show_new_badge && <p className={`${theme} text-white font-semibold text-xs px-2 py-0.5 rounded-full`}>New</p>}
                            
                        </div>
                        {data.image && !imageError ? (
                            <img
                            className="w-full h-32 mt-6 object-contain"
                            id="image"
                            src={
                            action === 'Update'
                                ? isImageEdited
                                ? URL.createObjectURL(data.image)
                                : `../../storage/${data.image}`
                                : action === 'Create' && data.image
                                ? URL.createObjectURL(data.image)
                                : '../../storage/${data.image}'
                            }
                            alt="Selected"
                            onError={() => setImageError(true)}
                            />
                        ) : data.image && imageError ? (
                            <div className="w-full h-24 mt-4 text-white bg-gray-300 rounded-md mb-3 overflow-hidden">
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                <ImageIcon className="h-6 w-6 mr-2" />
                                <span>Image Preview</span>
                            </div>
                            </div>
                        ) : null
                        }
                        <p className={`text-xs mt-6 whitespace-pre-line overflow-hidden ${data.description_center && 'text-center'}`}>
                            {data.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 justify-center mt-4">
                            {data.actions.map((action, index) => (
                                <div
                                key={index}
                                className={`
                                    px-3 py-2 text-sm rounded-md cursor-pointer
                                    ${action.style === "Default" && theme + " text-white hover:opacity-70"}
                                    ${action.style === "Secondary" && (theme === 'bg-skin-blue' ? 'bg-skin-blue-accent text-white hover:opacity-70' : 'bg-skin-black-secondary text-white hover:opacity-70')}
                                    ${action.style === "Destructive" && "bg-red-500 hover:opacity-70 text-white text-destructive-foreground"}
                                    ${action.style === "Outline" && "border border-input"}
                                    ${action.style === "Ghost" && (theme === 'bg-skin-blue' ? 'hover:bg-skin-blue-secondary/40 hover:text-white' : 'hover:bg-skin-black/60 hover:text-white')}
                                `}
                                >
                                    {action.label}
                                </div>
                            ))}
                        </div>
                    
                    </div>
                    <div className='mt-3 space-y-2'>
                        <p className='text-xs font-medium'>Features:</p>
                        <ul className="space-y-1 text-xs">
                        <li className="flex items-center gap-2">
                            <div
                            className={`h-2 w-2 rounded-full ${data.variant === "Default" ? "bg-primary" : `bg-${data.variant === "Info" ? "blue" : data.variant === "Warning" ? "amber" : data.variant === "Success" ? "green" : "purple"}-500`}`}
                            />
                            <span>{data.variant.charAt(0).toUpperCase() + data.variant.slice(1)} variant</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-gray-500" />
                            <span>{data.size === "Small" ? "Small" : data.size === "Medium" ? "Medium" : "Large"} size</span>
                        </li>
                        {data.show_new_badge && (
                            <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-primary" />
                            <span>Shows "NEW" badge</span>
                            </li>
                        )}
                        {data.description_center && (
                            <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-pink-500" />
                            <span>Aligns description to center</span>
                            </li>
                        )}
                        {data.close_button && (
                            <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-red-500" />
                            <span>Shows close button</span>
                            </li>
                        )}
                        {data.confetti_effect && (
                            <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-yellow-500" />
                            <span>Confetti effect</span>
                            </li>
                        )}
                        {data.auto_dismiss && (
                            <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-orange-500" />
                            <span>Auto-dismisses after {data.auto_dismiss_duration}s</span>
                            </li>
                        )}
                        {data.image && (
                            <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-indigo-500" />
                            <span>Includes image</span>
                            </li>
                        )}
                        {data.once_per_user && (
                            <li className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-teal-500" />
                            <span>Shows only once per user</span>
                            </li>
                        )}
                        </ul>
                    </div>
                </div>
            </div>
            <div className="flex justify-between mt-5">
            <Button
                type="link"
                href="/announcements"
                extendClass={`${theme}`}
                fontColor={textColorActive}
                disabled={processing}
            >
                    <span>Back</span>
            </Button>
            <Button
                type="button"
                extendClass={`${theme}`}
                fontColor={textColorActive}
                disabled={processing}
                onClick={handleConfirmModalToggle}
            >
                <span>{action === 'Create' ? 'Create' : 'Update'} Announcement</span>
            </Button>
        </div>
        </ContentPanel>
        <AnnouncementModal isOpen={showAnnouncementModal} setIsOpen={setShowAnnouncementModal} isImageEdited={isImageEdited} data={data} action={action}/>
        <Modalv2 
            isOpen={confirmModal} 
            setIsOpen={handleConfirmModalToggle}
            title="Confirmation"
            confirmButtonName={`${action === 'Create' ? 'Create' : 'Update'} Announcement`}
            content={`Are you sure you want to ${action === 'Create' ? 'Create' : 'Update'} Announcement?`}
            onConfirm={handleSubmit}
        />
    </>
  )
}

export default AnnouncementForm