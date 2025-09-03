import { Head, router, usePage } from '@inertiajs/react';
 import React, { useContext, useEffect, useState } from 'react';
 import ContentPanel from '../../../Components/Table/ContentPanel';
 import TopPanel from '../../../Components/Table/TopPanel';
 import TableContainer from '../../../Components/Table/TableContainer';
 import Thead from '../../../Components/Table/Thead';
 import TableHeader from '../../../Components/Table/TableHeader';
 import Row from '../../../Components/Table/Row';
 import RowData from '../../../Components/Table/RowData';
 import TableSearch from '../../../Components/Table/TableSearch';
 import Pagination from '../../../Components/Table/Pagination';
 import TableButton from '../../../Components/Table/Buttons/TableButton';
 import Modal from '../../../Components/Modal/Modal';
 import Tbody from '../../../Components/Table/Tbody';
 import { useTheme } from '../../../Context/ThemeContext';
 import useThemeStyles from '../../../Hooks/useThemeStyles';
 import ModuleGeneratorAction from '.././ModuleGenerator/ModuleGeneratorAction';
 import Tooltip from '../../../Components/Tooltip/Tooltip';
 import Button from '../../../Components/Table/Buttons/Button';
 import CustomFilter from '../../../Components/Table/Buttons/CustomFilter';
 import ModuleGeneratorFilter from './ModuleGeneratorFilter';
 
 const ModuleGenerator = ({ modules, queryParams, database_tables, page_title }) => {
     const { theme } = useTheme();
     const [showCreateModal, setShowCreateModal] = useState(false);
     const { textColor, primayActiveColor, textColorActive } = useThemeStyles(theme);
     const [pathname, setPathname] = useState(null);
 
     const handleCreate = () => {
         setShowCreateModal(true);
     };
     const handleCloseCreateModal = () => {
         setShowCreateModal(false);
     };
 
     useEffect(() => {
         const segments = window.location.pathname.split("/");
         setPathname(segments.pop());
     }, []);
 
     const refreshTable = (e) => {
         e.preventDefault();
         router.get(pathname);
     };
 
     return (
         <>
             <Head title={page_title} />
             <ContentPanel>
                 <TopPanel>
                     <div className="inline-flex flex-wrap gap-1">
                         <Tooltip text="Refresh data" arrow="bottom">
                             <Button
                                 extendClass={
                                     (["bg-skin-white"].includes(theme)
                                         ? primayActiveColor
                                         : theme) + " py-[5px] px-[10px]"
                                 }
                                 fontColor={textColorActive}
                                 onClick={refreshTable}
                             >
                                 <i className="fa fa-rotate-right text-base p-[1px]"></i>
                             </Button>
                         </Tooltip>
                         <TableButton extendClass={theme === 'bg-skin-white' ? primayActiveColor : theme} fontColor={theme === 'bg-skin-white' ? 'text-white' : theme === 'bg-skin-blue' ? 'text-white' : textColor} onClick={handleCreate}>
                             <i className="fa fa-plus text-white mr-1"></i> Add Modules
                         </TableButton>
                     </div>
                     <div className='flex'>
                         <CustomFilter width='lg'>
                             <ModuleGeneratorFilter database_tables={database_tables}/>
                         </CustomFilter>
                         <TableSearch queryParams={queryParams} />
                     </div>
                 </TopPanel>
                 <TableContainer data={modules?.data}>
                     <Thead>
                         <Row>
                             <TableHeader
                                 justify='center'
                                 name="id"
                                 sortable={false}
                                 width="sm"
                             >
                                 Id
                             </TableHeader>
                             <TableHeader
                                 name="name"
                                 queryParams={queryParams}
                                 width="sm"
                             >
                                 Name
                             </TableHeader>
                             <TableHeader
                                 name="table_name"
                                 queryParams={queryParams}
                                 width="sm"
                             >
                                 Table Name
                             </TableHeader>
                             <TableHeader
                                 name="path"
                                 queryParams={queryParams}
                                 width="sm"
                             >
                                 Path
                             </TableHeader>
                             <TableHeader
                                 name="controller"
                                 queryParams={queryParams}
                                 width="sm"
                             >
                                 Controller
                             </TableHeader>
                         </Row>
                     </Thead>
 
                     <Tbody data={modules?.data}>
                         {modules &&
                             modules?.data.map((item, index) => (
                                 <Row key={item.id}>
                                     <RowData center>
                                         {item.id}
                                     </RowData>
                                     <RowData>
                                         {item.name}
                                     </RowData>
                                     <RowData>
                                         {item.table_name}
                                     </RowData>
                                     <RowData>
                                         {item.path}
                                     </RowData>
                                     <RowData>
                                         {item.controller}
                                     </RowData>
                                 </Row>
                             ))}
                     </Tbody>
                 </TableContainer>
                 <Pagination extendClass={theme} paginate={modules} />
             </ContentPanel>
             <Modal
                 theme={theme}
                 show={showCreateModal}
                 onClose={handleCloseCreateModal}
                 title="Create Module"
                 width="lg"
                 fontColor={textColorActive}
             >
                 <ModuleGeneratorAction onClose={handleCloseCreateModal} database_tables={database_tables} />
             </Modal>
         </>
     );
 };
 
 export default ModuleGenerator;