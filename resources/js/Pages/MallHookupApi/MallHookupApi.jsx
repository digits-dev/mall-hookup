import { useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import ContentPanel from "../../Components/Table/ContentPanel";
import TopPanel from "../../Components/Table/TopPanel";
import Button from "../../Components/Table/Buttons/Button";
import useThemeStyles from "../../Hooks/useThemeStyles";
import { useTheme } from "../../Context/ThemeContext";
import TableContainer from "../../Components/Table/TableContainer";
import Thead from "../../Components/Table/Thead";
import TableHeader from "../../Components/Table/TableHeader";
import Row from "../../Components/Table/Row";
import RowData from "../../Components/Table/RowData";
import RowAction from "../../Components/Table/RowAction";
import Tbody from "../../Components/Table/Tbody";
import Modal from "../../Components/Modal/Modal";

const MallHookupApi = ({ mall_hookup_api }) => {
    const { theme } = useTheme();
    const { primayActiveColor, textColorActive } = useThemeStyles(theme);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        pos_supplier_url: "",
        pos_supplier_retrieve_url: "",
        pos_supplier_api_key: "",
        pos_supplier_retrieve_api_key: "",
        secret_key: "",
    });

    useEffect(() => {
        if (isEditing && mall_hookup_api) {
            setData({
                pos_supplier_url: mall_hookup_api.pos_supplier_url || "",
                pos_supplier_retrieve_url:
                    mall_hookup_api.pos_supplier_retrieve_url || "",
                pos_supplier_api_key:
                    mall_hookup_api.pos_supplier_api_key || "",
                pos_supplier_retrieve_api_key:
                    mall_hookup_api.pos_supplier_retrieve_api_key || "",
                secret_key: mall_hookup_api.secret_key || "",
            });
        }
    }, [isEditing]);

    const handleModalToggle = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleEdit = () => {
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setIsEditing(false);
        reset(); // clear the form
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        setData(e.target.name, e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = isEditing
            ? "/mall_hookup_api/update"
            : "/mall_hookup_api/add_save";

        post(url, {
            onSuccess: () => {
                setIsModalOpen(false);
            },
        });
    };

    return (
        <>
            <ContentPanel>
                <TopPanel>
                    <div className="inline-flex flex-wrap gap-1">
                        {/* Hide Add button if data already exists */}
                        {!mall_hookup_api && (
                            <Button
                                extendClass={
                                    (["bg-skin-white"].includes(theme)
                                        ? primayActiveColor
                                        : theme) + " py-[5px] px-[10px]"
                                }
                                type="button"
                                fontColor={textColorActive}
                                onClick={handleAdd}
                            >
                                <i className="fa-solid fa-plus mr-1"></i> Add
                                Mall Hookup API
                            </Button>
                        )}
                    </div>
                </TopPanel>

                <TableContainer>
                    <Thead>
                        <Row>
                            <TableHeader width="sm">
                                POS SUPPLIER URL
                            </TableHeader>
                            <TableHeader width="sm">
                                POS SUPPLIER RETRIEVE URL
                            </TableHeader>
                            <TableHeader width="sm">
                                POS SUPPLIER API KEY
                            </TableHeader>
                            <TableHeader width="sm">
                                POS SUPPLIER RETRIEVE API KEY
                            </TableHeader>
                            <TableHeader width="sm">SECREY KEY</TableHeader>
                            <TableHeader width="sm">Actions</TableHeader>
                        </Row>
                    </Thead>

                    <Tbody>
                        {mall_hookup_api ? (
                            <Row key={mall_hookup_api.id}>
                                <RowData>
                                    {mall_hookup_api.pos_supplier_url}
                                </RowData>
                                <RowData>
                                    {mall_hookup_api.pos_supplier_retrieve_url}
                                </RowData>
                                <RowData>
                                    {mall_hookup_api.pos_supplier_api_key}
                                </RowData>
                                <RowData>
                                    {
                                        mall_hookup_api.pos_supplier_retrieve_api_key
                                    }
                                </RowData>
                                <RowData>{mall_hookup_api.secret_key}</RowData>
                                <RowData center>
                                    <RowAction
                                        type="button"
                                        action="edit"
                                        onClick={handleEdit}
                                    />
                                </RowData>
                            </Row>
                        ) : (
                            <Row>
                                <RowData center>No credentials found.</RowData>
                            </Row>
                        )}
                    </Tbody>
                </TableContainer>
            </ContentPanel>

            {/* 🧩 Modal (shared for Add / Edit) */}
            <Modal show={isModalOpen} onClose={handleModalToggle}>
                <div className="p-6">
                    <h2 className="text-lg font-semibold mb-4">
                        {isEditing
                            ? "Edit ETP Credentials"
                            : "Add ETP Credentials"}
                    </h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label className="block text-sm font-medium mb-1">
                                POS SUPPLIER URL
                            </label>
                            <input
                                type="text"
                                name="pos_supplier_url"
                                value={data.pos_supplier_url}
                                onChange={handleChange}
                                className="w-full border rounded px-2 py-1"
                                required
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block text-sm font-medium mb-1">
                                POS SUPPLIER RETRIEVE URL
                            </label>
                            <input
                                type="text"
                                name="pos_supplier_retrieve_url"
                                value={data.pos_supplier_retrieve_url}
                                onChange={handleChange}
                                className="w-full border rounded px-2 py-1"
                                required
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block text-sm font-medium mb-1">
                                POS SUPPLIER API KEY
                            </label>
                            <input
                                type="text"
                                name="pos_supplier_api_key"
                                value={data.pos_supplier_api_key}
                                onChange={handleChange}
                                className="w-full border rounded px-2 py-1"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium mb-1">
                                POS SUPPLIER RETRIEVE API KEY
                            </label>
                            <input
                                type="text"
                                name="pos_supplier_retrieve_api_key"
                                value={data.pos_supplier_retrieve_api_key}
                                onChange={handleChange}
                                className="w-full border rounded px-2 py-1"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium mb-1">
                                SECREY KEY
                            </label>
                            <input
                                type="text"
                                name="secret_key"
                                value={data.secret_key}
                                onChange={handleChange}
                                className="w-full border rounded px-2 py-1"
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button
                                type="button"
                                extendClass=" text-black px-4 py-2 rounded"
                                onClick={handleModalToggle}
                            >
                                Cancel
                            </Button>
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                disabled={processing}
                            >
                                {isEditing ? "Update" : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default MallHookupApi;
