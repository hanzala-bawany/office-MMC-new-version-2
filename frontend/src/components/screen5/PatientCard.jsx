import { memo } from "react";
import { Tag, Badge } from "antd";
import { FaUserInjured, FaUserMd, FaHashtag, FaInfoCircle, FaDoorOpen } from "react-icons/fa";
import { motion } from "framer-motion";

const PatientCard = ({ doc, isTwo, highlight }) => {

  const isMessageCard = doc?.GENDER === "message";
  const messageText = isMessageCard ? doc?.PATIENTNAME : null;

  return (

    <div className={` relative bg-white rounded-3xl shadow-xl border border-cyan-200 overflow-hidden hover:shadow-2xl transition-all duration-300 patientCardFont ${isTwo && "h-[40%] p-5 py-12"} ${highlight ? "bg-yellow-50 animate-pulse ring-2 ring-yellow-400 shadow-md shadow-yellow-400/40 scale-100 border-yellow-400" : ""}`}>

      {/* Left Gradient Strip */}
      {
        isMessageCard ? <div className="absolute left-0 top-0 h-full w-2 bg-linear-to-b from-orange-400 to-red-500" />
          : <div className={`absolute left-0 top-0 h-full w-2 bg-linear-to-b ${highlight ? "from-yellow-800 to-yellow-500" : "from-cyan-500 to-blue-500"} `} />
      }

      <div className="p-6 4xl:p-12 flex justify-between items-center h-full">

        {
          isMessageCard ? (

            // MESSAGE CARD VIEW - When GENDER is "message"
            <>
              {/* left view */}
              <div className="space-y-6 3xl:space-y-10 4xl:space-y-14 5xl:space-y-16">

                {/* Doctor Name */}
                <div className="flex items-center gap-3 4xl:gap-5">
                  <FaUserMd className="text-orange-500 text-3xl 4xl:text-5xl 5xl:text-6xl" />
                  <p className="text-3xl xl:text-4xl 4xl:text-5xl 5xl:text-6xl font-semibold text-gray-500">
                    {doc?.NAME.split(" ")[0].length > 13 ? `${doc?.NAME?.split(" ")[0]?.slice(0, 14)} ... ${doc?.NAME.split(" ").slice(1).join(" ")}` : doc?.NAME}
                  </p>
                </div>

                <div className="flex gap-10">
                  <div className="inline-flex items-center justify-center px-4 py-1 bg-orange-50 border border-orange-300 rounded-full text-orange-700 font-extrabold text-md 2xl:text-lg 4xl:text-xl tracking-wide shadow-sm">
                    {messageText?.length > 30 ? `${messageText.slice(0, 30)}...` : messageText || "No message available"}
                  </div>
                </div>

              </div>

              {/* RIGHT SIDE - Message Badge instead of Token */}
              <div className="flex flex-col items-center justify-center gap-4 4xl:gap-8">

                <Badge.Ribbon
                  text="ANNOUNCEMENT"
                  color="orange"
                  className="text-lg 4xl:text-xl font-semibold"
                >
                  <div className="relative bg-linear-to-br from-orange-500 to-red-600 text-white rounded-full px-6 py-6 4xl:px-8 4xl:py-10 flex items-center justify-center shadow-2xl border-4 border-white min-w-[140px] 4xl:min-w-[180px]">
                    <span className="text-2xl 4xl:text-3xl font-black text-center">
                      INFO
                    </span>
                  </div>
                </Badge.Ribbon>

                {/* Status changed to MESSAGE */}
                {/* <div className="inline-flex items-center justify-center px-3 py-1 text-sm 2xl:text-md 4xl:text-lg 5xl:text-xl font-extrabold tracking-widest text-[#ad8b00] bg-[#fff7d6] border border-[#ffe58f] rounded-full shadow-md animate-pulse">
                  NOT SERVING
                </div> */}

                {doc?.ROOM_NO &&
                  <div className="inline-flex items-center gap-2 px-4 py-1 bg-purple-50 border border-purple-300 rounded-full w-fit">

                    <span className=" text-md 2xl:text-lg 4xl:text-xl font-bold text-purple-700 tracking-wide">ROOM</span>
                    <span className=" text-purple-900 font-extrabold text-md 2xl:text-lg 4xl:text-xl">{doc?.ROOM_NO}</span>

                  </div>
                }

              </div>

            </>
          ) : (
            // NORMAL CARD VIEW - Original design
            <>
              {/* LEFT INFO */}
              <div className="space-y-6 3xl:space-y-10 4xl:space-y-14 5xl:space-y-16">

                {/* Doctor Name */}
                <div className="flex items-center gap-3 4xl:gap-5">
                  <FaUserMd className={`${highlight ? "text-yellow-500" : "text-blue-500"} text-3xl 4xl:text-5xl 5xl:text-6xl`} />
                  <p className=" text-3xl xl:text-4xl 4xl:text-5xl 5xl:text-6xl font-semibold text-gray-500">
                    {doc?.NAME.split(" ")[0].length > 13 ? `${doc?.NAME?.split(" ")[0]?.slice(0, 14)} ... ${doc?.NAME.split(" ").slice(1).join(" ")}` : doc?.NAME}
                  </p>
                </div>

                {/* Faculty/Department */}
                <div className="flex gap-10">
                  <div className={`tracking-wide inline-flex items-center justify-center px-4 py-1 border  rounded-full  ${highlight ? " bg-[#fff9e6]  border-[#a37615]  text-yellow-700" : "bg-[#e6fffb]  border-[#87e8de]  text-cyan-700"}    font-extrabold  text-sm 2xl:text-md 4xl:text-lg tracking-wide shadow-sm`}>
                    {doc?.FACULTY?.length > 25 ? `${doc?.FACULTY.slice(0, 30)} ...` : doc?.FACULTY || "GENERAL"}
                  </div>
                </div>

              </div>

              {/* RIGHT TOKEN */}
              <div className="flex flex-col items-center justify-center gap-4 4xl:gap-8 5xl:gap-12">

                {/* Token Circle */}
                {
                  doc?.TOKENNO ? <Badge.Ribbon
                    text="TOKEN"
                    color={highlight ? "#854d0e" : "blue"}
                    className="text-lg 4xl:text-xl font-semibold"
                  >
                    <div className={`relative bg-linear-to-br  ${highlight ? "from-yellow-800 to-yellow-500" : "from-cyan-500 to-blue-600"}  text-white rounded-full px-4 py-6 4xl:px-6 4xl:py-8 flex items-center justify-center shadow-2xl border-4 border-white`}>
                      <FaHashtag className="absolute top-3 left-3 opacity-30 text-xl" />
                      <span className="text-5xl 4xl:text-6xl font-black">
                        {doc?.TOKENNO}
                      </span>
                    </div>
                  </Badge.Ribbon> :

                    // <div className="flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-2xl px-6 py-8 4xl:px-10 4xl:py-12 5xl:px-14 5xl:py-16 shadow-inner w-[90%] max-w-xs 4xl:max-w-sm">
                    <div className="flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-2xl px-4 py-3 4xl:px-6 4xl:py-3 5xl:px-8 5xl:py-3 shadow-inner w-[80%] max-w-xs 4xl:max-w-sm">

                      <p className="text-gray-500 text-sm 4xl:text-lg font-medium text-center">
                        No Patient Yet
                      </p>

                    </div>
                }

                {
                  doc?.ROOM_NO ?
                    <div className="inline-flex items-center gap-2 px-4 py-1 bg-purple-50 border border-purple-300 rounded-full w-fit">

                      <span className=" text-md 2xl:text-lg 4xl:text-xl font-bold text-purple-700 tracking-wide">ROOM</span>
                      <span className=" text-purple-900 font-extrabold text-md 2xl:text-lg 4xl:text-xl">{doc?.ROOM_NO}</span>

                    </div>
                    :
                    // <div className="flex flex-col items-center justify-center bg-gray-50 border border-dashed border-gray-300 rounded-2xl px-4 py-1 shadow-inner w-fit ">
                    <div className="inline-flex items-center gap-2 px-4 py-1 bg-gray-50 border border-dashed border-gray-300 rounded-2xl w-fit">

                      <p className="text-gray-500 text-sm 4xl:text-lg font-medium text-center">
                        No Room
                      </p>

                    </div>
                }

              </div>
            </>
          )
        }

      </div>

    </div >

  );
};

export default memo(PatientCard);
