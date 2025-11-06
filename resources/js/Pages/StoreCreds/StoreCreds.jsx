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

const StoreCreds = ({ store_creds }) => {
    const { theme } = useTheme();
    const { primayActiveColor, textColorActive } = useThemeStyles(theme);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        contract_number: "",
        contract_key: "",
        pos_no: "",
        company_code: "",
    });

    useEffect(() => {
        if (isEditing && store_creds) {
            setData({
                contract_number: store_creds.contract_number || "",
                contract_key: store_creds.contract_key || "",
                pos_no: store_creds.pos_no || "",
                company_code: store_creds.company_code || "",
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

        const url = isEditing ? "/store_creds/update" : "/store_creds/add_save";

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
                        {!store_creds && (
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
                                STORE CREDENTIAL
                            </Button>
                        )}
                    </div>
                </TopPanel>

                <TableContainer>
                    <Thead>
                        <Row>
                            <TableHeader width="sm">
                                Contract Number
                            </TableHeader>
                            <TableHeader width="sm">Contract Key</TableHeader>
                            <TableHeader width="sm">POS No</TableHeader>
                            <TableHeader width="sm">Company Code</TableHeader>
                            <TableHeader width="sm">Actions</TableHeader>
                        </Row>
                    </Thead>

                    <Tbody>
                        {store_creds ? (
                            <Row key={store_creds.id}>
                                <RowData>{store_creds.contract_number}</RowData>
                                <RowData>{store_creds.contract_key}</RowData>
                                <RowData>{store_creds.pos_no}</RowData>
                                <RowData>{store_creds.company_code}</RowData>
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
                                Contract Number
                            </label>
                            <input
                                type="text"
                                name="contract_number"
                                value={data.contract_number}
                                onChange={handleChange}
                                className="w-full border rounded px-2 py-1"
                                required
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block text-sm font-medium mb-1">
                                Contract Key
                            </label>
                            <input
                                type="text"
                                name="contract_key"
                                value={data.contract_key}
                                onChange={handleChange}
                                className="w-full border rounded px-2 py-1"
                                required
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block text-sm font-medium mb-1">
                                POS No
                            </label>
                            <input
                                type="text"
                                name="pos_no"
                                value={data.pos_no}
                                onChange={handleChange}
                                className="w-full border rounded px-2 py-1"
                                required
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-sm font-medium mb-1">
                                Company Code
                            </label>
                            <input
                                type="text"
                                name="company_code"
                                value={data.company_code}
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

export default StoreCreds;
