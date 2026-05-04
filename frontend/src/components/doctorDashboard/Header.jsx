import { Avatar, Button, Card, Modal } from "antd";
import { memo, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/MMC logo.png";
import docotorAvatar from "../../assets/maleDoctor.png";
import { logoutUser } from "../../reduxToolKit/authSlice";
import { toggleRefreshPatients } from "../../reduxToolKit/doctorSlice";
import {
  FaSignOutAlt,
  FaTimesCircle,
  FaCalendarAlt,
  FaUserCheck,
  FaUserClock,
  FaUserTimes,
} from "react-icons/fa";
import { base_URL } from "../../utills/baseUrl";
import axios from "axios";

const Header = ({ doctorData, patientsData, onStartTour }) => {
  // console.log(patientsData, "patientsData >>>>>>>>>>>");
  // console.log(doctorData, "doctorData >>>>>>>>>>>");

  const [openProfile, setOpenProfile] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stats = [
    {
      id: 1,
      driverId : "stat-today-appointments",
      title: "Today Appointments",
      value: patientsData?.todayAppointments,
      icon: <FaCalendarAlt />,
    },
    {
      id: 2,
      driverId : "stat-patients-checked",
      title: "Patients Checked",
      value: patientsData?.patientsChecked,
      icon: <FaUserCheck />,
    },
    {
      id: 3,
      driverId : "stat-patients-waiting",
      title: "Patients Waiting",
      value: patientsData?.patientsRemaining,
      icon: <FaUserClock />,
    },
    {
      id: 4,
      driverId : "stat-patients-skipped",
      title: "Patients Skipped",
      value: patientsData?.patientsSkipped,
      icon: <FaUserTimes />,
    },
  ];

  const logoutHandler = async () => {

     try {
      setLogoutLoading(true);
      const res = await axios.post(`${base_URL}/api/auth/logout`, {
        doctorId: doctorData?.doctorId,
      });
      console.log(res, "res of logout Handler by id");


    } catch (err) {
      console.log(err, "error in next Handler");
      toast.error(err?.message);
    } finally {
      setLogoutLoading(false);
    }

    dispatch(logoutUser());
    toast.success("Logout Scuccessful");
    navigate("/login");
  };

  const cancelAllHandler = async () => {
    try {
      setCancelLoading(true);
      const res = await axios.post(
        `${base_URL}/api/opd/doctor/patient-cancel-all`,
        {
          doctorId: doctorData?.doctorId,
          receiptNo: null,
        },
      );
      // console.log(res, "res of cancel Handler by id");
      dispatch(toggleRefreshPatients());
      toast.success(`Cancel all remaining patients Successfully`);
    } catch (err) {
      console.log(err, "error in next Handler");
      toast.error(err?.message);
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div className="flex flex-col 2xl:flex-row 2xl:items-center 2xl:gap-25 w-full justify-between">

      <Modal open={openProfile} onCancel={() => setOpenProfile(false)} footer={null} centered width={400} >
        
        <div className="flex flex-col items-center text-center py-4">
          <h2 className="text-xl font-bold text-slate-800 ">
            {" "}
            {doctorData?.name || "Doctor Name"}{" "}
          </h2>

          <p className="text-slate-400 font-medium italic underline underline-offset-4 decoration-blue-200 text-sm">
            {" "}
            {doctorData?.faculty || "Consultant"}{" "}
          </p>

          <div className="w-full flex items-center justify-between bg-slate-50 rounded-2xl p-2 shadow-sm border border-slate-100 mb-6 mt-2">
            <span className="text-sm text-slate-500 font-medium">
              Patients Cancelled
            </span>

            <span className="px-4 py-1 rounded-full bg-red-100 text-red-600 font-semibold text-lg shadow-sm">
              {patientsData?.patientsCanceled || 0}
            </span>
          </div>

          {/* 👇 Help Tour Button — modal band karke tour start karega */}
          <Button
            block
            icon={<span>❓</span>}
            onClick={() => {
              setOpenProfile(false);     // pehle modal band karo
              setTimeout(() => {
                onStartTour();         // thodi delay ke baad tour shuru
              }, 300);
            }}
            className="rounded-xl flex items-center justify-center gap-2 mb-2 border-blue-400 text-blue-600 hover:bg-blue-50"
          >
            Take a Tour / Help Guide
          </Button>

          <Button
            type="primary"
            block
            loading={cancelLoading}
            icon={<FaTimesCircle />}
            onClick={cancelAllHandler}
            className="mt-4 rounded-xl flex items-center justify-center gap-2 bg-blue-500"
          >
            Cancel All
          </Button>

          <Button
            danger
            type="primary"
            block
            size="medium"
            icon={<FaSignOutAlt />}
            onClick={logoutHandler}
            className="rounded-xl flex items-center justify-center gap-2 mt-4"
          >
            Logout Securely
          </Button>

        </div>

      </Modal>

      <div className="flex 2xl:flex-col justify-between items-center 2xl:items-start gap-4 mb-8 2xl:w-fit ">

        <div className="backdrop-blur-md py-2 px-2 sm:px-4 rounded-full border flex gap-4 justify-center items-center border-blue-600 bg-white z-10">
          <img
            src={logo}
            alt="logo"
            className="h-12 min-[2000px]:h-16 [@media(min-width:3000px)]:h-18  [@media(min-width:4400px)]:h-30 w-12 min-[2000px]:w-16 [@media(min-width:3000px)]:w-18 [@media(min-width:4400px)]:w-30 object-contain"
          />

          <h1 className="text-xl  lg:text-2xl    font-bold hidden sm:block  tracking-wide drop-shadow">
            Memon Medical Complex
          </h1>
        </div>

        <div
          id="doctor-name-btn"
          onClick={() => setOpenProfile(true)}
          className=" flex items-center gap-3 px-3 py-1.5  rounded-full  shadow-lg  cursor-pointer  transition-all duration-100 hover:shadow-xl  border border-blue-600 bg-white z-10"
        >

          {/* Avatar */}
          <div className="relative">
            <div className="w-9 h-9 rounded-full border border-gray-400 p-1 flex items-center justify-center bg-white">
              <img
                className="w-full h-full object-cover rounded-full"
                src={docotorAvatar}
                alt="Doctor Avatar"
              />
            </div>
            <span className="z-10 absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-white"></span>
          </div>

          {/* Info */}
          <div className="flex flex-col leading-tight">
            <span className="text-md font-bold text-slate-800">
              {doctorData?.name || "Doctor Name"}
            </span>
          </div>

        </div>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4  gap-6 mb-8">

        {stats?.map((s) => (
          <div
            id={s?.driverId}
            key={s?.id}
            className={`relative p-[2px] rounded-2xl  bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 `}
          >
            <div  className="rounded-2xl bg-white backdrop-blur-xl p-5 h-full  transition-all duration-300  group-hover:scale-[1.03] group-hover:shadow-2xl">
              <div className="flex items-center gap-5">
                {/* Icon Bubble */}
                <div className=" w-12 h-12 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100  text-blue-700 text-xl shadow-inner">
                  {s?.icon || "👨‍⚕️"}
                </div>

                {/* Text */}
                <div className="flex flex-col">
                  <p className="text-gray-500 font-medium text-lg text-start">
                    {s?.title || "Not yet"}
                  </p>

                  <p className="text-3xl font-extrabold text-slate-800 leading-tight">
                    {s?.value || 0}
                  </p>
                </div>
              </div>

              {/* Glow on hover */}
              <div className=" absolute inset-0 rounded-2xl opacity-0  group-hover:opacity-100 transition bg-gradient-to-r from-blue-400/10 to-purple-400/10 pointer-events-none" />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default memo(Header);
