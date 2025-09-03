import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';
import ContentPanel from '../../../Components/Table/ContentPanel';
import TopPanel from '../../../Components/Table/TopPanel';
import TableSearch from '../../../Components/Table/TableSearch';
import Export from '../../../Components/Table/Buttons/Export';
import TableContainer from '../../../Components/Table/TableContainer';
import Thead from '../../../Components/Table/Thead';
import Row from '../../../Components/Table/Row';
import TableHeader from '../../../Components/Table/TableHeader';
import Tbody from '../../../Components/Table/Tbody';
import RowData from '../../../Components/Table/RowData';
import Pagination from '../../../Components/Table/Pagination';
import moment from 'moment';
import { useTheme } from '../../../Context/ThemeContext';
import WyswygTextEditor from '../../../Components/Forms/WyswygTextEditor';
import Button from '../../../Components/Table/Buttons/Button';
import RowAction from '../../../Components/Table/RowAction';
import useThemeStyles from '../../../Hooks/useThemeStyles';
import CustomFilter from '../../../Components/Table/Buttons/CustomFilter';
import Tooltip from '../../../Components/Tooltip/Tooltip';
import RowStatus from '../../../Components/Table/RowStatus';
import AnnouncementModal from '../../../Components/Modal/AnnouncementsModal';

const AnnouncementPage = ({ announcements, queryParams }) => {
    const {theme} = useTheme();
    const [loading, setLoading] = useState(false);
    const [pathname, setPathname] = useState(null);
    const { textColorActive, primayActiveColor } = useThemeStyles(theme);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [data, setData] = useState(null);

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
            <Head title="Announcements" />
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
                            href="announcements/add_announcement"
                            extendClass={theme}
                            type="link"
                            fontColor={textColorActive}
                        >
                            <i className="fa fa-plus text-white mr-1"></i>Add Announcement
                        </Button>
                    </div>
                    <div className='flex'>
                        <CustomFilter/>
                        <TableSearch queryParams={queryParams} />
                    </div>
                </TopPanel>

                <TableContainer data={announcements.data}>
                    <Thead>
                        <Row>
                            <TableHeader
                                sortable={false}
                                width="md"
                                justify="center"
                            >
                                Action
                            </TableHeader>
                            <TableHeader
                                name="status"
                                queryParams={queryParams}
                                width="sm"
                            >
                                Status
                            </TableHeader>
                            <TableHeader
                                name="name"
                                queryParams={queryParams}
                                width="xl"
                            >
                                Announcement Name
                            </TableHeader>
                            <TableHeader
                            name="created_by"
                            queryParams={queryParams}
                            width="md"
                        >
                            Created By
                        </TableHeader>
                        <TableHeader
                            name="updated_by"
                            queryParams={queryParams}
                            width="md"
                        >
                            Updated By
                        </TableHeader>
                        <TableHeader
                            name="updated_by"
                            queryParams={queryParams}
                            width="lg"
                        >
                            Created At
                        </TableHeader>
                        <TableHeader
                            name="updated_by"
                            queryParams={queryParams}
                            width="lg"
                        >
                            Updated At
                        </TableHeader>
                        </Row>
                    </Thead>
                    <Tbody data={announcements.data}>
                        {announcements &&
                            announcements.data.map((item) => (
                                <Row key={item.id}>
                                    <RowData center>
                                        <RowAction
                                            type='link'
                                            action="edit"
                                            href={`announcements/edit_announcement/${item.id}`}
                                        />
                                        <RowAction
                                            type='button'
                                            action="view"
                                            onClick={()=>{setShowAnnouncementModal(true); setData(item.json_data)}}
                                        />
                                    </RowData>
                                    <RowStatus
                                        isLoading={loading}
                                        systemStatus={
                                            item.status === "ACTIVE"
                                                ? "active"
                                                : "inactive"
                                        }
                                    >
                                        {item.status === "ACTIVE"
                                            ? "ACTIVE"
                                            : "INACTIVE"}
                                    </RowStatus>
                                    <RowData isLoading={loading}>
                                        {item.name}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.get_created_by?.name}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.get_updated_by?.name}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.created_at}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.updated_at}
                                    </RowData>
                                </Row>
                            ))}
                    </Tbody>
                </TableContainer>
                <Pagination extendClass={theme} paginate={announcements} />
            </ContentPanel>
            <AnnouncementModal isOpen={showAnnouncementModal} setIsOpen={setShowAnnouncementModal} data={data} action="View"/>
        </>
    );
};

export default AnnouncementPage;
