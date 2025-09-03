import { router, useForm } from '@inertiajs/react';
import React, { useRef, useState } from 'react'
import CustomSelect from '../../../Components/Dropdown/CustomSelect';
import InputComponent from '../../../Components/Forms/Input';
import Buttonv2 from '../../../Components/Table/Buttons/Buttonv2';
import Modalv2 from '../../../Components/Modal/Modalv2';
import { useToast } from '../../../Context/ToastContext';
import { useTheme } from '../../../Context/ThemeContext';
import LoginInputTooltip from '../../../Components/Tooltip/LoginInputTooltip';

const DashboardSettingsAction = ({action, initialData, privileges, onClose}) => {
    const { handleToast } = useToast();
    const { theme } = useTheme();
    const fileInputRef = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [photoName, setPhotoName] = useState(initialData.logo);

    const { data, setData, processing, reset, post, errors } = useForm({
        id: "" || initialData.id,
        name: "" || initialData.name,
        description: "" || initialData.description,
        privileges: initialData.privileges ? initialData.privileges.map((option) => ({
            value: option.get_privilege?.id,
            label: option.get_privilege?.name,
        })) : [],
        url: "" || initialData.url,
        status: "" || initialData.status == 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
        logo: "" || initialData.logo,
    });

    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedImage(URL.createObjectURL(file));
            setData("logo", file);
            setPhotoName(file ? file.name : "No image chosen");
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click()
    }

    const [showModal, setShowModal] = useState(false);

    const statuses = [
        {
            value:'ACTIVE',
            label: 'ACTIVE',
        },
        {
            value:'INACTIVE',
            label: 'INACTIVE',
        },
    ];

    const handleSubmit = () => { 

        if (action == 'Add'){
            post('/settings/add_embedded_dashboard', {
               onSuccess: (data) => {
                   const { message, type } = data.props.auth.sessions;
                   handleToast(message, type);
                   router.reload({ only: ["embedded_dashboards"] });

                   if (message && type){
                        onClose();
                        reset();
                   }
                 
               },
               onError: (error) => {
               }
           });
        }

        if (action == 'Update'){
            post('/settings/update_embedded_dashboard', {
                onSuccess: (data) => {
                    const { message, type } = data.props.auth.sessions;
                    handleToast(message, type);
                    router.reload({ only: ["embedded_dashboards"] });
                    if (message && type){
                        onClose();
                        reset();
                   }
                },
                onError: (error) => {
                }
            });
        }
   }
   
   const handleModalToggle = ()=> {
       setShowModal(!showModal);
   };

  return (
    <>
        <div className='space-y-2'>
            {action != "View" && 
            <div>
                <label
                    className={`block text-xs font-bold ${theme === 'bg-skin-black' ? ' text-gray-400' : 'text-gray-700'}  font-poppins`}
                >
                    Logo
                </label>
                <div className={`flex items-center relative w-full mt-1 text-xs overflow-hidden rounded-md border ${errors.logo ? 'border-red-600' : 'border-accent'}`}>
                    <button
                        onClick={handleButtonClick}
                        className={`${theme} text-white text-xs px-4 py-2.5 rounded-md font-medium`}
                        type="button"
                    >
                        {photoName ? 'Change Image' : 'Choose Image'}
                    </button>
                    <div className={`${!photoName && 'text-gray-500'} px-4 py-2 flex-1 truncate w-full`}>{photoName ? photoName : 'No image chosen'}</div>
                    <input ref={fileInputRef} type="file" className="hidden" onChange={handleImageChange} />
                    {errors.logo && 
                        <LoginInputTooltip content={errors.logo}>
                        <i
                            className="fa-solid fa-circle-info text-red-600 absolute cursor-pointer top-1/2 text-xs md:text-base right-1.5 md:right-3 transform -translate-y-1/2">
                        </i>
                        </LoginInputTooltip>
                    }
                </div>
            </div>
            }
            {action == "View" && 
                <div className='flex flex-col'>
                    <div className={`block text-xs font-bold ${theme === 'bg-skin-black' ? ' text-gray-400' : 'text-gray-700'}  font-poppins`}>
                        Access Privileges
                    </div>
                    <div className='flex space-x-1 mt-1'>
                        {data.privileges && data.privileges?.map((privilege, index)=>(
                            <p key={privilege.name + privilege.value} className='text-[8px] text-nowrap bg-cyan-400 w-fit text-white px-2  py-0.5 rounded-full font-semibold'>{privilege.label}</p>
                        ))}
                    </div>
                </div>
            }
            {action != "View" && 
                <CustomSelect
                    placeholder="Choose Privilege/s"
                    selectType="react-select"
                    isMulti
                    onError={errors.privileges}
                    value={data.privileges.map((option)=> ({value:option?.value, label:option?.label}))}
                    name="privileges"
                    displayName="Access Privileges"
                    isStatus={false}
                    options={privileges}
                    onChange={(selectedOptions) => {
                        setData((prevData) => ({
                            ...prevData,
                            privileges: selectedOptions.map((option) => ({
                                value: option.value,
                                label: option.label,
                            })),
                        }));
                    }}
                />
            }
            <InputComponent
                name="name"
                displayName="Dashboard Name"
                value={data.name}
                onError={errors.name}
                disabled={action === 'View'}
                placeholder="Add Dashboard Name"
                onChange={(e)=> setData("name", e.target.value)}
            />
            <InputComponent
                name="description"
                displayName="Dashboard Description"
                value={data.description}
                onError={errors.description}
                disabled={action === 'View'}
                placeholder="Add Dashboard Description (min:60 characters)"
                onChange={(e)=> setData("description", e.target.value)}
            />
            <InputComponent
                name="url"
                displayName="Dashboard URL"
                value={data.url}
                onError={errors.url}
                disabled={action === 'View'}
                placeholder="Add Dashboard URL"
                onChange={(e)=> setData("url", e.target.value)}
            />

            {action == 'Update' && 
                <CustomSelect
                    placeholder="Choose Status"
                    defaultSelect="Select Status"
                    onChange={(selectedOption) => setData("status", selectedOption?.value)}
                    name="status"
                    menuPlacement="top"
                    onError={errors.status}
                    options={statuses}
                    value={data.status ? { label: data.status, value: data.status } : null}
                />
            }

            {action == "View" && 
                <div className='flex items-center space-x-2'>
                    <div className={`block text-xs font-bold ${theme === 'bg-skin-black' ? ' text-gray-400' : 'text-gray-700'}  font-poppins`}>
                        Status
                    </div>
                    <div className={`select-none ${data.status == 'ACTIVE' ? 'bg-status-success': 'bg-status-error'} mb-2 text-xs font-poppins font-semibold py-1 px-3 text-center text-white rounded-full mt-2`}>
                        {data.status}
                    </div>
                </div>
            }
        </div>
        {action != 'View' && 
            <div className='flex justify-end mt-5'>
                <Buttonv2 name={action === 'Add' ? 'Add Dashboard' : 'Update Dashboard'} onClick={handleModalToggle}/>
            </div>
        }
       
        <Modalv2
            title="Embedded Dashboard Confirmation"
            content={`Are you sure you want to ${action == 'Add' ? 'create' : 'update'} Dashboard?`}
            confirmButtonName={`${action == 'Add' ? 'Create' : 'Update'} Dashboard`}
            isOpen={showModal}
            onConfirm={handleSubmit}
            setIsOpen={handleModalToggle}
        />
    </>
  )
}

export default DashboardSettingsAction