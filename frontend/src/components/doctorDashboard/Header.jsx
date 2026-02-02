import { Avatar, Button, Card, Modal } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/MMC logo.png";
import docotorAvatar from "../../assets/maleDoctor.png";
import { logoutUser } from "../../reduxToolKit/authSlice";
import { FaSignOutAlt } from "react-icons/fa";

const Header = ({ doctorData, patientsData }) => {

    const [openProfile, setOpenProfile] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const stats = [
        { title: "Today Appointments", value: patientsData?.todayAppointments, id: 1, half: true },
        { title: "Patients Checked", value: patientsData?.patientsChecked, id: 2 },
        { title: "Patients Remaining", value: patientsData?.patientsRemaining, id: 3, full: true },
    ];
    const card = "rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 themeBoxShadow";


    const logoutHandler = () => {
        dispatch(logoutUser())
        toast.success("Logout Scuccessful")
        navigate("/login")
    }


    return (
        <div className="flex flex-col 2xl:flex-row 2xl:items-center w-full justify-between">


            <Modal open={openProfile} onCancel={() => setOpenProfile(false)} footer={null} centered width={400} >
                <div className="flex flex-col items-center text-center py-4">
                    <h2 className="text-xl font-bold text-slate-800">   {doctorData?.name} </h2>
                    <p className="text-slate-400 mb-8 font-medium italic underline underline-offset-4 decoration-blue-200 text-sm">   {doctorData?.consultant || "Consultant"} </p>
                    <Button
                        danger
                        type="primary"
                        block
                        size="large"
                        icon={<FaSignOutAlt />}
                        onClick={logoutHandler}
                        className="rounded-xl flex items-center justify-center gap-2"
                    >
                        Logout Securely
                    </Button>
                </div>
            </Modal>

            <div className="flex 2xl:flex-col justify-between items-center 2xl:items-start gap-4 mb-8 2xl:w-fit ">

                <div className="backdrop-blur-md py-2 px-2 sm:px-4 rounded-full border flex gap-4 justify-center items-center border-blue-600 bg-white z-10">
                    <img src={logo} alt="logo" className="h-12 min-[2000px]:h-16 [@media(min-width:3000px)]:h-18  [@media(min-width:4400px)]:h-30 w-12 min-[2000px]:w-16 [@media(min-width:3000px)]:w-18 [@media(min-width:4400px)]:w-30 object-contain" />

                    <h1 className="text-xl  lg:text-2xl    font-bold hidden sm:block  tracking-wide drop-shadow">
                        Memon Medical Complex
                    </h1>
                </div>


                <div onClick={() => setOpenProfile(true)}
                    className=" flex items-center gap-3 px-3 py-1.5  rounded-full  shadow-lg  cursor-pointer  transition-all duration-100 hover:shadow-xl  border border-blue-600 bg-white z-10" >
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
                            {doctorData?.name}
                        </span>
                    </div>
                </div>


            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-6 mb-8">
                {stats?.map((s, i) => (
                    <div key={s?.id} className={`p-1 z-10 rounded-[10px] bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 ${s.full ? "sm:col-span-2 lg:col-span-1" : ""} `}>
                        <Card key={i} className={card}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-blue-600 text-blue-600 font-bold">
                                    👤
                                </div>
                                <div>
                                    <p className="text-gray-500 text-lg">{s?.title}</p>
                                    <p className="text-2xl font-bold text-gray-800">{s?.value}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Header