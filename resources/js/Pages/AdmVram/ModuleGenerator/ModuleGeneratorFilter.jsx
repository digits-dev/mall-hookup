import React, { useEffect } from 'react'
 import { useState } from 'react';
 import { useTheme } from '../../../Context/ThemeContext';
 import useThemeStyles from '../../../Hooks/useThemeStyles';
 import DropdownSelect from '../../../Components/Dropdown/Dropdown'
 import InputComponent from '../../../Components/Forms/Input'
 import TableButton from '../../../Components/Table/Buttons/TableButton'
 import { router } from '@inertiajs/react';
 import CustomFilter from '../../../Components/Table/Buttons/CustomFilter';
 import CustomSelect from '../../../Components/Dropdown/CustomSelect';
 
 const ModuleGeneratorFilter = ({database_tables}) => {
     const { theme } = useTheme();
     const { primayActiveColor, textColorActive } = useThemeStyles(theme);
     const [pathname, setPathname] = useState(null);
 
     const [filters, setFilters] = useState({
         table_name: "",
         name: "",
         path: "",
     });
 
 
     useEffect(() => {
         const segments = window.location.pathname.split("/");
         setPathname(segments.pop());
     }, []);
 
     const handleFilter = (e, attrName, type) => {
         if (type === "select") {
             const { value } = e;
 
             setFilters((filters) => ({
                 ...filters,
                 [attrName]: value,
             }));
         } else {
             const { name, value } = e.target;
 
             setFilters((filters) => ({
                 ...filters,
                 [name]: value,
             }));
         }
     };
 
     const handleFilterSubmit = (e) => {
         e.preventDefault();
         const queryString = new URLSearchParams(filters).toString();
         router.get(`${pathname}?${queryString}`);
     };
 
   return (
     <form>
         <div onSubmit={handleFilterSubmit} className='space-y-2'>
                 <CustomSelect
                     placeholder="Choose Table"
                     selectType="react-select"
                     defaultSelect="Table"
                     onChange={(e) => handleFilter(e, "table_name", "select")}
                     name="table_name"
                     options={database_tables}
                 />
                 <InputComponent
                     displayName="Module Name"
                     name="name"
                     value={filters.name}
                     placeholder="Enter Module Name"
                     onChange={(e) => handleFilter(e, "name")}
                 />
                 <InputComponent
                     name="path"
                     value={filters.path}
                     placeholder="Enter Path"
                     onChange={(e) => handleFilter(e, "path")}
                 />
         </div>
         <div className='mt-5 flex justify-end'>
             <TableButton 
                 extendClass={["bg-skin-white"].includes(theme)? primayActiveColor : theme} 
                 fontColor={textColorActive}
                 onClick={handleFilterSubmit}
             > 
                 <i className="fa fa-filter"></i> Filter
             </TableButton>
         </div>
     </form>
     
   )
 }
 
 export default ModuleGeneratorFilter