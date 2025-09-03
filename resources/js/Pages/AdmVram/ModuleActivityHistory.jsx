import { Head, Link, router, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";
import { useTheme } from "../../Context/ThemeContext";
import useThemeStyles from "../../Hooks/useThemeStyles";
import ContentPanel from "../../Components/Table/ContentPanel";
import TopPanel from "../../Components/Table/TopPanel";
import Tooltip from "../../Components/Tooltip/Tooltip";
import Button from "../../Components/Table/Buttons/Button";
import TableSearch from "../../Components/Table/TableSearch";
import TableContainer from "../../Components/Table/TableContainer";
import Thead from "../../Components/Table/Thead";
import Tbody from "../../Components/Table/Tbody";
import RowAction from "../../Components/Table/RowAction";
import Row from "../../Components/Table/Row";
import TableHeader from "../../Components/Table/TableHeader";
import RowData from "../../Components/Table/RowData";
import RowStatus from "../../Components/Table/RowStatus";
import Pagination from "../../Components/Table/Pagination";
import Modal from "../../Components/Modal/Modal";
import Export from "../../Components/Table/Buttons/Export";
import InputComponent from "../../Components/Forms/Input";
import TextArea from "../../Components/Forms/TextArea";

const ModuleActivityHistory = ({
    page_title,
    tableName,
    module_activity_history,
    queryParams,
}) => {
    const { theme } = useTheme();
    const [loading, setLoading] = useState(false);
    const { primayActiveColor, textColorActive, buttonSwalColor } =
        useThemeStyles(theme);
    const [pathname, setPathname] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [updateData, setUpdateData] = useState({
        id: "",
        module_name: "",
        action_type: "",
        created_at: "",
        created_by: "",
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
                        <Export
                            path="/system_error_logs/export"
                            page_title={page_title}
                        />
                    </div>
                    <div className="flex">
                        <TableSearch queryParams={queryParams} />
                    </div>
                </TopPanel>
                <TableContainer data={module_activity_history?.data}>
                    <Thead>
                        <Row>
                            <TableHeader
                                sortable={false}
                                width="md"
                                justify="center"
                            >
                                View
                            </TableHeader>
                            <TableHeader
                                name="module_name"
                                queryParams={queryParams}
                                width="lg"
                            >
                                Module Name
                            </TableHeader>
                            <TableHeader
                                name="created_by"
                                queryParams={queryParams}
                                width="2xl"
                            >
                                Action
                            </TableHeader>
                            <TableHeader
                                name="updated_by"
                                queryParams={queryParams}
                                width="md"
                            >
                                Created By
                            </TableHeader>
                            <TableHeader
                                name="updated_by"
                                queryParams={queryParams}
                                width="lg"
                            >
                                Created At
                            </TableHeader>
                        </Row>
                    </Thead>
                    <Tbody data={module_activity_history?.data}>
                        {module_activity_history &&
                            module_activity_history?.data.map((item, index) => (
                                <Row key={item.id}>
                                    <RowData center>
                                        <RowAction
                                            type="button"
                                            action="view"
                                            onClick={() => {
                                                handleModalClick();
                                                setUpdateData({
                                                    id: item.id,
                                                    module_name:
                                                        item.module_name,
                                                    action_type:
                                                        item.action_type,
                                                    created_at: item.created_at,
                                                    created_by:
                                                        item.get_created_by
                                                            ?.name,
                                                });
                                            }}
                                        />
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.module_name}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.action_type}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.get_created_by?.name}
                                    </RowData>
                                    <RowData isLoading={loading}>
                                        {item.created_at}
                                    </RowData>
                                </Row>
                            ))}
                    </Tbody>
                </TableContainer>
                <Pagination
                    extendClass={theme}
                    paginate={module_activity_history}
                />
            </ContentPanel>
            <Modal
                theme={theme}
                show={isModalOpen}
                onClose={handleModalClick}
                title="Activity Details"
                width="xl"
                fontColor={textColorActive}
                btnIcon="fa fa-edit"
            >
                <InputComponent
                    name="module_name"
                    value={updateData.module_name}
                    disabled={true}
                />
                <TextArea
                    addClass="mt-2"
                    name="action_type"
                    value={updateData.action_type}
                    disabled={true}
                />
                <InputComponent
                    name="created_by"
                    addClass="mt-2"
                    value={updateData.created_by}
                    disabled={true}
                />
                <InputComponent
                    name="created_at"
                    addClass="mt-2"
                    value={updateData.created_at}
                    disabled={true}
                />
            </Modal>
        </>
    );
};

export default ModuleActivityHistory;
