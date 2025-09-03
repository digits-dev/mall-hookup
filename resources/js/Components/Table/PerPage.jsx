import { router } from '@inertiajs/react';
import React, { useRef, useState } from 'react'
import DescIcon from './Icons/DescIcon';
import { useTheme } from '../../Context/ThemeContext';
import useThemeStyles from '../../Hooks/useThemeStyles';

const PerPage = ({queryParams}) => {
  const {theme} = useTheme();
  const {textColor, bulkActionTextColor, borderTheme, textColorActive, primayActiveColor, bulkActionCancelButtonColor} = useThemeStyles(theme)
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const perPage = useRef(queryParams?.perPage || 10);
  const path = window.location.pathname;


  const handleChange = (e) => {
      perPage.current = e.target.value;
      const updatedParams = {...queryParams, perPage: perPage.current, page: 1};
      router.get(path, updatedParams, {preserveScroll:true, preserveState:true});
  }

  return (
    <div className='relative w-[58px] min-w-[50px] h-[2.4rem]'>
      <select 
        className={`appearance-none pl-[10px] text-sm outline-none rounded-r-md font-poppins border-2 ${borderTheme} border-l-0 ${theme === 'bg-skin-black' ? 'bg-black-table-color text-gray-300' : 'bg-white'} w-full h-full cursor-pointer`}  
        name="perPage" 
        id="perPage" 
        value={perPage.current} 
        onChange={handleChange}
        onMouseDown={(e) => {
          setIsMenuOpen((prev) => !prev); // Toggle state manually on every click
        }}
        onBlur={() => setIsMenuOpen(false)}
      >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
          <option value="100">100</option>
      </select>
      {/* Icon  */}
      <span className="absolute top-1/2 right-[8px] -translate-y-1/2  pointer-events-none">
          <i className={`${bulkActionTextColor} fa-solid fa-caret-down text-xs md:text-base transform transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}></i>
      </span>
    </div>
  )
}


export default PerPage