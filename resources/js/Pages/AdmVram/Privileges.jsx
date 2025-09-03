import { Head, router, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import ContentPanel from '../../Components/Table/ContentPanel';
import TopPanel from '../../Components/Table/TopPanel';
import TableContainer from '../../Components/Table/TableContainer';
import Thead from '../../Components/Table/Thead';
import TableHeader from '../../Components/Table/TableHeader';
import Row from '../../Components/Table/Row';
import RowData from '../../Components/Table/RowData';
import TableSearch from '../../Components/Table/TableSearch';
import RowAction from '../../Components/Table/RowAction';
import Pagination from '../../Components/Table/Pagination';
import Tbody from '../../Components/Table/Tbody';
import { useTheme } from '../../Context/ThemeContext';
import Button from '../../Components/Table/Buttons/Button';
import useThemeStyles from '../../Hooks/useThemeStyles';
import Tooltip from '../../Components/Tooltip/Tooltip';
import Export from '../../Components/Table/Buttons/Export';

const Privileges = ({ tableName, privileges, queryParams }) => {
    const { theme } = useTheme();
    queryParams = queryParams || {};
    const [loading, setLoading] = useState(false);
    const { primayActiveColor, textColorActive } = useThemeStyles(theme);
    const [pathname, setPathname] = useState(null);

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
            <Head title="Privileges"/>
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
                        <Button
                            extendClass={
                                (["bg-skin-white"].includes(theme)
                                    ? primayActiveColor
                                    : theme) + " py-[5px] px-[10px]"
                            }
                            type="link"
                            fontColor={textColorActive}
                            href="privileges/create-privileges"
                        >
                            <i className="fa-solid fa-plus mr-1"></i>{" "}
                            Add Privilege
                        </Button>
                        <Export page_title="Privileges" path='/privileges/export'/>
                    </div>
                    <div className='flex'>
                        <TableSearch queryParams={queryParams} />
                    </div>
                </TopPanel>
                <TableContainer data={privileges?.data}>
                    <Thead>
                        <Row>
                            <TableHeader
                                sortable={false}
                                width="auto"
                                justify="center"
                            >
                                Action
                            </TableHeader>
                            <TableHeader
                                name="id"
                                queryParams={queryParams}
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
                                name="is_superadmin"
                                queryParams={queryParams}
                                width="sm"
                            >
                                Type
                            </TableHeader>
                        </Row>
                    </Thead>
                    <Tbody data={privileges?.data}>
                        {privileges &&
                            privileges?.data.map((item, index) => (
                                <Row key={item.id}>
                                    <RowData center>
                                        <RowAction
                                            as="button"
                                            action="edit"
                                            href={`privileges/edit-privileges/${item.id}`}
                                        />
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.id}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.name}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.is_superadmin
                                            ? "Superadmin"
                                            : "Standard"}
                                    </RowData>
                                </Row>
                            ))}
                    </Tbody>
                </TableContainer>
                <Pagination extendClass={theme} paginate={privileges}/>
            </ContentPanel>
        </>
    );
};

export default Privileges;
