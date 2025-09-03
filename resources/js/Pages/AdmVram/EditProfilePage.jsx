import { Head, useForm } from '@inertiajs/react';
import React, { useEffect, useRef, useState } from 'react'
import Button from '../../Components/Table/Buttons/Button';
import Modalv2 from '../../Components/Modal/Modalv2';
import { useToast } from '../../Context/ToastContext';
import ContentPanel from '../../Components/Table/ContentPanel';
import InputComponent from '../../Components/Forms/Input';
import { useTheme } from '../../Context/ThemeContext';

const EditProfilePage = ({user_info, user_photo}) => {
    const { theme } = useTheme();
    const [selectedImage, setSelectedImage] = useState(null);
    const [photoName, setPhotoName] = useState(null);
    const [isButtonDisable, setIsButtonDisable] = useState(true);
    const [openConfirmModal, setOpenConfirmModal] = useState(false);

    const fileInputRef = useRef(null);
    
    const { handleToast } = useToast();
    
    const { data, setData, post, errors, progress } = useForm({
        profile_photo: null,
    });


    
    const handleImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setSelectedImage(URL.createObjectURL(file));
            setData("profile_photo", file);
            setPhotoName(file.name);
            setIsButtonDisable(false);
        }
    };

    const handleRemoveImage = () => {
        setSelectedImage(null);
        setData("profile_photo", null);
        setPhotoName(null);
        setIsButtonDisable(true);

        if (fileInputRef.current) {
            fileInputRef.current.value = null;
        }
    }

    const handleSubmit = () =>{
        post("/update_profile", {
          onSuccess: (data) => {
              const { message, type } = data.props.auth.sessions;
              handleToast(message, type);
          },
          onError: (newErrors) => {
              console.log(newErrors);
          }
      }); 
    }

  return (

    <>
        <Head title='Edit Profile'/>
        <ContentPanel>
            <div className={`${theme === 'bg-skin-black' ? ' text-white' : 'text-gray-700'} flex h-full space-y-3 md:space-y-0 md:space-x-5 flex-col md:flex-row`}>
                <div className='border-2 md:w-[40%] rounded-lg p-5 md:p-10 flex select-none flex-col items-center justify-center'>
                    <p className="font-bold mb-5 text-xl">
                        Your Profile Photo
                    </p>
                    <div className='w-40 h-40 md:w-80 md:h-80 border-4 md:border-8 rounded-full  overflow-hidden  border-accent2 items-center justify-center relative'>
                        {selectedImage ? (
                            <>
                                <img
                                    className="w-full h-full absolute object-contain"
                                    id="image"
                                    src={selectedImage}
                                    alt="Selected"
                                />
                                <div className='h-full w-full absolute items-center justify-center bg-black/50 flex'>
                                    <div className='absolute z-0 font-semibold border-dashed border-white text-white text-xs md:text-xl border md:border-2 rounded-lg p-3'>
                                        CHANGE PHOTO
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>  
                                {user_photo
                                    ? 
                                        <img
                                            className="w-full h-full absolute object-fit"
                                            id="image"
                                            src={`../storage/${user_photo.file_name}`}
                                            alt="Upload"
                                        />
                                    :
                                        <img
                                            className="w-full h-full absolute object-fit"
                                            id="image"
                                            src="/Images/Others/user-icon.png"
                                            alt="Upload"
                                        />
                                }
                                
                                <div className='h-full w-full absolute items-center justify-center bg-black/50 flex'>
                                    <div className='absolute z-0 font-semibold border-dashed  border-white text-white text-xs md:text-xl border md:border-2 rounded-lg p-3'>
                                        UPLOAD PHOTO
                                    </div>
                                </div>
                                
                            </>
                        )}     
                        <input
                            required
                            id="input-file"
                            name="image"
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            className="w-full z-20 h-full rounded-full opacity-0 cursor-pointer"
                            onChange={handleImageChange}
                        />
                    </div>

                    {photoName && 
                        <p className='text-sm mt-5 max-w-96 text-center'><span className='font-bold text-accent2'>File Name:</span> {photoName} <span className='text-red-500 cursor-pointer border-2 p-0.5 border-red-500 rounded-lg text-xs font-bold' onClick={handleRemoveImage}>Remove</span></p>
                    }
                
                    <p className="text-sm mt-5 text-slate-500">
                        File Supported: JPEG, PNG, GIF
                    </p>

            
                    
                </div>
                <div className='border-2 md:w-[60%] rounded-lg p-5 select-none'>
                    <p className="font-bold mb-5 text-lg">
                        Your Profile Information
                    </p>
                    <div className='flex space-x-3'>
                        <InputComponent
                            name="Name"
                            value={user_info.name}
                            disabled={true}
                            addClass="flex-1"
                        />
                        <InputComponent
                            name="Email"
                            value={user_info.email}
                            disabled={true}
                            addClass="flex-1"
                        />
                    </div>
                    <InputComponent
                            name="Privilege"
                            value={user_info.privilege.name}
                            disabled={true}
                            addClass="flex-1 mt-2"
                        />
                    <div className='flex space-x-2 justify-end mt-5'>
                        <Button extendClass="bg-gray-100" type='link' href="/profile" >
                            Cancel
                        </Button>
                        <Button extendClass={`${theme} bg-gray-100`} fontColor="text-white" type='button' href="/profile" disabled={isButtonDisable} onClick={()=>{setOpenConfirmModal(true)}} >
                            <i className="fa-solid fa-edit mr-1"></i>Submit Changes
                        </Button>
                    </div>
            
                </div>
            </div>
        </ContentPanel>
        <Modalv2 
            isOpen={openConfirmModal} 
            setIsOpen={setOpenConfirmModal}
            title="Profile Information Change"
            content="Are you sure you want to change your profile information? This action cannot be undone"
            onConfirm={handleSubmit}
        />
    </>
    
  )
}

export default EditProfilePage