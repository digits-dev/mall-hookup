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

const EtpCreds = ({ etp_creds }) => {
    const { theme } = useTheme();
    const { primayActiveColor, textColorActive } = useThemeStyles(theme);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        store_id: "",
        etp_ip: "",
        etp_database_name: "",
    });

    useEffect(() => {
        if (isEditing && etp_creds) {
            setData({
                store_id: etp_creds.store_id || "",
                etp_ip: etp_creds.etp_ip || "",
                etp_database_name: etp_creds.etp_database_name || "",
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

        const url = isEditing ? "/etp_creds/update" : "/etp_creds/add_save";

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
                        {!etp_creds && (
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
                                ETP CREDENTIAL
                            </Button>
                        )}
                    </div>
                </TopPanel>

                <TableContainer>
                    <Thead>
                        <Row>
                            <TableHeader width="sm">Store ID</TableHeader>
                            <TableHeader width="sm">ETP IP</TableHeader>
                            <TableHeader width="sm">
                                ETP Database Name
                            </TableHeader>
                            <TableHeader width="sm">Actions</TableHeader>
                        </Row>
                    </Thead>

                    <Tbody>
                        {etp_creds ? (
                            <Row key={etp_creds.id}>
                                <RowData>{etp_creds.store_id}</RowData>
                                <RowData>{etp_creds.etp_ip}</RowData>
                                <RowData>{etp_creds.etp_database_name}</RowData>
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
                                Store ID
                            </label>
                            <input
                                type="text"
                                name="store_id"
                                value={data.store_id}
                                onChange={handleChange}
                                className="w-full border rounded px-2 py-1"
                                required
                            />
                        </div>

                        <div className="mb-2">
                            <label className="block text-sm font-medium mb-1">
                                ETP IP
                            </label>
                            <input
                                type="text"
                                name="etp_ip"
                                value={data.etp_ip}
                                onChange={handleChange}
                                className="w-full border rounded px-2 py-1"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">
                                ETP Database Name
                            </label>
                            <input
                                type="text"
                                name="etp_database_name"
                                value={data.etp_database_name}
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

export default EtpCreds;
