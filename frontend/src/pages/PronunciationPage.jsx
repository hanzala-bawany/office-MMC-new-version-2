import React, { useState, useEffect } from "react";
import {
    Select,
    Input,
    Button,
    Table,
    Modal,
    Form,
    message,
    Space,
    Tag,
    Tooltip,
    Card,
} from "antd";
import {
    PlusOutlined,
    DeleteOutlined,
    EditOutlined,
    SoundOutlined,
    BulbOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import { base_URL } from "../utills/baseUrl";

const PronunciationPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [pronounceName, setPronounceName] = useState("");
    const [tableData, setTableData] = useState([]);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // console.log(editingId, "editingId .......");
    // console.log(pronounceName, "pronounceName .......");
    // console.log(selectedDoctor, "selectedDoctor .......");

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await axios.get(`${base_URL}/api/pronounce`);
            console.log(res?.data?.data, "............. res");

            const doctorsData = (res?.data?.data || [])
                ?.filter((item) => item?.ID && item?.ID !== 0)
                ?.map((item) => ({
                    id: item?.ID,
                    name: item?.ORIGINAL_NAME,
                    pronounceName: item?.PRONOUNCE_NAME,
                }));

            const tableDoctorsData = doctorsData?.filter(
                (item) => item?.pronounceName,
            );

            console.log("Mapped Doctors: .......... ", doctorsData);

            setDoctors(doctorsData);
            setTableData(tableDoctorsData);
        } catch (error) {
            console.error("Error fetching doctors:", error);
            message.error("Failed to fetch doctors");
        }
    };

    const handleAdd = async () => {
        if (!selectedDoctor || !pronounceName.trim()) {
            toast.warning("Please select doctor and enter pronounce name");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${base_URL}/api/pronounce`, {
                action: "ADD",
                consultantId: selectedDoctor.id,
                pronounceName: pronounceName.trim(),
                user: "Admin",
            });

            if (res.data.success) {
                toast.success(res.data.message);
                setPronounceName("");
                setSelectedDoctor(null);
                setIsEditMode(false);
                setEditingId(null);
                fetchDoctors();
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error("Error saving pronunciation");
        } finally {
            setLoading(false);
        }
    };

    // ✅ Updated handleEdit - ONLY sets pronounce name, NOT doctor
    const handleEdit = (record) => {
        // ✅ Sirf pronounce name set karo, doctor select nahi
        setPronounceName(record.pronounceName || "");
        setIsEditMode(true);
        setEditingId(record.id);
        toast.info(
            `Editing pronunciation for ${record.name}. Update the pronounce name and click Update.`,
        );
    };

    // ✅ handleUpdate - Update the pronunciation
    const handleUpdate = async () => {
        if (!editingId || !pronounceName.trim()) {
            toast.warning("Please enter pronounce name");
            return;
        }

        setLoading(true);
        try {
            const res = await axios.post(`${base_URL}/api/pronounce`, {
                action: "ADD",
                consultantId: editingId,
                pronounceName: pronounceName.trim(),
                user: "Admin",
            });

            if (res.data.success) {
                setPronounceName("");
                setIsEditMode(false);
                setEditingId(null);
                fetchDoctors();
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error("Error updating pronunciation");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (record) => {
        console.log(record, "record ....................");

        Modal.confirm({
            title: "Confirm Delete",
            content: `Delete pronunciation for ${record.name}?`,
            onOk: async () => {
                try {
                    const res = await axios.post(`${base_URL}/api/pronounce`, {
                        action: "DELETE",
                        consultantId: record.id,
                        user: "Admin",
                    });

                    if (res.data.success) {
                        toast.success(res.data.message);
                        fetchDoctors();
                    } else {
                        toast.error(res.data.message);
                    }
                } catch {
                    toast.error("Delete failed");
                }
            },
        });
    };

    const loadVoices = () => {
        return new Promise((resolve) => {
            let voices = speechSynthesis.getVoices();
            if (voices.length) resolve(voices);

            speechSynthesis.onvoiceschanged = () => {
                resolve(speechSynthesis.getVoices());
            };
        });
    };

    const handleAnnounce = async () => {
        const voices = await loadVoices();

        if (!pronounceName && !selectedDoctor?.name) {
            return toast.info("Please select any doctor")
        }

        const msg = new SpeechSynthesisUtterance(
            `doctor ${pronounceName || selectedDoctor?.name}`,
        );

        msg.voice =
            voices.find((v) => v?.lang?.includes("hi")) ||
            voices?.find((v) => v?.lang?.includes("en")) ||
            voices[0];
        msg.rate = 0.9;

        window.speechSynthesis.resume();
        window.speechSynthesis.speak(msg);

        toast.success(`Announcing doctor ${pronounceName || selectedDoctor?.name}`);
    };

    // ✅ Cancel edit mode
    const handleCancelEdit = () => {
        setPronounceName("");
        setIsEditMode(false);
        setEditingId(null);
    };

    const columns = [
        {
            title: "Doctor ID",
            dataIndex: "id",
            key: "id",
            width: 120,
            render: (text) => <Tag color="blue">{text || "N/A"}</Tag>,
        },
        {
            title: "Doctor Name",
            dataIndex: "name",
            key: "name",
            width: 250,
            render: (text) => (
                <span className="font-medium text-gray-700">{text || "N/A"}</span>
            ),
        },
        {
            title: "Pronounce Name",
            dataIndex: "pronounceName",
            key: "pronounceName",
            width: 250,
            render: (text) => (
                <div className="flex items-center gap-2">
                    <SoundOutlined className="text-blue-500" />
                    <span className="text-gray-700 font-medium">
                        {text && text.trim() ? text : "Not set"}
                    </span>
                </div>
            ),
        },
        {
            title: "Actions",
            key: "actions",
            width: 150,
            fixed: "right",
            render: (_, record) => (
                <Space>
                    <Tooltip title="Edit Pronunciation">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            className="text-blue-600 hover:text-blue-800"
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record)}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
            <div className="max-w-7xl mx-auto">
               
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                        <SoundOutlined className="text-3xl text-blue-600" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Doctor Pronunciation Manager
                    </h1>
                    <p className="text-gray-500">
                        Manage doctor name pronunciations for clear announcements
                    </p>
                </div>

                {/* Input Section Card */}
                <Card className="mb-8 shadow-md border-0 rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Doctor Select - Always enabled */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                Select Doctor <span className="text-red-500">*</span>
                            </label>
                            <Select
                                allowClear
                                showSearch
                                placeholder="Search and select doctor"
                                className="w-full"
                                size="large"
                                value={selectedDoctor?.id}
                                onChange={(value, option) => {
                                    if (!value) {
                                        setSelectedDoctor(null);
                                        return;
                                    }

                                    setSelectedDoctor({
                                        id: value,
                                        name: option.label,
                                    });
                                }}
                                suffixIcon={<SearchOutlined className="text-gray-400" />}
                                options={doctors.map((doc) => ({
                                    value: doc.id,
                                    label: doc.name || "Unknown",
                                }))}
                                optionFilterProp="label"
                                filterOption={(input, option) =>
                                    (option?.label ?? "")
                                        .toLowerCase()
                                        .includes(input.toLowerCase())
                                }
                            // ✅ Removed disabled - always enabled
                            />
                        </div>

                        {/* Pronounce Name Input */}
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">
                                Pronunciation Name <span className="text-red-500">*</span>
                            </label>
                            <Input
                                addonBefore="Doctor"
                                placeholder="Enter pronounce name in small char to get better responce"
                                size="large"
                                value={pronounceName}
                                onChange={(e) => setPronounceName(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Buttons Row */}
                    <div className="flex gap-4 mt-6">
                        {isEditMode ? (
                            // ✅ Show Update button in edit mode
                            <>
                                <Button
                                    type="primary"
                                    icon={<EditOutlined />}
                                    size="large"
                                    onClick={handleUpdate}
                                    loading={loading}
                                    className="bg-orange-600 hover:bg-orange-700 border-none flex-1 h-12 text-base font-medium rounded-lg"
                                >
                                    Update Pronunciation
                                </Button>
                            </>
                        ) : (
                            // ✅ Show Add button in normal mode
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                size="large"
                                onClick={handleAdd}
                                loading={loading}
                                className="bg-blue-600 hover:bg-blue-700 border-none flex-1 h-12 text-base font-medium rounded-lg"
                            >
                                Add Pronunciation
                            </Button>
                        )}

                        <Button
                            size="large"
                            onClick={handleCancelEdit}
                            className="border-gray-300 text-gray-700 flex-1 h-12 text-base font-medium rounded-lg"
                        >
                            Cancel
                        </Button>

                        <Button
                            icon={<BulbOutlined />}
                            size="large"
                            onClick={handleAnnounce}
                            className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 border-none text-white flex-1 h-12 text-base font-medium rounded-lg"
                        >
                            Announce Name
                        </Button>
                    </div>
                </Card>

                {/* Table Section Card */}
                <Card className="shadow-md border-0 rounded-2xl overflow-hidden">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800">
                                Pronunciation List
                            </h2>
                            <p className="text-gray-500 text-sm mt-1">
                                Manage doctor name pronunciations
                            </p>
                        </div>
                        <Tag color="blue" className="text-base px-3 py-1 rounded-full">
                            {tableData.length} Records
                        </Tag>
                    </div>

                    <Table
                        columns={columns}
                        dataSource={tableData}
                        rowKey="id"
                        loading={loading}
                        pagination={{
                            pageSize: 10,
                            showTotal: (total) => `Total ${total} records`,
                            showSizeChanger: true,
                            pageSizeOptions: ["10", "20", "50"],
                        }}
                        scroll={{ x: 800 }}
                        className="[&_.ant-table-thead>tr>th]:bg-gray-50 
                                 [&_.ant-table-thead>tr>th]:text-gray-800 
                                 [&_.ant-table-thead>tr>th]:font-semibold 
                                 [&_.ant-table-thead>tr>th]:text-sm 
                                 [&_.ant-table-thead>tr>th]:border-b-2 
                                 [&_.ant-table-thead>tr>th]:border-gray-200
                                 [&_.ant-table-tbody>tr>td]:text-gray-700 
                                 [&_.ant-table-tbody>tr>td]:border-b 
                                 [&_.ant-table-tbody>tr>td]:border-gray-100
                                 [&_.ant-table-tbody>tr:hover>td]:bg-gray-50
                                 [&_.ant-pagination-item-active]:bg-blue-600 
                                 [&_.ant-pagination-item-active]:border-blue-600
                                 [&_.ant-pagination-item-active_a]:text-white"
                    />
                </Card>
                
            </div>
        </div>
    );
};

export default PronunciationPage;


