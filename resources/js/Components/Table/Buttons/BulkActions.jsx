import React, { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../../Context/ThemeContext';
import useThemeStyles from '../../../Hooks/useThemeStyles';
import TableButton from './TableButton'

const BulkActions = ({disabled, setData, onConfirm, itemName}) => {

    const {theme} = useTheme();
    const {textColor, bulkActionTextColor, borderTheme, textColorActive, primayActiveColor, bulkActionCancelButtonColor} = useThemeStyles(theme)

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [bulkAction, setBulkAction] = useState(null);

    const notifRef = useRef(null);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const handleClickOutside = (event) => {
        if (notifRef.current && !notifRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
    };

    const handleMenuToggle = ()=> {
        if (!disabled){
            setIsMenuOpen(!isMenuOpen);
        }
    }

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    }

  return (
    <>
        <div ref={notifRef} className={`z-[60] select-none relative inline-block text-left font-poppins ${disabled ? 'opacity-50' : 'opacity-100' }`}>
            <div className={`${theme === 'bg-skin-black' ? 'bg-black-table-color text-gray-300' : 'bg-white'} outline-none rounded-md flex gap-3 items-center justify-center font-semibold border-2 ${borderTheme} px-3 py-2 md:px-3.5 md:py-2.5  w-full h-[2.4rem] ${disabled ? 'cursor-not-allowed' : 'cursor-pointer' }`} onClick={handleMenuToggle}>
                <i className={`${bulkActionTextColor}  ${isMenuOpen ? 'fa-solid' : 'fa-regular'} fa-square-check text-xs md:text-base transform transition-transform duration-200 `}></i>
                <p className={`${bulkActionTextColor} text-[10px] md:text-xs`}>Bulk Actions</p>
                <i className={`${bulkActionTextColor} fa-solid fa-caret-down text-xs md:text-base transform transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}></i>
            </div>
            <div
                className={`${theme === 'bg-skin-black' ? 'bg-black-table-color text-gray-300' : 'bg-white'} absolute left-0 z-10 mt-1 w-full origin-top-left rounded-md overflow-hidden shadow-xl border border-white border-primary/15 transition  focus:outline-none duration-300 ease-in-out ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
            >
                <div className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${theme === 'bg-skin-black' ? 'hover:bg-black/20' : 'hover:bg-gray-200'}`} onClick={()=>{handleMenuToggle(); handleModalToggle(); setBulkAction('Active'); setData('bulkAction', 'ACTIVE');}}>
                    <i className={`fa-solid fa-circle-check text-green-500 text-wrap text-xs md:text-base`}></i>
                    <p className='text-[10px] md:text-xs font-medium text-nowrap'>Set as Active</p>
                </div>
                <div className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${theme === 'bg-skin-black' ? 'hover:bg-black/20' : 'hover:bg-gray-200'}`} onClick={()=>{handleMenuToggle(); handleModalToggle(); setBulkAction('Inactive'); setData('bulkAction', 'INACTIVE');}}>
                    <i className={`fa-solid fa-circle-xmark text-red-500 text-wrap text-xs md:text-base`}></i>
                    <p className='text-[10px] md:text-xs font-medium '>Set as Inactive</p>
                </div>
                
            </div>
        </div>

        {/* MODAL */}
        <div className={`fixed inset-0 z-100 select-none w-screen font-parkinsans h-screen bg-black/50 flex justify-center items-center duration-100 ease-in ${isModalOpen ? 'opacity-100' : 'opacity-0  pointer-events-none'} `}>
            <div className={`${theme === 'bg-skin-black' ? 'bg-black-table-color text-gray-300' : 'bg-white'} p-5 max-w-[30rem] w-full m-5 rounded-lg shadow-lg duration-300 ease-in-out ${isModalOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                <i className="fa-solid fa-xmark absolute top-4 right-4 text-gray-400 px-1 py-0.5 rounded-full hover:bg-gray-100 cursor-pointer" onClick={handleModalToggle}></i>
            
                <>
                    <p className={`${theme == 'bg-skin-black' ? 'text-white' : 'text-black'} mb-2 font-semibold text-lg`}>Bulk Action</p>
                    <p className={`${theme == 'bg-skin-black' ? 'text-white' : 'text-black'} text-sm text-gray-500 mb-7`}>Set selected {itemName} to {bulkAction}?</p>
                    <div className='flex space-x-1 justify-end'>
                    <TableButton 
                        extendClass={bulkActionCancelButtonColor} 
                        fontColor={textColor}
                        onClick={()=>{handleModalToggle();}}
                    > 
                        <span className='text-black'>Cancel</span>
                    </TableButton>
                    <TableButton 
                        extendClass={["bg-skin-white"].includes(theme)? primayActiveColor : theme} 
                        fontColor={textColorActive}
                        onClick={()=>{handleModalToggle(); onConfirm();}}
                    > 
                        Set as {bulkAction}
                    </TableButton>
                    </div>
                </>
        
            
            </div>
        </div>
    </>
  )
}

export default BulkActions