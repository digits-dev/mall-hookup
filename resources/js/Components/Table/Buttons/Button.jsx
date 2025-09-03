import { Link, router } from "@inertiajs/react";
import React, { useState } from "react";

const Button = ({
    children,
    onClick,
    disabled,
    extendClass,
    type = "button",
    href,
    fontColor
}) => {
    const [loading, setLoading] = useState(false);
        
    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    return (

        <>
            {type == "button" ? (
                <button
                    onClick={onClick}
                    disabled={disabled ? disabled : loading}
                    className={`${fontColor} overflow-hidden disabled:cursor-not-allowed border border-gray-500 rounded-md font-poppins text-sm px-2 py-2 hover:opacity-80 ${extendClass}`}
                >
                     <div className="text-[10px] md:text-sm flex items-center">{children}</div>
                </button>
            ) : (
                loading ? (
                    <span
                        className={`${fontColor} pt-2 overflow-hidden border border-gray-500 rounded-md font-poppins text-sm px-2 py-2 opacity-70 cursor-not-allowed ${extendClass}`}
                    >
                        <div className="text-[10px] md:text-sm flex items-center">{children}</div>
                    </span>
                ):
                (
                    <Link
                        href={href}
                        className={`${fontColor} pt-2 overflow-hidden border border-gray-500 rounded-md font-poppins text-sm px-2 py-2 hover:opacity-80 ${extendClass}`}
                    >
                         <div className="text-[10px] md:text-sm flex items-center">{children}</div>
                    </Link>
                )
            )}
        </>
    );
};

export default Button;
