import ContentPanel from "../../Components/Table/ContentPanel";
import JsonModal from "../../Components/Modal/JsonModal";
import Modal from "../../Components/Modal/Modal";
import dayjs from "dayjs";

import { useState } from "react";
import {
    Database,
    Upload,
    Download,
    Settings,
    Activity,
    CheckCircle,
    XCircle,
    Clock,
    RefreshCw,
} from "lucide-react";
import axios from "axios";

const DataSyncDashboard = ({ api_responses, posData, my_privilege_id }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalDateOpen, setIsModalDateOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [activeTab, setActiveTab] = useState("logs");
    const [isOpen, setIsOpen] = useState(false);
    const [modalJsonData, setModalJsonData] = useState();
    const [title, setTitle] = useState();
    const [action, setAction] = useState();
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const recordsPerPage = 10;
    const [syncCurrentPage, setSyncCurrentPage] = useState(1);
    const [dataCurrentPage, setDataCurrentPage] = useState(1);

    const syncTotalPages = Math.ceil(api_responses.length / recordsPerPage);
    const syncStartIndex = (syncCurrentPage - 1) * recordsPerPage;
    const syncEndIndex = syncStartIndex + recordsPerPage;
    const syncCurrentRecords = api_responses.slice(
        syncStartIndex,
        syncEndIndex
    );

    const posDataTotalPages = Math.ceil(posData.length / recordsPerPage);
    const posDataStartIndex = (dataCurrentPage - 1) * recordsPerPage;
    const posDataEndIndex = posDataStartIndex + recordsPerPage;
    const posDataCurrentRecords = posData.slice(
        posDataStartIndex,
        posDataEndIndex
    );

    const handleSyncData = async () => {
        setIsLoading(true);
        setIsModalOpen(true);
        setAction("sync");

        try {
            const response = await axios.get("/get-pos-data");

            setModalData(response.data);
        } catch (error) {
            setModalData({
                status: error.response?.status || 500,
                message:
                    error.response?.data?.message ||
                    "Network error occurred. Please try again.",
                data: [],
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReSyncYesterday = async () => {
        setIsLoading(true);
        setIsModalOpen(true);
        setAction("sync");

        try {
            const response = await axios.get("/resync-all-failed");

            setModalData(response.data);
        } catch (error) {
            setModalData({
                status: error.response?.status || 500,
                message:
                    error.response?.data?.message ||
                    "Network error occurred. Please try again.",
                data: [],
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleReSyncBetweenDate = () => {
        setIsModalDateOpen(true);
    };

    const submitReSyncBetweenDate = async () => {
        if (!fromDate || !toDate) {
            alert("Please select both From and To dates");
            return;
        }

        setIsLoading(true);
        setIsModalOpen(true);
        setAction("sync");
        setIsModalDateOpen(false); // close date modal when submitting

        try {
            const response = await axios.post("/resync-between-dates", {
                from: fromDate,
                to: toDate,
            });

            setModalData(response.data);
        } catch (error) {
            setModalData({
                status: error.response?.status || 500,
                message:
                    error.response?.data?.message ||
                    "Network error occurred. Please try again.",
                data: [],
            });
        } finally {
            setIsLoading(false);
        }
    };

    const today = dayjs().format("YYYY-MM-DD");

    // latest API sync attempt
    const latestSync = api_responses[0];

    // check if today’s posData exists
    const todayPosData = posData.find(
        (pos) => dayjs(pos.date_of_transaction).format("YYYY-MM-DD") === today
    );

    const todaySync = todayPosData || null;

    const isSyncedToday = todayPosData?.status?.toLowerCase() === "success";

    const goToNextPage = () => {
        if (activeTab === "logs") {
            if (syncCurrentPage < syncTotalPages) {
                setSyncCurrentPage(syncCurrentPage + 1);
            }
        } else if (activeTab === "database") {
            if (dataCurrentPage < posDataTotalPages) {
                setDataCurrentPage(dataCurrentPage + 1);
            }
        }
    };

    const goToPreviousPage = () => {
        if (activeTab === "logs") {
            if (syncCurrentPage > 1) {
                setSyncCurrentPage(syncCurrentPage - 1);
            }
        } else if (activeTab === "database") {
            if (dataCurrentPage > 1) {
                setDataCurrentPage(dataCurrentPage - 1);
            }
        }
    };

    const goToPage = (page) => {
        if (activeTab === "logs") {
            setSyncCurrentPage(page);
        } else if (activeTab === "database") {
            setDataCurrentPage(page);
        }
    };

    // 🔹 Always return correct pagination set
    const getCurrentPaginationValues = () => {
        if (activeTab === "logs") {
            return {
                currentPage: syncCurrentPage,
                totalPages: syncTotalPages,
                startIndex: syncStartIndex,
                endIndex: syncEndIndex,
                totalRecords: api_responses.length,
                currentRecords: syncCurrentRecords,
            };
        } else if (activeTab === "database") {
            return {
                currentPage: dataCurrentPage,
                totalPages: posDataTotalPages,
                startIndex: posDataStartIndex,
                endIndex: posDataEndIndex,
                totalRecords: posData.length,
                currentRecords: posDataCurrentRecords,
            };
        }
        return {
            currentPage: 1,
            totalPages: 1,
            startIndex: 0,
            endIndex: 0,
            totalRecords: 0,
            currentRecords: [],
        };
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case "success":
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case "failed":
                return <XCircle className="h-4 w-4 text-red-600" />;
            case "pending":
                return <Clock className="h-4 w-4 text-gray-500" />;
            default:
                return null;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "success":
                return "text-green-600 bg-green-100";
            case "failed":
                return "text-red-600 bg-red-100";
            case "pending":
                return "text-yellow-600 bg-yellow-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    };

    const paginationValues = getCurrentPaginationValues();

    const handleViewClick = async (posDataId) => {
        setIsLoading(true);
        setIsModalOpen(true);
        setAction("retrieve");

        try {
            const response = await axios.post("/pos-supplier-retrieve", {
                pos_data_id: posDataId,
            });

            if (response.data?.status === 200 || response.status === 200) {
                setModalData(response.data);
            } else {
                setModalData({
                    status: response.data?.status || 400,
                    message: response.data?.message || "Something went wrong",
                    data: response.data?.data || {},
                });
            }
        } catch (error) {
            setModalData({
                status: error.response?.status || 500,
                message:
                    error.response?.data?.message ||
                    "Network error occurred. Please try again.",
                data: {},
            });
        } finally {
            setIsLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalData(null);
        if (action === "sync") {
            window.location.reload();
        }
    };

    const closeJsonModal = () => {
        setIsOpen(false);
    };

    const openModal = () => {
        setIsOpen(true);
    };

    return (
        <>
            <div className="bg-gray-50  py-4 px-4 rounded-md shadow-menus  w-full flex flex-col justify-between">
                <div className="container mx-auto p-6 space-y-6">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-balance">
                                    Data Synchronization Dashboard
                                </h1>
                                <p className="text-sm text-gray-600">
                                    Synchronize data from database to Mall
                                </p>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                {[1, 2].includes(my_privilege_id) && (
                                    <button
                                        onClick={handleReSyncBetweenDate}
                                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-md font-medium"
                                    >
                                        <RefreshCw className="h-5 w-5" />
                                        ReSync Between Date
                                    </button>
                                )}
                                {[1, 3].includes(my_privilege_id) && (
                                    <>
                                        <button
                                            onClick={handleSyncData}
                                            disabled={
                                                isSyncedToday || isLoading
                                            }
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-md font-medium"
                                        >
                                            <RefreshCw className="h-5 w-5" />
                                            Sync Data to Mall
                                        </button>
                                        <button
                                            onClick={handleReSyncYesterday}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-md font-medium"
                                        >
                                            <RefreshCw className="h-5 w-5" />
                                            Sync All Failed
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Today's Status
                                    </p>
                                    {todaySync ? (
                                        <div
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-2 ${getStatusColor(
                                                todaySync.status
                                            )}`}
                                        >
                                            <span className="mr-1">
                                                {getStatusIcon(
                                                    todaySync.status
                                                )}
                                            </span>
                                            {todaySync.status.toUpperCase()}
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-md font-medium mt-2 text-red-600 bg-red-100">
                                            <span className="mr-1">
                                                <XCircle className="h-4 w-4 text-red-600" />
                                            </span>
                                            No Sync Yet
                                        </div>
                                    )}
                                </div>
                                <div className="text-2xl">📊</div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-600">
                                        Failed Transactions
                                    </h3>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {posData?.filter(
                                            (pos) =>
                                                pos.status?.toLowerCase() ===
                                                "failed"
                                        ).length ?? 0}
                                    </div>
                                </div>

                                <div className="text-2xl">📝</div>
                            </div>
                        </div>

                        {/* <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-sm font-medium text-gray-600">
                                    Success Rate
                                </h3>
                                <Activity className="h-4 w-4 text-gray-400" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">
                                98.5%
                            </div>
                            <p className="text-xs text-gray-500">
                                Last 30 days
                            </p>
                        </div> */}

                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-600">
                                        Last Sync
                                    </h3>
                                    <div className="text-2xl font-bold text-gray-900">
                                        {latestSync?.api_created_at
                                            ? dayjs(
                                                  latestSync.api_created_at
                                              ).format("MMM D, YYYY h:mm A")
                                            : "No sync yet"}
                                    </div>
                                </div>
                                <div className="text-2xl">🔄</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="border-b border-gray-200">
                            <nav className="flex space-x-8">
                                {[
                                    { id: "logs", label: "Sync Logs" },
                                    { id: "database", label: "Data History" },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                            activeTab === tab.id
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {activeTab === "logs" && (
                            <div className="bg-white rounded-lg shadow-sm border">
                                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Sync History
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Recent synchronization attempts
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Showing{" "}
                                        {paginationValues.startIndex + 1}-
                                        {Math.min(
                                            paginationValues.endIndex,
                                            paginationValues.totalRecords
                                        )}{" "}
                                        of {paginationValues.totalRecords}{" "}
                                        records
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date of Transaction
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Datetime Sync
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Sales Amount
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Transactions
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Json Payload
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Json Response
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    View
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {paginationValues.currentRecords.map(
                                                (api_response) => (
                                                    <tr
                                                        key={api_response.id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {
                                                                api_response.date_of_transaction
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {
                                                                api_response.created_at
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                                    api_response.status
                                                                )}`}
                                                            >
                                                                <span className="mr-1">
                                                                    {getStatusIcon(
                                                                        api_response.status
                                                                    )}
                                                                </span>
                                                                {
                                                                    api_response.status
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                            {Number(
                                                                api_response.total_sales
                                                            ).toLocaleString(
                                                                "en-US",
                                                                {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2,
                                                                }
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                                            {
                                                                api_response.transaction_count
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <button
                                                                className="text-gray-500 hover:text-gray-700"
                                                                onClick={() => {
                                                                    openModal();
                                                                    setModalJsonData(
                                                                        api_response.payload
                                                                    );
                                                                    setTitle(
                                                                        "JSON Payload"
                                                                    );
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        color: "orange",
                                                                    }}
                                                                >
                                                                    &#123;
                                                                </span>
                                                                &nbsp;
                                                                <span>
                                                                    Payload
                                                                </span>
                                                                &nbsp;
                                                                <span
                                                                    style={{
                                                                        color: "orange",
                                                                    }}
                                                                >
                                                                    &#125;
                                                                </span>
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <button
                                                                className="text-gray-500 hover:text-gray-700"
                                                                onClick={() => {
                                                                    openModal();
                                                                    setModalJsonData(
                                                                        api_response.raw_response
                                                                    );
                                                                    setTitle(
                                                                        "JSON Response"
                                                                    );
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        color: "orange",
                                                                    }}
                                                                >
                                                                    &#123;
                                                                </span>
                                                                &nbsp;
                                                                <span>
                                                                    Response
                                                                </span>
                                                                &nbsp;
                                                                <span
                                                                    style={{
                                                                        color: "orange",
                                                                    }}
                                                                >
                                                                    &#125;
                                                                </span>
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            <button
                                                                onClick={() =>
                                                                    handleViewClick(
                                                                        api_response.pos_data_id
                                                                    )
                                                                }
                                                                className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                                            >
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={goToPreviousPage}
                                            disabled={
                                                paginationValues.currentPage ===
                                                1
                                            }
                                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                paginationValues.currentPage ===
                                                1
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                                            }`}
                                        >
                                            Previous
                                        </button>

                                        <div className="flex items-center space-x-1">
                                            {Array.from(
                                                {
                                                    length: paginationValues.totalPages,
                                                },
                                                (_, i) => i + 1
                                            ).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() =>
                                                        goToPage(page)
                                                    }
                                                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                        paginationValues.currentPage ===
                                                        page
                                                            ? "bg-blue-600 text-white"
                                                            : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={goToNextPage}
                                            disabled={
                                                paginationValues.currentPage ===
                                                paginationValues.totalPages
                                            }
                                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                paginationValues.currentPage ===
                                                paginationValues.totalPages
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                                            }`}
                                        >
                                            Next
                                        </button>
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        Page {paginationValues.currentPage} of{" "}
                                        {paginationValues.totalPages}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "database" && (
                            <div className="bg-white rounded-lg shadow-sm border">
                                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            POS Data
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Recent pulled from POS
                                        </p>
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Showing{" "}
                                        {paginationValues.startIndex + 1}-
                                        {Math.min(
                                            paginationValues.endIndex,
                                            paginationValues.totalRecords
                                        )}{" "}
                                        of {paginationValues.totalRecords}{" "}
                                        records
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Contract Number
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Contract Key
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Pos No
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Company Code
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Date of Transaction
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total Sales
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Transaction Count
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Created At
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {paginationValues.currentRecords.map(
                                                (data) => (
                                                    <tr
                                                        key={data.id}
                                                        className="hover:bg-gray-50"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span
                                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                                    data.status
                                                                )}`}
                                                            >
                                                                <span className="mr-1">
                                                                    {getStatusIcon(
                                                                        data.status
                                                                    )}
                                                                </span>
                                                                {data.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {
                                                                data.contract_number
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {data.contract_key}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {data.pos_no}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {data.company_code}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {
                                                                data.date_of_transaction
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {data.total_sales}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {
                                                                data.transaction_count
                                                            }
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {data.created_at}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={goToPreviousPage}
                                            disabled={
                                                paginationValues.currentPage ===
                                                1
                                            }
                                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                paginationValues.currentPage ===
                                                1
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                                            }`}
                                        >
                                            Previous
                                        </button>

                                        <div className="flex items-center space-x-1">
                                            {Array.from(
                                                {
                                                    length: paginationValues.totalPages,
                                                },
                                                (_, i) => i + 1
                                            ).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() =>
                                                        goToPage(page)
                                                    }
                                                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                        paginationValues.currentPage ===
                                                        page
                                                            ? "bg-blue-600 text-white"
                                                            : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={goToNextPage}
                                            disabled={
                                                paginationValues.currentPage ===
                                                paginationValues.totalPages
                                            }
                                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                paginationValues.currentPage ===
                                                paginationValues.totalPages
                                                    ? "text-gray-400 cursor-not-allowed"
                                                    : "text-gray-700 hover:bg-gray-100 border border-gray-300"
                                            }`}
                                        >
                                            Next
                                        </button>
                                    </div>

                                    <div className="text-sm text-gray-600">
                                        Page {paginationValues.currentPage} of{" "}
                                        {paginationValues.totalPages}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {isModalOpen && (
                    <div className="fixed inset-0 bg-gray bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    API Response Details
                                </h3>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                                >
                                    x
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto max-h-[60vh]">
                                {isLoading ? (
                                    <div className="flex items-center justify-center py-8">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        <span className="ml-3 text-gray-600">
                                            Loading response...
                                        </span>
                                    </div>
                                ) : modalData ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-gray-600">
                                                Status:
                                            </span>
                                            <span
                                                className={`px-2 py-1 rounded text-sm font-medium ${
                                                    modalData.status === 200
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}
                                            >
                                                {modalData.status === 200
                                                    ? "SUCCESS"
                                                    : "FAILED"}
                                            </span>
                                        </div>

                                        <div>
                                            <span className="text-sm font-medium text-gray-600">
                                                Message:
                                            </span>
                                            <p className="mt-1 text-sm text-gray-900">
                                                {modalData.message}
                                            </p>
                                        </div>

                                        <div>
                                            <span className="text-sm font-medium text-gray-600">
                                                Response Data:
                                            </span>
                                            <div className="mt-2 bg-gray-50 rounded-lg p-4 overflow-x-auto">
                                                <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                                                    {JSON.stringify(
                                                        modalData,
                                                        null,
                                                        2
                                                    )}
                                                </pre>
                                            </div>
                                        </div>

                                        {modalData.data?.Main &&
                                            modalData.data.Main.length > 0 &&
                                            modalData.data.Main[0][
                                                "Contract No."
                                            ] &&
                                            modalData.data.Main[0][
                                                "POS No."
                                            ] && (
                                                <div>
                                                    <span className="text-sm font-medium text-gray-600">
                                                        Transaction Details:
                                                    </span>
                                                    <div className="mt-2 bg-blue-50 rounded-lg p-4">
                                                        {modalData.data.Main.map(
                                                            (item, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="space-y-2"
                                                                >
                                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                                        <div>
                                                                            <span className="font-medium text-gray-600">
                                                                                Contract
                                                                                No:
                                                                            </span>
                                                                            <p className="text-gray-900">
                                                                                {
                                                                                    item[
                                                                                        "Contract No."
                                                                                    ]
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-medium text-gray-600">
                                                                                POS
                                                                                No:
                                                                            </span>
                                                                            <p className="text-gray-900">
                                                                                {
                                                                                    item[
                                                                                        "POS No."
                                                                                    ]
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-medium text-gray-600">
                                                                                Transaction
                                                                                Date:
                                                                            </span>
                                                                            <p className="text-gray-900">
                                                                                {
                                                                                    item[
                                                                                        "Transaction Date"
                                                                                    ]
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                        <div>
                                                                            <span className="font-medium text-gray-600">
                                                                                Total
                                                                                Sales:
                                                                            </span>
                                                                            <p className="text-green-600 font-medium">
                                                                                ₱
                                                                                {
                                                                                    item[
                                                                                        "Total Sales"
                                                                                    ]
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                    </div>
                                ) : null}
                            </div>

                            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                <JsonModal
                    show={isOpen}
                    onClose={closeJsonModal}
                    title={title}
                    modalData={modalJsonData}
                ></JsonModal>
                <Modal
                    show={isModalDateOpen}
                    fontColor="text-white"
                    title="ReSync Transactions Between Date"
                    onClose={() => setIsModalDateOpen(false)}
                    btnIcon="fa fa-edit"
                >
                    <div className="p-4 space-y-4">
                        <div>
                            <label className="block mb-1">From Date</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block mb-1">To Date</label>
                            <input
                                type="date"
                                className="w-full p-2 border rounded"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-gray-500 text-white rounded"
                                onClick={() => setIsModalDateOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={submitReSyncBetweenDate}
                            >
                                ReSync
                            </button>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default DataSyncDashboard;
