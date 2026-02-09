import { useState, useEffect } from 'react';
import logo from "../assets/MMC logo.png"; // ← Apna logo path yahan set kar lo
import NubitLogo from "../assets/nubit logo png.png"; // ← Apna Nubit logo
import fish from "../assets/fish.mp4";
import fish1 from "../assets/fish1.mp4";
import fish2 from "../assets/fish2.mp4";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PatientCard from '../components/screen5/PatientCard';
import { useRef } from "react";
import { base_URL } from '../utills/baseUrl';
import axios from 'axios';
import { logoutUser } from "../reduxToolKit/authSlice";
import { toast } from "react-toastify";
import { updatePatinetnDocotrsData } from '../reduxToolKit/doctorSlice';
import ImageLoader from '../utills/ImageLoader';
import { socket } from '../socket/socket';




const Screen5Display = () => {


  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [i, setI] = useState(0);
  const videoRef = useRef(null);
  const handledRef = useRef(false);
  const slideshowImages = [
    fish2,
    fish,
    fish1,
  ];
  const patinetnDocotrsData = useSelector((state) => state?.doctorSlice?.patinetnDocotrData);
  // console.log(patinetnDocotrsData, "<<<<<<<<<<");



  const logoutHandler = () => {
    dispatch(logoutUser())
    toast.success("Logout Scuccessful")
    navigate("/login")
  }

  // const nextVideo = () => {
  //   setI(prev =>
  //     prev >= slideshowImages.length - 1 ? 0 : prev + 1
  //   );
  // };

  // const handleTimeUpdate = () => {
  //   const video = videoRef.current;
  //   if (!video) return;

  //   if (!handledRef.current && video.duration - video.currentTime <= 1) {
  //     handledRef.current = true;
  //     nextVideo();
  //   }
  // };


  // useEffect(() => {
  //   handledRef.current = false;
  // }, [i]);

  const getPatientnDoctorInfo = async () => {
    try {
      const res = await axios.get(`${base_URL}/api/opd/patients`);
      // console.log(res, "res of get Patient for screen");
      const data = res?.data?.data?.filter((i) => i?.PATIENT_STATUS_ID == 2);
      dispatch(updatePatinetnDocotrsData(data));
    }
    catch (err) {
      // console.log(err, "error in get Doctor info");
      // toast.error(err?.message)
    }
  }


  useEffect(() => {
    const interval = setInterval(() => {
      setI((prev) => prev >= slideshowImages?.length - 1 ? 0 : prev + 1);
    }, 1000 * 20);

    return () => clearInterval(interval); // cleanup
  }, []);

  useEffect(() => {
    getPatientnDoctorInfo()
  },[]);


  useEffect(() => {

    socket.on("QUEUE_UPDATED", getPatientnDoctorInfo);

    return () => {
      socket.off("QUEUE_UPDATED", getPatientnDoctorInfo);
    };

  }, [dispatch]);


  return (

    <div className="h-[100vh] w-full flex flex-col bg-gradient-to-br from-[#e0f7fa] to-[#fff]">

      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='%2300aaff'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />


      <div className="flex absolute top-4 4xl:top-8 [@media(min-width:3200px)]:top-12 left-4 4xl:left-8 [@media(min-width:4200px)]:left-12 items-center gap-4 [@media(min-width:3200px)]:gap-8 [@media(min-width:4400px)]:gap-12">
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

      <div className="flex justify-center items-center pt-3  relative flex-2 invisible">
        <h1 className="text-cyan-800 font-extrabold tracking-wide text-5xl 4xl:text-6xl 5xl:text-7xl relative">

          <span className="bg-clip-text text-transparent  bg-gradient-to-r from-cyan-600 to-blue-500">
            Live Patient Queue
          </span>

          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2  w-40 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" />
        </h1>
      </div>

      <div className='flex-13 flex '>

        {
          patinetnDocotrsData.length ?
            <div className={`${patinetnDocotrsData.length <= 6 ? "w-[70%]" : "w-full"} h-full grid grid-cols-${patinetnDocotrsData.length <= 6 ? "2" : "3"} gap-8 4xl:gap-12 px-6`}>
              {patinetnDocotrsData?.map((doc) => <PatientCard key={doc?.PATIENTID} doc={doc} isTwo={patinetnDocotrsData.length <= 2} />)}
            </div>
            :
            <div className='flex justify-center w-[70%]'>
              <ImageLoader />
            </div>
        }

        {
          patinetnDocotrsData.length <= 6 && <div className='w-[30%] h-full px-6 overflow-hidden '>
            <video
              className="h-full w-full object-cover rounded-2xl bg-amber-500"
              autoPlay
              loop
              muted
              playsInline
              src={slideshowImages[i]}
              // onTimeUpdate={handleTimeUpdate}
              ref={videoRef}>

            </video>
          </div>
        }


      </div>

      <div className=" text-cyan-600 flex-1 flex justify-center items-center z-50 [@media(min-width:4200px)]:right-10 bottom-5 [@media(min-width:4200px)]:bottom-8 [@media(min-width:1520px)]:text-2xl [@media(min-width:2200px)]:text-3xl [@media(min-width:3200px)]:text-4xl  [@media(min-width:4200px)]:text-6xl">
        <span className='flex justify-center items-center gap-2 cursor-pointer' onClick={logoutHandler}> Powered by <img className="w-[50px] [@media(min-width:2200px)]:w-[70px] [@media(min-width:3200px)]:w-[80px]" src={NubitLogo} alt="" /> </span>
      </div>

    </div>
  );
};

export default Screen5Display;






















