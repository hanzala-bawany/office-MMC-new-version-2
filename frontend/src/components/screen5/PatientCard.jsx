import { memo } from "react";
import { Tag, Badge } from "antd";
import { FaUserInjured, FaUserMd, FaHashtag, FaInfoCircle, FaDoorOpen } from "react-icons/fa";
import { motion } from "framer-motion";

const PatientCard = ({ doc, isTwo, highlight }) => {

  const isMessageCard = doc?.GENDER === "message";
  const messageText = isMessageCard ? doc?.PATIENTNAME : null;
  // console.log(doc , "doc......")0;


  return (

    <div className={` relative bg-white rounded-3xl shadow-xl border border-cyan-200 overflow-hidden hover:shadow-2xl transition-all duration-300 patientCardFont  ${highlight ? "bg-yellow-50 animate-pulse ring-2 ring-yellow-400 shadow-md shadow-yellow-400/40 scale-100 border-yellow-400" : ""}`}>

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
                    {doc?.FACULTY_NAME?.length > 25 ? `${doc?.FACULTY_NAME.slice(0, 30)} ...` : doc?.FACULTY_NAME || "No Faculty Yet"}
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






// import { memo } from "react";
// import { Tag, Badge } from "antd";
// import { FaUserInjured, FaUserMd, FaHashtag, FaInfoCircle, FaDoorOpen } from "react-icons/fa";
// import { motion } from "framer-motion";

// const PatientCard = ({ doc, isTwo, highlight }) => {

//   const isMessageCard = doc?.GENDER === "message";
//   const messageText = isMessageCard ? doc?.PATIENTNAME : null;

//   return (
//     <div className={`relative rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.06)] border overflow-hidden transition-all duration-300 patientCardFont
//       ${highlight 
//         ? "bg-gradient-to-br from-amber-50 via-orange-50 to-white border-amber-400 shadow-[0_20px_50px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/20 scale-100" 
//         : isMessageCard
//         ? "bg-gradient-to-br from-slate-50 via-white to-orange-50/40 border-orange-200/80 hover:border-orange-400/60"
//         : "bg-gradient-to-br from-white via-cyan-50/30 to-blue-50/40 border-slate-200/70 hover:border-blue-300 shadow-[0_12px_35px_rgba(33,150,243,0.05)]"
//       }`}
//     >
//       {/* ================= STATIC BACKGROUND BUBBLES & SHAPES ================= */}
//       {/* Top Right Large Medical Bubble */}
//       <div className={`absolute -right-12 -top-12 w-40 h-40 rounded-full opacity-40 blur-xl pointer-events-none
//         ${highlight ? "bg-amber-200/50" : isMessageCard ? "bg-orange-200/40" : "bg-cyan-200/50"}`} 
//       />
      
//       {/* Center Small Floating-Style Static Bubble */}
//       <div className={`absolute left-[40%] top-[20%] w-12 h-12 rounded-full opacity-20 border pointer-events-none
//         ${highlight ? "bg-amber-300/30 border-amber-400" : isMessageCard ? "bg-orange-300/30 border-orange-400" : "bg-blue-300/20 border-blue-400"}`} 
//       />

//       {/* Bottom Left Medium Bubble */}
//       <div className={`absolute left-10 -bottom-8 w-24 h-24 rounded-full opacity-25 blur-lg pointer-events-none
//         ${highlight ? "bg-orange-200/40" : isMessageCard ? "bg-red-100/30" : "bg-blue-200/40"}`} 
//       />

//       {/* Right Token Area Sub-Bubble Backdrop */}
//       <div className={`absolute right-6 bottom-4 w-32 h-12 rounded-full opacity-30 pointer-events-none blur-md
//         ${highlight ? "bg-yellow-200/40" : "bg-slate-100"}`} 
//       />
//       {/* ===================================================================== */}

//       {/* Left Gradient Strip */}
//       {
//         isMessageCard ? <div className="absolute left-0 top-0 h-full w-2 bg-linear-to-b from-orange-400 to-red-500 z-10" />
//           : <div className={`absolute left-0 top-0 h-full w-2 bg-linear-to-b z-10 ${highlight ? "from-yellow-600 to-yellow-500" : "from-cyan-500 to-blue-500"} `} />
//       }

//       {/* Main Content Area (Z-index added to stay above background bubbles) */}
//       <div className="p-6 4xl:p-12 flex justify-between items-center h-full relative z-10">

//         {
//           isMessageCard ? (

//             // MESSAGE CARD VIEW - When GENDER is "message"
//             <>
//               {/* left view */}
//               <div className="space-y-6 3xl:space-y-10 4xl:space-y-14 5xl:space-y-16">

//                 {/* Doctor Name */}
//                 <div className="flex items-center gap-3 4xl:gap-5">
//                   <FaUserMd className="text-orange-500 text-3xl 4xl:text-5xl 5xl:text-6xl" />
//                   <p className="text-3xl xl:text-4xl 4xl:text-5xl 5xl:text-6xl font-semibold text-slate-700">
//                     {doc?.NAME.split(" ")[0].length > 13 ? `${doc?.NAME?.split(" ")[0]?.slice(0, 14)} ... ${doc?.NAME.split(" ").slice(1).join(" ")}` : doc?.NAME}
//                   </p>
//                 </div>

//                 <div className="flex gap-10">
//                   <div className="inline-flex items-center justify-center px-4 py-1 bg-orange-500/10 border border-orange-300 rounded-full text-orange-700 font-extrabold text-md 2xl:text-lg 4xl:text-xl tracking-wide shadow-xs">
//                     {messageText?.length > 30 ? `${messageText.slice(0, 30)}...` : messageText || "No message available"}
//                   </div>
//                 </div>

//               </div>

//               {/* RIGHT SIDE - Message Badge instead of Token */}
//               <div className="flex flex-col items-center justify-center gap-4 4xl:gap-8">

//                 <Badge.Ribbon
//                   text="ANNOUNCEMENT"
//                   color="orange"
//                   className="text-lg 4xl:text-xl font-semibold"
//                 >
//                   <div className="relative bg-linear-to-br from-orange-500 to-red-600 text-white rounded-full px-6 py-6 4xl:px-8 4xl:py-10 flex items-center justify-center shadow-2xl border-4 border-white min-w-[140px] 4xl:min-w-[180px]">
//                     <span className="text-2xl 4xl:text-3xl font-black text-center">
//                       INFO
//                     </span>
//                   </div>
//                 </Badge.Ribbon>

//                 {doc?.ROOM_NO &&
//                   <div className="inline-flex items-center gap-2 px-4 py-1 bg-purple-50 border border-purple-300 rounded-full w-fit">
//                     <span className=" text-md 2xl:text-lg 4xl:text-xl font-bold text-purple-700 tracking-wide">ROOM</span>
//                     <span className=" text-purple-900 font-extrabold text-md 2xl:text-lg 4xl:text-xl">{doc?.ROOM_NO}</span>
//                   </div>
//                 }

//               </div>

//             </>
//           ) : (
//             // NORMAL CARD VIEW - Original design
//             <>
//               {/* LEFT INFO */}
//               <div className="space-y-6 3xl:space-y-10 4xl:space-y-14 5xl:space-y-16">

//                 {/* Doctor Name */}
//                 <div className="flex items-center gap-3 4xl:gap-5">
//                   <FaUserMd className={`${highlight ? "text-yellow-600" : "text-blue-500"} text-3xl 4xl:text-5xl 5xl:text-6xl`} />
//                   <p className={`text-3xl xl:text-4xl 4xl:text-5xl 5xl:text-6xl font-semibold ${highlight ? "text-amber-900" : "text-slate-700"}`}>
//                     {doc?.NAME.split(" ")[0].length > 13 ? `${doc?.NAME?.split(" ")[0]?.slice(0, 14)} ... ${doc?.NAME.split(" ").slice(1).join(" ")}` : doc?.NAME}
//                   </p>
//                 </div>

//                 {/* Faculty/Department */}
//                 <div className="flex gap-10">
//                   <div className={`tracking-wide inline-flex items-center justify-center px-4 py-1 border rounded-full ${highlight ? " bg-amber-100/60 border-amber-300 text-yellow-800" : "bg-cyan-50/60 border-cyan-200 text-cyan-700"} font-extrabold text-sm 2xl:text-md 4xl:text-lg tracking-wide shadow-xs`}>
//                     {doc?.FACULTY_NAME?.length > 25 ? `${doc?.FACULTY_NAME.slice(0, 30)} ...` : doc?.FACULTY_NAME || "No Faculty Yet"}
//                   </div>
//                 </div>

//               </div>

//               {/* RIGHT TOKEN */}
//               <div className="flex flex-col items-center justify-center gap-4 4xl:gap-8 5xl:gap-12">

//                 {/* Token Circle */}
//                 {
//                   doc?.TOKENNO ? <Badge.Ribbon
//                     text="TOKEN"
//                     color={highlight ? "#854d0e" : "blue"}
//                     className="text-lg 4xl:text-xl font-semibold"
//                   >
//                     <div className={`relative bg-linear-to-br ${highlight ? "from-yellow-600 to-amber-500 shadow-md shadow-amber-500/20" : "from-cyan-500 to-blue-600"} text-white rounded-full px-4 py-6 4xl:px-6 4xl:py-8 flex items-center justify-center shadow-xl border-4 border-white`}>
//                       <FaHashtag className="absolute top-3 left-3 opacity-30 text-xl" />
//                       <span className="text-5xl 4xl:text-6xl font-black">
//                         {doc?.TOKENNO}
//                       </span>
//                     </div>
//                   </Badge.Ribbon> :

//                     <div className="flex flex-col items-center justify-center bg-slate-50/50 border border-dashed border-slate-300 rounded-2xl px-4 py-3 4xl:px-6 4xl:py-3 5xl:px-8 5xl:py-3 shadow-inner w-[80%] max-w-xs 4xl:max-w-sm">
//                       <p className="text-slate-400 text-sm 4xl:text-lg font-medium text-center">
//                         No Patient Yet
//                       </p>
//                     </div>
//                 }

//                 {
//                   doc?.ROOM_NO ?
//                     <div className="inline-flex items-center gap-2 px-4 py-1 bg-purple-50/80 border border-purple-200 rounded-full w-fit">
//                       <span className=" text-md 2xl:text-lg 4xl:text-xl font-bold text-purple-700 tracking-wide">ROOM</span>
//                       <span className=" text-purple-900 font-extrabold text-md 2xl:text-lg 4xl:text-xl">{doc?.ROOM_NO}</span>
//                     </div>
//                     :
//                     <div className="inline-flex items-center gap-2 px-4 py-1 bg-slate-50 border border-dashed border-slate-300 rounded-2xl w-fit">
//                       <p className="text-slate-400 text-sm 4xl:text-lg font-medium text-center">
//                         No Room
//                       </p>
//                     </div>
//                 }

//               </div>
//             </>
//           )
//         }

//       </div>

//     </div>

//   );
// };

// export default memo(PatientCard);