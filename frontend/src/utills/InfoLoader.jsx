
const InfoLoader = () => {
    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-4">
            <div className="w-14 h-14 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-blue-600 font-medium tracking-wide animate-pulse">
                Loading Information...
            </p>
        </div>
    )
}

export default InfoLoader;