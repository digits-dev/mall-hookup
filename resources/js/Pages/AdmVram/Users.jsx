import { router, Head, usePage, useForm } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import Modal from '../../Components/Modal/Modal';
import RowData from '../../Components/Table/RowData';
import TableContainer from '../../Components/Table/TableContainer';
import TopPanel from '../../Components/Table/TopPanel';
import TableSearch from '../../Components/Table/TableSearch';
import ContentPanel from '../../Components/Table/ContentPanel';
import Thead from '../../Components/Table/Thead';
import Row from '../../Components/Table/Row';
import TableHeader from '../../Components/Table/TableHeader';
import Pagination from '../../Components/Table/Pagination';
import RowAction from '../../Components/Table/RowAction';
import Checkbox from '../../Components/Checkbox/Checkbox';
import RowStatus from '../../Components/Table/RowStatus';
import BulkActions from '../../Components/Table/Buttons/BulkActions';
import Tbody from '../../Components/Table/Tbody';
import { useToast } from '../../Context/ToastContext';
import { useTheme } from '../../Context/ThemeContext';
import useThemeStyles from '../../Hooks/useThemeStyles';
import Button from '../../Components/Table/Buttons/Button';
import Tooltip from '../../Components/Tooltip/Tooltip';
import CustomFilter from '../../Components/Table/Buttons/CustomFilter';
import UsersAction from './UsersAction';
import Export from '../../Components/Table/Buttons/Export';
import UsersFilter from './UsersFilters';

