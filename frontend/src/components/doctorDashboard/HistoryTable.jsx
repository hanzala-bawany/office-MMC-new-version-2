import {
  FaFileMedical,
  FaNotesMedical,
  FaFlask,
  FaXRay,
  FaFolderOpen,
  FaMicroscope,
  FaHistory,
  FaHeartbeat,
  FaPills,
  FaSyringe,
  FaClock,
  FaUserMd,
} from "react-icons/fa";
import { Card, Button, Table, Modal, Tag } from "antd";
import { useState } from "react";



const HistoryTable = () => {

  const [openReport, setOpenReport] = useState(false);
  const [openVitals, setOpenVitals] = useState(false);
  const [openTreatment, setOpenTreatment] = useState(false);
  const card = "rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 themeBoxShadow";

  
  const historyColumns = [
    { title: "Date", dataIndex: "date" },
    { title: "Patient", dataIndex: "name" },
    { title: "Primery Diagnosis", dataIndex: "disease", render: (d) => <Tag color="cyan">{d}</Tag> },
    { title: "Primery Complain", dataIndex: "comment", },
    {
      title: "Treatment",
      render: () => (
        <Button
          icon={<FaPills />}
          className="flex items-center gap-2 border-blue-500 text-blue-500 "
          onClick={() => setOpenTreatment(true)}
        >
          View
        </Button>
      ),
    },
    {
      title: "Vitals",
      render: () => (
        <Button
          icon={<FaHeartbeat />}
          className="flex items-center gap-2 border-blue-500 text-blue-500 "
          onClick={() => setOpenVitals(true)}
        >
          View
        </Button>
      ),
    },
    {
      title: "Report",
      render: () => (
        <Button
          icon={<FaMicroscope />}
          className="flex items-center gap-2 border-blue-500 text-blue-500 "
          onClick={() => setOpenReport(true)}
        >
          View
        </Button>
      ),
    },
  ];


  const historyData = [
    {
      key: 1,
      date: "15 Jan 2026",
      name: "Ahmed",
      disease: "Asthama",
      comment: "High fever and sore throat",
    },
    {
      key: 2,
      date: "16 Jan 2026",
      name: "Ahmed",
      disease: "Blood presure",
      comment: "Mild flu, prescribed rest",
    },
  ];



  return (
    <>

      {/* report modal */}
      <Modal
        open={openReport}
        onCancel={() => setOpenReport(false)}
        footer={null}
        centered
        width={600}
      >

        <div className="flex justify-between items-center mb-4  mr-6">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <FaMicroscope className="text-blue-500" /> Patient Reports
          </h2>

          <div className="flex gap-4 text-md ">
            <span className="cursor-pointer text-blue-500">📄</span>
            <span className="cursor-pointer text-green-500">🧪</span>
            <span className="cursor-pointer text-purple-500">📊</span>
          </div>
        </div>

        <Card className="rounded-xl shadow-lg">

          <div className="space-y-3 space-x-3  grid  grid-cols-1 sm:grid-cols-2   text-gray-600 ">
            <p className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition" >
              <FaFileMedical className="text-blue-500" />
              Previous Discharge Summary
            </p>

            <p className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition">
              <FaNotesMedical className="text-green-500" />
              Previous OPD Records
            </p>

            <p className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition">
              <FaFlask className="text-purple-500" />
              Lab Reports
            </p>

            <p className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition">
              <FaXRay className="text-orange-500" />
              Radiology Reports
            </p>

            <p className="flex items-center gap-2 hover:text-blue-600 cursor-pointer transition">
              <FaFolderOpen className="text-gray-500" />
              Others
            </p>
          </div>

        </Card>
      </Modal>

      {/* vitals modal */}
      <Modal
        open={openVitals}
        onCancel={() => setOpenVitals(false)}
        footer={null}
        centered
        width={600}
      >

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
            <FaHeartbeat className="text-red-500" />
            Patient Vitals
          </h2>

          <span className="text-sm text-gray-600 font-medium mr-6">
            Recorded before OPD
          </span>
        </div>

        {/* Body */}
        <div className="mt-3 grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm p-4 rounded-2xl themeBoxShadow">

          {/* Blood Pressure */}
          <div className="flex flex-col p-3 rounded-lg border bg-pink-50 border-pink-500">
            <span className="text-black font-semibold flex items-center gap-1">
              Blood Pressure
            </span>
            <span className="font-bold text-pink-700">
              120 / 80
            </span>
          </div>

          {/* Blood Sugar */}
          <div className="flex flex-col p-3 rounded-lg border bg-green-50 border-green-500">
            <span className="text-black font-semibold flex items-center gap-1">
              Blood Sugar
            </span>
            <span className="font-bold text-green-700">
              110 mg/dL
            </span>
          </div>

          {/* Weight */}
          <div className="flex flex-col p-3 rounded-lg border bg-blue-50 border-blue-600">
            <span className="text-black font-semibold flex items-center gap-1">
              Weight
            </span>
            <span className="font-bold text-blue-700">
              72 kg
            </span>
          </div>

          {/* Height */}
          <div className="flex flex-col p-3 rounded-lg border bg-gray-100 border-gray-600">
            <span className="text-black font-semibold flex items-center gap-1">
              Height
            </span>
            <span className="font-bold text-gray-700">
              5.8 ft
            </span>
          </div>

          {/* Temperature */}
          <div className="flex flex-col p-3 rounded-lg border bg-purple-50 border-purple-600">
            <span className="text-black font-semibold flex items-center gap-1">
              Temperature
            </span>
            <span className="font-bold text-purple-700">
              98.6 °F
            </span>
          </div>

          {/* Pulse */}
          <div className="flex flex-col p-3 rounded-lg border bg-yellow-50 border-yellow-600">
            <span className="text-black font-semibold flex items-center gap-1">
              Pulse
            </span>
            <span className="font-bold text-yellow-700">
              76 bpm
            </span>
          </div>

        </div>


      </Modal>

      {/* vitals modal */}
      <Modal
        open={openTreatment}
        onCancel={() => setOpenTreatment(false)}
        footer={null}
        centered
        width={600}
      >

        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
            <FaPills className="text-green-600" />
            Prescribed Medication
          </h2>

          <span className="text-sm text-gray-600 font-medium mr-6 hidden sm:flex items-center gap-1 ">
            <FaUserMd />
            OPD Doctor
          </span>
        </div>


        {/* Body */}
        <div className="mt-3 gap-4 p-4 rounded-2xl themeBoxShadow">

          {/* Medicine Card */}
          <div className="flex flex-col gap-2 p-4 rounded-xl border bg-green-50 border-green-400">
            <div className="flex items-center gap-2 font-semibold text-green-800">
              <FaPills />
              Panadol 500mg
            </div>

            <div className="text-sm text-gray-700 flex items-center gap-2">
              {/* <FaClock className="text-gray-500" /> */}
              Take rest for 3 days
            </div>
          </div>

        </div>



      </Modal>


      <Card
        title={
          <div className="flex justify-between items-center w-full">

            <div className="flex items-center  text-md sm:text-lg gap-2 font-bold text-slate-700">
              <FaHistory className="text-blue-500" />
              Patient <span className="hidden sm:inline"> Visit </span> History
            </div>


            <div className="hidden md:flex items-center gap-3 bg-blue-50 px-3 py-1 rounded-full shadow-sm">
              <FaHeartbeat className="text-red-500 text-lg" />
              <span className="text-red-600 font-semibold text-xs sm:text-sm">
                Chronic Patient
              </span>
            </div>


            <div className="flex items-center gap-4 text-xs sm:text-sm">

              <div className="flex flex-col sm:flex-row sm:gap-2  text-center">
                <span className="text-black">Last Visit</span>
                <span className="font-semibold text-blue-600">
                  16 Jan 2026
                </span>
              </div>

              <div className="h-8 w-[1px] bg-gray-200" />

              <div className="flex flex-col sm:flex-row sm:gap-2  text-center">
                <span className="text-black">Total Visits</span>
                <span className="font-semibold text-blue-600">
                  12
                </span>
              </div>

            </div>


          </div>
        }
        className={`${card} flex-1`}
        styles={{
          header: {
            borderBottom: "2px solid #E5E7EB",
            padding: "15px 16px",
            background: "#F9FAFB",
          },
          body: {
            padding: "15px",
          },
        }}
      >
        <Table
          columns={historyColumns}
          dataSource={historyData}
          pagination={false}
          scroll={{ x: true }}
        />
      </Card>

    </>
  )
}

export default HistoryTable