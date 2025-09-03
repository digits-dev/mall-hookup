import React from "react";
import { useTheme } from "../../Context/ThemeContext";
import useThemeStyles from "../../Hooks/useThemeStyles";

const TableContainer = ({children, autoHeight, data}) => {
    const { theme } = useTheme();
    const { scrollbarTheme } = useThemeStyles(theme);
    return (
        <>
            <div className="w-full overflow-hidden relative border border-secondary rounded-md text-secondary ">
            {
                data?.length != 0 ?
                <div className={`w-full max-h-[510px] ${autoHeight ? 'min-h-[100px] max-h-[auto]' : 'h-[auto]'} overflow-auto scrollbar-thin h-32 ${scrollbarTheme} scrollbar-track-gray-200 cursor-pointer`}>
                    <table className="w-full">
                        {children}
                    </table>
                </div>
                :
                <div style={{height: "16rem"}} className={`w-full ${autoHeight ? 'min-h-[100px] max-h-[auto]' : 'h-[auto]'} overflow-auto scrollbar-thin ${scrollbarTheme} scrollbar-track-gray-200 cursor-pointer`}>
                    <table className="w-full ">
                        {children}
                    </table>
                </div>
            }
            </div>
        </>
    );
};

export default TableContainer;
