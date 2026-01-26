import { Card, Select, Input, Button, Table, Avatar, Tag, Modal } from "antd";
import MyCircleChart from "../components/Dashboard/MyCircleChart";
import logo from "../assets/MMC logo.png";
import { useEffect, useState } from "react";
import { base_URL } from "../../src/utills/baseUrl.js";
import axios from "axios";


const { Option } = Select;

const DoctorDashboard = () => {

  const [openReport, setOpenReport] = useState(false);

  const stats = [
    { title: "Today Appointments", value: "200" , half : true },
    { title: "Patients Checked", value: "60" },
    { title: "Patients Remaining", value: "140", full: true },
  ];


  const pieData = [
    { name: "Patients Remaining", uv: 140, fill: "#60A5FA" },   // blue-400
    { name: "Patients Checked", uv: 60, fill: "#A855F7" }, // purple-500
    // { name: "Today Appointments", uv: 200, fill: "#EC4899" }, // pink-500
  ];


  const historyColumns = [
    { title: "Date", dataIndex: "date" },
    { title: "Patient", dataIndex: "name" },
    { title: "Disease", dataIndex: "disease" },
    { title: "Discription", dataIndex: "comment",},
    {
      title: "Report",
      render: (text, row) => (
        <Button
          type="primary"
          size="small"
          onClick={() => setOpenReport(true)}
        >
          View Reports
        </Button>
      ),
    },
  ];


  const historyData = [
    {
      key: 1,
      date: "15 Jan 2026",
      name: "Ahmed",
      disease: "Flu",
      comment: "High fever and sore throat",
    },
    {
      key: 2,
      date: "16 Jan 2026",
      name: "Ahmed",
      disease: "Flu",
      comment: "Mild flu, prescribed rest",
    },
  ];


  const card = "rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 themeBoxShadow";


  useEffect(() => {

    const foo = async () => {
      try {
        const res = await axios.get(`${base_URL}/api/opd/doctor-patients/341`);
        // console.log(res, "res of get DocotrDetail by id");
        // setData(res.data.data);
      }
      catch (err) {
        // console.log(err, "error in get faculty");
        //  toast.error(err?.message)
      }
    }
    foo()

  }, [])



  return (



    <div className="flex flex-col min-h-screen xl:h-screen  bg-gradient-to-br from-[#e3f1ff] via-[#e3efff] to-[#FFFFFF] p-4 md:p-8 relative ">

      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='%2300aaff'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />


      <Modal
        open={openReport}
        onCancel={() => setOpenReport(false)}
        footer={null}
        centered
        width={600}
      >
        <Card className="rounded-xl shadow-lg">

          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Patient Reports
            </h2>

            <div className="flex gap-4 text-xl">
              <span className="cursor-pointer text-blue-500">📄</span>
              <span className="cursor-pointer text-green-500">🧪</span>
              <span className="cursor-pointer text-purple-500">📊</span>
            </div>
          </div>

          <div className="space-y-3 text-gray-600">
            <p>🩺 Diagnosis Report</p>
            <p>🧾 Prescription</p>
            <p>🧪 Lab Results</p>
          </div>

          <Button
            className="mt-6"
            type="primary"
            block
            onClick={() => setOpenReport(false)}
          >
            Close
          </Button>

        </Card>
      </Modal>


      {/* Header */}
      <div className="flex flex-col 2xl:flex-row w-full justify-between">

        <div className="flex 2xl:flex-col justify-between items-center 2xl:items-start gap-4 mb-8 2xl:w-fit ">

          <div className="backdrop-blur-md py-2 px-2 sm:px-4 rounded-full border flex gap-4 justify-center items-center border-[#00b0ff] bg-white z-10">
            <img src={logo} alt="logo" className="h-12 min-[2000px]:h-16 [@media(min-width:3000px)]:h-18  [@media(min-width:4400px)]:h-30 w-12 min-[2000px]:w-16 [@media(min-width:3000px)]:w-18 [@media(min-width:4400px)]:w-30 object-contain" />

            <h1 className="text-xl  lg:text-2xl   text-[#00b0ff] font-bold hidden sm:block  tracking-wide drop-shadow">
              Memon Medical Complex
            </h1>
          </div>

          <div className="flex items-center gap-3 bg-white border border-[#00b0ff]  px-4 py-2 rounded-full z-10">
            <span className="font-semibold text-[#00b0ff]">Dr. Hanzala Bawany</span>
          </div>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6 mb-8">
          {stats?.map((s, i) => (
            <div key={s?.value}     className={`p-1 z-10 rounded-[10px] bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 ${s.full ? "sm:col-span-2 lg:col-span-1" : ""} `}>
              <Card key={i} className={card}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-blue-600 text-blue-600 font-bold">
                    👤
                  </div>
                  <div>
                    <p className="text-gray-500 text-lg">{s.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                  </div>
                </div>
              </Card>
            </div>
          ))}
        </div>

      </div>



      {/* Middle Section */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8 h-auto ">

        {/* Pie Chart */}
        <div className="themeBoxShadow border-none outline-none rounded-[10px] z-10 bg-white flex flex-col justify-between h-[35vh] sm:h-[40vh] lg:h-auto">

          <div className="flex-1 p-2 px-4 sm:p-4 flex justify-between gap-4 sm:gap-8 items-center border-b border-gray-300 text-[18px] text-gray-500 font-medium">

            <span> Patient Progress </span>
            <div className="flex flex-col sm:flex-row  justify-center gap-1 sm:gap-6 text-sm ">
              <span className="text-[#60A5FA] ">● Patients Remaining </span>
              <span className="text-[#A855F7] ">● Patients Checked</span>
            </div>

          </div>

          <div className="flex-7 p-6">
            <MyCircleChart piData={pieData} active="dd" />
          </div>


        </div>

        {/* Current Patient */}
        <div className="z-10 themeBoxShadow rounded-[10px] bg-white h-full flex flex-col justify-between ">

          <div className="flex-1 p-4  flex items-center justify-between border-b border-gray-200 text-[18px] text-gray-500 font-semibold">
            Patient Data
            <Tag style={{ padding: "0px 8px" }} color="blue">A - 20</Tag>
          </div>

          <div className="p-6 flex flex-col gap-3 flex-6 text-gray-700">
            <p>
              <b>Name:</b> Ali Raza
            </p>
            <p>
              <b>Age:</b> 32
            </p>
            <p>
              <b>Gender:</b> Male
            </p>

          </div>

          {/* NEXT BUTTON */}
          <div className="p-4 border-t  border-gray-200 flex-1">
            <Button
              type="primary"
              block
            // size="large"
            // onClick={handleNextPatient}
            // disabled={currentIndex === patientsQueue.length - 1}
            >
              Next Patient
            </Button>
          </div>

        </div>


        {/* Add Patient Detail */}
        <div className="z-10 themeBoxShadow border-none outline-none rounded-[10px] bg-white h-full flex flex-col justify-between">

          <div className="flex-1 flex items-center border-b border-gray-300 text-[18px] text-gray-500 p-4 font-medium">
            Add Patient Detail
          </div>

          <div className="flex-6 flex flex-col gap-4 p-4 ">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              style={{ width: "100%" }}
              placeholder="Search to Select Disease"
              filterSort={(optionA, optionB) =>
                optionA.label.toLowerCase().localeCompare(optionB.label.toLowerCase())
              }
              options={[
                { value: 'diabetes', label: 'Diabetes' },
                { value: 'blood pressure', label: 'Blood Pressure' },
                { value: 'heart disease', label: 'Heart Disease' },
                { value: 'asthma', label: 'Asthma' },
                { value: 'flu', label: 'Flu' },
                { value: 'migraine', label: 'Migraine' },
              ]}

            />


            <Select placeholder="Status">
              <Option value="checked">Checked</Option>
              <Option value="pending">Pending</Option>
              <Option value="skip">Skip</Option>
              <Option value="inprocess">Inprocess</Option>
            </Select>

            <Input.TextArea rows={3} placeholder="Comments..." />

          </div>

          <div className="flex-1 p-4 border-t border-gray-200 ">

            <Button type="primary" block>
              Save
            </Button>
          </div>

        </div>

      </div>

      {/* History */}
      <Card title="Current Patients History" className={`${card} flex-1 overflow-y-scroll`}>
        <Table
          columns={historyColumns}
          dataSource={historyData}
          pagination={false}
          scroll={{ x: true }}
        />
      </Card>

    </div>
  );
};

export default DoctorDashboard;













