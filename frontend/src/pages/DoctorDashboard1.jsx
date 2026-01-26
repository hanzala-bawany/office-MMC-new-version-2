// import { Card, Select, Input, Button, Table, Avatar } from "antd";
// import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// const { Option } = Select;

// const DoctorDashboard1 = () => {

//   const stats = [
//     { title: "Total Patients", value: "200+" },
//     { title: "Today Patients", value: "068" },
//     { title: "Today Appointments", value: "085" },
//   ];

//   const pieData = [
//     { name: "New Patients", value: 60 },
//     { name: "Old Patients", value: 40 },
//   ];

//   const COLORS = ["#2563EB", "#FACC15"];

//   const historyColumns = [
//     { title: "Date", dataIndex: "date" },
//     { title: "Patient", dataIndex: "name" },
//     { title: "Status", dataIndex: "status" },
//   ];

//   const historyData = [
//     { key: 1, date: "15 Jan 2026", name: "Ahmed", status: "Checked" },
//     { key: 2, date: "16 Jan 2026", name: "Bilal", status: "Checked" },
//   ];

//   // Custom animated border style
//   const card =
//     "relative rounded-2xl shadow-md overflow-hidden transition-all duration-300 bg-white";

//   return (

    
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500 p-4 md:p-8 text-white">
//       {/* Header */}

//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
//         <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-yellow-300 to-white bg-clip-text text-transparent">
//           Doctor Dashboard
//         </h1>

//         <div className="flex items-center gap-3 bg-blue-800 px-4 py-2 rounded-full shadow-lg">
//           <Avatar className="bg-yellow-400 font-bold">DR</Avatar>
//           <span className="font-semibold text-white">Dr. Hanzala</span>
//         </div>
//       </div>

//       {/* Stats */}

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//         {stats.map((s, i) => (
//           <div key={i} className="group relative  p-1.5 overflow-hidden">
//             {/* Animated border */}
//             <div className="absolute inset-0 W-[120%] rounded-2xl p-[2px] bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 "></div>

//             <Card className={`${card} relative`}>
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-blue-600 text-blue-600 font-bold bg-blue-100">
//                   👤
//                 </div>
//                 <div>
//                   <p className="text-gray-500 text-sm">{s.title}</p>
//                   <p className="text-2xl font-bold text-gray-800">{s.value}</p>
//                 </div>
//               </div>
//             </Card>
//           </div>
//         ))}
//       </div>

//       {/* Middle Section */}

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">


//         {/* Pie Chart */}
//         <div className="group relative">
//           <Card title="Patients Summary" className={card}>
//             <div className="h-64">
//               <ResponsiveContainer width="100%" height="100%" >
//                 <PieChart>
//                   <Pie
//                     data={pieData}
//                     dataKey="value"
//                     innerRadius={60}
//                     outerRadius={90}
//                     paddingAngle={4}
//                   >
//                     {pieData?.map((_, index) => (
//                       <Cell key={index} fill={COLORS[index]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </div>

//             <div className="flex justify-center gap-6 mt-4 text-sm">
//               <span className="text-blue-300">● New Patients</span>
//               <span className="text-yellow-300">● Old Patients</span>
//             </div>
//           </Card>
//         </div>

//         {/* Current Patient */}
//         <div className="group relative">
//           <Card title="Next Patient Details" className={card}>
//             <p>
//               <b>Name:</b> Ali Raza
//             </p>
//             <p>
//               <b>Age:</b> 32
//             </p>
//             <p>
//               <b>Gender:</b> Male
//             </p>
//             <p>
//               <b>Problem:</b> Fever & Cough
//             </p>
//           </Card>
//         </div>

//         {/* Doctor Notes */}
//         <div className="group relative">
//           <Card title="Doctor Notes" className={card}>
//             <div className="flex flex-col gap-4">
//               <Select placeholder="Diagnosis">
//                 <Option value="flu">Flu</Option>
//                 <Option value="cold">Cold</Option>
//                 <Option value="infection">Infection</Option>
//               </Select>

//               <Select placeholder="Status">
//                 <Option value="checked">Checked</Option>
//                 <Option value="pending">Pending</Option>
//               </Select>

//               <Input.TextArea rows={3} placeholder="Comments..." />

//               <Button
//                 type="primary"
//                 block
//                 className="bg-blue-600 hover:bg-blue-700"
//               >
//                 Save
//               </Button>
//             </div>
//           </Card>
//         </div>


//       </div>

//       {/* History */}

