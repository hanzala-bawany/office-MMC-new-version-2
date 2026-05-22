import { useState, useEffect, useCallback } from "react";
import logo from "../assets/MMC logo.png"; // ← Apna logo path yahan set kar lo
import NubitLogo from "../assets/nubit logo png.png"; // ← Apna Nubit logo
import hospitraxLogo from "../assets/productLogoBgRemove.png"; // ← Apna Product logo
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PatientCard from "../components/screen5/PatientCard";
import { useRef } from "react";
import { base_URL } from "../utills/baseUrl";
import axios from "axios";
import { logoutUser } from "../reduxToolKit/authSlice";
import { toast } from "react-toastify";
import { updatePatinetnDocotrsData } from "../reduxToolKit/doctorSlice";
import ImageLoader from "../utills/ImageLoader";
import { socket } from "../socket/socket";
import VidioSlideShow from "../components/screen5/VidioSlideShow";
import EmptyPatientMessage from "../components/screen5/EmptyPatientMessage";
import { useScreenSocket } from "../utills/useScreenSocket";

const Screen5Display = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const patinetnDocotrsData = useSelector((state) => state?.doctorSlice?.patinetnDocotrData,);
  const [isLoading, setIsLoading] = useState(true);
  const voiceQueueRef = useRef([]);
  const isSpeakingRef = useRef(false);
  const alertAudioRef = useRef(null);
  const currentSpeakingTokenRef = useRef(null);
  const [highlightToken, setHighlightToken] = useState(null);
  const loginUserData = JSON.parse(localStorage.getItem("loginUserData"));
  const { screenNum } = useParams(); // Get screen number from URL: /screen/6
  const SCREEN_ID = parseInt(screenNum) + 1;  // make id fron this



  const logoutHandler = () => {
    dispatch(logoutUser());
    toast.success("Logout Scuccessful");
    navigate("/login");
  };

  const getPatientnDoctorInfo = async () => {
    setIsLoading(true); // Start loading

    try {
      // const res = await axios.get( `${base_URL}/api/opd/patients?patientStatus=2`);
      const res = await axios.get(`${base_URL}/api/opd/patients-by-screen?patientStatus=2&screenId=${SCREEN_ID}`);
      dispatch(updatePatinetnDocotrsData(res?.data?.data));
      // console.log(res , " ,,,,,,,,,,,,,");
    } catch (err) {
      console.log(err, "error in get Doctor info");
    } finally {
      setIsLoading(false); // Stop loading regardless of success/error
    }
  };

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

  // voice work START

  const cleanDoctorName = (name) => {
    if (!name) return "";

    return name
      .replace(/\(.*?\)/g, "") // (Anesthetist), (RMO) etc remove
      .replace(/\bDR\.?\b/gi, "") // DR. ya DR word remove
      .replace(/-/g, " ") // hyphen → space
      .replace(/\./g, " ") // dots → space
      .replace(/,/g, " ") // comma → space
      .replace(/\s+/g, " ") // multiple spaces → single
      .trim()
      .toLowerCase();
  }; // ye banaya he take name alag alag word me call na kare

  const loadVoices = () => {
    return new Promise((resolve) => {
      let voices = speechSynthesis.getVoices();
      if (voices.length) resolve(voices);

      speechSynthesis.onvoiceschanged = () => {
        resolve(speechSynthesis.getVoices());
      };
    });
  };

  const speakToken = async ({ token, doctor, room }) => {
    // console.log("speak tokenc chala" , token , doctor);
    const voices = await loadVoices();
    // console.log(voices, " <<<<<<<< voices");

    const msg = new SpeechSynthesisUtterance(
      token === "System"
        ? "Voice service is ready."
        : `Token ${token} , Aap doctor ${doctor} ke paas,  ${room ? `room number ${room} me` : ""} tashreef le jaen`,
      // token === "System" ? "Voice service is ready." : `Token ${token} , Aap doctor  ${doctor}  ke pass tashreef le jaen`
    );

    msg.voice =
      voices.find((v) => v?.lang?.includes("hi")) ||
      voices?.find((v) => v?.lang?.includes("en")) ||
      voices[0];
    msg.rate = 0.9;

    msg.onend = () => {
      // console.log("oned bhi chala", isSpeakingRef.current);
      isSpeakingRef.current = false; // stop voice alert
      currentSpeakingTokenRef.current = null;
      setHighlightToken(null); // remove highlight
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
    } catch (err) {
      console.log(err, "err in buzzer .............");
    }
    setHighlightToken(data);
    // console.log(data, "dtaa .......................");

    speakToken(data);
  };

  // END


  // START socket work

  // useEffect(() => {
  //   getPatientnDoctorInfo();
  // }, []);

  // useEffect(() => {
  //   const handleQueue = (payload) => {
  //     console.log(" payload ..........", payload);
  //     getPatientnDoctorInfo();

  //     if (!payload?.patientToken) return;

  //     const cleanName = payload?.pronounceName
  //       ? cleanDoctorName(payload?.pronounceName)
  //       : cleanDoctorName(payload?.doctorName?.replace("DR", ""));

  //     voiceQueueRef?.current?.push({ token: payload?.patientToken, doctor: cleanName, doctorId: payload?.doctorId, room: payload?.roomNo, });
  //     voiceQueueRef?.current?.push({ token: payload?.patientToken, doctor: cleanName, doctorId: payload?.doctorId, room: payload.roomNo });

  //     // voiceQueueRef?.current?.push({ token: payload?.patientToken, doctor: payload?.doctorName?.replace("DR", ""), doctorId: payload?.doctorId });
  //     // voiceQueueRef?.current?.push({ token: payload?.patientToken, doctor: payload?.doctorName?.replace("DR", ""), doctorId: payload?.doctorId });
  //     playNextVoice();
  //   };

  //   socket.on("QUEUE_UPDATED", handleQueue);

  //   return () => {
  //     socket.off("QUEUE_UPDATED", handleQueue);
  //   };
  // }, []);

  
  // END


  // START socket room work

  const handleQueueUpdate = useCallback((payload) => {


    console.log(`Screen id ${SCREEN_ID} received update:`, payload);

    // Double-check if this update is for current screen
    if (payload?.screenId && payload.screenId !== SCREEN_ID) {
      console.log(`Ignoring update for screen ${payload.screenId}, current screen is ${SCREEN_ID}`);
      return;
    }

    // Refresh data
    getPatientnDoctorInfo();

    if (!payload?.patientToken) return;

    const cleanName = payload?.pronounceName ? cleanDoctorName(payload?.pronounceName) : cleanDoctorName(payload?.doctorName?.replace("DR", ""));

    voiceQueueRef.current.push({ token: payload?.patientToken, doctor: cleanName, doctorId: payload?.doctorId, room: payload?.roomNo });
    voiceQueueRef.current.push({ token: payload?.patientToken, doctor: cleanName, doctorId: payload?.doctorId, room: payload?.roomNo });

    playNextVoice();
  }, [SCREEN_ID]);

  const { isConnected } = useScreenSocket(SCREEN_ID, handleQueueUpdate);

  useEffect(() => {
    getPatientnDoctorInfo();
  }, [SCREEN_ID]);

  // END


  useEffect(() => {
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
  }, []); // for icon click skip

  // console.log(patinetnDocotrsData, "<<<<<<< patinetnDocotrsData", highlightToken, "<<<< highlightToken");
  // console.log(loginUserData, "<<<<<<< loginUserData");



  return (
    <div className="relative h-screen w-full flex flex-col bg-gradient-to-br from-[#e0f7fa] to-[#fff]">

      {/* Animated Background */}
      <style>{`
   @keyframes floatUp {
    0%   { transform: translateY(0) rotate(0deg) scale(0.6); opacity: 0; }
    10%  { opacity: 1; }
    85%  { opacity: 0.5; }
    100% { transform: translateY(-100vh) rotate(360deg) scale(1.1); opacity: 0; }
   }
  .particle { position: absolute; opacity: 0; animation: floatUp linear infinite; pointer-events: none; }
  .cross-shape { width: 16px; height: 16px; position: relative; }
  .cross-shape::before, .cross-shape::after { content: ''; position: absolute; background: #2196f3; border-radius: 2px; }
  .cross-shape::before { width: 100%; height: 34%; top: 33%; left: 0; }
  .cross-shape::after  { height: 100%; width: 34%; left: 33%; top: 0; }
  .dot-shape { border-radius: 50%; background: #0ea5e9; }
  .ring-shape { border-radius: 50%; border: 2px solid #38bdf8; background: transparent; }
      `}</style>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[
          { cl: "p1", l: "5%", dur: "18s", del: "0s", type: "cross", sz: 16 },
          { cl: "p2", l: "12%", dur: "22s", del: "3s", type: "dot", sz: 7 },
          { cl: "p3", l: "20%", dur: "16s", del: "6s", type: "ring", sz: 14 },
          { cl: "p4", l: "28%", dur: "25s", del: "1s", type: "cross", sz: 12 },
          { cl: "p5", l: "35%", dur: "19s", del: "8s", type: "dot", sz: 6 },
          { cl: "p6", l: "42%", dur: "21s", del: "4s", type: "ring", sz: 10 },
          { cl: "p7", l: "50%", dur: "17s", del: "11s", type: "cross", sz: 20 },
          { cl: "p8", l: "58%", dur: "23s", del: "2s", type: "dot", sz: 8 },
          { cl: "p9", l: "65%", dur: "20s", del: "7s", type: "ring", sz: 14 },
          { cl: "p10", l: "72%", dur: "15s", del: "9s", type: "cross", sz: 14 },
          { cl: "p11", l: "80%", dur: "26s", del: "5s", type: "dot", sz: 5 },
          { cl: "p12", l: "88%", dur: "18s", del: "13s", type: "ring", sz: 12 },
          { cl: "p13", l: "8%", dur: "24s", del: "15s", type: "cross", sz: 10 },
          { cl: "p14", l: "22%", dur: "20s", del: "10s", type: "dot", sz: 9 },
          { cl: "p15", l: "45%", dur: "22s", del: "12s", type: "ring", sz: 16 },
          {
            cl: "p16",
            l: "62%",
            dur: "19s",
            del: "14s",
            type: "cross",
            sz: 18,
          },
          { cl: "p17", l: "75%", dur: "28s", del: "16s", type: "dot", sz: 7 },
          { cl: "p18", l: "92%", dur: "17s", del: "18s", type: "ring", sz: 11 },
        ].map(({ cl, l, dur, del, type, sz }) => (
          <div
            key={cl}
            className="particle"
            style={{
              left: l,
              bottom: "-20px",
              animationDuration: dur,
              animationDelay: del,
            }}
          >
            {type === "cross" && (
              <div className="cross-shape" style={{ width: sz, height: sz }} />
            )}
            {type === "dot" && (
              <div className="dot-shape" style={{ width: sz, height: sz }} />
            )}
            {type === "ring" && (
              <div className="ring-shape" style={{ width: sz, height: sz }} />
            )}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center px-8 4xl:px-16 py-4 4xl:py-6">

        {/* Left Side - Hospitrax Logo & Name */}
        <div className="flex items-center gap-4 [@media(min-width:3200px)]:gap-8 [@media(min-width:4400px)]:gap-12">
          <img
            src={hospitraxLogo}
            alt="Hospitrax Logo"
            className="w-22 4xl:w-30"
          />
        </div>

        {/* Center - Memon Medical Complex Info (Clickable for Voice) */}
        <div
          onClick={() => {
            voiceQueueRef.current.push({
              token: "System",
              doctor: "hanzala bawany",
            });
            playNextVoice();
          }}
          className="cursor-pointer  flex  items-center gap-4 [@media(min-width:3200px)]:gap-8 [@media(min-width:4400px)]:gap-12"
        >
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-blue-500 ">
            <img
              src={logo}
              alt="logo"
              className="h-12 min-[2000px]:h-16 [@media(min-width:3000px)]:h-18  [@media(min-width:4400px)]:h-30 w-12 min-[2000px]:w-16 [@media(min-width:3000px)]:w-18 [@media(min-width:4400px)]:w-30 object-contain"
            />
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
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl px-6 py-1.5 shadow-md border border-blue-200 min-[2000px]:px-8 min-[2000px]:py-4 [@media(min-width:3200px)]:px-9 [@media(min-width:3200px)]:py-5 [@media(min-width:4400px)]:px-12 [@media(min-width:4400px)]:py-6">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 text-sm font-medium uppercase tracking-wide min-[2000px]:text-base [@media(min-width:3200px)]:text-lg">Screen</span>
            <span className="text-blue-800 text-xl font-bold min-[2000px]:text-2xl [@media(min-width:3200px)]:text-3xl [@media(min-width:4400px)]:text-4xl">:</span>
            <span className="text-blue-700 text-2xl font-black min-[2000px]:text-3xl [@media(min-width:3200px)]:text-4xl [@media(min-width:4400px)]:text-5xl">{screenNum}</span>
          </div>
        </div>

      </div>

      {/* Body */}
      <div className="flex-13 flex mb-7">

        {patinetnDocotrsData?.length > 0 ? (
          <div
            // className={` ${patinetnDocotrsData.length <= 6 ? "w-[70%]" : "w-full"} h-full grid ${patinetnDocotrsData.length <= 6 ? "grid-cols-2" : "grid-cols-3"}  gap-8 4xl:gap-12 px-6`}
            className={`w-full h-full grid grid-cols-3 ${patinetnDocotrsData.length <= 6 ? "grid-rows-2" : "grid-cols-3"} gap-6  4xl:gap-12 px-6`}
          >
            {patinetnDocotrsData?.map((doc, i) => (
              <PatientCard
                key={`${doc?.CONSULTANTID}-${doc?.TOKENNO || i}`}
                doc={doc}
                isTwo={patinetnDocotrsData.length <= 2}
                highlight={
                  highlightToken?.token === doc?.TOKENNO &&
                  highlightToken?.doctorId == doc?.CONSULTANTID
                }
              />
            ))}
          </div>
        ) : isLoading ? (
          <div className="flex justify-center w-full">
            <ImageLoader />
          </div>
        ) : (
          <EmptyPatientMessage />
        )}

        {
          // patinetnDocotrsData.length <= 6 && <div className='w-[30%] h-full px-6 overflow-hidden '>
          //   <VidioSlideShow />
          // </div>
        }
      </div>

      {/* Footer */}
      <div className=" text-blue-500 flex-1 flex justify-center items-center z-50 [@media(min-width:4200px)]:right-10 bottom-5 [@media(min-width:4200px)]:bottom-8 [@media(min-width:1520px)]:text-2xl [@media(min-width:2200px)]:text-3xl [@media(min-width:3200px)]:text-4xl  [@media(min-width:4200px)]:text-6xl">
        <span
          className="flex justify-center items-center gap-2 cursor-pointer"
          onClick={logoutHandler}
        >
          {" "}
          Powered by{" "}
          <img
            className="w-[50px] [@media(min-width:2200px)]:w-[70px] [@media(min-width:3200px)]:w-[80px]"
            src={NubitLogo}
            alt=""
          />{" "}
        </span>
      </div>

    </div>
  );
};

export default Screen5Display;










// import { useState, useEffect, useCallback } from "react";
// import logo from "../assets/MMC logo.png"; // ← Apna logo path yahan set kar lo
// import NubitLogo from "../assets/nubit logo png.png"; // ← Apna Nubit logo
// import hospitraxLogo from "../assets/productLogoBgRemove.png"; // ← Apna Product logo
// import { useNavigate, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import PatientCard from "../components/screen5/PatientCard";
// import { useRef } from "react";
// import { base_URL } from "../utills/baseUrl";
// import axios from "axios";
// import { logoutUser } from "../reduxToolKit/authSlice";
// import { toast } from "react-toastify";
// import { updatePatinetnDocotrsData } from "../reduxToolKit/doctorSlice";
// import ImageLoader from "../utills/ImageLoader";
// import { socket } from "../socket/socket";
// import VidioSlideShow from "../components/screen5/VidioSlideShow";
// import EmptyPatientMessage from "../components/screen5/EmptyPatientMessage";
// import { useScreenSocket } from "../utills/useScreenSocket";

// const Screen5Display = () => {

//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const patinetnDocotrsData = useSelector((state) => state?.doctorSlice?.patinetnDocotrData,);
//   const [isLoading, setIsLoading] = useState(true);
//   const voiceQueueRef = useRef([]);
//   const isSpeakingRef = useRef(false);
//   const alertAudioRef = useRef(null);
//   const currentSpeakingTokenRef = useRef(null);
//   const [highlightToken, setHighlightToken] = useState(null);
//   const loginUserData = JSON.parse(localStorage.getItem("loginUserData"));
//   const { screenNum } = useParams(); // Get screen number from URL: /screen/6
//   const SCREEN_ID = parseInt(screenNum) + 1;  // make id fron this



//   const logoutHandler = () => {
//     dispatch(logoutUser());
//     toast.success("Logout Scuccessful");
//     navigate("/login");
//   };

//   const getPatientnDoctorInfo = async () => {
//     setIsLoading(true); // Start loading

//     try {
//       // const res = await axios.get( `${base_URL}/api/opd/patients?patientStatus=2`);
//       const res = await axios.get(`${base_URL}/api/opd/patients-by-screen?patientStatus=2&screenId=${SCREEN_ID}`);
//       dispatch(updatePatinetnDocotrsData(res?.data?.data));
//       // console.log(res , " ,,,,,,,,,,,,,");
//     } catch (err) {
//       console.log(err, "error in get Doctor info");
//     } finally {
//       setIsLoading(false); // Stop loading regardless of success/error
//     }
//   };

//   const playAlert = () => {
//     return new Promise((resolve) => {
//       if (!alertAudioRef.current) {
//         resolve();
//         return;
//       }
//       // console.log(alertAudioRef);

//       alertAudioRef.current.currentTime = 0;

//       alertAudioRef.current.play();

//       alertAudioRef.current.onended = () => {
//         resolve();
//       };
//     });
//   };

//   // voice work
//   // START

//   const cleanDoctorName = (name) => {
//     if (!name) return "";

//     return name
//       .replace(/\(.*?\)/g, "") // (Anesthetist), (RMO) etc remove
//       .replace(/\bDR\.?\b/gi, "") // DR. ya DR word remove
//       .replace(/-/g, " ") // hyphen → space
//       .replace(/\./g, " ") // dots → space
//       .replace(/,/g, " ") // comma → space
//       .replace(/\s+/g, " ") // multiple spaces → single
//       .trim()
//       .toLowerCase();
//   }; // ye banaya he take name alag alag word me call na kare

//   const loadVoices = () => {
//     return new Promise((resolve) => {
//       let voices = speechSynthesis.getVoices();
//       if (voices.length) resolve(voices);

//       speechSynthesis.onvoiceschanged = () => {
//         resolve(speechSynthesis.getVoices());
//       };
//     });
//   };

//   const speakToken = async ({ token, doctor, room }) => {
//     // console.log("speak tokenc chala" , token , doctor);
//     const voices = await loadVoices();
//     // console.log(voices, " <<<<<<<< voices");

//     const msg = new SpeechSynthesisUtterance(
//       token === "System"
//         ? "Voice service is ready."
//         : `Token ${token} , Aap doctor ${doctor} ke paas,  ${room ? `room number ${room} me` : ""} tashreef le jaen`,
//       // token === "System" ? "Voice service is ready." : `Token ${token} , Aap doctor  ${doctor}  ke pass tashreef le jaen`
//     );

//     msg.voice =
//       voices.find((v) => v?.lang?.includes("hi")) ||
//       voices?.find((v) => v?.lang?.includes("en")) ||
//       voices[0];
//     msg.rate = 0.9;

//     msg.onend = () => {
//       // console.log("oned bhi chala", isSpeakingRef.current);
//       isSpeakingRef.current = false; // stop voice alert
//       currentSpeakingTokenRef.current = null;
//       setHighlightToken(null); // remove highlight
//       playNextVoice();
//     };

//     msg.onerror = (e) => {
//       console.log("Speech error:", e);
//       isSpeakingRef.current = false;
//       currentSpeakingTokenRef.current = null;
//       setHighlightToken(null);
//       playNextVoice();
//     };

//     window.speechSynthesis.resume();
//     window.speechSynthesis.speak(msg);
//   };

//   const playNextVoice = async () => {
//     // console.log("isSpeakingRef.current >>>>> ", isSpeakingRef.current, " voiceQueueRef.current.length === 0 >>>> ", voiceQueueRef.current.length === 0);
//     if (isSpeakingRef.current || voiceQueueRef.current.length === 0) return;

//     isSpeakingRef.current = true;
//     const data = voiceQueueRef.current.shift();

//     try {
//       await playAlert();
//     } catch (err) {
//       console.log(err, "err in buzzer .............");
//     }
//     setHighlightToken(data);
//     // console.log(data, "dtaa .......................");

//     speakToken(data);
//   };

//   // END

//   // useEffect(() => {
//   //   getPatientnDoctorInfo();
//   // }, []);

//   // useEffect(() => {
//   //   const handleQueue = (payload) => {
//   //     console.log(" payload ..........", payload);
//   //     getPatientnDoctorInfo();

//   //     if (!payload?.patientToken) return;

//   //     const cleanName = payload?.pronounceName
//   //       ? cleanDoctorName(payload?.pronounceName)
//   //       : cleanDoctorName(payload?.doctorName?.replace("DR", ""));

//   //     voiceQueueRef?.current?.push({ token: payload?.patientToken, doctor: cleanName, doctorId: payload?.doctorId, room: payload?.roomNo, });
//   //     voiceQueueRef?.current?.push({ token: payload?.patientToken, doctor: cleanName, doctorId: payload?.doctorId, room: payload.roomNo });

//   //     // voiceQueueRef?.current?.push({ token: payload?.patientToken, doctor: payload?.doctorName?.replace("DR", ""), doctorId: payload?.doctorId });
//   //     // voiceQueueRef?.current?.push({ token: payload?.patientToken, doctor: payload?.doctorName?.replace("DR", ""), doctorId: payload?.doctorId });
//   //     playNextVoice();
//   //   };

//   //   socket.on("QUEUE_UPDATED", handleQueue);

//   //   return () => {
//   //     socket.off("QUEUE_UPDATED", handleQueue);
//   //   };
//   // }, []);

//   // START socket room work

//   const handleQueueUpdate = useCallback((payload) => {


//     console.log(`Screen id ${SCREEN_ID} received update:`, payload);

//     // Double-check if this update is for current screen
//     if (payload.screenId && payload.screenId !== SCREEN_ID) {
//       console.log(`Ignoring update for screen ${payload.screenId}, current screen is ${SCREEN_ID}`);
//       return;
//     }

//     // Refresh data
//     getPatientnDoctorInfo();

//     if (!payload?.patientToken) return;

//     const cleanName = payload?.pronounceName ? cleanDoctorName(payload?.pronounceName) : cleanDoctorName(payload?.doctorName?.replace("DR", ""));

//     voiceQueueRef.current.push({ token: payload?.patientToken, doctor: cleanName, doctorId: payload?.doctorId, room: payload?.roomNo });
//     voiceQueueRef.current.push({ token: payload?.patientToken, doctor: cleanName, doctorId: payload?.doctorId, room: payload?.roomNo });

//     playNextVoice();
//   }, [SCREEN_ID]);

//   const { isConnected } = useScreenSocket(SCREEN_ID, handleQueueUpdate);

//   useEffect(() => {
//     getPatientnDoctorInfo();
//   }, [SCREEN_ID]);

//   // END


//   useEffect(() => {
//     alertAudioRef.current = new Audio("/buffer3.mp3.wav");
//   }, []);

//   useEffect(() => {
//     let unlocked = false;

//     const unlock = () => {
//       if (unlocked) return;
//       const msg = new SpeechSynthesisUtterance(" ");
//       msg.volume = 0;
//       window.speechSynthesis.speak(msg);
//       unlocked = true;
//     };

//     setTimeout(unlock, 1000);
//     document.addEventListener("keydown", unlock);
//     document.addEventListener("click", unlock);

//     return () => {
//       document.removeEventListener("keydown", unlock);
//       document.removeEventListener("click", unlock);
//     };
//   }, []); // for icon click skip

//   // console.log(patinetnDocotrsData, "<<<<<<< patinetnDocotrsData", highlightToken, "<<<< highlightToken");
//   // console.log(loginUserData, "<<<<<<< loginUserData");



//   return (
//     <div className="relative h-screen w-full flex flex-col overflow-hidden bg-[#07111f]">

//       {/* Animated Background */}
//       <style>{`
//    @keyframes floatUp {
//     0%   { transform: translateY(0) rotate(0deg) scale(0.6); opacity: 0; }
//     10%  { opacity: 1; }
//     85%  { opacity: 0.5; }
//     100% { transform: translateY(-100vh) rotate(360deg) scale(1.1); opacity: 0; }
//    }
//   .particle { position: absolute; opacity: 0; animation: floatUp linear infinite; pointer-events: none; filter: drop-shadow(0 0 10px rgba(56, 189, 248, 0.35)); }
//   .cross-shape { width: 16px; height: 16px; position: relative; }
//   .cross-shape::before, .cross-shape::after { content: ''; position: absolute; background: rgba(125, 211, 252, 0.65); border-radius: 2px; }
//   .cross-shape::before { width: 100%; height: 34%; top: 33%; left: 0; }
//   .cross-shape::after  { height: 100%; width: 34%; left: 33%; top: 0; }
//   .dot-shape { border-radius: 50%; background: rgba(34, 211, 238, 0.7); }
//   .ring-shape { border-radius: 50%; border: 2px solid rgba(186, 230, 253, 0.55); background: transparent; }
//   .screen5-bg {
//     position: absolute;
//     inset: 0;
//     z-index: 0;
//     background:
//       radial-gradient(circle at 16% 12%, rgba(14, 165, 233, 0.2), transparent 28%),
//       radial-gradient(circle at 86% 18%, rgba(45, 212, 191, 0.13), transparent 28%),
//       linear-gradient(135deg, #050b16 0%, #071a2d 48%, #061525 100%);
//   }
//   .screen5-bg::after {
//     content: "";
//     position: absolute;
//     inset: 0;
//     background-image:
//       linear-gradient(rgba(148, 163, 184, 0.055) 1px, transparent 1px),
//       linear-gradient(90deg, rgba(148, 163, 184, 0.055) 1px, transparent 1px);
//     background-size: 54px 54px;
//     mask-image: linear-gradient(to bottom, rgba(0,0,0,0.8), rgba(0,0,0,0.2));
//   }
//       `}</style>

//       <div className="screen5-bg" />

//       <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
//         {[
//           { cl: "p1", l: "5%", dur: "18s", del: "0s", type: "cross", sz: 16 },
//           { cl: "p2", l: "12%", dur: "22s", del: "3s", type: "dot", sz: 7 },
//           { cl: "p3", l: "20%", dur: "16s", del: "6s", type: "ring", sz: 14 },
//           { cl: "p4", l: "28%", dur: "25s", del: "1s", type: "cross", sz: 12 },
//           { cl: "p5", l: "35%", dur: "19s", del: "8s", type: "dot", sz: 6 },
//           { cl: "p6", l: "42%", dur: "21s", del: "4s", type: "ring", sz: 10 },
//           { cl: "p7", l: "50%", dur: "17s", del: "11s", type: "cross", sz: 20 },
//           { cl: "p8", l: "58%", dur: "23s", del: "2s", type: "dot", sz: 8 },
//           { cl: "p9", l: "65%", dur: "20s", del: "7s", type: "ring", sz: 14 },
//           { cl: "p10", l: "72%", dur: "15s", del: "9s", type: "cross", sz: 14 },
//           { cl: "p11", l: "80%", dur: "26s", del: "5s", type: "dot", sz: 5 },
//           { cl: "p12", l: "88%", dur: "18s", del: "13s", type: "ring", sz: 12 },
//           { cl: "p13", l: "8%", dur: "24s", del: "15s", type: "cross", sz: 10 },
//           { cl: "p14", l: "22%", dur: "20s", del: "10s", type: "dot", sz: 9 },
//           { cl: "p15", l: "45%", dur: "22s", del: "12s", type: "ring", sz: 16 },
//           {
//             cl: "p16",
//             l: "62%",
//             dur: "19s",
//             del: "14s",
//             type: "cross",
//             sz: 18,
//           },
//           { cl: "p17", l: "75%", dur: "28s", del: "16s", type: "dot", sz: 7 },
//           { cl: "p18", l: "92%", dur: "17s", del: "18s", type: "ring", sz: 11 },
//         ].map(({ cl, l, dur, del, type, sz }) => (
//           <div
//             key={cl}
//             className="particle"
//             style={{
//               left: l,
//               bottom: "-20px",
//               animationDuration: dur,
//               animationDelay: del,
//             }}
//           >
//             {type === "cross" && (
//               <div className="cross-shape" style={{ width: sz, height: sz }} />
//             )}
//             {type === "dot" && (
//               <div className="dot-shape" style={{ width: sz, height: sz }} />
//             )}
//             {type === "ring" && (
//               <div className="ring-shape" style={{ width: sz, height: sz }} />
//             )}
//           </div>
//         ))}
//       </div>

//       {/* Header */}
//       <div className="relative z-10 flex justify-between items-center px-8 4xl:px-16 py-4 4xl:py-6 bg-slate-950/55 border-b border-cyan-200/15 shadow-[0_18px_50px_rgba(0,0,0,0.22)] backdrop-blur-md">

//         {/* Left Side - Hospitrax Logo & Name */}
//         <div className="flex items-center gap-4 [@media(min-width:3200px)]:gap-8 [@media(min-width:4400px)]:gap-12">
//           <img
//             src={hospitraxLogo}
//             alt="Hospitrax Logo"
//             className="w-22 4xl:w-30"
//           />
//         </div>

//         {/* Center - Memon Medical Complex Info (Clickable for Voice) */}
//         <div
//           onClick={() => {
//             voiceQueueRef.current.push({
//               token: "System",
//               doctor: "hanzala bawany",
//             });
//             playNextVoice();
//           }}
//           className="cursor-pointer  flex  items-center gap-4 [@media(min-width:3200px)]:gap-8 [@media(min-width:4400px)]:gap-12"
//         >
//           <div className="bg-white p-2 rounded-full border border-cyan-200 shadow-lg shadow-cyan-950/30">
//             <img
//               src={logo}
//               alt="logo"
//               className="h-12 min-[2000px]:h-16 [@media(min-width:3000px)]:h-18  [@media(min-width:4400px)]:h-30 w-12 min-[2000px]:w-16 [@media(min-width:3000px)]:w-18 [@media(min-width:4400px)]:w-30 object-contain"
//             />
//           </div>

//           <div>
//             <h1 className="text-cyan-50 text-3xl font-bold min-[2000px]:text-5xl [@media(min-width:3200px)]:text-6xl  [@media(min-width:4400px)]:text-7xl  tracking-wide drop-shadow">
//               Memon Medical Complex
//             </h1>
//             <p className="text-cyan-100/75 text-sm italic min-[2000px]:text-2xl [@media(min-width:3000px)]:text-3xl [@media(min-width:4400px)]:text-5xl ">
//               “Serving with Excellence & Care”
//             </p>
//           </div>
//         </div>

//         {/* Right Side - Empty for balance (or you can add something here later) */}
//         <div className="bg-white rounded-xl px-6 py-1.5 shadow-xl shadow-cyan-950/25 border border-cyan-100 min-[2000px]:px-8 min-[2000px]:py-4 [@media(min-width:3200px)]:px-9 [@media(min-width:3200px)]:py-5 [@media(min-width:4400px)]:px-12 [@media(min-width:4400px)]:py-6">
//           <div className="flex items-center gap-2">
//             <span className="text-cyan-700 text-sm font-medium uppercase tracking-wide min-[2000px]:text-base [@media(min-width:3200px)]:text-lg">Screen</span>
//             <span className="text-slate-500 text-xl font-bold min-[2000px]:text-2xl [@media(min-width:3200px)]:text-3xl [@media(min-width:4400px)]:text-4xl">:</span>
//             <span className="text-slate-900 text-2xl font-black min-[2000px]:text-3xl [@media(min-width:3200px)]:text-4xl [@media(min-width:4400px)]:text-5xl">{screenNum}</span>
//           </div>
//         </div>

//       </div>

//       {/* Body */}
//       <div className="relative z-10 flex-13 flex mb-7 pt-6">

//         {patinetnDocotrsData?.length > 0 ? (
//           <div
//             // className={` ${patinetnDocotrsData.length <= 6 ? "w-[70%]" : "w-full"} h-full grid ${patinetnDocotrsData.length <= 6 ? "grid-cols-2" : "grid-cols-3"}  gap-8 4xl:gap-12 px-6`}
//             className={`w-full h-full grid grid-cols-3 ${patinetnDocotrsData.length <= 6 ? "grid-rows-2" : "grid-cols-3"} gap-6  4xl:gap-12 px-6`}
//           >
//             {patinetnDocotrsData?.map((doc, i) => (
//               <PatientCard
//                 key={`${doc?.CONSULTANTID}-${doc?.TOKENNO || i}`}
//                 doc={doc}
//                 isTwo={patinetnDocotrsData.length <= 2}
//                 highlight={
//                   highlightToken?.token === doc?.TOKENNO &&
//                   highlightToken?.doctorId == doc?.CONSULTANTID
//                 }
//               />
//             ))}
//           </div>
//         ) : isLoading ? (
//           <div className="flex justify-center w-full">
//             <ImageLoader />
//           </div>
//         ) : (
//           <EmptyPatientMessage />
//         )}

//         {
//           // patinetnDocotrsData.length <= 6 && <div className='w-[30%] h-full px-6 overflow-hidden '>
//           //   <VidioSlideShow />
//           // </div>
//         }
//       </div>

//       {/* Footer */}
//       <div className="text-cyan-100/80 bg-slate-950/60 border-t border-cyan-200/15 flex-1 flex justify-center items-center z-50 [@media(min-width:4200px)]:right-10 bottom-5 [@media(min-width:4200px)]:bottom-8 [@media(min-width:1520px)]:text-2xl [@media(min-width:2200px)]:text-3xl [@media(min-width:3200px)]:text-4xl  [@media(min-width:4200px)]:text-6xl">
//         <span
//           className="flex justify-center items-center gap-2 cursor-pointer"
//           onClick={logoutHandler}
//         >
//           {" "}
//           Powered by{" "}
//           <img
//             className="w-[50px] [@media(min-width:2200px)]:w-[70px] [@media(min-width:3200px)]:w-[80px]"
//             src={NubitLogo}
//             alt=""
//           />{" "}
//         </span>
//       </div>

//     </div>
//   );
// };

// export default Screen5Display;



// blue  theme updated 


// import { useState, useEffect, useCallback } from "react";
// import logo from "../assets/MMC logo.png";
// import NubitLogo from "../assets/nubit logo png.png";
// import hospitraxLogo from "../assets/productLogoBgRemove.png";
// import { useNavigate, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import PatientCard from "../components/screen5/PatientCard";
// import { useRef } from "react";
// import { base_URL } from "../utills/baseUrl";
// import axios from "axios";
// import { logoutUser } from "../reduxToolKit/authSlice";
// import { toast } from "react-toastify";
// import { updatePatinetnDocotrsData } from "../reduxToolKit/doctorSlice";
// import ImageLoader from "../utills/ImageLoader";
// import { socket } from "../socket/socket";
// import VidioSlideShow from "../components/screen5/VidioSlideShow";
// import EmptyPatientMessage from "../components/screen5/EmptyPatientMessage";
// import { useScreenSocket } from "../utills/useScreenSocket";

// const Screen5Display = () => {

//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const patinetnDocotrsData = useSelector((state) => state?.doctorSlice?.patinetnDocotrData,);
//   const [isLoading, setIsLoading] = useState(true);
//   const voiceQueueRef = useRef([]);
//   const isSpeakingRef = useRef(false);
//   const alertAudioRef = useRef(null);
//   const currentSpeakingTokenRef = useRef(null);
//   const [highlightToken, setHighlightToken] = useState(null);
//   const loginUserData = JSON.parse(localStorage.getItem("loginUserData"));
//   const { screenNum } = useParams();
//   const SCREEN_ID = parseInt(screenNum) + 1;

//   const logoutHandler = () => {
//     dispatch(logoutUser());
//     toast.success("Logout Scuccessful");
//     navigate("/login");
//   };

//   const getPatientnDoctorInfo = async () => {
//     setIsLoading(true);
//     try {
//       const res = await axios.get(`${base_URL}/api/opd/patients-by-screen?patientStatus=2&screenId=${SCREEN_ID}`);
//       dispatch(updatePatinetnDocotrsData(res?.data?.data));
//     } catch (err) {
//       console.log(err, "error in get Doctor info");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const playAlert = () => {
//     return new Promise((resolve) => {
//       if (!alertAudioRef.current) {
//         resolve();
//         return;
//       }
//       alertAudioRef.current.currentTime = 0;
//       alertAudioRef.current.play();
//       alertAudioRef.current.onended = () => {
//         resolve();
//       };
//     });
//   };

//   const cleanDoctorName = (name) => {
//     if (!name) return "";
//     return name
//       .replace(/\(.*?\)/g, "")
//       .replace(/\bDR\.?\b/gi, "")
//       .replace(/-/g, " ")
//       .replace(/\./g, " ")
//       .replace(/,/g, " ")
//       .replace(/\s+/g, " ")
//       .trim()
//       .toLowerCase();
//   };

//   const loadVoices = () => {
//     return new Promise((resolve) => {
//       let voices = speechSynthesis.getVoices();
//       if (voices.length) resolve(voices);
//       speechSynthesis.onvoiceschanged = () => {
//         resolve(speechSynthesis.getVoices());
//       };
//     });
//   };

//   const speakToken = async ({ token, doctor, room }) => {
//     const voices = await loadVoices();
//     const msg = new SpeechSynthesisUtterance(
//       token === "System"
//         ? "Voice service is ready."
//         : `Token ${token} , Aap doctor ${doctor} ke paas,  ${room ? `room number ${room} me` : ""} tashreef le jaen`,
//     );
//     msg.voice = voices.find((v) => v?.lang?.includes("hi")) || voices?.find((v) => v?.lang?.includes("en")) || voices[0];
//     msg.rate = 0.9;
//     msg.onend = () => {
//       isSpeakingRef.current = false;
//       currentSpeakingTokenRef.current = null;
//       setHighlightToken(null);
//       playNextVoice();
//     };
//     msg.onerror = (e) => {
//       console.log("Speech error:", e);
//       isSpeakingRef.current = false;
//       currentSpeakingTokenRef.current = null;
//       setHighlightToken(null);
//       playNextVoice();
//     };
//     window.speechSynthesis.resume();
//     window.speechSynthesis.speak(msg);
//   };

//   const playNextVoice = async () => {
//     if (isSpeakingRef.current || voiceQueueRef.current.length === 0) return;
//     isSpeakingRef.current = true;
//     const data = voiceQueueRef.current.shift();
//     try {
//       await playAlert();
//     } catch (err) {
//       console.log(err, "err in buzzer .............");
//     }
//     setHighlightToken(data);
//     speakToken(data);
//   };

//   const handleQueueUpdate = useCallback((payload) => {
//     console.log(`Screen id ${SCREEN_ID} received update:`, payload);
//     if (payload.screenId && payload.screenId !== SCREEN_ID) {
//       console.log(`Ignoring update for screen ${payload.screenId}, current screen is ${SCREEN_ID}`);
//       return;
//     }
//     getPatientnDoctorInfo();
//     if (!payload?.patientToken) return;
//     const cleanName = payload?.pronounceName ? cleanDoctorName(payload?.pronounceName) : cleanDoctorName(payload?.doctorName?.replace("DR", ""));
//     voiceQueueRef.current.push({ token: payload?.patientToken, doctor: cleanName, doctorId: payload?.doctorId, room: payload?.roomNo });
//     voiceQueueRef.current.push({ token: payload?.patientToken, doctor: cleanName, doctorId: payload?.doctorId, room: payload?.roomNo });
//     playNextVoice();
//   }, [SCREEN_ID]);

//   const { isConnected } = useScreenSocket(SCREEN_ID, handleQueueUpdate);

//   useEffect(() => {
//     getPatientnDoctorInfo();
//   }, [SCREEN_ID]);

//   useEffect(() => {
//     alertAudioRef.current = new Audio("/buffer3.mp3.wav");
//   }, []);

//   useEffect(() => {
//     let unlocked = false;
//     const unlock = () => {
//       if (unlocked) return;
//       const msg = new SpeechSynthesisUtterance(" ");
//       msg.volume = 0;
//       window.speechSynthesis.speak(msg);
//       unlocked = true;
//     };
//     setTimeout(unlock, 1000);
//     document.addEventListener("keydown", unlock);
//     document.addEventListener("click", unlock);
//     return () => {
//       document.removeEventListener("keydown", unlock);
//       document.removeEventListener("click", unlock);
//     };
//   }, []);

//   return (
//     <div className="relative h-screen w-full flex flex-col overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      
//       {/* Animated Background Pattern */}
//       <div className="absolute inset-0 opacity-20">
//         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#3b82f6_0%,_transparent_70%)]"></div>
//         <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%233b82f6" fill-opacity="0.1"%3E%3Cpath d="M20 20L20 0L20 20L0 20L20 20L40 20L20 20L20 40L20 20Z"/%3E%3C/g%3E%3C/svg%3E")', backgroundSize: '40px 40px' }}></div>
//       </div>

//       {/* Header */}
//       <div className="relative z-10 flex justify-between items-center px-8 4xl:px-16 py-4 4xl:py-6 bg-gradient-to-r from-slate-900/90 via-blue-900/80 to-slate-900/90 backdrop-blur-md border-b border-blue-500/30 shadow-2xl">
        
//         <div className="flex items-center gap-4">
//           <div className="relative">
//             <div className="absolute inset-0 bg-blue-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
//             <img src={hospitraxLogo} alt="Hospitrax Logo" className="relative w-16 4xl:w-24 drop-shadow-2xl" />
//           </div>
//         </div>

//         <div
//           onClick={() => {
//             voiceQueueRef.current.push({ token: "System", doctor: "hanzala bawany" });
//             playNextVoice();
//           }}
//           className="cursor-pointer flex items-center gap-4 group transition-transform hover:scale-105 duration-300"
//         >
//           <div className="relative">
//             <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-500"></div>
//             <img src={logo} alt="logo" className="relative h-14 w-14 rounded-full bg-white p-2 shadow-2xl" />
//           </div>
//           <div>
//             <h1 className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent text-3xl font-bold tracking-wide drop-shadow-lg">
//               Memon Medical Complex
//             </h1>
//             <p className="text-blue-200/80 text-sm italic font-light">
//               “Serving with Excellence & Care”
//             </p>
//           </div>
//         </div>

//         <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl px-6 py-2 shadow-2xl border border-blue-300/50">
//           <div className="flex items-center gap-2">
//             <span className="text-white text-sm font-medium uppercase tracking-wide">Screen</span>
//             <span className="text-white/80 text-xl font-bold">:</span>
//             <span className="text-white text-2xl font-black drop-shadow">{screenNum}</span>
//           </div>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="relative z-10 flex-1 overflow-y-auto py-6 px-4">
//         {patinetnDocotrsData?.length > 0 ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
//             {patinetnDocotrsData?.map((doc, i) => (
//               <PatientCard
//                 key={`${doc?.CONSULTANTID}-${doc?.TOKENNO || i}`}
//                 doc={doc}
//                 isTwo={patinetnDocotrsData.length <= 2}
//                 highlight={highlightToken?.token === doc?.TOKENNO && highlightToken?.doctorId == doc?.CONSULTANTID}
//               />
//             ))}
//           </div>
//         ) : isLoading ? (
//           <div className="flex justify-center items-center h-full">
//             <ImageLoader />
//           </div>
//         ) : (
//           <EmptyPatientMessage />
//         )}
//       </div>

//       {/* Footer */}
//       <div className="relative z-10 bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-slate-900/95 backdrop-blur-md border-t border-blue-500/30 py-3">
//         <div className="flex justify-center items-center gap-2">
//           <span className="text-blue-200/80 text-sm">Powered by</span>
//           <img className="h-8" src={NubitLogo} alt="Nubit" />
//           <button
//             onClick={logoutHandler}
//             className="ml-4 px-4 py-1 text-sm bg-red-500/20 hover:bg-red-500/40 text-red-300 rounded-lg transition-all duration-300 border border-red-500/30 hover:scale-105"
//           >
//             Logout
//           </button>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default Screen5Display;




