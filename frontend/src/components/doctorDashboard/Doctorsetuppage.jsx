import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import logo from "../../assets/MMC logo.png";
import { base_URL } from '../../utills/baseUrl';

const DoctorSetupPage = () => {

    const savedURL = localStorage.getItem('dynamicBaseURL') || '';
    const savedRoom = localStorage.getItem('doctorRoom') || '';
    // dynamicBaseURL se ip aur port alag karo
    const savedIp = savedURL ? savedURL.replace('http://', '').split(':')[0] : '';
    const savedPort = savedURL ? savedURL.replace('http://', '').split(':')[1] : '';
    const [inputs, setInputs] = useState({
        room: savedRoom,
        ip: savedIp,
        port: savedPort
    });
    const [loading, setLoading] = useState(false);
    const doctorData = JSON.parse(localStorage.getItem('loginUserData') || '{}');
    const navigate = useNavigate();




    // Get doctor data from localStorage

    const inputHandler = (e) => {
        setInputs({ ...inputs, [e.target.id]: e.target.value });
    };

    // console.log(inputs, "inputs.......");
    // console.log(doctorData, "loginUserData.......");


    const handleSubmit = async () => {

        if (!inputs.room) {
            toast.info('Please fill all fields');
            return;
        }

        try {
            setLoading(true);
            const res = await axios.post(`${base_URL}/api/opd/set-room`, {
                doctorId: doctorData?.doctorId,
                roomNo: inputs?.room
            });

            const dynamicBaseURL = `http://${inputs.ip}:${inputs.port}`;

            // console.log(res, "res of next Handler by id");

            localStorage.setItem('dynamicBaseURL', dynamicBaseURL);
            localStorage.setItem('doctorRoom', inputs.room);
            navigate("/doctorDashboard");
            toast.success(`Login in Successfully`);

        } catch (err) {
            console.log(err, "error in next Handler");
            toast.error(err?.message);
        } finally {
            setLoading(false);
        }


    };


    return (

        <div className="min-h-screen bg-[#f0fafb] flex flex-col gap-8 sm:gap-14 p-6 items-center  relative overflow-hidden">

            {/* Background decorative blobs */}
            <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-[#01A7B5] opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[250px] h-[250px] bg-[#0b2745] opacity-10 rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

            {/* Top-left branding */}
            <div className="flex items-center gap-3">

                <div className="bg-[linear-gradient(135deg,#01A7B5_0%,#0b2745_100%)] p-[2px] rounded-full shadow-md">
                    <div className="bg-white p-2 rounded-full">
                        <img src={logo} alt="logo" className="h-10 w-10 object-contain" />
                    </div>
                </div>
                <div>
                    <h1 className="text-xl font-bold text-[#0b2745]">Memon Medical Complex</h1>
                    <p className="text-xs italic text-[#0b2745]/60">"Serving with Excellence & Care"</p>
                </div>

            </div>

            {/* Main Card */}
            <div className="w-full max-w-md mx-4">

                {/* Card Header */}
                <div className="bg-[linear-gradient(135deg,#01A7B5_0%,#0b2745_100%)] rounded-t-2xl px-8 py-6 text-white text-center">

                    <h2 className="text-2xl font-bold tracking-wide">Doctor Setup</h2>

                </div>

                {/* Card Body */}
                <div className="bg-white rounded-b-2xl shadow-2xl px-8 py-7 flex flex-col gap-5">

                    {/* Room Field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-[#0b2745] flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#01A7B5]" />
                            Room Number
                        </label>
                        <input
                            id="room"
                            type="number"
                            placeholder="e.g. Room 5, OPD-1"
                            value={inputs.room}
                            onChange={inputHandler}
                            onKeyUp={(e) => e.key === 'Enter' && handleSubmit()}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[15px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#01A7B5] focus:border-transparent transition"
                        />
                    </div>

                    {/* IP Field and port fiels*/}
                    {/* <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-[#0b2745] flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#01A7B5]" />
                            Local Server IP Address
                        </label>
                        <input
                            id="ip"
                            type="text"
                            placeholder="e.g. 192.168.3.12"
                            value={inputs.ip}
                            onChange={inputHandler}
                            onKeyUp={(e) => e.key === 'Enter' && handleSubmit()}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[15px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#01A7B5] focus:border-transparent transition font-mono"
                        />
                    </div>

                  
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-[#0b2745] flex items-center gap-2">
                            <span className="inline-block w-2 h-2 rounded-full bg-[#01A7B5]" />
                            Port
                        </label>
                        <input
                            id="port"
                            type="number"
                            placeholder="e.g. 3000"
                            value={inputs.port}
                            onChange={inputHandler}
                            onKeyUp={(e) => e.key === 'Enter' && handleSubmit()}
                            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-[15px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#01A7B5] focus:border-transparent transition font-mono"
                        />
                    </div> */}


                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full cursor-pointer bg-[linear-gradient(135deg,#01A7B5_0%,#0b2745_100%)] hover:opacity-90 active:scale-[0.98] text-white font-semibold text-[16px] py-3 rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                Setting up...
                            </>
                        ) : (
                            <>
                                Proceed to Dashboard
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </>
                        )}
                    </button>

                    <p className="text-center text-xs text-gray-400">
                        Powered by <span className="text-[#01A7B5] font-medium">Nubit Software</span>
                    </p>

                </div>

            </div>

        </div>
    );
};

export default DoctorSetupPage;