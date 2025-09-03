import { usePage } from "@inertiajs/react";
import React, { useContext, useEffect } from "react";
import BreadCrumbs from "../../Components/Table/BreadCrumbs";
import { NavbarContext } from "../../Context/NavbarContext";
import { ToastProvider } from "../../Context/ToastContext";
import { useTheme } from "../../Context/ThemeContext";

const AppContent = ({ children }) => {
    const {theme} = useTheme();

    return (
        <>
            <div id="app-content" className={`h-full ${theme === 'bg-skin-black' ? 'bg-black-screen-color' : 'bg-screen-color'} p-4`}>
                <BreadCrumbs></BreadCrumbs>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </div>
        </>
    );
};

export default AppContent;
