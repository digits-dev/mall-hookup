import React, { useEffect, useState } from "react";
import CapitalizeFirstLetter from "../../Utilities/CapitalizeFirstLetter";

const DissapearingToast = ({ type, message, setMessage, isDisappearing }) => {
    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        if (message) {
            setIsShow(true);
        } else {
            setIsShow(false);   
        }
    }, [message]);

    return (
        <>
            {isShow && (
                <div className="toast-container mb-4 flex bg-white overflow-hidden rounded-lg font-poppins">
                    <div
                        className={`w-[10px] ${
                            type == "success" ? "bg-green-500" : "bg-red-500"
                        }`}
                    ></div>
                    <div className="items-center flex ml-3">
                        <img
                            src={`/images/toast/${
                                type == "success"
                                    ? "success-icon-toast"
                                    : "error-icon-toast"
                            }.png`}
                            className="w-10 h-10"
                        />
                    </div>
                    <div className="p-3 ml-2">
                        <p className="font-extrabold text-[14px]">
                            {CapitalizeFirstLetter(type)}
                        </p>
                        <p>{message}</p>
                    </div>
                        <div className="flex-1 flex justify-end">
                            <div className="hover:bg-gray-200 w-6 h-6 flex items-center justify-center rounded-full cursor-pointer mt-2 mr-2" onClick={()=>{setMessage("")}}>
                                <i className="fa-solid fa-x text-gray-300 font-extrabold text-xs mt-[2px]"></i>
                            </div>
                        </div>
                </div>
            )}
        </>
    );
};

export default DissapearingToast;
