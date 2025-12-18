import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InfoLoader from "../../utills/InfoLoader";

const S3RightScrolling = () => {

    const doctorsData = useSelector(state => state?.doctorSlice?.doctorsData);
    const [scrollIndex, setScrollIndex] = useState(0);
    const [udateDoctorsData, setUpdateDoctorsData] = useState([]);
    const visibleDoctors = [...udateDoctorsData, ...udateDoctorsData];

    useEffect(() => {
        if (!doctorsData?.length) return;

        const newData = doctorsData?.map((doc) => {
            const schedule = doc.SCHEDULE_SUMMARY?.split(", ").map((item) => {
                const day = item.slice(0, 3);
                const timeRange = item.slice(4, -1);
                const [start, end] = timeRange.split("-");

                const start12 = moment(start, "HH:mm").format("hh:mm A");
                const end12 = moment(end, "HH:mm").format("hh:mm A");

                return {
                    day,
                    time: `${start12} - ${end12}`,
                };
            }) || [];

            return { ...doc, schedule };
        });

        setUpdateDoctorsData(newData);
    }, [doctorsData]);

    // useEffect(() => {
    //     const scrollTimer = setInterval(() => {
    //         setScrollIndex((prev) => (prev + 1) % udateDoctorsData?.length);
    //     }, 3500);
    //     return () => clearInterval(scrollTimer);
    // }, [udateDoctorsData.length]);

    useEffect(() => {
        if (!udateDoctorsData.length) return;

        const scrollTimer = setInterval(() => {
                setScrollIndex((prev) => (prev + 1) % udateDoctorsData?.length);
        }, 3500);

        return () => clearInterval(scrollTimer);
    }, [udateDoctorsData.length]);



    return (
        <div className="w-[35%] bg-gradient-to-b from-[#112b46] to-[#1f476d] flex flex-col p-6 relative border-l border-[#00b0ff]/20">

            {/* Heading */}
            <h2 className="
                text-center text-2xl font-bold text-white mb-4 
                bg-gradient-to-r from-[#00b0ff] to-[#ff4b5c] bg-clip-text 
                [@media(min-width:3200px)]:text-4xl
                [@media(min-width:4400px)]:text-7xl
            ">
                MMC Doctors Schedule
            </h2>

            <div className="
                w-20 h-[3px] mx-auto mb-5 rounded-full 
                bg-gradient-to-r from-[#00b0ff] to-[#ff4b5c]
                [@media(min-width:3200px)]:w-28
                [@media(min-width:4400px)]:w-full
            "></div>

            {/* Scrolling */}
            {
                !doctorsData?.length ?
                    <InfoLoader />
                    :
                    <div className="overflow-hidden flex-1 relative">
                        <div
                            className="transition-transform duration-1000 ease-in-out"
                            style={{ transform: `translateY(-${scrollIndex * 18}rem)` }}
                        >
                            {visibleDoctors?.map((doc, i) => (
                                <div
                                    key={doc?.DOCTOR_ID + "-" + i}
                                    className="
                                flex m-3 rounded-2xl bg-gradient-to-r 
                                from-[#1a3658]/90 to-[#204c79]/90 
                                border border-[#00b0ff]/20 shadow-xl overflow-hidden backdrop-blur-sm
                                [@media(min-width:3200px)]:m-5
                                [@media(min-width:4400px)]:m-7
                            "
                                >

                                    {/* IMAGE */}
                                    <div className="
                                w-[40%] relative p-5 pb-0 
                                2xl:p-6 
                                [@media(min-width:2000px)]:p-10 
                                [@media(min-width:3200px)]:p-14 
                                [@media(min-width:4400px)]:p-16
                            ">
                                        <img
                                            src={doc?.IMAGE}
                                            alt={doc?.DOCTOR_NAME}
                                            className="h-full w-full object-cover"
                                        />

                                        <div className="
                                    absolute bottom-0 left-0 right-0 capitalize 
                                    bg-black/60 text-center py-1.5 font-semibold tracking-[2px]
                                    text-xs 
                                    2xl:text-md 
                                    [@media(min-width:2000px)]:text-[17px]
                                    [@media(min-width:3200px)]:text-xl
                                    [@media(min-width:4400px)]:text-2xl
                                ">
                                            {doc?.FACULTY_NAME}
                                        </div>
                                    </div>

                                    {/* INFO */}
                                    <div className="w-[60%] p-3 flex flex-col justify-between">

                                        <div>
                                            <h3 className="
                                        capitalize font-bold text-white leading-tight
                                        text-lg 
                                        2xl:text-2xl 
                                        [@media(min-width:2000px)]:text-3xl
                                        [@media(min-width:3200px)]:text-4xl
                                        [@media(min-width:4400px)]:text-5xl
                                    ">
                                                {doc?.DOCTOR_NAME}
                                            </h3>

                                            <div className="mt-2 space-y-1">
                                                {doc?.schedule?.map((slot, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="
                                                    flex justify-between border-b border-white/10 pb-[2px]
                                                    text-sm 
                                                    2xl:text-lg 
                                                    [@media(min-width:2000px)]:text-xl
                                                    [@media(min-width:3200px)]:text-2xl
                                                    [@media(min-width:4400px)]:text-3xl
                                                "
                                                    >
                                                        <span className="text-[#00b0ff] font-semibold">{slot.day}</span>
                                                        <span className="text-white/90">{slot.time}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center mt-2">
                                            <div className="
                                        bg-gradient-to-r from-[#00b0ff] to-[#ff4b5c] 
                                        text-white font-bold px-3 py-1 rounded-full shadow-lg
                                        text-xs 
                                        [@media(min-width:3200px)]:text-base
                                        [@media(min-width:4400px)]:text-lg
                                    ">
                                                Now Serving: 0
                                            </div>

                                            <div className="
                                        w-2 h-2 bg-green-400 rounded-full animate-pulse
                                        [@media(min-width:3200px)]:w-3 [@media(min-width:3200px)]:h-3
                                        [@media(min-width:4400px)]:w-4 [@media(min-width:4400px)]:h-4
                                    "></div>
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
            }

        </div>
    );
};

export default S3RightScrolling;
