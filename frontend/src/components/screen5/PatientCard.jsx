import { memo } from "react";
import { Tag, Badge } from "antd";
import { FaUserInjured, FaUserMd, FaHashtag } from "react-icons/fa";
import { motion } from "framer-motion";

const PatientCard = ({ doc, isTwo, highlight }) => {



  return (

    // <motion.div
    //   initial={{ y: 0 }}
    //   animate={{ y: [0, -50, 0] }}   // 👈 up-down movement
    //   transition={{
    //     duration: 3,
    //     repeat: Infinity,
    //     ease: "easeInOut"
    //   }}
    // // className={` relative bg-white rounded-3xl shadow-xl border border-cyan-200 overflow-hidden hover:shadow-2xl transition-all duration-300 patientCardFont  ${isTwo && "h-[40%] p-5 py-12"}   ${highlight ? "bg-yellow-50 animate-pulse ring-2 ring-yellow-400 shadow-md shadow-yellow-400/40 scale-100 border-yellow-400" : ""}`}
    // >


      <div className={` relative bg-white rounded-3xl shadow-xl border border-cyan-200 overflow-hidden hover:shadow-2xl transition-all duration-300 patientCardFont   ${isTwo && "h-[40%] p-5 py-12"}  ${highlight ? "bg-yellow-50 animate-pulse  ring-2 ring-yellow-400 shadow-md shadow-yellow-400/40 scale-100 border-yellow-400" : ""}`}>

        {/* Left Gradient Strip */}
        <div className="absolute left-0 top-0 h-full w-2  bg-linear-to-b from-cyan-500 to-blue-500" />

        <div className="p-6 4xl:p-12 flex justify-between items-center h-full">

          {/* LEFT INFO */}
          <div className="space-y-6 3xl:space-y-10 4xl:space-y-14 5xl:space-y-16">

            {/* Patient Name */}
            {/* <div className="flex items-center gap-3 4xl:gap-5 ">
            <FaUserInjured className="text-cyan-600 text-2xl 4xl:text-4xl 5xl:text-5xl" />
            <h2 className="text-2xl xl:text-3xl 4xl:text-4xl  5xl:text-5xl 
              font-extrabold text-gray-700 capitalize">
              {doc?.PATIENTNAME}
            </h2>
          </div> */}

            {/* Doctor */}
            <div className="flex items-center gap-3 4xl:gap-5">
              <FaUserMd className="text-blue-500 text-3xl 4xl:text-5xl 5xl:text-6xl" />
              <p className="text-3xl xl:text-4xl 4xl:text-5xl  5xl:text-6xl
              font-semibold text-gray-500">
                {doc?.NAME}
              </p>
            </div>

            {/* room and consultant */}
            <div className="flex gap-10">

              {/* Physician */}
              <div className=" inline-flex items-center justify-center px-4 py-1  bg-[#e6fffb] border border-[#87e8de] rounded-full  text-cyan-700 font-extrabold text-md 2xl:text-lg 4xl:text-xl tracking-wide shadow-sm">
                {doc?.FACULTY?.length > 25 ? `${doc?.FACULTY.slice(0, 30)} ...` : doc?.FACULTY || "General"}
              </div>

            </div>


          </div>

          {/* RIGHT TOKEN */}
          <div className="flex flex-col items-center justify-center  gap-4 4xl:gap-8 5xl:gap-12">

            {/* Token Circle */}
            <Badge.Ribbon
              text="TOKEN"
              color="blue"
              className="text-lg 4xl:text-xl font-semibold"
            >
              <div
                className="relative bg-linear-to-br from-cyan-500 to-blue-600
              text-white rounded-full px-4 py-6
               4xl:px-6 4xl:py-8  
              flex items-center justify-center
              shadow-2xl border-4 border-white "
              >
                <FaHashtag className="absolute top-3 left-3 opacity-30 text-xl" />
                <span className="text-5xl 4xl:text-6xl font-black">
                  {doc?.TOKENNO}
                </span>
              </div>
            </Badge.Ribbon>

            {/* Status */}
            <div
              className="inline-flex items-center justify-center px-3 py-1 text-sm 2xl:text-md 4xl:text-lg  5xl:text-xl font-extrabold tracking-widest text-[#ad8b00] bg-[#fff7d6] border border-[#ffe58f] rounded-full shadow-md animate-pulse">
              NOW SERVING
            </div>

          </div>

        </div>

      </div>

    // </motion.div>

  );
};

export default memo(PatientCard);