//       <div className="group relative">
//         <Card title="Recent Patients" className={card}>
//           <Table
//             columns={historyColumns}
//             dataSource={historyData}
//             pagination={false}
//             scroll={{ x: true }}
//           />
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default DoctorDashboard1;











import {
  Card,
  Avatar,
  Table,
  Tag,
  Select,
  Input,
  Button,
} from "antd";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const { Option } = Select;

const pieData = [
  { name: "Cancer", value: 48 },
  { name: "Dental", value: 17 },
  { name: "Eye", value: 16 },
  { name: "Surgery", value: 19 },
];

const COLORS = ["#2563EB", "#0EA5E9", "#22C55E", "#A855F7"];

const salesData = [
  { name: "Jan", sales: 40, profit: 24 },
  { name: "Feb", sales: 30, profit: 13 },
  { name: "Mar", sales: 20, profit: 18 },
  { name: "Apr", sales: 27, profit: 20 },
  { name: "May", sales: 45, profit: 30 },
];

const historyColumns = [
  { title: "Date", dataIndex: "date" },
  { title: "Patient", dataIndex: "name" },
  {
    title: "Status",
    dataIndex: "status",
    render: (status) => (
      <Tag color={status === "Checked" ? "green" : "orange"}>
        {status}
      </Tag>
    ),
  },
];

const historyData = [
  { key: 1, date: "15 Jan 2026", name: "Ahmed", status: "Checked" },
  { key: 2, date: "16 Jan 2026", name: "Bilal", status: "Pending" },
];

const stats = [
  { title: "Available Stock", value: "$89,278" },
  { title: "Total Sales", value: "$89,278" },
  { title: "Total Profit", value: "$89,278" },
  { title: "Low Stock Items", value: "17" },
];

const DoctorDashboard1 = () => {




  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-slate-900">
            Hospital Dashboard
          </h1>

          <div className="flex items-center gap-3">
            <Avatar size={40} />
            <span className="font-medium text-slate-700">
              Dr. Hanzala
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <Card
              key={i}
              className="rounded-xl shadow-sm border border-slate-100"
            >
              <p className="text-sm text-slate-500">{s.title}</p>
              <h2 className="text-2xl font-semibold text-slate-900 mt-2">
                {s.value}
              </h2>
            </Card>
          ))}
        </div>

        {/* Middle Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Category Summary */}
          <Card className="rounded-xl shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">
              Available Stock by Category
            </h3>

            {pieData.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-center mb-3"
              >
                <span className="text-sm text-slate-600">
                  {item.name}
                </span>
                <span className="font-medium">
                  ${item.value * 100}
                </span>
              </div>
            ))}
          </Card>

          {/* Pie Chart */}
          <Card className="rounded-xl shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">
              Profit by Category
            </h3>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    innerRadius={60}
                    paddingAngle={3}
                  >
                    {pieData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Stock Limit */}
          <Card className="rounded-xl shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-4">
              Stock Limit
            </h3>

            {[
              { name: "Cancer", value: 80 },
              { name: "Dental", value: 45 },
              { name: "Eye", value: 30 },
              { name: "Surgery", value: 65 },
            ].map((item, i) => (
              <div key={i} className="mb-4">
                <p className="text-sm text-slate-600 mb-1">
                  {item.name}
                </p>
                <div className="h-2 bg-slate-100 rounded">
                  <div
                    className="h-2 bg-blue-600 rounded"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Bottom Charts */}
        <Card className="rounded-xl shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">
            Items Sales vs Profit
          </h3>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#2563EB" />
                <Bar dataKey="profit" fill="#22C55E" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Recent Patients */}
        <Card className="rounded-xl shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">
            Recent Patients
          </h3>

          <Table
            columns={historyColumns}
            dataSource={historyData}
            pagination={false}
          />
        </Card>

        {/* Doctor Notes */}
        <Card className="rounded-xl shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">
            Doctor Notes
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select placeholder="Diagnosis" size="large">
              <Option value="flu">Flu</Option>
              <Option value="cold">Cold</Option>
              <Option value="infection">Infection</Option>
            </Select>

            <Select placeholder="Status" size="large">
              <Option value="checked">Checked</Option>
              <Option value="pending">Pending</Option>
            </Select>

            <Input.TextArea
              rows={4}
              placeholder="Clinical Notes..."
              className="md:col-span-2"
            />

            <Button
              type="primary"
              size="large"
              className="md:col-span-2"
            >
              Save Record
            </Button>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default DoctorDashboard1;