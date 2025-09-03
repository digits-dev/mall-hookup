import React from "react";
import Button from "./Button";
import { useTheme } from "../../../Context/ThemeContext";
import { useToast } from "../../../Context/ToastContext";
import useThemeStyles from "../../../Hooks/useThemeStyles";

const Export = ({ path = "", page_title }) => {
    const { theme } = useTheme();
    const { handleToast } = useToast();
    const { primayActiveColor, textColorActive, buttonSwalColor } = useThemeStyles(theme);
    const handleExport = () => {
        Swal.fire({
            title: `<p class="font-poppins text-3xl">Do you want to Export ${page_title ? page_title : 'Table'}?</p>`,
            showCancelButton: true,
            confirmButtonText: "Export",
            confirmButtonColor: buttonSwalColor,
            icon: "question",
            iconColor: buttonSwalColor,
            reverseButtons: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    window.location.href = path + window.location.search;
                } catch (error) {
                    {
                        handleToast &&
                            handleToast(
                                "Something went wrong, please try again later.",
                                "Error"
                            );
                    }
                }
            }
        });
    };

    return (

        <Button
            extendClass={(['bg-skin-white'].includes(theme) ? primayActiveColor : theme)+" py-[5px] px-[10px]"}
            type="button"
            fontColor={textColorActive}
            onClick={handleExport}
        > 
            <i className="fa-solid fa-download mr-1"></i> Export
        </Button>
    )
};

export default Export;
