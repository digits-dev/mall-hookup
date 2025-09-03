import React from 'react'
import TableButton from './TableButton'
import { useState } from 'react';
import { useTheme } from '../../../Context/ThemeContext';
import useThemeStyles from '../../../Hooks/useThemeStyles';

const CustomFilter = ({children, width = '2xl'}) => {
  const {theme} = useTheme();
  const {textColor, iconThemeColor, scrollbarTheme, textColorActive, primayActiveColor} = useThemeStyles(theme)
  const childCount = React.Children.count(children);
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(!show);
  }

  const maxWidth = {
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
  }[width];

  return (
    <>
    <div className="flex-none w-20 z-[65] rounded-tr-lg ">
        <TableButton 
            extendClass={["bg-skin-white"].includes(theme)? primayActiveColor : theme} 
            fontColor={textColorActive}
            onClick={handleShow}
        > 
            <i className="fa fa-filter select-none"></i> Filters
        </TableButton>
    </div>
    {show && 
        <div className="modal-backdrop z-[100] ">
            <div className={`${theme === 'bg-skin-black' ? 'bg-black-table-color text-gray-300' : 'bg-white'} ${maxWidth}  rounded-lg shadow-custom w-full m-5`}>
                <div className={`${theme === 'bg-skin-white' ? 'bg-skin-black' : theme} rounded-t-lg flex justify-between p-3 border-b-2 items-center`}>
                    <p className={`${textColorActive} font-poppins font-extrabold text-lg`}><i className="fa fa-filter mr-2"></i>  Filter</p>
                    <i
                        className="fa fa-times-circle text-white font-extrabold text-md cursor-pointer"
                        onClick={handleShow}
                    ></i>
                </div>
                <div className="py-3 px-3 max-h-[35rem] overflow-y-auto">
                    {childCount == 0 ? 
                        <div className='flex h-32 border-2 border-dashed rounded-lg items-center justify-center select-none'>
                            <p className='font-semibold text-lg text-gray-300'>Please Add Filters</p>
                        </div> 
                    :
                        <>
                            {children}
                        </>
                    }
                    
                </div>
                
            </div>
        </div>
    }
    </>
  )
}

export default CustomFilter