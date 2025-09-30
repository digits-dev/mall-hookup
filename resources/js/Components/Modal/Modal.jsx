import React from "react";
import LoadingIcon from "../Table/Icons/LoadingIcon";
import Button from "../Table/Buttons/Button";
import { useTheme } from "../../Context/ThemeContext";
import useThemeStyles from "../../Hooks/useThemeStyles";

const Modal = ({
    show,
    onClose,
    children,
    title,
    icon,
    modalLoading,
    width = "lg",
    fontColor,
    loading,
    onClick,
    withButton,
    btnIcon,
    isDelete,
}) => {
    if (!show) {
        return null;
    }

    const maxWidth = {
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        "2xl": "max-w-2xl",
    }[width];

    const { theme } = useTheme();
    const { textColor, primayActiveColor, textColorActive } =
        useThemeStyles(theme);
    return (
        <>
            {modalLoading ? (
                <div className="modal-backdrop z-[120]">
                    <div className="bg-transparent rounded-lg w-32 m-5 ">
                        <main className="py-5 px-5 flex items-center justify-center">
                            <LoadingIcon classes="h-14 w-14 fill-white" />
                        </main>
                    </div>
                </div>
            ) : (
                <div className="modal-backdrop z-[100] ">
                    <div
                        className={`${
                            theme === "bg-skin-black"
                                ? "bg-black-table-color text-gray-300"
                                : "bg-white"
                        }   rounded-lg shadow-custom ${maxWidth} w-full m-5`}
                    >
                        <div
                            className={`${
                                theme === "bg-skin-white"
                                    ? "bg-skin-black"
                                    : theme
                            } rounded-t-lg flex justify-between p-3 border-b-2 items-center`}
                        >
                            <p
                                className={`${fontColor} font-poppins font-medium text-sm md:text-base`}
                            >
                                {icon && <i className={`${icon} mr-2`}></i>}
                                {title}
                            </p>
                            <i
                                className="fa fa-times-circle text-white font-extrabold text-md cursor-pointer"
                                onClick={(e) => onClose(e, "close")}
                            ></i>
                        </div>
                        <main className="py-3 px-3 max-h-[35rem] overflow-y-auto">
                            {children}
                        </main>
                        {withButton && (
                            <div className="p-2 border-t-2 mt-3">
                                <Button
                                    onClick={(e) => onClose(e, "close")}
                                    extendClass={`bg-skin-default border-[1px] border-gray-400`}
                                    fontColor={
                                        theme === "bg-skin-black"
                                            ? "text-gray-900"
                                            : textColor
                                    }
                                >
                                    <i
                                        className={`fa fa-times-circle ${
                                            theme === "bg-skin-black"
                                                ? "text-gray-900"
                                                : textColor
                                        }`}
                                    ></i>{" "}
                                    Close
                                </Button>
                                {isDelete && (
                                    <Button
                                        extendClass="bg-red-500 float-right"
                                        fontColor={fontColor}
                                        onClick={(e) => onClick(e, "delete")}
                                    >
                                        <i className="fa fa-trash px-1"></i>{" "}
                                        Delete
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    extendClass={`${
                                        theme === "bg-skin-white"
                                            ? primayActiveColor
                                            : theme
                                    } float-right mr-1`}
                                    disabled={loading}
                                    fontColor={fontColor}
                                    onClick={(e) => onClick(e, "update")}
                                >
                                    <i className={btnIcon}></i>{" "}
                                    {loading ? "Updating..." : "Update"}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
