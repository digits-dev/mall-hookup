import React, { useState } from "react";
import { useTheme } from "../../Context/ThemeContext";
import { router } from "@inertiajs/react";

const RowData = ({ children, sticky, center, isLoading, addClass }) => {
    const {theme} = useTheme();

    const [loading, setLoading] = useState(false);

    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    const stickyClass = {
        left: `sticky left-0 top-0 z-40 after:absolute after:top-0 after:right-0 after:z-40  after:h-full after:w-[0.60px] ${theme === 'bg-skin-black' ? theme+' text-gray-300' : 'bg-white'}`,
        right: `sticky right-0 top-0 z-40 before:absolute before:top-0 before:left-0  before:z-40  before:h-full before:w-[0.60px] ${theme === 'bg-skin-black' ? theme+' text-gray-300' : 'bg-white'}`,
    }[sticky];

    return (
        <td
            className={`px-4 py-2 ${theme === 'bg-skin-black' ? theme+' text-gray-400' : 'bg-white'} ${addClass}  text-[13px] border border-secondary border-t-0 border-b-0 first:border-l-0 last:border-r-0  ${stickyClass} ${
                center && "text-center"
            }`}
        >
            {loading ? (
                <span className="animate-pulse inline-block w-3/4 rounded-lg h-4 p-auto bg-gray-200">
                    &nbsp;&nbsp;
                </span>
            ) : (
                <div>
                    {children}
                </div>
                
            )}
        </td>
    );
};

export default RowData;
