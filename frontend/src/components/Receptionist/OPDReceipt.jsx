import React, { useState } from 'react';
import {
    Button,
    Input,
    Select,
    DatePicker,
    Card,
    Row,
    Col,
    Form,
    Divider,
    Space,
    Radio,
    InputNumber,
    Badge
} from 'antd';
import {
    SaveOutlined,
    DeleteOutlined,
    PrinterOutlined,
    CloseOutlined,
    SearchOutlined,
    UserAddOutlined,
    PlusOutlined,
    UndoOutlined,
    EyeOutlined
} from '@ant-design/icons';
import moment from 'moment';
import LastSlipIssuedModal from './LastSlipIssuedModal';
import { useEffect } from 'react';
import axiosInstance from '../../utills/axiosInstance';

const { TextArea } = Input;
const { Option } = Select;

const OPDReceipt = () => {

    const [form] = Form.useForm();
    const [grossAmount, setGrossAmount] = useState(0);
    const [netAmount, setNetAmount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showLastVisitModal, setShowLastVisitModal] = useState(false);
    const [opdCategoryData, setOpdCategoryData] = useState(false);
    

    // Mock data for dropdowns
    const opdCategories = [
        { value: 'general', label: 'General O.P.D' },
        { value: 'consultant', label: 'Consultant O.P.D' },
        { value: 'medical', label: 'Medical Services' },
        { value: 'dental', label: 'Dental' },
        { value: 'eye', label: 'Eye O.P.D' },
        { value: 'ent', label: 'ENT O.P.D' },
    ];

    const consultants = [
        { value: 'kulsoom', label: 'Kulsoom Bhati' },
        { value: 'saad', label: 'Saad Hassan' },
        { value: 'jawaid', label: 'Md. Jawaid' },
        { value: 'majid', label: 'Majid Khan' },
        { value: 'shumailla', label: 'Shumailla (R)' },
        { value: 'ali', label: 'Dr. Ali Ahmed' },
    ];

    const patientTitles = [
        { value: 'mr', label: 'Mr.' },
        { value: 'mrs', label: 'Mrs.' },
        { value: 'ms', label: 'Ms.' },
        { value: 'dr', label: 'Dr.' },
    ];

    const genders = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
        { value: 'other', label: 'Other' },
    ];

    const partialPayment = [
        { value: '1', label: 400 },
        { value: '2', label: 600 },
        { value: '3', label: 8000 },
    ];

    const labTest = [
        { id: 1, label: "CBC", amount: 200 },
        { id: 2, label: "MRA", amount: 300 },
        { id: 3, label: "LFT", amount: 400 },
        { id: 4, label: "KFT", amount: 500 },
    ]

    const types = [
        { value: 'opd', label: 'OPD' },
        { value: 'ipd', label: 'IPD' },
        { value: 'emergency', label: 'Emergency' },
    ];

    const payments = [
        { value: 'cash', label: 'Cash' },
        { value: 'card', label: 'Card' },
        { value: 'online', label: 'Online' },
        { value: 'insurance', label: 'Insurance' },
    ];

    const references = [
        { value: 'walkin', label: 'Walk-in' },
        { value: 'referral', label: 'Referral' },
        { value: 'online', label: 'Online Booking' },
        { value: 'camp', label: 'Medical Camp' },
    ];

    // Handle form submission
    const onFinish = (values) => {
        setLoading(true);
        console.log('Form Values:', values);

        const formData = {
            ...values,
            date: values.date ? values.date.format('DD-MMM-YYYY HH:mm:ss') : null,
            grossAmount: grossAmount,
            netAmount: netAmount,
        };

        console.log('Processed Form Data:', formData);

        setTimeout(() => {
            setLoading(false);
            console.log('Form submitted successfully!');
        }, 1500);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Form validation failed:', errorInfo);
    };

    const handleReset = () => {
        form.resetFields();
        setGrossAmount(0);
        setNetAmount(0);
    };

    const fetchOpdCategoryData = async () => {
        try {
            const res = await axiosInstance.get('/api/receptionist/opdCategory'); 
            console.log(res , "res fetch Opd Category Data...............");
            
            // setOpdCategoryData(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchOpdCategoryData();
    }, []);




    return (
        // h-full so it fills the tab pane height given by the parent (ReceptionistPage)
        <div className="opd-receipt-container h-full flex flex-col">

            {
                showLastVisitModal && < LastSlipIssuedModal open={showLastVisitModal} onCancel={() => setShowLastVisitModal(false)} form={form} />
            }

            <Card
                className="shadow-sm rounded-xl border-0 flex-1 min-h-0 flex flex-col"
                bodyStyle={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    minHeight: 0,
                    padding: '16px 20px',
                }}
                style={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                }}
                title={
                    <div className="flex items-center justify-between">

                        <div className="flex items-center gap-3">
                            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                            <span className="text-lg font-semibold text-gray-800">
                                OPD RECEIPT
                            </span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                New Patient
                            </span>
                        </div>

                        <div className="flex-1 max-w-md min-w-[200px]">
                            <Input
                                placeholder="Search Patient by Name, CNIC or Phone"
                                prefix={<SearchOutlined className="text-gray-400" />}
                                className="rounded-lg hover:border-blue-400 focus:border-blue-500"
                                allowClear
                                onChange={(e) => console.log('Search:', e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 shrink-0">

                            {/* Refresh Button */}
                            <button
                                onClick={() => {
                                    console.log('Refresh clicked');
                                }}
                                className="flex cursor-pointer items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-all duration-300 border border-blue-200"
                                title="Refresh"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>

                            {/* Save Patient Button */}
                            <button
                                onClick={() => {
                                    console.log('Save Patient clicked');
                                    // form.submit(); 
                                }}
                                className="flex cursor-pointer items-center gap-1.5 px-4 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-medium rounded-lg shadow-md shadow-green-500/30 hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
                            >
                                <SaveOutlined className="text-white" />
                                Save Patient
                            </button>

                            {/* Search Patient Button */}
                            <button
                                onClick={() => {
                                    console.log('Search Patient clicked');
                                }}
                                className="flex cursor-pointer items-center gap-1.5 px-4 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg shadow-md shadow-blue-500/30 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                            >
                                <SearchOutlined className="text-white" />
                                Search Patient
                            </button>

                            {/* Last OPD Receipt Button (already existing) */}
                            <button
                                onClick={() => setShowLastVisitModal(true)}
                                className="flex cursor-pointer items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-lg shadow-md shadow-purple-500/30 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
                            >
                                <EyeOutlined className="text-white" />
                                Last Receipt
                            </button>

                        </div>

                    </div>
                }
            >

                {/* min-h-0 + flex-1 is what makes the Form (and its scroll area) actually shrink instead of pushing the page taller */}
                <Form
                    form={form}
                    layout="vertical"
                    className="opd-form flex-1 min-h-0 flex flex-col"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{
                        date: moment(),
                        type: 'opd',
                        gender: 'male',
                        payment: 'cash',
                        patientTitle: 'mr',
                    }}
                >

                    {/* SCROLLABLE FIELDS AREA - only this scrolls, buttons below stay fixed/visible */}
                    <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-1" style={{ scrollbarGutter: 'stable' }}>

                        {/* Main Form - Complete Grid Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-3">

                            <Form.Item
                                name="type"
                                label={<span className="text-xs font-semibold text-gray-600">Type</span>}
                                rules={[{ required: true, message: 'Please select type' }]}
                                className="mb-0"
                            >
                                <Select
                                    placeholder="Select Type"
                                    className="rounded-lg"
                                    suffixIcon={<span className="text-gray-400">▼</span>}
                                >
                                    {types.map(item => (
                                        <Option key={item.value} value={item.value}>{item.label}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="reference"
                                label={<span className="text-xs font-semibold text-gray-600">Reference</span>}
                                className="mb-0 md:col-span-1 lg:col-span-1"
                            >
                                <Select
                                    placeholder="Select Reference"
                                    className="rounded-lg"
                                    allowClear
                                    suffixIcon={<span className="text-gray-400">▼</span>}
                                >
                                    {references.map(item => (
                                        <Option key={item.value} value={item.value}>{item.label}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="partialPayment"
                                label={<span className="text-xs font-semibold text-gray-600">Partial Payment</span>}
                                rules={[{ required: true, message: 'Please select Partial Payment' }]}
                                className="mb-0"
                            >
                                <Select
                                    placeholder="Select Partial Payment"
                                    className="rounded-lg"
                                    suffixIcon={<span className="text-gray-400">▼</span>}
                                >
                                    {partialPayment?.map(item => (
                                        <Option key={item.value} value={item.value}>{item.label}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="date"
                                label={<span className="text-xs font-semibold text-gray-600">Date & Time</span>}
                                rules={[{ required: true, message: 'Please select date and time' }]}
                                className="mb-0"
                            >
                                <DatePicker
                                    showTime
                                    format="DD-MMM-YYYY HH:mm:ss"
                                    className="w-full rounded-lg hover:border-blue-400 focus:border-blue-500"
                                    placeholder="Select Date & Time"
                                    suffixIcon={<span className="text-gray-400">📅</span>}
                                />
                            </Form.Item>

                            <Form.Item
                                name="opdCategory"
                                label={<span className="text-xs font-semibold text-gray-600">OPD Category</span>}
                                rules={[{ required: true, message: 'Please select OPD category' }]}
                                className="mb-0"
                            >
                                <Select
                                    placeholder="Select OPD Category"
                                    className="rounded-lg"
                                    suffixIcon={<span className="text-gray-400">▼</span>}
                                >
                                    {opdCategories.map(item => (
                                        <Option key={item.value} value={item.value}>{item.label}</Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="consultant"
                                label={<span className="text-xs font-semibold text-gray-600">Consultant</span>}
                                rules={[{ required: true, message: 'Please select consultant' }]}
                                className="mb-0"
                            >
                                <Select
                                    placeholder="Select Consultant"
                                    showSearch
                                    className="rounded-lg"
                                    suffixIcon={<span className="text-gray-400">▼</span>}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {consultants.map(item => (
                                        <Option key={item.value} value={item.value}>{item.label}</Option>
                                    ))}
                                </Select>

                            </Form.Item>

                            <Form.Item
                                name="labTest"
                                label={<span className="text-xs font-semibold text-gray-600">Lab test</span>}
                                rules={[{ required: true, message: 'Please select lab Test' }]}
                                className="mb-0"
                            >
                                <Select
                                    mode="multiple"
                                    placeholder="Select Lab test"
                                    showSearch
                                    className="rounded-lg"
                                    suffixIcon={<span className="text-gray-400">▼</span>}
                                    allowClear
                                    onChange={(value, option) => {
                                        const selectedTests = labTest?.filter(item =>
                                            value.includes(item.id)
                                        );
                                        const amounts = selectedTests?.map(item => item.amount);
                                        console.log(amounts, "amounts ,,,,,,,,,");
                                    }}
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().includes(input.toLowerCase())
                                    }
                                >
                                    {labTest.map(item => (
                                        <Option key={item.id} value={item.id}>{item.label}</Option>
                                    ))}
                                </Select>
                            </Form.Item>


                            <Form.Item
                                name="labTestAmount"
                                label={<span className="text-xs font-semibold text-gray-600">Lab test Amount</span>}
                                rules={[{ required: true, message: 'Please select lab Test Amount' }]}
                                className="mb-0"
                            >
                                <Select
                                    placeholder="Select Lab test"
                                    className="rounded-lg"
                                    suffixIcon={<span className="text-gray-400">▼</span>}
                                    mode="multiple"
                                    allowClear
                                >
                                    {/* <Option key={item.value} value={item.value}>200</Option> */}

                                </Select>
                            </Form.Item>


                        </div>

                        <div className="flex flex-col lg:flex-row justify-between gap-6 md:gap-10">

                            {/* Patient Details  */}
                            <div className="flex-8">

                                <Divider orientation="left" className="text-xs font-semibold text-gray-600 !my-3">
                                    <span className="flex items-center gap-2">
                                        <span className="w-1 h-4 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full"></span>
                                        Patient Details
                                    </span>
                                </Divider>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">

                                    {/* Title */}
                                    <Form.Item
                                        name="patientTitle"
                                        label={<span className="text-xs font-semibold text-gray-600">Title</span>}
                                        rules={[{ required: true, message: 'Please select title' }]}
                                        className="mb-0"
                                    >
                                        <Select
                                            placeholder="Title"
                                            className="rounded-lg"
                                            suffixIcon={<span className="text-gray-400">▼</span>}
                                        >
                                            {patientTitles.map(item => (
                                                <Option key={item.value} value={item.value}>{item.label}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    {/* Patient Name */}
                                    <Form.Item
                                        name="patientName"
                                        label={<span className="text-xs font-semibold text-gray-600">Patient Name</span>}
                                        rules={[
                                            { required: true, message: 'Please enter patient name' },
                                            { min: 2, message: 'Name must be at least 2 characters' }
                                        ]}
                                        className="mb-0"
                                    >
                                        <Input
                                            placeholder="Enter patient full name"
                                            className="rounded-lg hover:border-blue-400 focus:border-blue-500"
                                            prefix={<span className="text-gray-400 text-xs">👤</span>}
                                        />
                                    </Form.Item>

                                    {/* Contact */}
                                    <Form.Item
                                        name="contact"
                                        label={<span className="text-xs font-semibold text-gray-600">Contact #</span>}
                                        rules={[
                                            { required: true, message: 'Please enter contact number' },
                                            { pattern: /^[0-9+\-\s()]{7,15}$/, message: 'Please enter a valid phone number' }
                                        ]}
                                        className="mb-0"
                                    >
                                        <Input
                                            placeholder="Enter contact number"
                                            className="rounded-lg hover:border-blue-400 focus:border-blue-500"
                                            prefix={<span className="text-gray-400 text-xs">📞</span>}
                                            suffix={
                                                <span className="text-xs text-blue-500 font-medium">F7 Help</span>
                                            }
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="gender"
                                        label={<span className="text-xs font-semibold text-gray-600">Gender</span>}
                                        rules={[{ required: true, message: 'Please select gender' }]}
                                        className="mb-0"
                                    >
                                        <Select
                                            placeholder="Select Gender"
                                            className="rounded-lg"
                                            suffixIcon={<span className="text-gray-400">▼</span>}
                                        >
                                            {genders.map(item => (
                                                <Option key={item.value} value={item.value}>{item.label}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>


                                    {/* Age  */}
                                    <Form.Item
                                        label={<span className="text-xs font-semibold text-gray-600">Age</span>}
                                        className="mb-0"
                                        required
                                    >
                                        <div className="grid grid-cols-2 gap-3">

                                            {/* Age Number Input */}
                                            <Form.Item
                                                name="ageValue"
                                                rules={[
                                                    { required: true, message: 'Please enter age' },
                                                    { type: 'number', min: 0, max: 150, message: 'Age must be greater then 0' }
                                                ]}
                                                className="mb-0"
                                            >
                                                <Input
                                                    placeholder="Enter age"
                                                    className="rounded-lg hover:border-blue-400 focus:border-blue-500"
                                                    type="number"
                                                    min={0}
                                                    prefix={<span className="text-gray-400 text-xs">🔢</span>}
                                                />
                                            </Form.Item>

                                            {/* Age Type Dropdown */}
                                            <Form.Item
                                                name="ageType"
                                                rules={[{ required: true, message: 'Please select age type' }]}
                                                className="mb-0"
                                                initialValue="years"
                                            >
                                                <Select
                                                    placeholder="Select Age Type"
                                                    className="rounded-lg"
                                                    suffixIcon={<span className="text-gray-400">▼</span>}
                                                >
                                                    <Option value="days">Days</Option>
                                                    <Option value="months">Months</Option>
                                                    <Option value="years">Years</Option>
                                                </Select>
                                            </Form.Item>

                                        </div>
                                    </Form.Item>

                                    {/* Remarks - Full Width */}
                                    <Form.Item
                                        name="remarks"
                                        label={<span className="text-xs font-semibold text-gray-600">Remarks</span>}
                                        className="mb-0 col-span-1 sm:col-span-1"
                                    >
                                        <TextArea
                                            placeholder="Enter any remarks or notes"
                                            rows={1}
                                            className="rounded-lg hover:border-blue-400 focus:border-blue-500"
                                        />
                                    </Form.Item>

                                </div>

                            </div>

                            {/* Payment Details */}
                            <div className="flex-2">

                                <Divider orientation="left" className="text-xs font-semibold text-gray-600 !my-3">
                                    <span className="flex items-center gap-2">
                                        <span className="w-1 h-4 bg-gradient-to-b from-green-400 to-emerald-500 rounded-full"></span>
                                        Payment Details
                                    </span>
                                </Divider>

                                <div className="grid grid-cols-1 gap-3">

                                    {/* Gross Payment */}
                                    <Form.Item
                                        name="grossPayment"
                                        label={<span className="text-xs font-semibold text-gray-600">Gross Payment</span>}
                                        rules={[
                                            { required: true, message: 'Please enter gross payment amount' },
                                            { type: 'number', min: 0, message: 'Amount must be greater than 0' }
                                        ]}
                                        className="mb-0"
                                    >
                                        <Input
                                            placeholder="Enter gross amount"
                                            className="rounded-lg hover:border-blue-400 focus:border-blue-500"
                                            type="number"
                                            min={0}
                                            step={100}
                                            prefix={<span className="text-gray-400 text-xs">Rs.</span>}
                                            suffix={
                                                <span className="text-xs text-blue-500 font-medium">PKR</span>
                                            }
                                        />
                                    </Form.Item>

                                    {/* Net Payment */}
                                    <Form.Item
                                        name="netPayment"
                                        label={<span className="text-xs font-semibold text-gray-600">Net Payment</span>}
                                        rules={[
                                            { required: true, message: 'Please enter net payment amount' },
                                            { type: 'number', min: 0, message: 'Amount must be greater than 0' }
                                        ]}
                                        className="mb-0"
                                    >
                                        <Input
                                            placeholder="Enter net amount"
                                            className="rounded-lg hover:border-blue-400 focus:border-blue-500"
                                            type="number"
                                            min={0}
                                            step={100}
                                            prefix={<span className="text-gray-400 text-xs">Rs.</span>}
                                            suffix={
                                                <span className="text-xs text-green-500 font-medium">PKR</span>
                                            }
                                        />
                                    </Form.Item>

                                </div>


                            </div>

                        </div>


                    </div>


                    {/* STICKY ACTION FOOTER - shrink-0 so it always stays visible, no scroll needed to Save/Print */}
                    <div className="shrink-0 pt-3 mt-3 border-t border-gray-200 flex flex-col items-center justify-between gap-3">

                        <div className="flex justify-between w-full bg-gradient-to-r from-red-50/70 to-orange-50/70 p-3 rounded-xl border border-red-200/50">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1 h-5 bg-gradient-to-b from-red-400 to-orange-500 rounded-full"></div>
                                <span className="text-sm font-semibold text-red-600">Refund Information</span>
                                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-medium rounded-full">Optional</span>
                            </div>

                            <div className="flex items-center gap-3 bg-white/60 p-2 rounded-lg">
                                <span className="text-xs font-medium text-gray-500 min-w-[80px]">Refund By:</span>
                                <span className="text-sm font-semibold text-gray-800">s.m.nawaz</span>
                            </div>

                            <div className="flex items-center gap-3 bg-white/60 p-2 rounded-lg">
                                <span className="text-xs font-medium text-gray-500 min-w-[80px]">Refund Date:</span>
                                <span className="text-sm font-semibold text-gray-800">16-Jul-2026 01:44 PM</span>
                            </div>

                        </div>

                        <div className='flex justify-between w-full'>

                            <div className="flex flex-wrap gap-2">
                                <Button
                                    type="primary"
                                    icon={<UserAddOutlined />}
                                    className="bg-gradient-to-r from-blue-500 to-indigo-600 border-0 shadow-md shadow-blue-500/30 hover:shadow-lg hover:shadow-blue-500/40"
                                    htmlType="reset"
                                    onClick={handleReset}
                                >
                                    New
                                </Button>

                                <Button
                                    type="primary"
                                    icon={<SaveOutlined />}
                                    loading={loading}
                                    htmlType="submit"
                                    className="bg-gradient-to-r from-emerald-500 to-green-600 border-0 shadow-md shadow-green-500/30 hover:shadow-lg hover:shadow-green-500/40"
                                >
                                    Save
                                </Button>

                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    className="shadow-sm hover:shadow-md"
                                >
                                    Delete
                                </Button>

                                <Button
                                    type="default"
                                    icon={<PrinterOutlined />}
                                    className="hover:border-blue-400 hover:text-blue-600"
                                >
                                    Print
                                </Button>

                                <Button
                                    icon={<CloseOutlined />}
                                    className="hover:border-red-400 hover:text-red-600"
                                    onClick={() => window.close()}
                                >
                                    Close
                                </Button>
                            </div>

                            <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-blue-50/50 px-4 py-2 rounded-xl border border-blue-100/50">
                                <span className="text-sm font-semibold text-gray-600">Current Cash:</span>
                                <span className="text-xl font-bold text-green-600">Rs. 0</span>
                            </div>

                        </div>

                    </div>

                </Form>

            </Card>


        </div >
    );
};

export default OPDReceipt;














