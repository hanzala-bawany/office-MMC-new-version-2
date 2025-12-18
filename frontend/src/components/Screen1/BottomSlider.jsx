import moment from "moment";
import { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DoctorCardSkeleton from "../../utills/CardSkaleton";




const BottomSlider = () => {
    const doctorsData = useSelector((state) => state?.doctorSlice?.doctorsData);
    const [UpdateDoctorsData, setUpdateDoctorsData] = useState([]);
    const [slideIndex, setSlideIndex] = useState(0);

    useEffect(() => {
        if (!doctorsData?.length) return;

        const processed = doctorsData.map((doc) => {
            const schedule = (doc.SCHEDULE_SUMMARY || "")
                .split(", ")
                .map((item) => {
                    const day = item.slice(0, 3);
                    const timeRange = item.slice(4, -1);
                    const [start, end] = timeRange.split("-");
                    const start12 = moment(start, "HH:mm").format("hh:mm A");
                    const end12 = end === "00:00" ? "12:00 AM" : moment(end, "HH:mm").format("hh:mm A");
                    return { day, time: `${start12} - ${end12}` };
                });
            return { ...doc, schedule };
        });

        setUpdateDoctorsData(processed);
    }, [doctorsData]);

    // Auto slide every 3.5 seconds
    useEffect(() => {
        if (!UpdateDoctorsData.length) return;

        const timer = setInterval(() => {
            setSlideIndex((prev) => (prev + 1) % UpdateDoctorsData.length);
        }, 3500);

        return () => clearInterval(timer);
    }, [UpdateDoctorsData.length]);

    // Duplicate array for seamless looping visual
    const visibleCards = [...UpdateDoctorsData, ...UpdateDoctorsData];

    // Card width + gap (same as your first version)
    const CARD_WIDTH = 340; // 320px card + ~20px gap



    return (
        <>

            <div className="relative  w-full h-[45vh] 
                   [@media(min-width:2200px)_and_(min-height:1200px)]:h-[25vh] 
                    [@media(min-width:3200px)_and_(min-height:2000px)]:h-[21vh] 
                   overflow-hidden bg-[#e0f2ff] border-t border-blue-200 
                     py-6 px-5 [@media(min-width:2200px)_and_(min-height:1200px)]:py-12 
                     mb-[45px]">

                {
                    UpdateDoctorsData.length === 0 ?
                                   
                        <DoctorCardSkeleton />
                        :
                        //  Sliding card Container 
                        <div
                            className="flex gap-4 h-full transition-transform duration-1000 ease-in-out [@media(min-width:2200px)_and_(min-height:1200px)]:gap-6"
                            style={{
                                transform: `translateX(-${slideIndex * CARD_WIDTH}px)`,
                            }}
                        >
                            {visibleCards.map((doc, i) => (
                                <div
                                    key={`${doc.DOCTOR_ID}-${i}`}
                                    className="bg-white/90 backdrop-blur-sm border h-full border-blue-100 rounded-2xl 
                            p-4 [@media(min-width:3200px)_and_(min-height:2000px)]:p-8 
                            shadow-md flex items-center 
                            gap-4 [@media(min-width:3000px)_and_(min-height:2000px)]:gap-10 
                            [@media(min-width:4200px)_and_(min-height:2600px)]:gap-16 
                            hover:shadow-xl hover:scale-105 transition-all duration-300 
                            min-w-[320px] flex-shrink-0"
                                >
                                    {/* Doctor Image */}
                                    <img
                                        src={doc.IMAGE || "/placeholder-doctor.jpg"}
                                        alt={doc.DOCTOR_NAME}
                                        className="p-1 w-[70px] h-[70px] object-fill
                                [@media(min-width:3200px)]:w-[90px] [@media(min-width:3200px)]:h-[90px]
                                [@media(min-width:3200px)_and_(min-height:2000px)]:w-[100px] [@media(min-width:3200px)_and_(min-height:2000px)]:h-[100px]
                                [@media(min-width:4200px)_and_(min-height:2600px)]:w-[120px] [@media(min-width:4200px)_and_(min-height:2600px)]:h-[120px]
                                rounded-full border-4 border-blue-300 shadow-sm  flex-shrink-0"
                                    />

                                    {/* Doctor Info */}
                                    <div className="flex flex-col 
                            [@media(min-width:2200px)_and_(min-height:1200px)]:gap-3 
                            [@media(min-width:3200px)_and_(min-height:2000px)]:gap-4 
                            [@media(min-width:4200px)_and_(min-height:2600px)]:gap-5">

                                        <h3 className="font-bold text-[18px] 
                                [@media(min-width:3200px)]:text-[24px] 
                                [@media(min-width:3200px)_and_(min-height:2000px)]:text-[32px] 
                                capitalize text-blue-800 line-clamp-1">
                                            {doc?.DOCTOR_NAME}
                                        </h3>

                                        <p className="text-[16px] 
                                [@media(min-width:3200px)]:text-[20px] 
                                [@media(min-width:3200px)_and_(min-height:2000px)]:text-[26px] 
                                text-blue-500 font-medium mb-2 line-clamp-1">
                                            {doc?.FACULTY_NAME}
                                        </p>

                                        <div className="text-sm 
                                [@media(min-width:3200px)]:text-xl 
                                [@media(min-width:3200px)_and_(min-height:2000px)]:text-3xl 
                                text-gray-600 grid grid-cols-2 gap-x-6 gap-y-1">
                                            {doc.schedule?.map((s, idx) => (
                                                <p key={idx} className="truncate">
                                                    <strong>{s?.day || "No Day"}</strong> • {s?.time || "No Time"}
                                                </p>
                                            ))}
                                        </div>

                                        <p className="text-[16px] 
                                [@media(min-width:3200px)]:text-xl 
                                [@media(min-width:3200px)_and_(min-height:2000px)]:text-3xl 
                                text-gray-700 mt-1">
                                            <strong className="text-blue-700">Room:</strong> {doc?.ROOMNAME}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                }
            </div>
        </>
    );
};

export default memo(BottomSlider);