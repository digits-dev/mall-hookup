import { Head, useForm } from '@inertiajs/react'
import React, { useState } from 'react'
import ContentPanel from '../../Components/Table/ContentPanel'
import { useTheme } from '../../Context/ThemeContext'
import InputComponent from '../../Components/Forms/Input'
import CustomSelect from '../../Components/Dropdown/CustomSelect'
import Button from '../../Components/Table/Buttons/Button'
import Checkbox from '../../Components/Checkbox/Checkbox'
import Modalv2 from '../../Components/Modal/Modalv2'
import { useToast } from '../../Context/ToastContext'

const PrivilegesForm = ({modules_data, action, privilege}) => {
    const { theme } = useTheme();
    const [showModal, setShowModal] = useState(false);
    const { handleToast } = useToast();

    const { data, setData, processing, reset, post, errors } = useForm({
        id: privilege.id || "",
        privilege_name: privilege.name || "",
        theme_color: privilege.theme_color || "",
        is_superadmin:  privilege?.is_superadmin === 0 ? "No" : "Yes",
        modules: modules_data, 
    });

    const themeOption = [
        {
            value: 'skin-blue',
            label: 'Default',
        },
        {
            value: 'skin-black',
            label: 'Dark Mode',
        },
    ]

    const handleModalToggle = ()=> {
        setShowModal(!showModal);
    };

    const togglePermission = (moduleId, permission) => {
        const updatedModules = data.modules.map(module => 
            module.id === moduleId 
                ? { 
                    ...module, 
                    permissions: { 
                        ...module.permissions, 
                        [permission]: !module.permissions[permission] 
                    } 
                } 
                : module
        );
    
        setData('modules', updatedModules);
    };

    const handleSwitchToggle = (is_superadmin) => {
        const updatedModules = data.modules.map(module => ({
            ...module,
            permissions: {
                view: false,
                create: false,
                read: false,
                update: false,
                delete: false,
            }
        }));
    
        setData(prev => ({
            ...prev,
            is_superadmin,
            modules: updatedModules
        }));
    };
    
    
    
    const toggleAllPermissions = (permission) => {
        const allChecked = data.modules.every(module => module.permissions[permission]);
    
        const updatedModules = data.modules.map(module => ({
            ...module,
            permissions: { 
                ...module.permissions, 
                [permission]: !allChecked 
            }
        }));
    
        setData('modules', updatedModules);
    };
    
    
    const toggleRowPermissions = (moduleId) => {
        const module = data.modules.find(m => m.id === moduleId);
        const allChecked = Object.values(module?.permissions || {}).every(value => value);
    
        const updatedModules = data.modules.map(module => 
            module.id === moduleId 
                ? { 
                    ...module, 
                    permissions: {
                        view: !allChecked,
                        create: !allChecked,
                        read: !allChecked,
                        update: !allChecked,
                        delete: !allChecked,
                    }
                } 
                : module
        );
    
        setData('modules', updatedModules);
    };

    const handleSubmit = () => {
        if (action == 'Create'){
            post('/privileges/create_save', {
                onSuccess: (data) => {
                    const { message, type } = data.props.auth.sessions;
                    handleToast(message, type);
                },
                onError: (error) => {
                }
            });
        }
        if (action == 'Update'){
            post('/privileges/edit_save', {
                onSuccess: (data) => {
                    const { message, type } = data.props.auth.sessions;
                    handleToast(message, type);
                },
                onError: (error) => {
                }
            });
        }
        
    }
    
  return (
    <>
        <Head title='Privileges - Configuration'/>
        <ContentPanel>
            <div className='flex items-center select-none'>
              <img src="/images/others/configuration.png" className="w-6 h-6 duration-500"/>
              <p className={`${theme === 'bg-skin-black' ? ' text-white' : 'text-black/90'} font-semibold text-lg ml-3`}>User Privilege Configuration</p>
            </div>
            <div className='md:grid md:grid-cols-2 md:gap-2 space-y-2 md:space-y-0 mt-5'>
                <div className='col-span-2'>
                    <InputComponent
                        name="privilege_name"
                        value={data.privilege_name}
                        placeholder="Enter Privilege Name"
                        onChange={(e)=> setData("privilege_name", e.target.value)}
                        onError={errors.privilege_name}
                    />
                </div>
                <CustomSelect
                    placeholder="Choose Theme"
                    selectType="react-select"
                    defaultSelect="Theme"
                    onError={errors.theme_color}
                    onChange={(selectedOption) => setData("theme_color", selectedOption?.value)}
                    name="theme"
                    options={themeOption}
                    value={
                        data.theme_color
                            ? themeOption.find((option) => option.value === data.theme_color)
                            : null
                    }
                />
                <div className='mt-2 select-none'>
                    <label className={`block text-xs font-bold ${theme === 'bg-skin-black' ? ' text-gray-400' : 'text-gray-700'}  font-poppins`}>Set as Superadmin</label>
                    <div className="relative rounded-lg mt-1 flex space-x-1 overflow-hidden border-2 bg-gray-300">
                        <div
                            className={`absolute ${theme} rounded-md h-full w-1/2 transition-all duration-300 ${
                            data.is_superadmin === "Yes" ? "left-0" : "left-1/2"}`}
                        >
                        </div>
                        <button
                            className={` flex-1 py-2 z-10 outline-none text-sm font-medium
                            ${data.is_superadmin === "Yes" ? "text-white" : "text-black/50"}`}
                            onClick={() => handleSwitchToggle('Yes')}
                        >
                            Yes
                        </button>
                        <button
                            className={`flex-1 py-2 z-10 outline-none text-sm font-medium
                            ${data.is_superadmin == "No" ? "text-white" : "text-black/50"}`}
                            onClick={() => handleSwitchToggle('No')}
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
            {data.is_superadmin == 'No' && 
                <div className='mt-4 font-medium'>
                    <p className='text-sm'>Privileges Configuration</p>
                    <div className="overflow-x-auto mt-5">
                        <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                            <tr>
                                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    No
                                </th>
                                <th scope="col" className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Module Name
                                </th>
                                <th scope="col" className="px-6 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    All
                                </th>
                                <th scope="col" className="px-6 py-3 bg-blue-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex flex-col items-center">
                                        <span>View</span>
                                        <Checkbox
                                            addClass="mt-1"
                                            handleClick={() => toggleAllPermissions('view')}
                                            isChecked={data.modules.every(module => module.permissions.view)}
                                        />
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 bg-yellow-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex flex-col items-center">
                                        <span>Create</span>
                                        <Checkbox
                                            addClass="mt-1"
                                            handleClick={() => toggleAllPermissions('create')}
                                            isChecked={data.modules.every(module => module.permissions.create)}
                                        />
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 bg-indigo-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex flex-col items-center">
                                        <span>Read</span>
                                        <Checkbox
                                            addClass="mt-1"
                                            handleClick={() => toggleAllPermissions('read')}
                                            isChecked={data.modules.every(module => module.permissions.read)}
                                        />
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 bg-green-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex flex-col items-center">
                                        <span>Update</span>
                                        <Checkbox
                                            addClass="mt-1"
                                            handleClick={() => toggleAllPermissions('update')}
                                            isChecked={data.modules.every(module => module.permissions.update)}
                                        />
                                    </div>
                                </th>
                                <th scope="col" className="px-6 py-3 bg-red-100 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <div className="flex flex-col items-center">
                                        <span>Delete</span>
                                        <Checkbox
                                            addClass="mt-1"
                                            handleClick={() => toggleAllPermissions('delete')}
                                            isChecked={data.modules.every(module => module.permissions.delete)}
                                        />
                                </div>
                                </th>
                                
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-300">
                            {data.modules.map((module, index) => (
                                <tr key={module.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {module.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <Checkbox
                                            handleClick={() => toggleRowPermissions(module.id)}
                                            isChecked={Object.values(module.permissions).every(value => value)}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center bg-blue-100">
                                        <Checkbox
                                            handleClick={() => togglePermission(module.id, 'view')}
                                            isChecked={module.permissions.view}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center bg-yellow-100">
                                        <Checkbox
                                            handleClick={() => togglePermission(module.id, 'create')}
                                            isChecked={module.permissions.create}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center bg-indigo-100">
                                        <Checkbox
                                            handleClick={() => togglePermission(module.id, 'read')}
                                            isChecked={module.permissions.read}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center bg-green-100">
                                        <Checkbox
                                            handleClick={() => togglePermission(module.id, 'update')}
                                            isChecked={module.permissions.update}
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center bg-red-100">
                                        <Checkbox
                                            handleClick={() => togglePermission(module.id, 'delete')}
                                            isChecked={module.permissions.delete}
                                        />
                                    </td>
                                   
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            }
            
            <div className='flex justify-between'>
                <Button
                    type='link'
                    href="/privileges"
                    extendClass={`${theme} text-white mt-5 font-semibold w-fit`}>
                    <p className='w-full'>Back</p>
                </Button>
                <Button
                    type='button'
                    onClick={handleModalToggle}
                    extendClass={`${theme} text-white mt-5 font-semibold w-fit`}>
                    <p className='w-full'>Save Changes</p>
                </Button>
            </div>
        </ContentPanel>
        <Modalv2
            title={`${action} Confimation`}
            content={`Are you sure you want to ${action == 'Create' ? 'create' : 'update'} Privilege?`}
            confirmButtonName={`${action} Privilege`}
            confirmButtonColor={theme}
            isOpen={showModal}
            onConfirm={handleSubmit}
            setIsOpen={handleModalToggle}
        />
    </>
  )
}

export default PrivilegesForm