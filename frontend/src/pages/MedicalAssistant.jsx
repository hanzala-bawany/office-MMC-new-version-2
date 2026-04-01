import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../reduxToolKit/authSlice";
import logo from "../assets/MMC logo.png";
import NubitLogo from "../assets/nubit logo png.png";
import FormHeader from "../components/MedicalAssistant/FormHeader";
import FormBody from "../components/MedicalAssistant/FormBody";




const MedicalAssistant = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedPatient, setSelectedPatient] = useState(null);


    const handleLogout = () => {
        dispatch(logoutUser());
        toast.success("Logout Successful");
        navigate("/login");
    };
    

    return (
        <>

            {/* ── PAGE ROOT ── */}
            <div
                className="flex flex-col just min-h-screen px-4 py-7"
                style={{
                    fontFamily: "'DM Sans', sans-serif",
                    background: "#f0f4ff",
                    backgroundImage: `radial-gradient(ellipse 80% 50% at 20% -10%, rgba(99,102,241,0.15) 0%, transparent 60%),radial-gradient(ellipse 60% 40% at 80% 110%, rgba(59,130,246,0.12) 0%, transparent 60%)`,
                }}
            >

                {/* HEADER   */}
                <header className="flex-1 flex items-center justify-between mb-7">

                    {/* Logo pill */}
                    <div className="anim-slideDown flex items-center gap-3 px-4 py-2 rounded-full border border-indigo-500/50 bg-white/90 backdrop-blur shadow-md shadow-indigo-500/10">
                        <img src={logo} alt="MMC Logo" className="h-12 w-12 object-contain rounded-full" />
                        <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-lg font-semibold text-indigo-950 tracking-wide hidden sm:block">
                            Memon Medical Complex
                        </span>
                    </div>

                    {/* Logout button */}
                    <button
                        onClick={handleLogout}
                        className="text-sm cursor-pointer font-medium text-red-500 hover:text-red-700 border border-red-200 hover:border-red-400 px-4 py-2 rounded-full transition-all hover:bg-red-50"
                    >
                        Logout →
                    </button>

                </header>

                {/*  BODY  */}
                <main className="flex-8 flex flex-col items-center justify-center">

                    {/* Form */}
                    <div className="anim-fadeUp w-full max-w-2xl h-max bg-white/97 rounded-3xl overflow-hidden border border-indigo-200/70" style={{ boxShadow: "0 12px 48px rgba(79,70,229,0.13), 0 2px 8px rgba(0,0,0,0.04)" }}  >

                        {/* ── Form Header ── */}
                        <FormHeader selectedPatient={selectedPatient} />

                        {/* ── Form Body ── */}
                        <FormBody selectedPatient={selectedPatient}  setSelectedPatient={setSelectedPatient} />

                    </div>

                </main>

                {/*   FOOTER  */}
                <footer className="flex-1 flex justify-end items-center pt-5 pr-2">
                    <button
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-700 text-sm font-medium transition-colors  bg-transparent border-none"
                    >
                        Powered by
                        <img src={NubitLogo} alt="Nubit" className="w-10 object-contain" />
                    </button>
                </footer>

            </div>
        </>
    );
};

export default MedicalAssistant;
























