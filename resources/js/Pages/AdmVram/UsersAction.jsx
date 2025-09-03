import React, { useState } from 'react'
import Button from '../../Components/Table/Buttons/Button';
import { useTheme } from '../../Context/ThemeContext';
import { useToast } from '../../Context/ToastContext';
import useThemeStyles from '../../Hooks/useThemeStyles';
import InputComponent from '../../Components/Forms/Input';
import { router, useForm, usePage } from '@inertiajs/react';
import CustomSelect from '../../Components/Dropdown/CustomSelect';
import Modalv2 from '../../Components/Modal/Modalv2';

const UsersAction = ({action, onClose, updateData, privileges}) => {
    const { theme } = useTheme();
    const { handleToast } = useToast();
    
    const [confirmModal, setConfirmModal] = useState(false);
    const { primayActiveColor, textColorActive, buttonSwalColor } = useThemeStyles(theme);

    const { data, setData, processing, reset, post, errors } = useForm({
        id: "" || updateData.id,
        name: "" || updateData.name,
        email: "" || updateData.email,
        password: "" || updateData.password,
        id_adm_privileges: "" || updateData.id_adm_privileges,
        privilege_name: "" || updateData.privilege_name,
        status: "" || updateData.status,
    });

    const statuses = [
        {
            value: 'ACTIVE',
            label:'ACTIVE',
        },
        {
            value: 'INACTIVE',
            label:'INACTIVE',
        },
    ]

    const handleConfirmModalToggle = () => {
        setConfirmModal(!confirmModal);
    }

    const handleFormSubmit = () => {
        if (action == 'Add'){
            post('users/create', {
                onSuccess: (data) => {
                    const { message, type } = data.props.auth.sessions;
                    handleToast(message, type);
                    router.reload({ only: ["users"] });
                    reset();
                    onClose();
                },
                onError: (error) => {
                }
            });
        }
        else{
            post('users/update', {
                onSuccess: (data) => {
                    const { message, type } = data.props.auth.sessions;
                    handleToast(message, type);
                    router.reload({ only: ["users"] });
                    reset();
                    onClose();
                },
                onError: (error) => {
                }
            });
        }
    }

  return (
    <>
        <div>
            <div className='space-y-2'>
                {/* NAME */}
                <InputComponent
                    name="name"
                    value={data.name}
                    disabled={action === 'View'}
                    placeholder="Enter Name"
                    onChange={(e)=> setData("name", e.target.value)}
                />
                {(errors.name) && (
                    <div className="font-poppins text-xs font-semibold text-red-600">
                        {errors.name}
                    </div>
                )}
                {/* EMAIL */}
                <InputComponent
                    name="email"
                    value={data.email}
                    disabled={action === 'View'}
                    placeholder="Enter Email"
                    onChange={(e)=> setData("email", e.target.value)}
                />
                {(errors.email) && (
                    <div className="font-poppins text-xs font-semibold text-red-600">
                        {errors.email}
                    </div>
                )}
                {/* PRIVILEGE */}
                {action == 'View' && 
                    <InputComponent
                        displayName="Privilege"
                        value={data.privilege_name}
                        disabled={action === 'View'}
                        onChange={()=>{}}
                        placeholder="Enter Privilege"
                    />
                }
                {(action == 'Update' || action == 'Add') && 
                    (   <CustomSelect
                            placeholder="Choose Privilege"
                            selectType="react-select"
                            defaultSelect="Select Privilege"
                            onChange={(selectedOption) => setData((prevData) => ({
                                ...prevData,
                                id_adm_privileges: selectedOption?.value,
                                privilege_name: selectedOption?.label
                            }))}
                            menuPlacement="top"
                            name="privilege"
                            isStatus={action == "Update"}
                            options={privileges}
                            value={data.id_adm_privileges ? { label: data.privilege_name, value: data.id_adm_privileges } : null}
                        />
                    )
                }
                {(errors.privilege_name) && (
                    <div className="font-poppins text-xs font-semibold text-red-600">
                        {errors.privilege_name}
                    </div>
                )}
                
                 {/* PASSWORD */}
                 {action != "View" && 
                    <InputComponent
                        name="password"
                        value={data.password}
                        disabled={action === 'View'}
                        placeholder="Enter Password"
                        onChange={(e)=> setData("password", e.target.value)}
                    />
                }
                {(errors.password) && (
                    <div className="font-poppins text-xs font-semibold text-red-600">
                        {errors.password}
                    </div>
                )}

                {/* STATUS */}
                {action == 'Update' && 
                    <>
                        <CustomSelect
                            placeholder="Choose Status"
                            selectType="react-select"
                            defaultSelect="Select Status"
                            onChange={(selectedOption) => setData("status", selectedOption?.value)}
                            name="status"
                            menuPlacement="top"
                            options={statuses}
                            value={data.status ? { label: data.status, value: data.status } : null}
                        />
                        {(errors.status) && (
                            <div className="font-poppins text-xs font-semibold text-red-600">
                                {errors.status}
                            </div>
                        )}
                    </>
                }
        
                {action == "View" && 
                    <div className='flex items-center space-x-2'>
                        <div className={`block text-sm font-bold ${theme === 'bg-skin-black' ? ' text-gray-400' : 'text-gray-700'}  font-poppins`}>
                            Status
                        </div>
                        <div className={`select-none ${data.status == 'ACTIVE' ? 'bg-status-success': 'bg-status-error'} mb-2 text-sm font-poppins font-semibold py-1 px-3 text-center text-white rounded-full mt-2`}>
                            {data.status}
                        </div>
                    </div>
                }
            </div>
            
            
            {action !== 'View' && 
                <div className='flex justify-end mt-5'>
                    <Button
                        type="button"
                        extendClass={`${theme === 'bg-skin-white' ? primayActiveColor : theme}`}
                        fontColor={textColorActive}
                        disabled={processing}
                        onClick={handleConfirmModalToggle}
                    >
                    {processing ? 
                        (
                            action === "Add" ? 'Submitting' : 'Updating'
                        ) 
                        : 
                        (
                            <span>
                                <i className={`fa-solid ${action === "Add" ? 'fa-plus' : 'fa-pen-to-square' } mr-1`}></i> {action === "Add" ? 'Add User' : 'Update User'}
                            </span>
                        )
                    }
                    </Button>  
                </div>
            }
            
        </div>
        <Modalv2 
            isOpen={confirmModal} 
            setIsOpen={handleConfirmModalToggle}
            title="Confirmation"
            confirmButtonName={`${action} User`}
            content={`Are you sure you want to ${action} User?`}
            onConfirm={handleFormSubmit}
        />
    </>
  )
}

export default UsersAction