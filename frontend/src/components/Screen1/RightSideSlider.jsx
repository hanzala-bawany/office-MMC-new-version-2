import { useMemo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import InfoLoader from "../../utills/InfoLoader";


const RightSideSlider = () => {
  const doctorsData = useSelector(
    (state) => state?.doctorSlice?.doctorsData
  );

  // Duplicate list for smooth infinite scroll
  const normalizedList = useMemo(() => {
    if (!doctorsData?.length) return [];
    if (doctorsData.length === 1) return Array(20).fill(doctorsData[0]);
    return [...doctorsData, ...doctorsData];
  }, [doctorsData]);

  const [scrollPos, setScrollPos] = useState(0);
  const cardHeight = 4.5; // rem, ek card ki height
  const visibleCards = 5; // kitne cards visible hain container me

  useEffect(() => {
    const timer = setInterval(() => {
      setScrollPos((prev) => {
        const maxScroll = normalizedList.length - visibleCards;
        if (prev >= maxScroll) return 0; // reset scroll
        return prev + 1;
      });
    }, 2000); // 2 sec interval, adjust for speed

    return () => clearInterval(timer);
  }, [normalizedList.length]);


  return (
    <div className="w-[30%] h-[60vh] mr-10 [@media(min-width:3200px)]:mr-15 bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl border border-blue-200/60 p-6 flex flex-col">

      {/* Heading */}
      <h2 className="text-center hb:bg-amber-200 text-2xl [@media(min-width:3200px)_and_(max-height:2000px)]:text-4xl [@media(min-width:3200px)_and_(min-height:2000px)]:text-5xl [@media(min-width:4200px)_and_(min-height:2600px)]:text-6xl font-bold text-blue-900 tracking-wide pb-2 [@media(min-width:3200px)_and_(max-height:2000px)]:pb-4 [@media(min-width:3200px)_and_(min-height:2000px)]:pb-6 border-b border-blue-300/40 mb-3">
        Memon Medical Complex Consultant

      </h2>

      {/* Scrolling Area */}
      <div className="overflow-hidden flex-1 relative">
        {
          !doctorsData?.length ?
            <InfoLoader />
            :
            <div
              className="transition-transform duration-700 ease-in-out flex flex-col [@media(min-width:3200px)_and_(min-height:2000px)]:px-5 [@media(min-width:4200px)_and_(min-height:2600px)]:px-8 gap-4 [@media(min-width:3200px)_and_(max-height:2000px)]:gap-6 [@media(min-width:3200px)_and_(min-height:2000px)]:gap-8 [@media(min-width:4200px)_and_(min-height:2600px)]:gap-10"
              style={{
                transform: `translateY(-${scrollPos * cardHeight}rem)`,
              }}
            >
              {normalizedList.map((row, i) => (
                <div
                  key={i}
                  className="bg-white/90 border border-blue-200/50 rounded-xl px-4 [@media(min-width:4200px)_and_(min-height:2600px)]:px-10 py-4 [@media(min-width:3200px)_and_(max-height:2000px)]:p-5 [@media(min-width:3200px)_and_(min-height:2000px)]:p-6 [@media(min-width:4200px)_and_(min-height:2600px)]:p-8 shadow-md hover:bg-blue-50/50 hover:shadow-lg transition-all flex justify-between text-[15px] [@media(min-width:3200px)]:text-[20px] [@media(min-width:3200px)_and_(min-height:2000px)]:text-[24px] [@media(min-width:4200px)_and_(min-height:2600px)]:text-[28px] font-semibold text-blue-800"
                >
                  <span className="truncate w-[48%]">{row?.DOCTOR_NAME}</span>
                  <span className="truncate w-[48%] text-blue-600 text-right">{row?.FACULTY_NAME}</span>
                </div>
              ))}
            </div>
        }
      </div>
    </div>
  );
};

export default RightSideSlider;









