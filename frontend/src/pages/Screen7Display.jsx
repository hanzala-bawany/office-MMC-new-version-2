import { useState, useEffect } from 'react';
import logo from "../assets/MMC logo.png"; // ← Apna logo path yahan set kar lo
import NubitLogo from "../assets/nubit logo png.png"; // ← Apna Nubit logo
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';



const PatientCard = ({ doc }) => {


  // const currentPatient = doc.find(p => p.current === 1);

  const patient = doc;

  return (

    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-cyan-100 shadow-lg  transition-shadow p-2 flex flex-col h-full">
      <div
        key={patient.id}
        className={`p-6 rounded-xl border-2 transition-all duration-300 flex justify-between flex-1
        ${patient.current === 1
            ? "bg-gradient-to-r from-yellow-100 to-yellow-50 border-yellow-400 shadow-md"
            : "bg-gradient-to-r from-cyan-100 to-cyan-50 border-cyan-200"
          }`}
      >
        <div className="flex flex-col justify-between  space-y-2 text-gray-700">
          <p className="text-lg xl:text-xl">
            <span className="font-semibold">Name:</span> {patient.name}
          </p>
          <p className="text-lg xl:text-xl">
            <span className="font-semibold">Age:</span> {patient.age} years
          </p>
          <p className="text-lg xl:text-xl">
            <span className="font-semibold">Doctor:</span> {patient.doctorName}
          </p>
        </div>

        <div className="flex flex-col justify-between items-center">
          <span className={`text-4xl font-bold ${patient.current === 1 ? "text-yellow-600" : "text-cyan-600"}`}>
            {patient.token}
          </span>

          {patient.current === 1 && (
            <span className="mt-4 inline-block px-6 py-2 bg-yellow-500 text-white font-bold rounded-full text-lg shadow-lg animate-pulse">
              NOW SERVING
            </span>
          )}
        </div>

      </div>
    </div>
  );
};





const Screen7Display = () => {


  const navigate = useNavigate()
  const dispatch = useDispatch()

  const vipDoctors = [
    { id: 1, token: "VIP-01", name: "Mr. Rahman Ali", current: 1, age: 52, doctorName: "Dr. Ahmed Khan" },
    { id: 4, token: "VIP-04", name: "Mrs. Ayesha Siddiqui", current: 1, age: 39, doctorName: "Dr. Sana Iqbal" },
    { id: 7, token: "VIP-07", name: "Mr. Bilal Ahmed", current: 1, age: 58, doctorName: "Dr. Usman Raza" },
    { id: 2, token: "VIP-02", name: "Mrs. Fatima Zahra", current: 0, age: 48, doctorName: "Dr. Ahmed Khan" },
    { id: 3, token: "VIP-03", name: "Mr. Khalid Mehmood", current: 0, age: 61, doctorName: "Dr. Ahmed Khan" },
    { id: 5, token: "VIP-05", name: "Mr. Imran Hassan", current: 0, age: 45, doctorName: "Dr. Sana Iqbal" },
    { id: 6, token: "VIP-06", name: "Mrs. Zainab Akbar", current: 0, age: 37, doctorName: "Dr. Sana Iqbal" },
    { id: 8, token: "VIP-08", name: "Mrs. Nadia Khan", current: 0, age: 44, doctorName: "Dr. Usman Raza" },
    { id: 9, token: "VIP-09", name: "Mr. Tariq Jamil", current: 0, age: 67, doctorName: "Dr. Usman Raza" },
  ];

  const logoutHandler = () => {
    dispatch(logoutUser())
    toast.success("Logout Scuccessful")
    navigate("/login")
  }

  const [currentImageIndex, setCurrentImageIndex] = useState(0);



  return (

    <div className="h-[100vh] w-full flex flex-col bg-gradient-to-br from-[#e0f7fa] to-[#fff]">

      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='%2300aaff'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* <div className="absolute inset-0 flex justify-center items-center">
        <img
          src={logo} // <-- yahan apna bg image path set karo
          alt="Hospital Background"
          className="w-[50%] h-[50%] object-cover opacity-20" // opacity kam rakha
        />
      </div> */}

      <div className="flex absolute top-4 [@media(min-width:4200px)]:top-8 left-4 [@media(min-width:4200px)]:left-8 items-center gap-4 [@media(min-width:3200px)]:gap-8 [@media(min-width:4400px)]:gap-12">
        <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-[#00b0ff]/30">
          <img src={logo} alt="logo" className="h-12 min-[2000px]:h-16 [@media(min-width:3000px)]:h-18  [@media(min-width:4400px)]:h-30 w-12 min-[2000px]:w-16 [@media(min-width:3000px)]:w-18 [@media(min-width:4400px)]:w-30 object-contain" />
        </div>
        <div>
          <h1 className="text-cyan-600 text-3xl font-bold min-[2000px]:text-5xl [@media(min-width:3200px)]:text-6xl  [@media(min-width:4400px)]:text-7xl  tracking-wide drop-shadow">
            Memon Medical Complex
          </h1>
          <p className="text-[#a7c8e8] text-sm italic min-[2000px]:text-2xl [@media(min-width:3000px)]:text-3xl [@media(min-width:4400px)]:text-5xl ">
            “Serving with Excellence & Care”
          </p>
        </div>
      </div>

      <div className="flex justify-center flex-2 pt-10 text-5xl  text-cyan-800 font-[700]">

        <h1>Current Patient Queue Display</h1>

      </div>

      <div className="flex-13 grid grid-cols-3 gap-8 p-6 pt-0">
        {
          vipDoctors.map((doc) => <PatientCard key={doc.id} doc={doc} />)
        }
      </div>

      <div onClick={logoutHandler} className=" text-cyan-600 flex-1 flex justify-center items-center gap-2 cursor-pointer z-50 [@media(min-width:4200px)]:right-10 bottom-5 [@media(min-width:4200px)]:bottom-8 [@media(min-width:1520px)]:text-2xl [@media(min-width:2200px)]:text-3xl [@media(min-width:3200px)]:text-4xl  [@media(min-width:4200px)]:text-6xl">
        Powered by <img className="w-[50px] [@media(min-width:2200px)]:w-[70px] [@media(min-width:3200px)]:w-[80px]" src={NubitLogo} alt="" />
      </div>

    </div>
  );
};

export default Screen7Display;






















