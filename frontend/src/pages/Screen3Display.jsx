import { useNavigate } from "react-router-dom";
import logo from "../assets/MMC logo.png";
import S3LeftScrolling from "../components/Screen3/LeftScrolling";
import Clock from "../components/Screen3/LiveClock";
import S3RightScrolling from "../components/Screen3/RightScrolling";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logoutUser } from "../reduxToolKit/authSlice";
import NubitLogo from ".././assets/nubit logo png.png"


const Screen3Display = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success("Logout Successful");
    navigate("/login");
  };

  return (

    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-[#071b30] to-[#163a63] text-white overflow-hidden font-sans">

      {/* HEADER */}
      <div className="flex flex-2 items-center justify-between px-10 py-4 bg-[#0b2745]/95 backdrop-blur-md border-b border-[#00b0ff]/30 shadow-md">
        {/* Left logo + title */}
        <div className="flex items-center gap-4 [@media(min-width:3200px)]:gap-8 [@media(min-width:4400px)]:gap-12">
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-[#00b0ff]/30">
            <img src={logo} alt="logo" className="h-12 min-[2000px]:h-16 [@media(min-width:3000px)]:h-18  [@media(min-width:4400px)]:h-30 w-12 min-[2000px]:w-16 [@media(min-width:3000px)]:w-18 [@media(min-width:4400px)]:w-30 object-contain" />
          </div>
          <div>
            <h1 className="text-3xl font-bold min-[2000px]:text-5xl [@media(min-width:3200px)]:text-6xl  [@media(min-width:4400px)]:text-7xl text-white tracking-wide drop-shadow">
              Memon Medical Complex
            </h1>
            <p className="text-[#a7c8e8] text-sm italic min-[2000px]:text-2xl [@media(min-width:3000px)]:text-3xl [@media(min-width:4400px)]:text-5xl ">
              “Serving with Excellence & Care”
            </p>
          </div>
        </div>

        {/* Clock */}
        <Clock />

      </div>

      {/* MAIN SECTION */}
      <div className="flex flex-18 overflow-hidden">
        {/* LEFT IMAGE */}
        <S3LeftScrolling />


        {/* RIGHT SCROLLING SECTION */}
        <S3RightScrolling />
      </div>

      {/* FOOTER */}
      <div className="bg-[#0b2745]/95 flex-1 text-center py-2 border-t flex justify-center items-center  border-[#00b0ff]/30 text-sm">

        <div  className=" text-white/60 cursor-pointer flex items-center gap-2 [@media(min-width:1920px)]:text-2xl  [@media(min-width:3000px)]:text-3xl [@media(min-width:4400px)]:text-5xl  min-[1520px]:text-[18px] ">
            <span className='flex justify-center items-center gap-2 cursor-pointer'  onClick={handleLogout} >  Powered by <img className="w-[60px] [@media(min-width:2200px)]:w-[80px] [@media(min-width:3200px)]:w-[90px]" src={NubitLogo} alt="" />  </span>
        </div>
      </div>

    </div>

  );
};

export default Screen3Display;
