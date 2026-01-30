import { memo } from "react";
import { Tag, Badge } from "antd";
import { FaUserInjured, FaUserMd, FaHashtag } from "react-icons/fa";

const PatientCard = ({ doc }) => {



  return (
    <div
      className="relative bg-white rounded-3xl shadow-xl
      border border-cyan-200 overflow-hidden
      hover:shadow-2xl transition-all duration-300"
    >
      {/* Left Gradient Strip */}
      <div className="absolute left-0 top-0 h-full w-2 
        bg-gradient-to-b from-cyan-500 to-blue-500" />

      <div className="p-6 4xl:p-8 flex justify-between items-center h-full">

        {/* LEFT INFO */}
        <div className="space-y-5">

          {/* Patient Name */}
          <div className="flex items-center gap-3">
            <FaUserInjured className="text-cyan-600 text-2xl 4xl:text-4xl" />
            <h2 className="text-2xl xl:text-3xl 4xl:text-4xl 
              font-extrabold text-gray-800">
              {doc?.PATIENTNAME}
            </h2>
          </div>

          {/* Doctor */}
          <div className="flex items-center gap-3">
            <FaUserMd className="text-blue-500 text-2xl 4xl:text-4xl" />
            <p className="text-xl xl:text-2xl 4xl:text-3xl 
              font-semibold text-gray-700">
              Dr. {doc?.NAME}
            </p>
          </div>

          {/* room and consultant */}
          <div className="flex gap-10">

            {/* Physician */}
            <div
              className="
      inline-flex items-center justify-center
      px-4
      py-1 
      bg-[#e6fffb]
      border border-[#87e8de]
      rounded-full
      text-cyan-700
      font-extrabold
      text-sm 2xl:text-md
      tracking-wide
      shadow-sm
    "
            >
             {doc?.FACULTY || "General"} 
            </div>

            {/* Room / Counter */}
            <div
              className="
         inline-flex items-center justify-center
      px-4
      py-1 
      bg-[#e6fffb]
      border border-[#87e8de]
      rounded-full
      text-cyan-700
      font-extrabold
      text-sm 2xl:text-md
      tracking-wide
      shadow-sm
    "
            >
              A - 12
            </div>

          </div>


        </div>

        {/* RIGHT TOKEN */}
        <div className="flex flex-col items-center justify-center  gap-4">

          {/* Token Circle */}
          <Badge.Ribbon
            text="TOKEN"
            color="blue"
            className="text-lg 4xl:text-xl font-semibold"
          >
            <div
              className="relative bg-gradient-to-br from-cyan-500 to-blue-600
              text-white rounded-full w-24 h-24 
              4xl:w-32 4xl:h-32
              flex items-center justify-center
              shadow-2xl border-4 border-white"
            >
              <FaHashtag className="absolute top-3 left-3 opacity-30 text-xl" />
              <span className="text-4xl 4xl:text-5xl font-black">
                {doc?.TOKENNO}
              </span>
            </div>
          </Badge.Ribbon>

          {/* Status */}
          <div
            className="
    inline-flex items-center justify-center
    px-3 py-1
    text-sm 2xl:text-md
    font-extrabold tracking-widest
    text-[#ad8b00]
    bg-[#fff7d6]
    border border-[#ffe58f]
    rounded-full
    shadow-md
    animate-pulse
  "
          >
            NOW SERVING
          </div>

        </div>

      </div>
    </div>
  );
};

export default memo(PatientCard);

