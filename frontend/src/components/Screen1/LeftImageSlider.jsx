import axios from "axios";
import { useEffect, useState } from "react";
import { base_URL } from "../../utills/baseUrl";
import { motion } from "framer-motion";
import ImageLoader from "../../utills/ImageLoader";

import image from '../../assets/niz2.jpg'

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
                        <motion.img
                            key={index}
                            src={imagesData[index]}
                            // src={image}
                            alt="MMC"
                            className="rounded-2xl w-[85%] h-[60vh] object-fill  shadow-xl border border-gray-300"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 3 }}
                        />

                    </>
                    :
                    <ImageLoader />
            }
        </div>
    )
}

export default LeftImageSlider