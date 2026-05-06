import { useState, useEffect } from 'react';
import logo from "../assets/MMC logo.png"; // ← Apna logo path yahan set kar lo
import NubitLogo from "../assets/nubit logo png.png"; // ← Apna Nubit logo
import hospitraxLogo from "../assets/productLogoBgRemove.png"; // ← Apna Product logo
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
import VidioSlideShow from '../components/screen5/VidioSlideShow';
import EmptyPatientMessage from '../components/screen5/EmptyPatientMessage';




const Screen5Display = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const patinetnDocotrsData = useSelector((state) => state?.doctorSlice?.patinetnDocotrData);
  const [isLoading, setIsLoading] = useState(true);
  const voiceQueueRef = useRef([]);
  const isSpeakingRef = useRef(false);
  const alertAudioRef = useRef(null);
  const currentSpeakingTokenRef = useRef(null);
  const [highlightToken, setHighlightToken] = useState(null);


  const logoutHandler = () => {
    dispatch(logoutUser())
    toast.success("Logout Scuccessful")
    navigate("/login")
  }

  const getPatientnDoctorInfo = async () => {

    setIsLoading(true); // Start loading

    try {
      // const res = await axios.get(`${base_URL}/api/opd/patients`);
      // const data = res?.data?.data?.filter((i) => i?.PATIENT_STATUS_ID == 2);
      // dispatch(updatePatinetnDocotrsData(data));
      const res = await axios.get(`${base_URL}/api/opd/patients?patientStatus=2`);
      dispatch(updatePatinetnDocotrsData(res?.data?.data));
      // console.log(res , " ,,,,,,,,,,,,,");
      
    } catch (err) {
      console.log(err, "error in get Doctor info");
    } finally {
      setIsLoading(false); // Stop loading regardless of success/error
    }

  }

  const playAlert = () => {

    return new Promise((resolve) => {

      if (!alertAudioRef.current) {
        resolve();
        return;
      }
      // console.log(alertAudioRef);

      alertAudioRef.current.currentTime = 0;

      alertAudioRef.current.play();

      alertAudioRef.current.onended = () => {
        resolve();
      };

    });
  };

  // voice work 
  // START

  const cleanDoctorName = (name) => {
    if (!name) return '';

    return name
      .replace(/\(.*?\)/g, '')          // (Anesthetist), (RMO) etc remove
      .replace(/\bDR\.?\b/gi, '')       // DR. ya DR word remove
      .replace(/-/g, ' ')               // hyphen → space
      .replace(/\./g, ' ')              // dots → space
      .replace(/,/g, ' ')               // comma → space
      .replace(/\s+/g, ' ')             // multiple spaces → single
      .trim()
      .toLowerCase();
  }; // ye banaya he take name alag alag word me call na kare

  const loadVoices = () => {
    return new Promise(resolve => {
      let voices = speechSynthesis.getVoices();
      if (voices.length) resolve(voices);

      speechSynthesis.onvoiceschanged = () => {
        resolve(speechSynthesis.getVoices());
      };
    });
  };

  const speakToken = async ({ token, doctor , room }) => {

    // console.log("speak tokenc chala" , token , doctor);
    const voices = await loadVoices();
    // console.log(voices, " <<<<<<<< voices");

    const msg = new SpeechSynthesisUtterance(
      token === "System" ? "Voice service is ready." : `Token ${token} , Aap doctor ${doctor} ke paas,  ${room ? `room number ${room} me` : ""} tashreef le jaen`  
      // token === "System" ? "Voice service is ready." : `Token ${token} , Aap doctor  ${doctor}  ke pass tashreef le jaen`  
    );

    msg.voice = voices.find(v => v?.lang?.includes("hi")) || voices?.find(v => v?.lang?.includes("en")) || voices[0];
    msg.rate = 0.9;


    msg.onend = () => {
      // console.log("oned bhi chala", isSpeakingRef.current);
      isSpeakingRef.current = false;           // stop voice alert
      currentSpeakingTokenRef.current = null;
      setHighlightToken(null);  // remove highlight
      playNextVoice();
    };

    msg.onerror = (e) => {
      console.log("Speech error:", e);
      isSpeakingRef.current = false;
      currentSpeakingTokenRef.current = null;
      setHighlightToken(null);
      playNextVoice();
    };

    window.speechSynthesis.resume();
    window.speechSynthesis.speak(msg);

  };

  const playNextVoice = async () => {

    // console.log("isSpeakingRef.current >>>>> ", isSpeakingRef.current, " voiceQueueRef.current.length === 0 >>>> ", voiceQueueRef.current.length === 0);
    if (isSpeakingRef.current || voiceQueueRef.current.length === 0) return;

    isSpeakingRef.current = true;
    const data = voiceQueueRef.current.shift();

    try {
      await playAlert();
    }
    catch (err) {
      console.log(err, "err in buzzer .............");
    }
    setHighlightToken(data);
    // console.log(data, "dtaa .......................");

    speakToken(data);
  };

  // END


  useEffect(() => {
    getPatientnDoctorInfo()
  }, []);

  useEffect(() => {

    const handleQueue = (payload) => {

      console.log(" payload ..........", payload);
      getPatientnDoctorInfo()

      if (!payload?.patientToken) return;

      const cleanName = payload?.pronounceName ? cleanDoctorName(payload?.pronounceName) : cleanDoctorName(payload?.doctorName?.replace("DR", ""))

      voiceQueueRef?.current?.push({ token: payload?.patientToken, doctor: cleanName, doctorId: payload?.doctorId ,room: payload?.roomNo });
      voiceQueueRef?.current?.push({ token: payload?.patientToken, doctor: cleanName, doctorId: payload?.doctorId ,room: payload.roomNo });

      // voiceQueueRef?.current?.push({ token: payload?.patientToken, doctor: payload?.doctorName?.replace("DR", ""), doctorId: payload?.doctorId });
      // voiceQueueRef?.current?.push({ token: payload?.patientToken, doctor: payload?.doctorName?.replace("DR", ""), doctorId: payload?.doctorId });
      playNextVoice();

    }

    socket.on("QUEUE_UPDATED", handleQueue);

    return () => {
      socket.off("QUEUE_UPDATED", handleQueue);
    };

  }, []);

  useEffect(() => {
    // alertAudioRef.current = new Audio("/buffer.mp3.wav");
    alertAudioRef.current = new Audio("/buffer3.mp3.wav");
  }, []);

  useEffect(() => {
    let unlocked = false;

    const unlock = () => {
      if (unlocked) return;
      const msg = new SpeechSynthesisUtterance(" ");
      msg.volume = 0;
      window.speechSynthesis.speak(msg);
      unlocked = true;
    };

    setTimeout(unlock, 1000);
    document.addEventListener("keydown", unlock);
    document.addEventListener("click", unlock);

    return () => {
      document.removeEventListener("keydown", unlock);
      document.removeEventListener("click", unlock);
    };
  }, []);   // for icon click skip


  console.log(patinetnDocotrsData, "<<<<<<< patinetnDocotrsData", highlightToken, "<<<< highlightToken");


  return (

    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-[#e0f7fa] to-[#fff]">

      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z' fill='%2300aaff'/%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {
        // <button className='bg-amber-300'  onClick={() => {
        //   voiceQueueRef.current.push({ token: "4", doctor: "Ubaid ur rehman" });
        //   playNextVoice();
        // }}>
        //   Test Voice
        // </button>
      }

        {/* Header */}
      <div className='flex justify-between items-center px-8 4xl:px-16 py-4 4xl:py-6'>

        {/* Left Side - Hospitrax Logo & Name */}
        <div className=" cursor-pointer flex items-center gap-4 [@media(min-width:3200px)]:gap-8 [@media(min-width:4400px)]:gap-12">

          <img
            src={hospitraxLogo}
            alt="Hospitrax Logo"
            className="w-22 4xl:w-30"
          
          />

        </div>

        {/* Center - Memon Medical Complex Info (Clickable for Voice) */}
        <div onClick={() => {
          voiceQueueRef.current.push({ token: "System", doctor: "hanzala bawany" });
          playNextVoice();
        }} className="cursor-pointer  flex  items-center gap-4 [@media(min-width:3200px)]:gap-8 [@media(min-width:4400px)]:gap-12">

          <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-blue-500 " >
            <img src={logo} alt="logo" className="h-12 min-[2000px]:h-16 [@media(min-width:3000px)]:h-18  [@media(min-width:4400px)]:h-30 w-12 min-[2000px]:w-16 [@media(min-width:3000px)]:w-18 [@media(min-width:4400px)]:w-30 object-contain" />
          </div>

          <div>
            <h1 className="text-blue-500 text-3xl font-bold min-[2000px]:text-5xl [@media(min-width:3200px)]:text-6xl  [@media(min-width:4400px)]:text-7xl  tracking-wide drop-shadow">
              Memon Medical Complex
            </h1>
            <p className="text-[#7d9ec0] text-sm italic min-[2000px]:text-2xl [@media(min-width:3000px)]:text-3xl [@media(min-width:4400px)]:text-5xl ">
              “Serving with Excellence & Care”
            </p>
          </div>

        </div>

        {/* Right Side - Empty for balance (or you can add something here later) */}
        <div className="w-45 [@media(min-width:4400px)]:w-62.5">
          {/* Future content like date/time or notification */}
        </div>

      </div>

   
        {/* Body */}
      <div className='flex-13 flex   mb-7'>

        {
          patinetnDocotrsData?.length > 0 ?

            <div className={` ${patinetnDocotrsData.length <= 6 ? "w-[70%]" : "w-full"} h-full grid ${patinetnDocotrsData.length <= 6 ? "grid-cols-2" : "grid-cols-3"} gap-8 4xl:gap-12 px-6`}>
              {patinetnDocotrsData?.map((doc) => <PatientCard key={doc?.CONSULTANTID} doc={doc} isTwo={patinetnDocotrsData.length <= 2} highlight={highlightToken?.token === doc?.TOKENNO && highlightToken?.doctorId == doc?.CONSULTANTID} />)}
            </div>

            : isLoading ?

              <div className='flex justify-center w-full'>
                <ImageLoader />
              </div>
              :
              <EmptyPatientMessage />
        }

        {
          // patinetnDocotrsData.length <= 6 && <div className='w-[30%] h-full px-6 overflow-hidden '>
          //   <VidioSlideShow />
          // </div>
        }

      </div>

        {/* Footer */}
      <div className=" text-blue-500 flex-1 flex justify-center items-center z-50 [@media(min-width:4200px)]:right-10 bottom-5 [@media(min-width:4200px)]:bottom-8 [@media(min-width:1520px)]:text-2xl [@media(min-width:2200px)]:text-3xl [@media(min-width:3200px)]:text-4xl  [@media(min-width:4200px)]:text-6xl">
        <span className='flex justify-center items-center gap-2 cursor-pointer' onClick={logoutHandler}> Powered by <img className="w-[50px] [@media(min-width:2200px)]:w-[70px] [@media(min-width:3200px)]:w-[80px]" src={NubitLogo} alt="" /> </span>
      </div>

    </div>
  );
};

export default Screen5Display;






















