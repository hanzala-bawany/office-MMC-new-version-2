import axios from "axios";
import { useEffect, useState } from "react";
import { base_URL } from "../../utills/baseUrl";
import { motion } from "framer-motion";
import ImageLoader from "../../utills/ImageLoader";



const LeftImageSlider = () => {

    const [imagesData, setImagesData] = useState([]);
    const [index, setIndex] = useState(0);

    // get screen 1 data
    useEffect(() => {

        const foo = async () => {
            try {
                const res = await axios.get(`${base_URL}/api/screen1images/manage`);
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

    // next image handler
    useEffect(() => {

        const interval = setTimeout(() => {
            setIndex((prev) => {
                if (imagesData.length <= 1) return 0;
                return (prev + 1) % imagesData.length;
            });
        }, 8000);
        return () => clearInterval(interval);

    }, [index, imagesData.length]);


    return (
        <div className="w-[70%]    flex justify-center items-center">
            {
                imagesData[index] ?
                    <>
                        <img
                            src={imagesData[index]}
                            alt="MMC"
                            className="slider-img rounded-2xl w-[85%] h-[60vh] object-cover shadow-xl border border-gray-300"
                        />

                    </>
                    :
                    <ImageLoader />
            }
        </div>
    )
}

export default LeftImageSlider