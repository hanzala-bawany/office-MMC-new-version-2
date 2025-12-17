import moment from "moment";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InfoLoader from "../../utills/InfoLoader";
const TodayDoctorsList = () => {


  const [scrollIndex, setScrollIndex] = useState(0);
  const [transition, setTransition] = useState(true);
  const [itemHeight, setItemHeight] = useState(0);
  const doctorsData = useSelector(state => state?.doctorSlice?.doctorsData);
  const [udateDoctorsData, setUpdateDoctorsData] = useState([]);



  useEffect(() => {
    if (!doctorsData?.length) return;
    const newData = doctorsData.map((doc) => {
      const schedule = doc.SCHEDULE_SUMMARY?.split(", ").map((item) => {
        const day = item.slice(0, 3);
        const timeRange = item.slice(4, -1);
        const [start, end] = timeRange.split("-");
        return {
          day,
          time: `${moment(start, "HH:mm").format("hh:mm A")} - ${moment(end, "HH:mm").format("hh:mm A")}`
        };
      }) || [];
      return { ...doc, schedule };
    });
    setUpdateDoctorsData(newData);
  }, [doctorsData]);

  const len = udateDoctorsData.length;
  const visibleDoctors = Array.from({ length: 4 }, () => udateDoctorsData).flat();

  useEffect(() => {
    const scrollTimer = setInterval(() => {
      setScrollIndex((prev) => prev + 1);
    }, 3500);
    return () => clearInterval(scrollTimer);
  }, []);


  useEffect(() => {
    if (scrollIndex === len) {
      setTransition(false);
      setScrollIndex(0);
    } else {
      setTransition(true);
    }
  }, [scrollIndex, len]);


  useEffect(() => {
    const updateHeight = () => {
      const item = document.querySelector(".doctor-item");
      if (item) {
        setItemHeight(item.clientHeight);
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [udateDoctorsData]);


  return (
    <div className="border-2 border-white rounded-xl p-6 bg-[#252a7c]/40 flex flex-col flex-1 min-h-0">
      <h2 className="text-center text-2xl md:text-4xl xl:text-5xl font-bold text-white mb-2 border-b border-white pb-1">
        Today’s Doctor
      </h2>
      <div className="overflow-hidden relative flex-1 min-h-0">
        {
          !doctorsData?.length ?
            <InfoLoader />
            :
            <div
              className={`${transition ? "transition-transform duration-700 ease-in-out" : ""}`}
              style={{ transform: `translateY(-${scrollIndex * itemHeight}px)` }}
            >
              {visibleDoctors?.map((doc, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-[#1a1f5f]/70 px-3 py-2 rounded-md border border-[#6b75d1] mb-2 doctor-item"
                >
                  <div className="text-sm md:text-base xl:text-lg font-semibold w-[45%] truncate text-left">
                    {doc?.DOCTOR_NAME}
                  </div>
                  <div className="text-sm md:text-base xl:text-lg font-semibold text-[#5ff8ff] w-[45%] truncate text-right">
                    {doc?.FACULTY_NAME}
                  </div>
                  <div className="text-sm md:text-base xl:text-lg font-bold text-white w-[10%] text-right">
                    0/0
                  </div>
                </div>
              ))}
            </div>
        }

      </div>
    </div>
  );
};
export default TodayDoctorsList;