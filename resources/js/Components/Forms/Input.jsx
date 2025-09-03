import React, { useState } from "react";
import FormatLabelName from "../../Utilities/FormatLabelName";
import { useTheme } from "../../Context/ThemeContext";
import LoginInputTooltip from "../Tooltip/LoginInputTooltip";

const InputComponent = ({
    type = "text",
    name,
    value,
    onChange,
    placeholder,
    displayName,
    checked,
    disabled,
    addClass,
    inputClass,
    onError
}) => {
    const {theme} = useTheme();
    return (
        <div className={addClass}>
            <label
                htmlFor={name}
                className={`block text-xs font-bold ${theme === 'bg-skin-black' ? ' text-gray-400' : 'text-gray-700'}  font-poppins`}
            >
                {displayName || FormatLabelName(name)}
            </label>
            <div className="relative">
                <input
                    id={name}
                    type={type}
                    value={value}
                    name={name}
                    disabled={disabled}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`${theme === 'bg-skin-black' ? theme+' text-gray-300 disabled:bg-skin-black' : 'bg-white'} mt-1 block w-full text-xs md:text-sm px-3 py-2 border disabled:bg-gray-100  ${onError ? 'border-red-600' : 'border-accent'} placeholder:text-sm focus:ring-[1.5px] focus:ring-blue-500 placeholder:text-gray-400  rounded-md shadow-sm focus:outline-none focus:border-skin-blue sm:text-sm ${inputClass}`}
                    checked={checked}
                    style={type === "date" ? { padding: "7px", fontSize: "14px" } : {}}
                />
                {onError && 
                    <LoginInputTooltip content={onError}>
                    <i
                        className="fa-solid fa-circle-info text-red-600 absolute cursor-pointer top-1/2 text-xs md:text-base right-1.5 md:right-3 transform -translate-y-1/2">
                    </i>
                    </LoginInputTooltip>
                }
            </div>
        </div>
    );
};

export default InputComponent;
