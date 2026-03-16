import { useEffect, useRef, useState } from "react";
import fish from "../../assets/fish.mp4";
import fish1 from "../../assets/fish1.mp4";
import fish2 from "../../assets/fish2.mp4";


const VidioSlideShow = () => {

    const [i, setI] = useState(0);
    const videoRef = useRef(null);
    const slideshowImages = [
        fish2,
        fish,
        fish1,
    ];


    useEffect(() => {
        const interval = setInterval(() => {
            setI((prev) => prev >= slideshowImages?.length - 1 ? 0 : prev + 1);
        }, 1000 * 20);

        return () => clearInterval(interval); // cleanup
    }, []);

    return (
        <video
            className="h-full w-full object-cover rounded-2xl bg-amber-500"
            autoPlay
            loop
            muted
            playsInline
            src={slideshowImages[i]}
            // onTimeUpdate={handleTimeUpdate}
            ref={videoRef}>

        </video>
    )
}

export default VidioSlideShow