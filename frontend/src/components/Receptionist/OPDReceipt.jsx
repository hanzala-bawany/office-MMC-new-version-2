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
import useFetch from '../../hooks/useFetch';
import { useSelector } from 'react-redux';
import OpdReceiptModal from './opdReceiptModal';
import './OPDReceipt.css';
import { toast } from 'react-toastify';



const { TextArea } = Input;
const { Option } = Select;


const OPDReceipt = () => {

    const loginUserData = useSelector((state) => state?.authSlice?.loginUser);
    const [form] = Form.useForm();
    const [grossAmount, setGrossAmount] = useState(0);
    const [netAmount, setNetAmount] = useState(0);
    const [addEditPatientLoading, setAddEditPatientLoading] = useState(false);
    const [showLastVisitModal, setShowLastVisitModal] = useState(false);
    const [showOpdReceiptModal, setShowOpdReceiptModal] = useState(false);
    const [selectedLabTestAmounts, setSelectedLabTestAmounts] = useState([]);
    const [patientTypeId, setPatientTypeId] = useState(null);
    const [opdCategoryId, setOpdCategoryId] = useState(null);
    const [islabortaryAble, setIslabortaryAble] = useState(false);
    const [showPartialnBalance, setShowPartialnBalance] = useState(false);
    const [showZakatnSPD, setShowZakatnSPD] = useState(null);
    const [showMember, setShowMember] = useState(null);
    const [selectedMemberNo, setSelectedMemberNo] = useState(null);
    const [selectedMemberPatientId, setSelectedMemberPatientId] = useState(null);
    const discountAmount = Form.useWatch('discountAmount', form);
    const partialAmount = Form.useWatch('partialPayment', form);

    const { data: opdCategoryData, loading: opdCategorLoading, error: opdCategorError } = useFetch('/api/receptionist/opdCategory');
    const { data: patientCategoryData, loading: patientCategorLoading, error: patientCategorError } = useFetch('/api/receptionist/patientCategory');
    const { data: membersData, loading: membersLoading, error: membersError } = useFetch('/api/receptionist/members');
    const { data: labTestData, loading: labTestLoading, error: labTestError } = useFetch('/api/receptionist/getLabTest');
    const { data: usersData, loading: usersLoading, error: usersError } = useFetch('/api/receptionist/users');

    const { data: memberDependentData, loading: memberDependentLoading, error: memberDependentError } =
        useFetch(selectedMemberNo ? `/api/receptionist/members/${selectedMemberNo}` : null);

    const { data: lastPatientData, loading: lastPatientLoading, error: lastPatientError } =
        useFetch(loginUserData?.username ? `/api/receptionist/lastPatient/${loginUserData?.username}` : null);

    const { data: referenceData, loading: referenceLoading, error: referenceError } =
        useFetch(`/api/receptionist/reference`);

    const { data: consultantsData, loading: consultantsLoading, error: consultantsError } =
        useFetch('/api/receptionist/allConsultant', { facultyId: opdCategoryId || null });


    const titleOptions = [
        { label: "Mr.", value: "Mr." },
        { label: "Ms.", value: "Ms." },
        { label: "Miss.", value: "Miss." },
        { label: "Mrs.", value: "Mrs." },
        { label: "Master.", value: "Master." },
        { label: "Baby.", value: "Baby." },
        { label: "S/O.", value: "S/O." },
        { label: "D/O.", value: "D/O." },
    ];

    const ageTypeOptions = [
        { label: "Year", value: "Year" },
        { label: "Month", value: "Month" },
        { label: "Day", value: "Day" },
    ];

    const genders = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' },
    ];

    const partialPayment = [
        { value: 0, label: "No" },
        { value: 1, label: "Yes" },
    ];

    const references = [
        { value: 'walkin', label: 'Walk-in' },
        { value: 'referral', label: 'Referral' },
        { value: 'online', label: 'Online Booking' },
        { value: 'camp', label: 'Medical Camp' },
    ];


    // console.log(grossAmount, "grossAmount ..............");
    // console.log(patientCategoryData, "patientCategoryData ..............");
    // console.log(membersData, "membersData ..............");
    // console.log(memberDependentData, "memberDependentData ..............");
    // console.log(usersData, "usersData ..............");
    // console.log(opdCategoryData, "opdCategoryData ..............");
    // console.log(consultantsData, "consultantsData ..............");
    // console.log(opdCategoryId, "opdCategoryId ..............");
    // console.log(selectedMemberPatientId, "selectedMemberPatientId ..............");
    // console.log(lastPatientData, "lastPatientData ..............");
    // console.log(labTestData, "labTestData ..............");
    

    useEffect(() => {

        form.setFieldsValue({ grossPayment: grossAmount });
        if (grossAmount === 0) {
            form.setFieldsValue({
                discountAmount: 0,
                partialPayment: 0,
                netPayment: 0,
                balancePayment: 0,
            });

        }
    }, [grossAmount])

    useEffect(() => {

        const discount = Number(discountAmount) || 0;
        const partial = Number(partialAmount) || 0;

        if (!partial) {
            const net = grossAmount - discount;
            form.setFieldsValue({ netPayment: net < 0 ? 0 : net });
        } else {
            form.setFieldsValue({ netPayment: partial });
            const balance = (grossAmount - discount) - partial;
            form.setFieldsValue({ balancePayment: balance < 0 ? 0 : balance });
        }

    }, [grossAmount, discountAmount, partialAmount]);



    const handleFieldChange = (changedValues, allValues) => {

        // console.log(changedValues, "changedValues");
        console.log(allValues, "allValues");


        if (changedValues?.type) {
            setPatientTypeId(changedValues.type);
            form.setFieldsValue({ reference: undefined });
        }
        else if (changedValues?.opdCategory) {
            setOpdCategoryId(changedValues.opdCategory);
            form.setFieldsValue({ consultant: undefined });
        }
    };

    const onFinish = async (values) => {

        setAddEditPatientLoading(true);

        try {
            const payload = {
                ReceiptNo: null,
                TokenNo: null,
                Vdate: values.date ? values.date.format('DD-MMM-YYYY HH:mm:ss') : null,
                CatagoryId: values.opdCategory,
                ConsultantID: values.consultant,
                PatientType: values.type,
                MemberID: values.members || null,
                PatientId: showMember ? selectedMemberPatientId : null,
                PatientTitle: values.patientTitle,
                PatientName: values.patientName || null,
                Gender: values.gender,
                ContactNo: values.contact,
                Age: values.ageValue,
                AgeUnit: values.ageType,
                ReferenceId: values.reference || null,
                Remarks: values.remarks,
                GrossAmount: Number(values.grossPayment) || 0,
                Discount: Number(values.discountAmount) || 0,
                NetAmount: Number(values.netPayment),
                partialAmount: Number(values.partialPayment) || 0,
                netbalance: Number(values.balancePayment) || 0,
                User: loginUserData?.username || null,
                TerminalId: null,                          //  ye kar na he 
                status: 0,                                 // ye dekhn ahe 
                isPartial: values.isPartial || null,
                electricitycharges: null,                  // ye dekhna he 
                laboratoryConsultantid: islabortaryAble ? values.consultant : null,  // ye bhi maaloom kar na he 
            };

            console.log("payload.........", payload);


            const res = await axiosInstance.post('/api/receptionist/opdAddandEditPatient', payload);

            console.log('Saved successfully:', res);
            toast.success(res?.data?.message)

        } catch (err) {
            console.error('Error saving OPD receipt:', err);
            toast.error(err?.response?.data?.message || "Failed to generate OPD reciept");
        } finally {
            setAddEditPatientLoading(false);
        }

    };

    const onFinishFailed = (errorInfo) => {
        console.log('Form validation failed:', errorInfo);
    };

    const handleReset = () => {
        form.resetFields();
    };

    const labTestHandler = (value, option) => {

        const selectedTests = labTestData?.data?.filter(item =>
            value.includes(item.ID)
        );

        const total = selectedTests?.reduce(
            (sum, item) => sum + Number(item.HOSPITALRATE || 0),
            0
        ) || 0;

        setGrossAmount(total);

        const amounts = selectedTests?.map(item => ({
            id: item.ID,
            title: item.TITLE,
            amount: item.HOSPITALRATE
        }));

        setSelectedLabTestAmounts(amounts || []);

    }

    const opdCategoryHandler = (value, option) => {
        setIslabortaryAble(value == 2 ? true : false)
        setGrossAmount(0);
    }

    const consultantHandler = (value, option) => {
        const selectedConsultant = consultantsData?.data?.find(item => item.ID === value);
        setGrossAmount(Number(selectedConsultant?.HOSPITALRATE) || 0);
    }



    return (
        <div className="opd-receipt-container h-full flex flex-col">

            {
                < LastSlipIssuedModal open={showLastVisitModal} onCancel={() => setShowLastVisitModal(false)} form={form} lastPatientData={lastPatientData} />
            }


            {
                < OpdReceiptModal open={showOpdReceiptModal} onCancel={() => setShowOpdReceiptModal(false)} form={form} />
            }

            <Card
                className="shadow-sm rounded-xl border-0 flex-1 min-h-0 flex flex-col"
                bodyStyle={{
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    minHeight: 0,
                    padding: '10px 16px',
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

                            <button
                                onClick={() => {
                                    handleReset()
                                }}
                                className="flex cursor-pointer items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-100 transition-all duration-300 border border-blue-200"
                                title="Refresh"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                Refresh
                            </button>

                            <button
                                onClick={() => {
                                    console.log('Save Patient clicked');
                                }}
                                className="flex cursor-pointer items-center gap-1.5 px-4 py-1 bg-gradient-to-r from-emerald-500 to-green-600 text-white text-sm font-medium rounded-lg shadow-md shadow-green-500/30 hover:from-emerald-600 hover:to-green-700 transition-all duration-300"
                            >
                                <SaveOutlined className="text-white" />
                                Save Patient
                            </button>

                            <button
                                onClick={() => setShowOpdReceiptModal(true)}
                                className="flex cursor-pointer items-center gap-1.5 px-4 py-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-lg shadow-md shadow-blue-500/30 hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
                            >
                                <SearchOutlined className="text-white" />
                                OPD Patient
                            </button>

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

                <Form
                    form={form}
                    layout="vertical"
                    className="opd-form flex-1 min-h-0 flex flex-col"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    initialValues={{
                        date: moment(),
                        gender: 'male',
                        payment: 'cash',
                        patientTitle: 'Mr.',
                        isPartial: 0,
                        type: "1",
                    }}
                    onValuesChange={handleFieldChange}
                >

                    <div className="flex-1 min-h-0 overflow-y-auto pr-1" style={{ scrollbarGutter: 'stable' }}>

                        {/* TOP: OPD Receipt fields (LEFT) + Patient Details fields (RIGHT) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

                            {/* ============ LEFT: OPD RECEIPT INFO ============ */}
                            <div>
                                <Divider orientation="left" className="text-xs font-semibold text-gray-600 !my-1.5">
                                    <span className="flex items-center gap-2">
                                        <span className="w-1 h-4 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full"></span>
                                        OPD Receipt
                                    </span>
                                </Divider>

                                <div className="grid grid-cols-3 gap-2">


                                    <Form.Item
                                        name="type"
                                        label={<span className="text-xs font-semibold text-gray-600">Patient Type</span>}
                                        rules={[{ required: true, message: 'Please select type' }]}
                                        className="mb-0"
                                    >
                                        <Select
                                            placeholder="Select Type"
                                            className="rounded-lg"
                                            allowClear
                                            suffixIcon={<span className="text-gray-400">▼</span>}
                                            onChange={(value, option) => {

                                                if (value == 2 || value == 4) {
                                                    setShowZakatnSPD(option)
                                                    setShowMember(null)
                                                    setSelectedMemberNo(null)
                                                }
                                                else if (value == 3) {
                                                    setShowMember(option)
                                                    setShowZakatnSPD(null)
                                                }
                                                else {
                                                    setShowZakatnSPD(null)
                                                    setShowMember(null)
                                                    setSelectedMemberNo(null)

                                                }

                                            }}
                                        >
                                            {patientCategoryData?.data?.map(item => (
                                                <Option key={item?.ID} value={item?.ID}>{item?.TITLE}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        name="isPartial"
                                        label={<span className="text-xs font-semibold text-gray-600">Is Partial</span>}
                                        rules={[{ required: true, message: 'Please select Partial Payment' }]}
                                        className="mb-0"
                                    >
                                        <Select
                                            placeholder="Select Partial Payment"
                                            className="rounded-lg"
                                            allowClear
                                            suffixIcon={<span className="text-gray-400">▼</span>}
                                            onChange={(value, option) => {

                                                if (value == 1) {
                                                    setShowPartialnBalance(true)
                                                }
                                                else (
                                                    setShowPartialnBalance(false)
                                                )

                                            }}
                                        >
                                            {partialPayment?.map(item => (
                                                <Option key={item.value} value={item.value}>{item.label}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>


                                    {
                                        showMember ?
                                            <Form.Item
                                                name="members"
                                                label={<span className="text-xs font-semibold text-gray-600">Members</span>}
                                                className="mb-0"
                                            >
                                                <Select
                                                    placeholder="Select Members"
                                                    className="rounded-lg"
                                                    allowClear
                                                    suffixIcon={<span className="text-gray-400">▼</span>}
                                                    showSearch
                                                    filterOption={(input, option) => {
                                                        console.log(option, "option ......")
                                                        return option.children.toLowerCase().includes(input.toLowerCase())
                                                    }}
                                                    onChange={(value, fullOption) => setSelectedMemberNo(value || null)}
                                                >
                                                    {membersData?.data?.map(item => (
                                                        <Option key={item?.NEWNO} value={item?.NEWNO}>{item?.NAME}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                            :
                                            <Form.Item
                                                name="reference"
                                                label={<span className="text-xs font-semibold text-gray-600">Reference</span>}
                                                className="mb-0"

                                            >
                                                <Select
                                                    placeholder="Select Reference"
                                                    className="rounded-lg"
                                                    allowClear
                                                    suffixIcon={<span className="text-gray-400">▼</span>}
                                                    showSearch
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().includes(input.toLowerCase())
                                                    }
                                                    disabled={!showZakatnSPD ? true : false}
                                                >
                                                    {referenceData?.data?.map(item => (
                                                        <Option key={item.ID} value={item.ID}>{item.NAME}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                    }

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
                                            allowClear
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
                                            allowClear
                                            suffixIcon={<span className="text-gray-400">▼</span>}
                                            onChange={opdCategoryHandler}
                                            showSearch
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }
                                        >
                                            {opdCategoryData?.data?.map(item => (
                                                <Option key={item?.ID} value={item?.ID}>{item?.TITLE}</Option>
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
                                            allowClear
                                            className="rounded-lg"
                                            suffixIcon={<span className="text-gray-400">▼</span>}
                                            filterOption={(input, option) =>
                                                option.children.toLowerCase().includes(input.toLowerCase())
                                            }
                                            onChange={consultantHandler}
                                        >
                                            {consultantsData?.data?.map(item => (
                                                <Option key={item.ID} value={item.ID}>{item.NAME}</Option>
                                            ))}
                                        </Select>

                                    </Form.Item>

                                    <div className='col-span-3  p-2'>

                                        <Form.Item
                                            name="labTest"
                                            label={<span className="text-xs font-semibold text-gray-600">Lab test & Amount</span>}
                                            className="mb-0 h-full"
                                        >
                                            <Select
                                                mode="multiple"
                                                placeholder="Select Lab test"
                                                showSearch
                                                allowClear
                                                className="rounded-lg vertical-tags-select h-full w-full"
                                                suffixIcon={<span className="text-gray-400">▼</span>}
                                                onChange={labTestHandler}
                                                optionFilterProp="label"
                                                filterOption={(input, option) => {
                                                    // console.log(option, "option ,........");
                                                    return option?.label?.toLowerCase().includes(input.toLowerCase())
                                                }}
                                                disabled={!islabortaryAble}
                                                listHeight={200}
                                                dropdownStyle={{ maxHeight: '300px' }}
                                            >
                                                {labTestData?.data?.map(item => (
                                                    <Option key={item?.ID} value={item?.ID} label={item.TITLE}>
                                                        <div className="flex justify-between items-center w-full">
                                                            <span className="font-medium">{item?.TITLE}</span>
                                                            <span className="text-green-600 font-semibold ml-4">
                                                                Rs. {item?.HOSPITALRATE || 0}
                                                            </span>
                                                        </div>
                                                    </Option>
                                                ))}
                                            </Select>
                                        </Form.Item>


                                    </div>

                                </div>

                            </div>

                            {/* ============ RIGHT: PATIENT DETAILS ============ */}
                            <div>

                                <Divider orientation="left" className="text-xs font-semibold text-gray-600 !my-1.5">
                                    <span className="flex items-center gap-2">
                                        <span className="w-1 h-4 bg-gradient-to-b from-blue-400 to-indigo-500 rounded-full"></span>
                                        Patient Details
                                    </span>
                                </Divider>

                                <div className="grid grid-cols-3 gap-2">

                                    <div className="flex gap-2 col-span-2">

                                        <Form.Item
                                            name="patientTitle"
                                            label={<span className="text-xs font-semibold text-gray-600">Title</span>}
                                            rules={[{ required: true, message: 'Please select title' }]}
                                            className="mb-0 w-30"
                                        >
                                            <Select
                                                placeholder="Title"
                                                className="rounded-lg"
                                                allowClear
                                                suffixIcon={<span className="text-gray-400">▼</span>}
                                                options={titleOptions}
                                            />
                                        </Form.Item>

                                        {
                                            !showMember ?
                                                <Form.Item
                                                    name="patientName"
                                                    label={<span className="text-xs font-semibold text-gray-600">Patient Name</span>}
                                                    rules={[
                                                        { required: true, message: 'Please enter patient name' },
                                                        { min: 2, message: 'Name must be at least 2 characters' }
                                                    ]}
                                                    className="mb-0 flex-1"
                                                >
                                                    <Input
                                                        placeholder="Enter patient full name"
                                                        className="rounded-lg hover:border-blue-400 focus:border-blue-500"
                                                        allowClear
                                                        prefix={<span className="text-gray-400 text-xs">👤</span>}
                                                    />
                                                </Form.Item>

                                                :
                                                <Form.Item
                                                    name="patientName"
                                                    label={<span className="text-xs font-semibold text-gray-600">Patient Name</span>}
                                                    rules={[{ required: true, message: 'Please select patient name' }]}
                                                    className="mb-0 flex-1"
                                                >
                                                    <Select
                                                        placeholder="Select patient full name"
                                                        className="rounded-lg"
                                                        allowClear
                                                        suffixIcon={<span className="text-gray-400">▼</span>}
                                                        onChange={(value, option) => {
                                                            // console.log(option , "option");
                                                            setSelectedMemberPatientId(option?.key || null)
                                                        }}
                                                        showSearch
                                                        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                                                    >
                                                        {memberDependentData?.data?.map(item => (
                                                            <Option key={item?.ID} value={item?.NAME}>{item?.NAME}</Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>

                                        }

                                    </div>

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
                                            allowClear
                                            prefix={<span className="text-gray-400 text-xs">📞</span>}
                                        />
                                    </Form.Item>

                                    <div className="flex gap-2 col-span-2">

                                        <Form.Item
                                            name="gender"
                                            label={<span className="text-xs font-semibold text-gray-600">Gender</span>}
                                            rules={[{ required: true, message: 'Please select gender' }]}
                                            className="mb-0 w-30"
                                        >
                                            <Select
                                                placeholder="Select Gender"
                                                className="rounded-lg"
                                                allowClear
                                                style={{ maxWidth: 140 }}
                                                suffixIcon={<span className="text-gray-400">▼</span>}
                                            >
                                                {genders.map(item => (
                                                    <Option key={item.value} value={item.value}>{item.label}</Option>
                                                ))}
                                            </Select>
                                        </Form.Item>

                                        <Form.Item
                                            name="remarks"
                                            label={<span className="text-xs font-semibold text-gray-600">Remarks</span>}
                                            className="mb-0 flex-1"
                                        >
                                            <TextArea
                                                placeholder="Enter any remarks or notes"
                                                rows={1}
                                                className="rounded-lg hover:border-blue-400 focus:border-blue-500"
                                                allowClear
                                            />
                                        </Form.Item>

                                    </div>

                                    <Form.Item
                                        label={<span className="text-xs font-semibold text-gray-600">Age</span>}
                                        className="mb-0"
                                        required
                                    >
                                        <div className="grid grid-cols-2 gap-2">
                                            <Form.Item
                                                name="ageValue"
                                                rules={[
                                                    { required: true, message: 'Please enter age' },
                                                    { type: 'number', min: 0, max: 150, message: 'Age must be greater then 0' }
                                                ]}
                                                className="mb-0 "
                                            >
                                                <InputNumber
                                                    placeholder="Enter age"
                                                    className="w-full! rounded-lg hover:border-blue-400 focus:border-blue-500"
                                                    type="number"
                                                    min={0}
                                                    allowClear
                                                    prefix={<span className="text-gray-400 text-xs">🔢</span>}
                                                />
                                            </Form.Item>

                                            <Form.Item
                                                name="ageType"
                                                rules={[{ required: true, message: 'Please select age type' }]}
                                                className="mb-0"
                                                initialValue="Year"
                                            >
                                                <Select
                                                    placeholder="Select Age Type"
                                                    className="rounded-lg w-full!"
                                                    allowClear
                                                    suffixIcon={<span className="text-gray-400">▼</span>}
                                                    options={ageTypeOptions}
                                                />
                                            </Form.Item>
                                        </div>

                                    </Form.Item>


                                </div>

                                {/* ============ BELOW BOTH: PAYMENT DETAILS ============ */}
                                <Divider orientation="left" className="text-xs font-semibold text-gray-600 my-1.5!">
                                    <span className="flex items-center gap-2">
                                        <span className="w-1 h-4 bg-linear-to-r from-green-400 to-emerald-500 rounded-full"></span>
                                        Payment Details
                                    </span>
                                </Divider>

                                <div className="grid grid-cols-3 lg:grid-cols-5 gap-2">

                                    <Form.Item
                                        name="grossPayment"
                                        label={<span className="text-xs font-semibold text-gray-600">Gross Payment</span>}
                                        rules={[
                                            { required: true, message: 'Please enter gross payment amount' },
                                            { type: 'number', min: 0, message: 'Amount must be greater than 0' }
                                        ]}
                                        className="mb-0"
                                    >
                                        <InputNumber
                                            placeholder="Enter gross amount"
                                            className="rounded-lg hover:border-blue-400 focus:border-blue-500 w-full!"
                                            type="number"
                                            min={0}
                                            // step={100}
                                            allowClear
                                            prefix={<span className="text-gray-400 text-xs">Rs.</span>}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="discountAmount"
                                        label={<span className="text-xs font-semibold text-gray-600">{showZakatnSPD?.children} Amount</span>}
                                        rules={[
                                            { type: 'number', min: 0, message: 'Amount must be greater than 0' }
                                        ]}
                                        className="mb-0"
                                    >
                                        <InputNumber
                                            placeholder="Enter  amount"
                                            className="rounded-lg hover:border-blue-400 focus:border-blue-500 w-full!"
                                            type="number"
                                            min={0}
                                            // step={100}
                                            allowClear
                                            prefix={<span className="text-gray-400 text-xs">Rs.</span>}
                                            disabled={!showZakatnSPD}
                                        />
                                    </Form.Item>


                                    <Form.Item
                                        name="partialPayment"
                                        label={<span className="text-xs font-semibold text-gray-600">Partial Payment</span>}
                                        rules={[
                                            { type: 'number', min: 0, message: 'Amount must be greater than 0' }
                                        ]}
                                        className="mb-0"
                                    >
                                        <InputNumber
                                            placeholder="Enter partial amount"
                                            className="rounded-lg hover:border-blue-400 focus:border-blue-500 w-full!"
                                            type="number"
                                            min={0}
                                            // step={100}
                                            allowClear
                                            prefix={<span className="text-gray-400 text-xs">Rs.</span>}
                                            disabled={!showPartialnBalance}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="netPayment"
                                        label={<span className="text-xs font-semibold text-gray-600">Net Payment</span>}
                                        rules={[
                                            { required: true, message: 'Please enter net payment amount' },
                                            { type: 'number', min: 0, message: 'Amount must be greater than 0' }
                                        ]}
                                        className="mb-0"
                                    >
                                        <InputNumber
                                            placeholder="Enter net amount"
                                            className="rounded-lg hover:border-blue-400 focus:border-blue-500 w-full!"
                                            type="number"
                                            min={0}
                                            // step={100}
                                            allowClear
                                            prefix={<span className="text-gray-400 text-xs">Rs.</span>}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        name="balancePayment"
                                        label={<span className="text-xs font-semibold text-gray-600">Balance Amount</span>}
                                        rules={[
                                            { type: 'number', min: 0, message: 'Amount must be greater than 0' }
                                        ]}
                                        className="mb-0"
                                    >
                                        <InputNumber
                                            placeholder="Enter net amount"
                                            className="rounded-lg hover:border-blue-400 focus:border-blue-500 w-full!"
                                            type="number"
                                            min={0}
                                            // step={100}
                                            allowClear
                                            prefix={<span className="text-gray-400 text-xs">Rs.</span>}
                                            disabled={!showPartialnBalance}
                                        />
                                    </Form.Item>


                                </div>

                            </div>

                        </div>

                    </div>


                    {/* STICKY ACTION FOOTER */}
                    <div className="shrink-0 pt-2 mt-2 border-t border-gray-200 flex flex-col items-center justify-between gap-2">

                        <div className="flex justify-between w-full bg-gradient-to-r from-red-50/70 to-orange-50/70 p-2 rounded-xl border border-red-200/50">
                            <div className="flex items-center gap-2">
                                <div className="w-1 h-5 bg-gradient-to-b from-red-400 to-orange-500 rounded-full"></div>
                                <span className="text-sm font-semibold text-red-600">Refund Information</span>
                                <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-medium rounded-full">Optional</span>
                            </div>

                            <div className="flex items-center gap-3 bg-white/60 p-1.5 rounded-lg">
                                <span className="text-xs font-medium text-gray-500 min-w-[80px]">Refund By:</span>
                                <Form.Item
                                    name="refundBy"
                                    noStyle
                                >
                                    <Select
                                        placeholder="Select Members"
                                        className="rounded-lg"
                                        allowClear
                                        suffixIcon={<span className="text-gray-400">▼</span>}
                                        showSearch
                                        filterOption={(input, option) => {
                                            console.log(option, "option ......")
                                            return option.children.toLowerCase().includes(input.toLowerCase())
                                        }}
                                    // onChange={(value, fullOption) => setSelectedMemberNo(value || null)}
                                    >
                                        {usersData?.data?.map((item, index) => (
                                            <Option  key={`${item.USERID}-${index}`} value={item?.USERID}>{item?.USERNAME}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </div>

                            <div className="flex items-center gap-3 bg-white/60 p-1.5 rounded-lg">
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
                                    loading={addEditPatientLoading}
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

                            </div>

                            <div className="flex items-center gap-3 bg-gradient-to-r from-gray-50 to-blue-50/50 px-4 py-1.5 rounded-xl border border-blue-100/50">
                                <span className="text-sm font-semibold text-gray-600">Current Cash:</span>
                                <span className="text-xl font-bold text-green-600">Rs. {lastPatientData?.data?.[0]?.NETAMOUNT}</span>
                            </div>

                        </div>

                    </div>

                </Form>

            </Card>


        </div >
    );
};

export default OPDReceipt;









































