import React, { useState } from "react";
import { useTheme } from "../../Context/ThemeContext";
import { router } from "@inertiajs/react";

const RowStatus = ({
    children,
    systemStatus,
    isLoading,
    center,
    color,
    addClass,
    addStatusClass,
}) => {
    const { theme } = useTheme();
    const systemStatusColor = {
        active: "bg-status-success",
        inactive: "bg-status-error",
        yellow: "bg-yellow-500",
        cyan: "bg-cyan-400",
        red: "bg-red-500",
        green: "bg-green-500",
    }[systemStatus];

    const [loading, setLoading] = useState(false);

    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    return (
        <td
            className={`${center && "text-center"} px-6 py-3 ${addClass} ${
                theme === "bg-skin-black"
                    ? theme + " text-gray-300"
                    : "bg-white"
            }`}
        >
            {loading ? (
                <span className="animate-pulse inline-block w-3/4 rounded-lg h-4 p-auto bg-gray-200">
                    &nbsp;&nbsp;
                </span>
            ) : (
                <>
                    {systemStatusColor ? (
                        <div
                            className={`mx-auto ${addStatusClass} rounded-full w-fit text-[12px] text-white px-[9px] py-[2px] ${systemStatusColor} `}
                        >
                            {children}
                        </div>
                    ) : (
                        <div
                            style={{ background: color }}
                            className={`mx-auto ${addStatusClass} w-fit text-[12px] rounded-[9px] ${
                                color && "text-white"
                            } px-3 py-1 `}
                        >
                            {children}
                        </div>
                    )}
                </>
            )}
        </td>
    );
};

export default RowStatus;
