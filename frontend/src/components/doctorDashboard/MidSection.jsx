import { Select, Input, Button, Tag, Badge, Table, } from "antd";
const { Option } = Select;
import MyCircleChart from "../Dashboard/MyCircleChart"
import axios from "axios";
import { base_URL } from "../../utills/baseUrl";
import { memo, useState } from "react";
import { toast } from "react-toastify";
import GetVoice from "./GetVoice";


const MidSection = ({ patientsData, docPatientData }) => {

    const loginUserData = JSON.parse(localStorage.getItem("loginUserData"));
    const currentPatientsData = patientsData?.patients?.[0];
    const [isNextLoading, setIsNextLoading] = useState(false);
    const [isSkipLoading, setIsSkipLoading] = useState(false);
    const [isRepeatCallingHandler, setRepeatCallingHandler] = useState(false);
    // const [isCallSkipLoading, setIsCallSkipLoading] = useState(false);
    const [resetTrigger, setResetTrigger] = useState(false);
    const [specificSearchingToken, setSpecificSearchingToken] = useState(null);
    const [formData, setFormData] = useState({
        primaryDiagnosis: [],
        medicalTests: [],
        treatment: "",
        primaryComplain: ""
    });
    let patientToken = Number(specificSearchingToken?.split(" ")[0]?.split("-")[1]);
    const hasAppointments = patientsData?.todayAppointments > 0;
    const hasCurrentPatient = !!currentPatientsData?.RECEIPTNO;
    const allPatientsDone = patientsData?.todayAppointments === patientsData?.patientsChecked + patientsData?.patientsSkipped;
    const disableNext = isNextLoading || !hasAppointments || (!specificSearchingToken && allPatientsDone);
    const disableSkip = isSkipLoading || !hasCurrentPatient;
    const [selectedDepartment, setSelectedDepartment] = useState(null);
    const [selectedTest, setSelectedTest] = useState(null);
    let patintsW8ing;


    // console.log(specificSearchingToken, "<<<<<<<  specificSearchingToken  ");
    console.log(currentPatientsData, "<<<<<<<  currentPatientsData ");
    console.log(patientsData, "<<<<<<<<<");
    console.log(loginUserData, "<<<<<<<  loginUserData  ");



    const departments = [
        { id: "1", name: "General", type: "1" },
        { id: "2", name: "BIOCHEMISTRY", type: "2" },
        { id: "3", name: "HEAMOTOLOGY", type: "2" },
        { id: "4", name: "SEROLOGY", type: "2" },
        { id: "5", name: "HORMONES", type: "2" },
        { id: "6", name: "URINE EXAMINATION", type: "2" },
        { id: "7", name: "BLOOD BANK", type: "2" },
        { id: "8", name: "FLUIDS", type: "2" },
        { id: "9", name: "MICROBIOLOGY", type: "2" },
        { id: "10", name: "STOOL EXAMINATION", type: "2" },
        { id: "11", name: "SEMEN ANALYSIS", type: "2" },
        { id: "12", name: "HEPATITIS", type: "2" },
        { id: "14", name: "HISTROPATHOLOGY", type: "2" },
        { id: "15", name: "ECHOCARDIOGRAPHY", type: "19" },
        { id: "16", name: "SPECIAL CHEMISTRY-1", type: "2" },
        { id: "17", name: "SPECIAL CHEMISTRY-2", type: "2" },
    ];

    // Sample tests data - sirf UI dikhane ke liye
    const sampleTests = [
        { id: "101", name: "Complete Blood Count", department: "2" },
        { id: "102", name: "Blood Sugar Fasting", department: "2" },
        { id: "103", name: "Lipid Profile", department: "2" },
        { id: "104", name: "Liver Function Test", department: "2" },
        { id: "105", name: "Thyroid Profile", department: "5" },
        { id: "106", name: "Urine Routine", department: "6" },
    ];

    // Sample lab patients data - sirf UI dikhane ke liye
    const sampleLabPatients = [
        {
            id: 1,
            patientName: "Ahmed Khan",
            tokenNo: "T-101",
            testName: "Complete Blood Count",
            department: "HEAMOTOLOGY",
            status: "pending",
        },
        {
            id: 2,
            patientName: "Fatima Ali",
            tokenNo: "T-102",
            testName: "Blood Sugar Fasting",
            department: "BIOCHEMISTRY",
            status: "in progress",
        },
        {
            id: 3,
            patientName: "Usman Tariq",
            tokenNo: "T-103",
            testName: "Lipid Profile",
            department: "BIOCHEMISTRY",
            status: "completed",
        },
        {
            id: 4,
            patientName: "Ayesha Malik",
            tokenNo: "T-104",
            testName: "Thyroid Profile",
            department: "HORMONES",
            status: "pending",
        },
        {
            id: 5,
            patientName: "Bilal Ahmed",
            tokenNo: "T-105",
            testName: "Urine Routine",
            department: "URINE EXAMINATION",
            status: "in progress",
        },
        {
            id: 6,
            patientName: "Hassan Raza",
            tokenNo: "T-106",
            testName: "Liver Function Test",
            department: "BIOCHEMISTRY",
            status: "completed",
        },
        {
            id: 7,
            patientName: "Sara Khan",
            tokenNo: "T-107",
            testName: "Hepatitis Screening",
            department: "HEPATITIS",
            status: "pending",
        },
        {
            id: 8,
            patientName: "Ali Hamza",
            tokenNo: "T-108",
            testName: "Stool Routine",
            department: "STOOL EXAMINATION",
            status: "pending",
        },
    ];


    const pieData = [
        { name: "Patients Remaining", uv: patientsData?.patientsRemaining, fill: "#60A5FA" },   // blue-400
        { name: "Patients Checked", uv: patientsData?.patientsChecked, fill: "#A855F7" }, // purple-500
    ];

    const patientData = {
        name: "Ali Raza",
        age: 32,
        gender: "Male",
        opdId: "A - 20",

        CbloodPressure: "120/80 mmHg",
        LbloodPressure: "130/85 mmHg",

        CbloodSugar: "95 mg/dL",
        LbloodSugar: "105 mg/dL",

        Cweight: "72 kg",
        Lweight: "74 kg",

        Cheight: "5.8 ft",
        Lheight: "5.8 ft",

        Ctemperature: "98.4°F",
        Ltemperature: "99.1°F",

        Cpulse: "78 bpm",
        Lpulse: "82 bpm",
    };

    const diagnosisOptions = patientsData?.diagnosisList?.map((item) => ({
        value: item.DIAGNOSIS,
        label: item.DIAGNOSIS,
    }));

    const testOptions = patientsData?.testList?.map((item) => ({
        value: item?.TEST_NAME,
        label: item?.TEST_NAME,
    }));

    const skippedTokenListOptions = patientsData?.skippedTokenList?.map((item) => ({
        value: item?.TOKENNO,
        label: item?.TOKENNO,
    }));




    const nextHandler = async () => {



        try {
            setIsNextLoading(true)
            const res = await axios.post(`${base_URL}/api/opd/doctor/next-patient`, {
                doctorId: loginUserData?.doctorId,
                receiptNo: currentPatientsData?.RECEIPTNO || null,
                remarks: formData?.primaryComplain || null,
                primaryDiagnosis: formData?.primaryDiagnosis || null,
                medicalTests: formData?.medicalTests || null,
                treatment: formData?.treatment || null
            });
            // console.log(res, "res of next Handler by id");
            await docPatientData()
            if (patientsData?.patientsRemaining > 0) {
                toast.success(`Next Patient is Coming`)
            }
            else {
                toast.info(`Patient Not yet`)
            }
            setFormData({
                primaryDiagnosis: [],
                medicalTests: [],
                treatment: "",
                primaryComplain: ""
            });
            setResetTrigger(prev => !prev)

        }
        catch (err) {
            console.log(err, "error in next Handler");
            toast.error(err?.message)
        }
        finally {
            setIsNextLoading(false);
        }

    }

    const specificCallingHandler = async () => {

        try {
            setIsNextLoading(true)
            const res = await axios.post(`${base_URL}/api/opd/doctor/patient-specific-call`, {
                doctorId: loginUserData?.doctorId,
                tokenNo: patientToken || null,
                remarks: formData?.primaryComplain || null,
                primaryDiagnosis: formData?.primaryDiagnosis || null,
                medicalTests: formData?.medicalTests || null,
                treatment: formData?.treatment || null
            });
            // console.log(res, "res of specific Calling Handler by id");
            await docPatientData()
            if (patientsData?.patientsRemaining > 0) {
                toast.success(`Next Patient is Coming`)
            }
            else {
                toast.info(`Patient Not yet`)
            }

            setSpecificSearchingToken(null)

        }
        catch (err) {
            console.log(err, "error in specific Calling Handler");
            toast.error(err?.message)
        }
        finally {
            setIsNextLoading(false);
        }

    }

    const skipHandler = async () => {

        // console.log(formData, ">>>>>>>>>>>>>");

        try {
            setIsSkipLoading(true)
            const res = await axios.post(`${base_URL}/api/opd/doctor/patient-skipped`, {
                doctorId: loginUserData?.doctorId,
                receiptNo: null,
            });
            // console.log(res, "res of skip Handler by id");
            await docPatientData()
            if (patientsData?.patientsRemaining > 0) {
                toast.success(`Next Patient is Coming`)
            }
            else {
                toast.info(`Patient Not yet`)
            }

        }
        catch (err) {
            console.log(err, "error in skip Handler");
            toast.error(err?.message)
        }
        finally {
            setIsSkipLoading(false);
        }

    }

    // const callSkipHandler = async () => {

    //     // if (!currentPatientsData) return;
    //     // console.log(formData, ">>>>>>>>>>>>>");

    //     try {
    //         setIsCallSkipLoading(true)
    //         const res = await axios.post(`${base_URL}/api/opd/doctor/patient-skipped-call`, {
    //             doctorId: loginUserData?.doctorId,
    //             receiptNo: null,
    //             remarks: formData?.primaryComplain || null,
    //             primaryDiagnosis: formData?.primaryDiagnosis || null,
    //             medicalTests: formData?.medicalTests || null,
    //             treatment: formData?.treatment || null
    //         });
    //         // console.log(res, "res of call Skip Handler by id");
    //         await docPatientData()
    //         if (patientsData?.patientsSkipped) {
    //             toast.success(`Next Patient is Coming`)
    //         }
    //         else {
    //             toast.info(`Patient Not yet`)
    //         }

    //     }
    //     catch (err) {
    //         console.log(err, "error in call Skip Handler");
    //         toast.error(err?.message)
    //     }
    //     finally {
    //         setIsCallSkipLoading(false);
    //     }

    // }

    const repeatCallingHandler = async () => {

        try {
            setRepeatCallingHandler(true)
            const res = await axios.post(`${base_URL}/api/opd/doctor/patient-repeat-call`, {
                doctorId: loginUserData?.doctorId,
                doctorName: loginUserData?.name,
                patientToken: currentPatientsData?.TOKENNO,
            });
            console.log(res, "res of repeat Calling Handler");

            toast.success(`Repeat Calling`)

        }
        catch (err) {
            console.log(err, "error in call Skip Handler");
            toast.error(err?.message)
        }
        finally {
            setRepeatCallingHandler(false);
        }

    }

    const formHandler = (key, value) => {
        setFormData({ ...formData, [key]: value });
    }




    const isPatientApointmentEqualstoChecked = patientsData?.todayAppointments == patientsData?.patientsChecked;
    // if (specificSearchingToken) {
    //     patintsW8ing = true
    // }
    // else if (patientsData?.todayAppointments && patientsData?.patientsChecked) {
    //     patintsW8ing = patientsData?.patientsRemaining
    // }
    // console.log(patintsW8ing, "<<<<<<<<<<<");



    return (

        <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6 mb-8 h-auto ">

            {/* Pie Chart */}
            {

                // <div className="themeBoxShadow  border-none outline-none rounded-[10px] z-10 bg-white hidden lg:flex flex-col justify-between min-h-[35vh] sm:min-h-[40vh] lg:h-auto">


                //     <div className="flex-1 p-2 px-4 sm:p-4 flex justify-between gap-4 sm:gap-8 items-center border-b border-gray-300 text-[18px] text-gray-500 font-medium">
                //         {/* text-slate-700 */}
                //         <h2 className="text-lg sm:text-xl font-semibold text-black"> Patient Progress </h2>
                //         <div className="flex flex-col sm:flex-row  justify-center gap-1 sm:gap-6 text-sm ">
                //             <span className="text-[#60A5FA] ">● Patients Remaining </span>
                //             <span className="text-[#A855F7] ">● Patients Checked</span>
                //         </div>

                //     </div>

                //     <div className={`flex-7 ${!(patientsData?.patientsRemaining || patientsData?.patientsChecked) && "p-6"}`}>
                //         {
                //             (patientsData?.patientsRemaining || patientsData?.patientsChecked) ?
                //                 <MyCircleChart piData={pieData} active="dd" /> :
                //                 (
                //                     <div className=" flex flex-col items-center justify-center  h-full  rounded-xl border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 text-center transition-all">

                //                         <div className=" w-16 h-16 rounded-full  bg-blue-100 flex items-center justify-center mb-3">
                //                             <span className="text-3xl">📊</span>
                //                         </div>

                //                         <h3 className="text-base sm:text-lg font-semibold text-blue-700">
                //                             No Patients Checked Today
                //                         </h3>

                //                         <p className="text-sm text-blue-500 mt-1 max-w-[220px]">
                //                             Patient visit data will appear here once appointments are scheduled
                //                         </p>

                //                         <div className=" mt-3 px-4 py-1 rounded-full text-xs font-medium  bg-blue-100 text-blue-600">
                //                             Waiting for OPD entries
                //                         </div>
                //                     </div>
                //                 )
                //         }
                //     </div>

                //     <div className="p-4 border-t border-gray-200 flex gap-4">
                //         <Button
                //             type="primary"
                //             block
                //             onClick={skipHandler}
                //             loading={isSkipLoading}
                //             disabled={disableSkip}
                //         >
                //             Skip Patient
                //         </Button>
                //         {/* <Button
                //         type="primary"
                //         block
                //         onClick={callSkipHandler}
                //         loading={isCallSkipLoading}
                //         disabled={isCallSkipLoading }
                //     >
                //         Call Skip Patient
                //     </Button> */}
                //     </div>

                // </div>
            }

            {/* Lab management */}
            <div className="order-3 xl:order-1 z-10 themeBoxShadow border-none outline-none rounded-xl bg-white flex flex-col min-h-[35vh]  overflow-hidden">

                {/* Header */}
                <div className="flex-1 p-4 flex justify-between items-center rounded-xl border border-gray-300 xl:bg-gradient-to-r xl:from-indigo-600 xl:to-blue-500">
                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-black xl:text-white">
                            Lab Management
                        </h2>
                        <p className="text-xs text-blue-600 xl:text-blue-100">
                            Assign & Monitor Patient Lab Tests
                        </p>
                    </div>

                    <div className=" flex items-center gap-2 bg-gray-100 xl:bg-white/20 px-3 py-1 rounded-full">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                        </span>
                        <span className="text-xs text-black  xl:text-white">Live</span>
                    </div>
                </div>


                {/* Department + Test Selection */}
                <div className="p-4 border-b border-gray-200 space-y-4">

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <Select
                            placeholder="Select Department"
                            value={selectedDepartment}
                            onChange={setSelectedDepartment}
                            showSearch
                            optionFilterProp="children"
                            className="w-full"
                            size="middle"
                        >
                            {departments.map((dept) => (
                                <Option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </Option>
                            ))}
                        </Select>

                        <Select
                            placeholder="Select Test"
                            value={selectedTest}
                            onChange={setSelectedTest}
                            disabled={!selectedDepartment}
                            showSearch
                            optionFilterProp="children"
                            className="w-full"
                            size="middle"
                        >
                            {selectedDepartment &&
                                sampleTests
                                    .filter((test) => test.department === selectedDepartment)
                                    .map((test) => (
                                        <Option key={test.id} value={test.id}>
                                            {test.name}
                                        </Option>
                                    ))}
                        </Select>

                        <Button
                            type="primary"
                            size="middle"
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 border-none hover:opacity-90"
                            onClick={() => {
                                if (selectedTest && currentPatientsData) {
                                    toast.success(
                                        `Test assigned to ${currentPatientsData.PATIENTNAME}`,
                                    );
                                    setSelectedTest(null);
                                } else {
                                    toast.warning(
                                        "Please select test and ensure patient available",
                                    );
                                }
                            }}
                            disabled={!selectedTest || !currentPatientsData}
                        >
                            Assign Test
                        </Button>
                    </div>
                </div>


                {/* Lab Patients Table */}
                <div className="flex-6 p-4 overflow-auto hide-scrollbar">

                    <div className="mb-3 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-700">
                            Today's Lab Patients
                        </h3>

                        <Badge
                            count={sampleLabPatients?.length}
                            style={{ backgroundColor: "#3b82f6" }}
                        />
                    </div>

                    <Table
                        columns={[
                            {
                                title: "Patient",
                                dataIndex: "patientName",
                                key: "patientName",
                                render: (text) => (
                                    <span className="font-medium text-gray-800">{text}</span>
                                ),
                            },
                            {
                                title: "Token",
                                dataIndex: "tokenNo",
                                key: "tokenNo",
                                render: (text) => <Tag color="blue">{text}</Tag>,
                            },
                            {
                                title: "Test",
                                dataIndex: "testName",
                                key: "testName",
                                render: (text) => <span className="text-gray-600">{text}</span>,
                            },
                            {
                                title: "Department",
                                dataIndex: "department",
                                key: "department",
                                render: (text) => (
                                    <span className="text-gray-600 text-xs font-medium">
                                        {text}
                                    </span>
                                ),
                            },
                            {
                                title: "Status",
                                dataIndex: "status",
                                key: "status",
                                render: (status) => {
                                    const style =
                                        status === "completed"
                                            ? "bg-green-100 text-green-700"
                                            : status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-blue-100 text-blue-700";

                                    const label =
                                        status === "completed"
                                            ? "Completed"
                                            : status === "pending"
                                                ? "Pending"
                                                : "Processing";

                                    return (
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${style}`}
                                        >
                                            {label}
                                        </span>
                                    );
                                },
                            },
                        ]}
                        dataSource={sampleLabPatients}
                        rowKey="id"
                        size="middle"
                        pagination={false}
                        scroll={{ y: 270, x: 'max-content' }}
                        className="rounded-lg"
                    />
                </div>

            </div>

            {/* Patient Vitals */}
            <div className="order-1 xl:order-2 z-10 themeBoxShadow rounded-[12px] bg-white h-full flex flex-col justify-between transition-all duration-300 hover:shadow-lg">

                <div className="flex-1 p-4 flex items-center justify-between border-b border-gray-200">

                    <h2 className="text-lg sm:text-xl font-semibold text-black">
                        Patient Vitals
                    </h2>

                    <div className="flex items-center gap-6">

                        {/* TOKEN */}
                        <div className="flex items-center gap-2 text-md px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                            {currentPatientsData?.TOKENNO || "Not Yet"}
                        </div>

                        {/* REPEAT CALL BUTTON */}
                        <Button
                            size="middle"
                            onClick={repeatCallingHandler}
                            loading={isRepeatCallingHandler}
                            disabled={!currentPatientsData}
                            className="bg-gradient-to-r from-indigo-500 to-blue-500 border-none text-white hover:opacity-90"
                        >
                            🔁 Repeat Call
                        </Button>

                    </div>

                </div>

                <div className="p-6 flex-6 flex flex-col gap-3 text-gray-700 ">

                    <div className="font-semibold  py-1 flex justify-between text-gray-600" >
                        <p>
                            <span className="font-semibold text-gray-800">Name :</span> {currentPatientsData?.PATIENTNAME || "Not Yet"}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-800">Age :</span> {currentPatientsData?.AGE || "Not Yet"}
                        </p>
                        <p>
                            <span className="font-semibold text-gray-800">Gender :</span> {currentPatientsData?.GENDER || "Not Yet"}
                        </p>
                    </div>

                    {
                        <div className="mt-3 grid grid-cols-2  sm:grid-cols-3 gap-3 gap-x-5 text-sm p-4 rounded-2xl shadow-lg transition-all themeBoxShadow">

                            {/* Blood Pressure */}
                            <div className="flex flex-col p-3 rounded-lg border"
                                style={{ backgroundColor: "#FDF2F8", borderColor: "#EC4899" }}>

                                <span className="text-black font-semibold">Blood Pressure</span>

                                <div className="font-bold text-[#DB2777]">
                                    {patientData?.CbloodPressure}
                                </div>

                                <div className="font-medium text-[#9D174D]">
                                    {patientData?.LbloodPressure}
                                </div>
                            </div>


                            {/* Blood Sugar */}
                            <div className="flex flex-col p-3 rounded-lg border"
                                style={{ backgroundColor: "#ECFDF5", borderColor: "#22C55E" }}>

                                <span className="text-black font-semibold">Blood Sugar</span>

                                <div className="font-bold text-green-700">
                                    {patientData?.CbloodSugar}
                                </div>

                                <div className="font-medium text-green-800">
                                    {patientData?.LbloodSugar}
                                </div>
                            </div>


                            {/* Weight */}
                            <div className="flex flex-col p-3 rounded-lg border"
                                style={{ backgroundColor: "#DBEAFE", borderColor: "#2563EB" }}>

                                <span className="text-black font-semibold">Weight</span>

                                <div className="font-bold text-blue-700">
                                    {patientData?.Cweight}
                                </div>

                                <div className="font-medium text-blue-800">
                                    {patientData?.Lweight}
                                </div>
                            </div>


                            {/* Height */}
                            <div className="flex flex-col p-3 rounded-lg border"
                                style={{ backgroundColor: "#F3F4F6", borderColor: "#4B5563" }}>

                                <span className="text-black font-semibold">Height</span>

                                <div className="font-bold text-gray-700">
                                    {patientData?.Cheight}
                                </div>

                                <div className="font-medium text-gray-800">
                                    {patientData?.Lheight}
                                </div>
                            </div>


                            {/* Temperature */}
                            <div className="flex flex-col p-3 rounded-lg border"
                                style={{ backgroundColor: "#EDE9FE", borderColor: "#7C3AED" }}>

                                <span className="text-black font-semibold">Temp</span>

                                <div className="font-bold text-purple-700">
                                    {patientData?.Ctemperature}
                                </div>

                                <div className="font-medium text-purple-800">
                                    {patientData?.Ltemperature}
                                </div>
                            </div>


                            {/* Pulse */}
                            <div className="flex flex-col p-3 rounded-lg border"
                                style={{ backgroundColor: "#FEF9C3", borderColor: "#CA8A04" }}>

                                <span className="text-black font-semibold">Pulse</span>

                                <div className="font-bold text-yellow-700">
                                    {patientData?.Cpulse}
                                </div>

                                <div className="font-medium text-yellow-800">
                                    {patientData?.Lpulse}
                                </div>
                            </div>

                        </div>
                    }

                </div>

                {/* NEXT BUTTON */}
                <div className="p-4 border-t border-gray-200 hidden 2xl:flex gap-5">
                    <Select
                        allowClear
                        showSearch
                        placeholder="Select Token"
                        optionFilterProp="label"
                        style={{ width: "40%" }}
                        options={skippedTokenListOptions}
                        onChange={(value) => setSpecificSearchingToken(value)}
                        value={specificSearchingToken}

                    />

                    <Button
                        type="primary"
                        block
                        onClick={specificSearchingToken ? specificCallingHandler : nextHandler}
                        loading={isNextLoading}
                        // disabled={disableNext || !patintsW8ing}
                        disabled={disableNext}
                    >
                        {specificSearchingToken ? "Specific Calling" : currentPatientsData?.RECEIPTNO ? "Next Patient" : "START"}
                    </Button>
                </div>

                {/* Skip Buttons */}
                <div className="p-4 border-t  border-gray-200 hidden 2xl:flex gap-3">
                    <Button
                        block
                        className="!border-blue-500 !text-blue-500  hover:!border-blue-600 hover:!text-blue-600 hover:!bg-blue-50 active:!bg-blue-100 transition-all duration-200"
                        onClick={skipHandler}
                        loading={isSkipLoading}
                        disabled={disableSkip}
                    >
                        Skip Patient
                    </Button>

                    {/* <Button
                        type="primary"
                        block
                        size="large"
                        onClick={callSkipHandler}
                        loading={isCallSkipLoading}
                        disabled={
                            isCallSkipLoading ||
                            isPatientApointmentEqualstoChecked ||
                            !patientsData?.patientsSkipped
                        }
                        className="bg-green-500 hover:bg-green-600 border-none"
                    >
                        Call Skip Patient
                    </Button> */}
                </div>

            </div>

            {/* Add Patient Detail */}
            <div className="order-2 xl:order-3 z-10 col-span-1 lg:col-span-2 2xl:col-span-1 themeBoxShadow border-none outline-none rounded-xl overflow-hidden bg-white h-full flex flex-col">

                {/* HEADER */}
                <div className="p-4 flex-1 flex justify-between items-center bg-gradient-to-r from-indigo-600 to-blue-500">

                    <div>
                        <h2 className="text-lg sm:text-xl font-semibold text-white">
                            Add Patient Detail
                        </h2>
                        <p className="text-xs text-blue-100">
                            Assign & Monitor
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                        <span className="relative flex h-2 w-2">
                            <span className=" absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                        </span>
                        <span className="text-xs text-white"> OPD Entry</span>
                    </div>
                </div>

                {/* BODY */}
                <div className="flex-6 grid grid-cols-1  md:grid-cols-2  2xl:grid-cols-1  gap-5 p-4 ">

                    {/* PRIMARY DIAGNOSIS */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-500">
                            Primary Diagnosis
                        </label>
                        <Select
                            // mode="multiple"
                            mode="tags"
                            allowClear
                            showSearch
                            placeholder="Select primary diagnosis"
                            optionFilterProp="label"
                            style={{ width: "100%" }}
                            options={diagnosisOptions}
                            onChange={(value) => formHandler("primaryDiagnosis", value)}
                            value={formData.primaryDiagnosis}
                        />
                    </div>

                    {/* MEDICAL TESTS */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-500">
                            Recommended Tests
                        </label>
                        <Select
                            // mode="multiple"
                            mode="tags"
                            allowClear
                            placeholder="Select medical tests"
                            style={{ width: "100%" }}
                            options={testOptions}
                            onChange={(value) => formHandler("medicalTests", value)}
                            value={formData.medicalTests}
                        />
                    </div>

                    {/* TREATMENT */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-500">
                            Treatment / Medication
                        </label>
                        <Input.TextArea
                            rows={3}
                            placeholder="Prescribed medicines or treatment"
                            onChange={(e) => formHandler("treatment", e.target.value)}
                            value={formData.treatment}

                        />
                    </div>

                    {/* PRIMARY COMPLAINT */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-gray-500">
                            Primary Complain
                        </label>
                        <Input.TextArea
                            rows={3}
                            placeholder="Patient complain / symptoms"
                            onChange={(e) => formHandler("primaryComplain", e.target.value)}
                            value={formData.primaryComplain}
                        />
                    </div>

                </div>

                <GetVoice formHandler={formHandler} resetTrigger={resetTrigger} />

                {/* NEXT BUTTON */}
                <div className="p-4 border-t border-gray-200 flex items-center gap-4 2xl:hidden">

                    {/* TOKEN SELECT */}
                    <div className="flex-1">
                        <Select
                            allowClear
                            showSearch
                            placeholder="Select Token"
                            optionFilterProp="label"
                            className="w-full"
                            options={skippedTokenListOptions}
                            onChange={(value) => setSpecificSearchingToken(value)}
                            value={specificSearchingToken}
                        />
                    </div>

                    {/* MAIN ACTION BUTTON */}
                    <div className="flex-1">
                        <Button
                            type="primary"
                            block
                            onClick={specificSearchingToken ? specificCallingHandler : nextHandler}
                            loading={isNextLoading}
                            disabled={disableNext}
                        >
                            {specificSearchingToken
                                ? "Specific Calling"
                                : currentPatientsData?.RECEIPTNO
                                    ? "Next Patient"
                                    : "START"}
                        </Button>
                    </div>

                    {/* SKIP BUTTON */}
                    <div className="flex-1 hidden md:block">
                        <Button
                            block
                            className="!border-blue-500 !text-blue-500  hover:!border-blue-600 hover:!text-blue-600 hover:!bg-blue-50 active:!bg-blue-100 transition-all duration-200"
                            onClick={skipHandler}
                            loading={isSkipLoading}
                            disabled={disableSkip}
                        >
                            Skip Patient
                        </Button>
                    </div>

                </div>

                <div className="border-t p-4 border-gray-200 gap-4 flex md:hidden">
                    <Button
                        block
                        className="!border-blue-500 !text-blue-500  hover:!border-blue-600 hover:!text-blue-600 hover:!bg-blue-50 active:!bg-blue-100 transition-all duration-200"
                        onClick={skipHandler}
                        loading={isSkipLoading}
                        disabled={disableSkip}
                    >
                        Skip Patient
                    </Button>
                </div>

            </div>

        </div >
    )
}

export default memo(MidSection)