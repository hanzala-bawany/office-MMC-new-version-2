import { Select, Input, Button, Tag, } from "antd";
const { Option } = Select;
import MyCircleChart from "../Dashboard/MyCircleChart"
import axios from "axios";
import { base_URL } from "../../utills/baseUrl";
import { memo, useState } from "react";
import { toast } from "react-toastify";

const MidSection = ({ patientsData, docPatientData }) => {

    const loginUserData = JSON.parse(localStorage.getItem("loginUserData"));
    const currentPatientsData = patientsData?.patients?.[0];
    const [isNextLoading, setIsNextLoading] = useState(false);
    const [formData, setFormData] = useState({
        primaryDiagnosis: [],
        medicalTests: [],
        treatment: "",
        primaryComplain: ""
    });
    let isAllPatientsChecked = false

    // console.log(currentPatientsData, "<<<<<<<  currentPatientsData  ");
    // console.log(patientsData, "<<<<<<<<<");
    // console.log(loginUserData, "<<<<<<<  loginUserData  "); 


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



    const nextHandler = async () => {

        // if (!currentPatientsData) return;
        // console.log(formData, ">>>>>>>>>>>>>");

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
            console.log(res, "res of next Handler by id");
            await docPatientData()
            toast.success(`Next Patient is Coming`)
            setFormData({
                primaryDiagnosis: [],
                medicalTests: [],
                treatment: "",
                primaryComplain: ""
            });

        }
        catch (err) {
            console.log(err, "error in next Handler");
            toast.error(err?.message)
        }
        finally {
            setIsNextLoading(false);
        }

    }

    if (patientsData?.todayAppointments > 0 && patientsData?.patientsChecked > 0) {
        isAllPatientsChecked = patientsData?.todayAppointments == patientsData?.patientsChecked
    }

    const formHandler = (key, value) => {
        setFormData({ ...formData, [key]: value });
    }




    return (

        <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 mb-8 h-auto ">

            {/* Pie Chart */}
            <div className="themeBoxShadow  border-none outline-none rounded-[10px] z-10 bg-white hidden lg:flex flex-col justify-between min-h-[35vh] sm:min-h-[40vh] lg:h-auto">

                <div className="flex-1 p-2 px-4 sm:p-4 flex justify-between gap-4 sm:gap-8 items-center border-b border-gray-300 text-[18px] text-gray-500 font-medium">
                    {/* text-slate-700 */}
                    <h2 className="text-lg sm:text-xl font-semibold text-black"> Patient Progress </h2>
                    <div className="flex flex-col sm:flex-row  justify-center gap-1 sm:gap-6 text-sm ">
                        <span className="text-[#60A5FA] ">● Patients Remaining </span>
                        <span className="text-[#A855F7] ">● Patients Checked</span>
                    </div>

                </div>

                <div className={`flex-7 ${!(patientsData?.patientsRemaining || patientsData?.patientsChecked) && "p-6"}`}>
                    {
                        (patientsData?.patientsRemaining || patientsData?.patientsChecked) ?
                            <MyCircleChart piData={pieData} active="dd" /> :
                            (
                                <div className=" flex flex-col items-center justify-center  h-full  rounded-xl border-2 border-dashed border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 text-center transition-all">

                                    <div className=" w-16 h-16 rounded-full  bg-blue-100 flex items-center justify-center mb-3">
                                        <span className="text-3xl">📊</span>
                                    </div>

                                    <h3 className="text-base sm:text-lg font-semibold text-blue-700">
                                        No Patients Checked Today
                                    </h3>

                                    <p className="text-sm text-blue-500 mt-1 max-w-[220px]">
                                        Patient visit data will appear here once appointments are scheduled
                                    </p>

                                    <div className=" mt-3 px-4 py-1 rounded-full text-xs font-medium  bg-blue-100 text-blue-600">
                                        Waiting for OPD entries
                                    </div>
                                </div>
                            )
                    }
                </div>

                <div className="p-4 border-t border-gray-200 flex gap-4">
                    <Button
                        type="primary"
                        block
                        // onClick={nextHandler}
                        // loading={isNextLoading}
                        // disabled={isNextLoading || isAllPatientsChecked}
                    >
                        Skip Patient
                    </Button>
                    <Button
                        type="primary"
                        block
                        // onClick={nextHandler}
                        // loading={isNextLoading}
                        // disabled={isNextLoading || isAllPatientsChecked}
                    >
                        Call Skip Patient
                    </Button>
                </div>


            </div>


            {/* Patient Vitals */}
            <div className="z-10 themeBoxShadow rounded-[12px] bg-white h-full flex flex-col justify-between transition-all duration-300 hover:shadow-lg">

                <div className="flex-1 p-4 flex items-center justify-between border-b border-gray-200">
                    <h2 className="text-lg sm:text-xl font-semibold text-black">
                        Patient Vitals
                    </h2>

                    <div className="flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                        {currentPatientsData?.TOKENNO || "Not Yet"}
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
                <div className="p-4 border-t border-gray-200 hidden 2xl:inline">
                    <Button
                        type="primary"
                        block
                        onClick={nextHandler}
                        loading={isNextLoading}
                        disabled={isNextLoading || isAllPatientsChecked}
                    >
                        {currentPatientsData?.RECEIPTNO ? "Next Patient" : "START"}
                    </Button>
                </div>

            </div>


            {/* Add Patient Detail */}
            <div className="z-10 col-span-1 lg:col-span-2 2xl:col-span-1  themeBoxShadow rounded-[10px] bg-white h-full flex flex-col">

                {/* HEADER */}
                <div className="flex items-center justify-between border-b border-gray-200 p-4">
                    <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
                        Add Patient Detail
                    </h2>

                    {/* RIGHT SIDE BADGE */}
                    <div className="flex items-center gap-2 text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        OPD Entry
                    </div>
                </div>

                {/* BODY */}
                {/* <div className="flex flex-col gap-5 p-4 "> */}
                <div className="grid grid-cols-1  md:grid-cols-2  2xl:grid-cols-1  gap-5 p-4 ">

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

                {/* NEXT BUTTON */}
                <div className="p-4 border-t border-gray-200 inline 2xl:hidden">
                    <Button
                        type="primary"
                        block
                        onClick={nextHandler}
                        loading={isNextLoading}
                        disabled={isNextLoading || isAllPatientsChecked}
                    >
                        {currentPatientsData?.RECEIPTNO ? "Next Patient" : "START"}
                    </Button>
                </div>

            </div>

        </div >
    )
}

export default memo(MidSection)