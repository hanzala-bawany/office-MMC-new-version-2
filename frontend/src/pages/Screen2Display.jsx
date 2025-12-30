import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import "./Screen2Display.css"
import ImageLoader from "../utills/ImageLoader";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../reduxToolKit/authSlice";
import { toast } from "react-toastify";
import NubitLogo from ".././assets/nubit logo png.png";
import logo from "../assets/MMC logo.png";



const dayMap = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday"
};


const Screen2Display = () => {

    const doctorsData = useSelector(state => state?.doctorSlice?.doctorsData);
    const [filterDoctorsData, setFilterDoctorsData] = useState([])
    const [index, setIndex] = useState(0);
    const [showDetails, setShowDetails] = useState(false);
    const doctor = filterDoctorsData[index];
    const [size, setSize] = useState({
        w: window.innerWidth,
        h: window.innerHeight
    });
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // console.log(index , "index . ..");
    // console.log(filterDoctorsData , "filterDoctorsData");
    // console.log(doctorsData , "doctorsData");
    // console.log(doctor , "doctor");


    const updatedTiming = useMemo(() => {
        if (!filterDoctorsData[index]?.SCHEDULE_SUMMARY) return "";

        return filterDoctorsData[index].SCHEDULE_SUMMARY
            .split(", ")
            .map((item) => {
                const timeRange = item.slice(3);
                const [start, end] = timeRange.split("-");

                const start12 = moment(start, "HH:mm").format("hh:mm A");
                const end12 = moment(end, "HH:mm").format("hh:mm A");

                return `${item.slice(0, 3)} (${start12} - ${end12})`;
            })
            .join(" | ");
    }, [filterDoctorsData, index]);
    // console.log(updatedTiming);

    const updatedDays = filterDoctorsData[index]?.SCHEDULE_SUMMARY
        ?.split(", ")
        .map((item) => {
            const shortDay = item.slice(0, 3);  // "Mon"
            return dayMap[shortDay] || shortDay;
        })
        .join(" - ");
    // console.log(updatedDays , "updatedDays");

    const logoutHandler = () => {
        dispatch(logoutUser())
        toast.success("Logout Scuccessful")
        navigate("/login")
    }


    useEffect(() => {
        setShowDetails(false);

        const detailTimer = setTimeout(() => {
            setShowDetails(true);
        }, 3500);

        const nextDoctorTimer = setTimeout(() => {
            setIndex((prev) => {
                if (filterDoctorsData.length <= 1) return 0;
                return (prev + 1) % filterDoctorsData.length;
            });
        }, 9000);


        return () => {
            clearTimeout(detailTimer);
            clearTimeout(nextDoctorTimer);
        };
    }, [index, filterDoctorsData]);

    const todayDoctors = useMemo(() => {

        const today = moment().format("ddd");
        return doctorsData?.filter((item) => {
            const days = item?.SCHEDULE_SUMMARY
                ?.split(", ")
                .map((it) => it.slice(0, 3));
            return days?.includes(today);
        });

    }, [doctorsData]);

    useEffect(() => {
        setFilterDoctorsData(todayDoctors);
    }, [todayDoctors]);


    useEffect(() => {
        const handler = () => {
            setSize({ w: window.innerWidth, h: window.innerHeight });
        };
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);


    return (
        // <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#e28585] to-black overflow-hidden relative text-white">
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-[#001f3f] via-[#004080] to-[#000814] overflow-hidden relative text-white">

            <div className="flex absolute top-4 [@media(min-width:4200px)]:top-8 left-4 [@media(min-width:4200px)]:left-8 items-center gap-4 [@media(min-width:3200px)]:gap-8 [@media(min-width:4400px)]:gap-12">
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

            <div onClick={logoutHandler} className="mt-1 flex items-center gap-2 cursor-pointer z-50 absolute right-5 [@media(min-width:4200px)]:right-10 bottom-5 [@media(min-width:4200px)]:bottom-8 text-white/60 [@media(min-width:1520px)]:text-xl [@media(min-width:2200px)]:text-3xl [@media(min-width:3200px)]:text-4xl  [@media(min-width:4200px)]:text-5xl">
                {/* Powered by <span className="text-[#00b0ff] font-bold">nubit</span> */}
                Powered by <img className="w-[50px] [@media(min-width:2200px)]:w-[70px] [@media(min-width:3200px)]:w-[80px]" src={NubitLogo} alt="" />
            </div>

            <AnimatePresence mode="wait">
                {
                    !doctor ?
                        <ImageLoader />
                        :
                        <motion.div
                            key={doctor?.DOCTOR_NAME}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                            className="absolute flex gap-x-6 items-center justify-center w-full h-full"
                        >

                            {/* top heading */}
                            <motion.div
                                className=" absolute top-10  text-4xl  [@media(min-width:2200px)]:text-5xl [@media(min-width:3200px)]:text-6xl [@media(min-width:4200px)]:text-8xl font-extrabold  text-transparent  bg-clip-text  bg-gradient-to-r from-[#00b4d8] via-[#90e0ef] to-white drop-shadow-[0_0_25px_#00b4d8] tracking-wide uppercase"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1.2, delay: 0.6 }}
                            >
                                Today's Doctors
                            </motion.div>


                            {/* Doctor Image Animation */}
                            {
                                doctor?.IMAGE ?
                                    <>
                                        <motion.img
                                            src={doctor?.IMAGE}
                                            alt={doctor?.DOCTOR_NAME}
                                            className="rounded-2xl p-2 motion-img shadow-2xl absolute w-[250px] [@media(min-width:2200px)]:w-[290px] [@media(min-width:3200px)_and_(min-height:1000px)]:w-[340px] [@media(min-width:3200px)_and_(min-height:1550px)]:w-[420px] [@media(min-width:4200px)]:w-[540px] 
                         h-[300px] [@media(min-width:2200px)]:h-[380px] [@media(min-width:3200px)_and_(min-height:1000px)]:h-[420px] [@media(min-width:3200px)_and_(min-height:1550px)]:h-[520px] [@media(min-width:4200px)]:h-[680px] object-cover border-2 border-[#00b4d8]"
                                            initial={{ y: size.h >= 1800 ? -300 : -150, scale: 0.9, x: 0 }}
                                            animate={{
                                                y: 0,
                                                scale: [2.5, 1.8],
                                                x: [-10, size.w >= 3200 ? -440 : -280],
                                            }}
                                            transition={{
                                                y: { duration: size.h >= 1800 ? 2 : 1 },
                                                scale: { duration: 3, times: [0, 1], ease: "easeInOut" },
                                                x: { delay: 2, duration: 1, ease: "easeInOut" },
                                            }}
                                        />
                                    </>
                                    :
                                    // Loading Animation
                                    <ImageLoader />

                            }

                            {/* Doctor Details */}
                            {showDetails && doctor && (
                                <motion.div
                                    initial={{ opacity: 0, x: 100 }}
                                    animate={{ opacity: 1, x: size.w >= 3200 ? -30 : -10 }}
                                    transition={{ duration: 1.2 }}
                                    className="absolute flex flex-col  [@media(min-width:3200px)]:gap-3  [@media(min-width:4200px)]:gap-5 left-[55%] top-1/2 transform -translate-y-1/2 w-[35%]  bg-[#0d1b2a]/70  p-6 [@media(min-width:300px)]:p-8 [@media(min-width:4200px)]:p-10 rounded-2xl shadow-lg backdrop-blur-md border border-[#0077b6]"
                                >
                                    <h2 className="text-5xl [@media(min-width:2200px)]:text-6xl [@media(min-width:3200px)]:text-7xl [@media(min-width:4200px)]:text-8xl  font-semibold text-[#00b4d8]">
                                        {doctor?.DOCTOR_NAME}
                                    </h2>
                                    <p className="text-2xl [@media(min-width:2200px)]:text-3xl [@media(min-width:4200px)]:text-4xl mt-1 text-gray-200 italic">
                                        {doctor?.FACULTY_NAME}
                                    </p>
                                    <p className="text-gray-300 mt-4 leading-relaxed text-lg [@media(min-width:2200px)]:text-2xl [@media(min-width:3200px)]:text-3xl [@media(min-width:4200px)]:text-4xl ">
                                        {doctor?.DESCRIPTION}
                                    </p>

                                    <div className="mt-6 space-y-2 text-[#caf0f8] text-lg [@media(min-width:2200px)]:text-[22px] [@media(min-width:3200px)]:text-[26px] [@media(min-width:4200px)]:text-[32px] ">
                                        <p>
                                            <strong className="text-[#90e0ef]">🏥 Room :</strong>{" "}
                                            {doctor?.ROOMNAME}
                                        </p>
                                        <p>
                                            <strong className="text-[#90e0ef]">⏰ Timing :</strong>{" "}
                                            {updatedTiming}
                                        </p>
                                        <p>
                                            <strong className="text-[#90e0ef]">📅 Days :</strong>{" "}
                                            {updatedDays}
                                        </p>
                                    </div>
                                </motion.div>
                            )}

                        </motion.div>
                }
            </AnimatePresence>

            {/* === Control Buttons === */}
            <div className="absolute bottom-10 flex gap-6">
                {
                    filterDoctorsData.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setIndex(i)}
                            className={`w-5 [@media(min-width:3200px)]:w-7 [@media(min-width:4200px)]:w-10 h-5 [@media(min-width:3200px)]:h-7 [@media(min-width:4200px)]:h-10 rounded-full border-2 transition-all ${index === i
                                ? "bg-[#00b4d8] border-[#00b4d8] scale-110"
                                : "border-gray-500 hover:bg-[#0077b6]"
                                }`}
                        />
                    ))
                }
            </div>
        </div>
    );
};

export default Screen2Display;
