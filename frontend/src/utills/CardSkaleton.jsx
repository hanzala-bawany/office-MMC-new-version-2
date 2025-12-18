const DoctorCardSkeleton = () => {

    return (
        <div
            className="bg-white/70 border h-full border-blue-100 rounded-2xl 
            p-4 shadow-md flex items-center gap-4 min-w-[320px] flex-shrink-0 
            animate-pulse"
        >
            {/* Image Skeleton */}
            <div className="w-[70px] h-[70px] rounded-full bg-blue-200 flex-shrink-0"></div>

            {/* Text Skeleton */}
            <div className="flex flex-col gap-3 w-full">
                <div className="h-4 w-2/3 bg-blue-200 rounded"></div>
                <div className="h-4 w-1/2 bg-blue-100 rounded"></div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded"></div>
                </div>

                <div className="h-4 w-1/3 bg-blue-200 rounded mt-2"></div>
            </div>
        </div>
    );
};

export default DoctorCardSkeleton;
