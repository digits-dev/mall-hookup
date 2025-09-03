import React, { Fragment } from "react";
import { Link } from "@inertiajs/react";
import useViewport from "../../Hooks/useViewport";
import useThemeStyles from "../../Hooks/useThemeStyles";
import { useTheme } from "../../Context/ThemeContext";



const   Pagination = ({ paginate, onClick, extendClass }) => {
    const { width } = useViewport();
    const mobileView = width < 640 ? true : false ;
    const { theme } = useTheme();
    const { paginationHoverColor, primayActiveColor, paginationSideActiveColor, textColor } = useThemeStyles(extendClass);
    
    return (
        <div onClick={onClick} className="flex justify-between items-center w-full gap-2 mt-2">
            {mobileView ? 
            <>
                {paginate.prev_page_url ? 
                    <Link
                        href={paginate.prev_page_url}
                        preserveState
                        preserveScroll
                        className={`text-white block px-2 py-[6px] text-sm  rounded-md  ${extendClass === 'bg-skin-white' ? primayActiveColor : extendClass} ${extendClass === 'bg-skin-white' ? 'hover:bg-skin-white-hover' : paginationHoverColor} shadow-md `}
                    >
                    « Previous
                    </Link> : 
                    <span className={`text-white block px-2 py-[6px] text-sm  rounded-md  ${extendClass === 'bg-skin-white' ? primayActiveColor : extendClass} shadow-md opacity-50 cursor-not-allowed`}>
                        « Previous
                    </span>
                }

                {paginate.next_page_url ? 
                    <Link
                        href={paginate.next_page_url}
                        preserveState
                        preserveScroll
                        className={`text-white block px-2 py-[6px] text-sm  rounded-md  ${extendClass === 'bg-skin-white' ? primayActiveColor : extendClass} ${extendClass === 'bg-skin-white' ? 'hover:bg-skin-white-hover' : paginationHoverColor} shadow-md `}
                    >
                    Next »
                    </Link> :    
                    <span className={`text-white block px-2 py-[6px] text-sm  rounded-md  ${extendClass === 'bg-skin-white' ? primayActiveColor : extendClass} shadow-md opacity-50 cursor-not-allowed`}>
                        Next »
                    </span>
                }
            </> 
            // Desktop View
            :
            <>
                <span className="text-gray-500 font-medium text-sm ">
                   {paginate.data.length != 0 ? 
                   `Showing ${paginate.from} to ${paginate.to} of ${paginate.total} results.` 
                   : 
                   `Showing 0 results.`} 
                </span>

                <nav className="inline-flex p-2 space-x-1">
                    {paginate.links.map((link, index) => {
                        const Label = index == 0
                            ? <i className="fa-solid fa-chevron-left text-xs"></i>
                            : paginate.links.length - 1 == index
                            ? <i className="fa-solid fa-chevron-right text-xs"></i>
                            : link.label;

                        return <Fragment key={"page" + link.label + 'index' + index}>
                        {link.url ? 

                        <Link
                            href={link.url}
                            preserveScroll
                            preserveState
                            className={`text-white inline-flex items-center justify-center p-3 py-2 w-9 h-9 font-medium rounded-full text-xs  hover:opacity-70
                                ${link.active ? theme == 'bg-skin-blue' ? "bg-skin-blue-accent text-white" : 'bg-gray-500 text-white' : theme} ${!link.url && "cursor-not-allowed "}`}
                        >
                            {Label}
                        </Link> 
                        :
                        <span className={`text-white inline-flex opacity-50 items-center justify-center p-3 py-2 w-9 h-9 rounded-full font-medium text-xs  ${theme} bg-accent2 hover:opacity-70 disabled:opacity-80
                            cursor-not-allowed `}>
                                {Label}
                        </span>}
                      </Fragment>
                    })}
                </nav>
            </>
            }
         
        </div>
    );
};

export default Pagination;
