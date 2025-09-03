import React, { useContext, useEffect, useState } from "react";
import ContentPanel from "../../Components/Table/ContentPanel";
import { Head, router } from "@inertiajs/react";
import { NavbarContext } from "../../Context/NavbarContext";
import { useProfile, useTheme } from "../../Context/ThemeContext";
import useThemeStyles from "../../Hooks/useThemeStyles";
import colorMap from "../../Components/Notification/ColorMap";
import axios from "axios";
import { useToast } from "../../Context/ToastContext";
import Modal from "../../Components/Modal/Modal";
import useThemeSwalColor from "../../Hooks/useThemeSwalColor";
import Button from "../../Components/Table/Buttons/Button";

const ProfilePage = ({ page_title, user_info, user_photo }) => {
    const { theme } = useTheme();
    const { textColor, scrollbarTheme, primayActiveColor, borderTheme, secondaryHoverBorderTheme } = useThemeStyles(theme);


    return (
        <>
            <Head title={page_title} />
            <ContentPanel>
                <div className={`${theme === 'bg-skin-black' ? ' text-white' : 'text-gray-700'} flex flex-col select-none font-parkinsans border-2 m-5 px-5 py-10 rounded-lg items-center justify-center`}>
                    {user_photo
                    ? 
                    <img src={`../storage/${user_photo.file_name}`} className="bg-white rounded-full border-[5px] border-accent/50 w-[100px] h-[100px] md:w-[120px] md:h-[120px] object-cover"/> 
                    :
                    <img src="/images/others/user-icon.png" className="bg-white rounded-full border-[5px] border-accent/50 w-[100px] h-[100px] md:w-[120px] md:h-[120px] object-cover"/>
                    }
                    
                    <p className='mt-5 md:text-xl font-bold'>{user_info.name}</p>
                    <p className='md:text-sm font-medium text-accent2 mt-2'>{user_info.email}</p>
                    <p className='mt-3 text-white bg-green-400 px-3 py-1.5 rounded-full text-sm md:text-base font-semibold'>{user_info.privilege.name}</p>
                    <Button type='link' href="/edit_profile" fontColor="text-white" extendClass={`mt-5 ${theme}`}>
                        <i className="fa-solid fa-edit mr-1"></i> Edit Profile
                    </Button>
                </div>
            </ContentPanel>
        </>
    );
};

export default ProfilePage;