const Users = ({page_title, tableName, users, queryParams, privileges}) => {
    const { handleToast } = useToast();
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const { primayActiveColor, textColorActive } = useThemeStyles(theme);
    const [pathname, setPathname] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [action, setAction] = useState(null);

    const [updateData, setUpdateData] = useState({
        id: "",
        name: "",
        email: "",
        id_adm_privileges: "",
        privilege_name: "",
        status: "",
    });

    router.on("start", () => setLoading(true));
    router.on("finish", () => setLoading(false));

    useEffect(() => {
        const segments = window.location.pathname.split("/");
        setPathname(segments.pop());
    }, []);

    const refreshTable = (e) => {
        e.preventDefault();
        router.get(pathname);
    };

    const handleModalClick = () => {
        setIsModalOpen(!isModalOpen);
    }

    // BULK ACTION

    const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);

    const { data, setData, processing, reset, post, errors } = useForm({
        selectedIds: [],
        bulkAction: "",
    });

    const handleSelectAll = () => {
        if (isSelectAllChecked) {
            setData("selectedIds", []);
        } else {
            setData(
                "selectedIds",
                users.data.map((item) => item.id)
            );
        }
        setIsSelectAllChecked(!isSelectAllChecked);
    };

    const handleRowSelection = (id) => {
        setData((prevData) => {
            const selectedIds = prevData.selectedIds || [];
            let updatedSelectedIds;

            if (selectedIds.includes(id)) {
                updatedSelectedIds = selectedIds.filter((item) => item !== id);
            } else {
                updatedSelectedIds = [...selectedIds, id];
            }

            if (
                updatedSelectedIds.length === users.data.length
            ) {
                setIsSelectAllChecked(true);
            } else {
                setIsSelectAllChecked(false);
            }

            return { ...prevData, selectedIds: updatedSelectedIds };
        });
    };

    const handleBulkAction = () => {
        if (data.selectedIds.length === 0) {
            handleToast("No Data Selected", "error");
            return;
        }
        post("users/bulk_action", {
            onSuccess: (data) => {
                const { message, type } = data.props.auth.sessions;
                handleToast(message, type);
                reset();
            },
            onError: (error) => {},
        });

        setData("selectedIds", []);
        setIsSelectAllChecked(false);
    };
    

    return (
        <>
            <Head title={page_title}/>
            <ContentPanel>
            <TopPanel>
                    <div className="inline-flex flex-wrap gap-1">
                        <BulkActions
                            setData={setData}
                            onConfirm={handleBulkAction}
                            itemName="Users"
                        />
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
                            type="button"
                            fontColor={textColorActive}
                            onClick={() => {
                                handleModalClick();
                                setAction("Add");
                                setUpdateData({
                                    id: "",
                                    name: "",
                                    email: "",
                                    id_adm_privileges: "",
                                    privilege_name: "",
                                    status: "",
                                });
                            }}
                        >
                            <i className="fa-solid fa-plus md:mr-1"></i> <span className='hidden md:block'>Add User</span>
                        </Button>
                        <Export path="/users/export" page_title="Users"/>
                    </div>
                    <div className="flex">
                        <CustomFilter>
                            <UsersFilter privileges={privileges}/>
                        </CustomFilter>
                        <TableSearch queryParams={queryParams} />
                    </div>
                </TopPanel>
                <TableContainer data={users?.data}>
                    <Thead>
                        <Row>
                            <TableHeader
                                name="id"
                                width="sm"
                                sortable={false}
                                justify="center"
                            >
                                <Checkbox
                                    handleClick={handleSelectAll}
                                    isChecked={isSelectAllChecked}
                                    disabled={false}
                                />
                            </TableHeader>
                            <TableHeader
                                name="name"
                                queryParams={queryParams}
                                width="xl"
                            >
                                Name
                            </TableHeader>
                            <TableHeader
                                name="email"
                                queryParams={queryParams}
                                width="lg"
                            >
                                Email
                            </TableHeader>
                            <TableHeader
                                name="privilege"
                                width="lg"
                                sortable={false}
                            >
                                Privilege
                            </TableHeader>
                            <TableHeader
                                name="status"
                                queryParams={queryParams}
                                width="sm"
                            >
                                Status
                            </TableHeader>
                            <TableHeader
                                sortable={false}
                                width="md"
                                justify="center"
                            >
                                Action
                            </TableHeader>
                        </Row>
                    </Thead>
                    <Tbody data={users?.data}>
                        {users &&
                            users?.data.map((item, index) => (
                                <Row key={item.id}>
                                    <RowData isLoading={loading} center>
                                        <Checkbox
                                            handleClick={() =>
                                                handleRowSelection(
                                                    item.id
                                                )
                                            }
                                            isChecked={data.selectedIds.includes(
                                                item.id
                                            )}
                                            disabled={false}
                                        />
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.name}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.email}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.privilege?.name}
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
                                    <RowData center>
                                        <RowAction
                                            type="button"
                                            action="edit"
                                            onClick={() => {
                                                setAction("Update");
                                                handleModalClick();
                                                setUpdateData({
                                                    id: item.id,
                                                    name: item.name,
                                                    email: item.email,
                                                    id_adm_privileges: item.id_adm_privileges,
                                                    privilege_name: item.privilege?.name,
                                                    status: item.status,
                                                });
                                            }}
                                        />
                                        <RowAction
                                            type="button"
                                            action="view"
                                            onClick={() => {
                                                setAction("View");
                                                handleModalClick();
                                                setUpdateData({
                                                    id: item.id,
                                                    name: item.name,
                                                    email: item.email,
                                                    id_adm_privileges: item.id_adm_privileges,
                                                    privilege_name: item.privilege?.name,
                                                    status: item.status,
                                                });
                                            }}
                                        />
                                    </RowData>
                                    
                                </Row>
                            ))}
                    </Tbody>
                </TableContainer>
                <Pagination extendClass={theme} paginate={users} />
            </ContentPanel>
            <Modal
                theme={theme}
                show={isModalOpen}
                onClose={handleModalClick}
                title={
                    action == "Add"
                        ? "Add User"
                        : action == "Update"
                        ? "Update User"
                        : "User Information"
                }
                width="xl"
                fontColor={textColorActive}
                btnIcon="fa fa-edit"
            >
                <UsersAction privileges={privileges} updateData={updateData} action={action} onClose={handleModalClick}/>
            </Modal>
        </>
    );
};

export default Users;
