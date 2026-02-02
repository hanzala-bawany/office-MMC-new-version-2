import { useEffect, useState } from "react";
import { base_URL } from "../../src/utills/baseUrl.js";
import axios from "axios";
import Header from "../components/doctorDashboard/Header.jsx";
import MidSection from "../components/doctorDashboard/MidSection.jsx";
import HistoryTable from "../components/doctorDashboard/HistoryTable.jsx";




const DoctorDashboard = () => {


  const [patientsData, setPatientsData] = useState([]);
  const [isNextBtnClick, setIsNextBtnClick] = useState(false);
  const loginUserData = JSON.parse(localStorage.getItem("loginUserData"));
  // console.log(loginUserData, "<<<<<<< loginUserData");
  console.log(isNextBtnClick, "<<<<<<< isNextBtnClick");


  useEffect(() => {

    const foo = async () => {
      try {
        const res = await axios.get(`${base_URL}/api/opd/doctor-patients/${loginUserData?.doctorId}`,);
        console.log(res, "res of get DocotrDetail by id");
        setPatientsData(res.data.data);
      }
      catch (err) {
        // console.log(err, "error in get faculty");
        toast.error(err?.message)
      }
    }
    foo()

  }, [isNextBtnClick])


  return (

    <div className="flex flex-col min-h-screen  bg-gradient-to-br from-[#e3f1ff] via-[#e3efff] to-[#FFFFFF] p-4 md:p-8 relative ">


      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='%2300aaff'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="fixed top-0 left-0 w-full h-27 bg-gradient-to-r from-[#0052cc] to-[#00b0ff] z-0 rounded-b-[40px]" />


      {/* Header */}
      <Header doctorData={loginUserData} patientsData={patientsData} />

      {/* Middle Section */}
      <MidSection patientsData={patientsData} setIsNextBtnClick={setIsNextBtnClick} />

      {/* History */}
      <HistoryTable />

    </div>
  );
};

export default DoctorDashboard;













