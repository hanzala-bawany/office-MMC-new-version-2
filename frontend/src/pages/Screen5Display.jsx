import { useState, useEffect } from 'react';
import logo from "../assets/MMC logo.png"; // ← Apna logo path yahan set kar lo
import NubitLogo from "../assets/nubit logo png.png"; // ← Apna Nubit logo
import fish from "../assets/fish.mp4"; // ← Apna Nubit logo
import fish1 from "../assets/fish1.mp4"; // ← Apna Nubit logo
import fish2 from "../assets/fish2.mp4"; // ← Apna Nubit logo
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import PatientCard from '../components/screen5/PatientCard';
import { useRef } from "react";



const Screen5Display = () => {


  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [i, setI] = useState(0)
  const videoRef = useRef(null);
  const handledRef = useRef(false);
  const vipDoctors = [
    { id: 1, token: "VIP-01", name: "Mr. Rahman Ali", current: 1, age: 52, doctorName: "Dr. Ahmed Khan" },
    { id: 4, token: "VIP-04", name: "Mrs. Ayesha Siddiqui", current: 1, age: 39, doctorName: "Dr. Sana Iqbal" },
    { id: 7, token: "VIP-07", name: "Mr. Bilal Ahmed", current: 1, age: 58, doctorName: "Dr. Usman Raza" },
    { id: 2, token: "VIP-02", name: "Mrs. Fatima Zahra", current: 1, age: 48, doctorName: "Dr. Ahmed Khan" },
    { id: 3, token: "VIP-03", name: "Mr. Khalid Mehmood", current: 1, age: 61, doctorName: "Dr. Ahmed Khan" },
    { id: 5, token: "VIP-05", name: "Mr. Imran Hassan", current: 1, age: 45, doctorName: "Dr. Sana Iqbal" },
  ];
  // const slideshowImages = [
  //   "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
  //   "https://img.freepik.com/premium-photo/brightly-coloured-orange-purple-yellow-large-headed-wildflower-close-up-low-level-macro-view_1048944-7567634.jpg?semt=ais_hybrid&w=740&q=80",
  //   "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80",
  //   "https://img.freepik.com/free-photo/cosmos-flowers_1373-83.jpg?semt=ais_hybrid&w=740",
  //   "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=1920&q=80",
  //   "https://images.unsplash.com/photo-1552083375-1447ce886485?w=1920&q=80",
  // ];
  const slideshowImages = [
    fish2,
    fish,
    fish1,
  ];


  const logoutHandler = () => {
    dispatch(logoutUser())
    toast.success("Logout Scuccessful")
    navigate("/login")
  }

  const nextVideo = () => {
    setI(prev =>
      prev >= slideshowImages.length - 1 ? 0 : prev + 1
    );
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!handledRef.current && video.duration - video.currentTime <= 1) {
      handledRef.current = true;
      nextVideo();
    }
  };


  useEffect(() => {
    handledRef.current = false;
  }, [i]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setI((prev) => prev >= slideshowImages.length - 1 ? 0 : prev + 1);
  //   }, 3000);

  //   return () => clearInterval(interval); // cleanup
  // }, []);



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

      <div className='flex-13 flex '>

        <div className={`${vipDoctors.length <= 6 ? "w-[70%]" : "w-full"} h-full grid grid-cols-${vipDoctors.length <= 6 ? "2" : "3"} gap-8 px-6`}>
          {
            vipDoctors.map((doc) => <PatientCard key={doc.id} doc={doc} />)
          }
        </div>
        {/* {
          vipDoctors.length <= 6 && <div className='w-[30%] h-full px-6 overflow-hidden '>
            <img src={slideshowImages[i]} alt="" className='h-full w-full rounded-2xl object-cover ' />
          </div>
        } */}
        {
          vipDoctors.length <= 6 && <div className='w-[30%] h-full px-6 overflow-hidden '>
            <video
              className="h-full w-full object-cover rounded-2xl bg-amber-500"
              autoPlay
              loop
              muted
              playsInline
              src={slideshowImages[i]}
              onTimeUpdate={handleTimeUpdate}
              ref={videoRef}>

            </video>
          </div>
        }


      </div>

      <div onClick={logoutHandler} className=" text-cyan-600 flex-1 flex justify-center items-center gap-2 cursor-pointer z-50 [@media(min-width:4200px)]:right-10 bottom-5 [@media(min-width:4200px)]:bottom-8 [@media(min-width:1520px)]:text-2xl [@media(min-width:2200px)]:text-3xl [@media(min-width:3200px)]:text-4xl  [@media(min-width:4200px)]:text-6xl">
        Powered by <img className="w-[50px] [@media(min-width:2200px)]:w-[70px] [@media(min-width:3200px)]:w-[80px]" src={NubitLogo} alt="" />
      </div>

    </div>
  );
};

export default Screen5Display;






















