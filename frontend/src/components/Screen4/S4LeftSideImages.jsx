import { useEffect, useState } from "react";
import { base_URL } from "../../utills/baseUrl";
import axios from "axios";
import ImageLoader from "../../utills/ImageLoader";
import { toast } from "react-toastify";
import { logoutUser } from "../../reduxToolKit/authSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import NubitLogo from "../../assets/nubit logo png.png";
import logo from "../../assets/MMC logo.png";


const S4LeftSideImages = () => {

    const [imagesData, setImagesData] = useState([]);
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // console.log("imagesData in screen 5:", imagesData);
    // console.log("index in screen 5:", index);


    // get screen 4 data
    useEffect(() => {

        const foo = async () => {
            try {
                const res = await axios.get(`${base_URL}/api/screen4images/manage`);
                // console.log(res, "res of get screen1Data");
                const newData = res.data.data.map((item) => item?.IMAGE);
                setImagesData(newData);
            }
            catch (err) {
                // console.log(err, "error in get screen1Data");
                // toast.error(err?.message)
            }
        }
        foo()

    }, [])

    // Image rotation
    useEffect(() => {
        if (imagesData.length === 0) return; // wait until images load

        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % imagesData.length);
        }, 7000);

        return () => clearInterval(timer);
    }, [imagesData]);


    const handleLogout = () => {
        dispatch(logoutUser());
        toast.success("Logout Successful");
        navigate("/login");
    };

    return (
        <div className="w-[70%] py-2 [@media(min-width:4000px)]:py-4 flex flex-col items-center justify-around gap-2 relative bg-[#2b2d70] border-r-4 border-[#a4b0ff]">

            <div className="flex self-start ml-4 [@media(min-width:3200px)]:ml-8 [@media(min-width:4400px)]:ml-10  items-center gap-4 [@media(min-width:3200px)]:gap-8 [@media(min-width:4400px)]:gap-12">
                <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-[#00b0ff]/30">
                    <img src={logo} alt="logo" className="h-12 min-[2000px]:h-16 [@media(min-width:3000px)]:h-18  [@media(min-width:4400px)]:h-30 w-12 min-[2000px]:w-16 [@media(min-width:3000px)]:w-18 [@media(min-width:4400px)]:w-30 object-contain" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold min-[2000px]:text-5xl [@media(min-width:3200px)]:text-6xl  [@media(min-width:4400px)]:text-7xl text-white tracking-wide drop-shadow">
                        Memon Medical Complex
                    </h1>
                    <p className="text-[#a7c8e8] text-sm italic min-[2000px]:text-2xl [@media(min-width:3000px)]:text-3xl [@media(min-width:4400px)]:text-5xl ">
                        “Serving with Excellence & Care”
                    </p>
                </div>
            </div>

            {
                imagesData[index] ?
                    <>
                        <div className="w-[90%] h-[85%] border-4 border-white rounded-xl overflow-hidden shadow-2xl">
                            <img
                                src={imagesData[index]}
                                alt="Hospital"
                                className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
                            />
                        </div>
                    </>
                    :
                    // Loading Animation
                    <ImageLoader />

            }

            {/* ---- POWERED BY NUBIT ---- */}
            <div  className=" text-white/60   bottom-2 w-full  flex items-center justify-center gap-2 [@media(min-width:1920px)]:text-3xl  [@media(min-width:3000px)]:text-4xl [@media(min-width:4000px)]:text-5xl  min-[1520px]:text-[18px] ">
              <span className='flex justify-center items-center gap-2 cursor-pointer' onClick={handleLogout}>   Powered by <img className="w-[60px] [@media(min-width:2200px)]:w-[80px] [@media(min-width:3200px)]:w-[90px] [@media(min-width:4000px)]:w-[120px]" src={NubitLogo} alt="" />  </span>
            </div>

        </div>
    )
}

export default S4LeftSideImages