import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
 import React, { useState, useEffect } from 'react';
 import { useToast } from '../../../Context/ToastContext';
 import { useTheme } from '../../../Context/ThemeContext';
 import CustomSelect from '../../../Components/Dropdown/CustomSelect';
 import InputComponent from '../../../Components/Forms/Input';
 import Button from '../../../Components/Table/Buttons/Button';
 import Modalv2 from '../../../Components/Modal/Modalv2';
 
 const ModuleGeneratorAction = ({ onClose, database_tables }) => {
     const { theme } = useTheme();
     const { handleToast } = useToast();
     const [showModal, setShowModal] = useState(false);
 
     const { data, setData, processing, reset, post, errors } = useForm({
         table_name: "",
         name: "",
         path: "",
         icon: "",
     });
 
     const handleModalToggle = ()=> {
         setShowModal(!showModal);
     };
 
     const handleSubmit = () => {
         post('/module_generator/create_module', {
             onSuccess: (data) => {
                 const { message, type } = data.props.auth.sessions;
                 handleToast(message, type);
             },
             onError: (error) => {
             }
         });
     };

 
     return (
         <>
             <div className='space-y-2'>
                 <CustomSelect
                     placeholder="Choose Table"
                     selectType="react-select"
                     defaultSelect="Table"
                     onError={errors.table_name}
                     onChange={(selectedOption) => setData("table_name", selectedOption?.value)}
                     name="table_name"
                     options={database_tables}
                    //  value={
                    //      data.table_name
                    //          ? database_tables.find((option) => option.value === data.table_name)
                    //          : null
                    //  }
                 />
                 <InputComponent
                     name="module_name"
                     value={data.name}
                     placeholder="Enter Module Name"
                     onChange={(e)=> setData("name", e.target.value)}
                     onError={errors.name}
                 />
                 <InputComponent
                     name="path"
                     value={data.path}
                     placeholder="Enter Path"
                     onChange={(e)=> setData("path", e.target.value)}
                     onError={errors.path}
                 />
                 <InputComponent
                     name="icon"
                     value={data.icon}
                     placeholder="Enter Icon (eg. fa-regular fa-circle)"
                     onChange={(e)=> setData("icon", e.target.value)}
                     onError={errors.icon}
                 />
                 <div>
                     <Button
                         type='button'
                         onClick={handleModalToggle}
                         extendClass={`${theme} text-white mt-3 font-semibold w-full`}>
                         <p className='w-full'>Create Module</p>
                     </Button>
                 </div>
             </div>
             <Modalv2
                 title={`Module Creation Confimation`}
                 content={`Are you sure you want to create this Module?`}
                 confirmButtonName={`Create Module`}
                 confirmButtonColor={theme}
                 isOpen={showModal}
                 onConfirm={handleSubmit}
                 setIsOpen={handleModalToggle}
             />
         </>
     );
 };
 
 export default ModuleGeneratorAction;