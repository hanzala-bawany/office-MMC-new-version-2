import { useState, useEffect } from 'react';
import logo from "../assets/MMC logo.png"; // ← Apna logo path yahan set kar lo
import NubitLogo from "../assets/nubit logo png.png"; // ← Apna Nubit logo



const vipDoctors = [
  {
    doctorId: 1,
    doctorName: "Dr. Ahmed Khan",
    patients: [
      { id: 1, token: "VIP-01", name: "Mr. Rahman Ali", current: 1, age: 52 },
      { id: 2, token: "VIP-02", name: "Mrs. Fatima Zahra", current: 0, age: 48 },
      { id: 3, token: "VIP-03", name: "Mr. Khalid Mehmood", current: 0, age: 61 },
    ],
  },
  {
    doctorId: 2,
    doctorName: "Dr. Sana Iqbal",
    patients: [
      { id: 4, token: "VIP-04", name: "Mrs. Ayesha Siddiqui", current: 1, age: 39 },
      { id: 5, token: "VIP-05", name: "Mr. Imran Hassan", current: 0, age: 45 },
      { id: 6, token: "VIP-06", name: "Mrs. Zainab Akbar", current: 0, age: 37 },
    ],
  },
  {
    doctorId: 3,
    doctorName: "Dr. Usman Raza",
    patients: [
      { id: 7, token: "VIP-07", name: "Mr. Bilal Ahmed", current: 1, age: 58 },
      { id: 8, token: "VIP-08", name: "Mrs. Nadia Khan", current: 0, age: 44 },
      { id: 9, token: "VIP-09", name: "Mr. Tariq Jamil", current: 0, age: 67 },
    ],
  },
];


const slideshowImages = [
  "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=1920&q=80",
  "https://images.unsplash.com/photo-1559825481-928a5fe45335?w=1920&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
  "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&q=80",
  "https://images.unsplash.com/photo-1519046905113-736d4e9984af?w=1920&q=80",
  "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=1920&q=80",
  "https://images.unsplash.com/photo-1552083375-1447ce886485?w=1920&q=80",
];



const PatientCard = ({ doc }) => {


  const currentPatient = doc.patients.find(p => p.current === 1);


  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-cyan-100 p-6 flex flex-col h-full">
      <h3 className="text-2xl font-bold text-cyan-700 mb-6 text-center">
        {doc.doctorName}
      </h3>

      <div className="space-y-4 flex-1 flex flex-col">

        {
          doc.patients.map((patient) => (
            <div
              key={patient.id}
              className={`p-5 rounded-xl border-2 transition-all flex justify-between flex-1 ${patient.current === 1
                ? "bg-yellow-100 border-yellow-400 shadow-md"
                : "bg-cyan-50/50 border-cyan-200"
                }`}
            >

              <div className="space-y-2 text-gray-700">

                <p className="text-lg">
                  <span className="font-semibold">Name:</span> {patient.name}
                </p>
                <p className="text-lg">
                  <span className="font-semibold">Age:</span> {patient.age} years
                </p>

              </div>

              <div className="flex flex-col justify-between items-center mb-3 ">

                <span
                  className={`text-4xl font-bold ${patient.current === 1 ? "text-yellow-600" : "text-cyan-600"
                    }`}
                >
                  {patient.token}
                </span>
                {
                  patient.current === 1 && (
                    <div className="mt-4  flex justify-end text-center">
                      <span className="inline-block px-6 py-2 bg-yellow-500 text-white font-bold rounded-full text-lg shadow-lg animate-pulse">
                        NOW SERVING
                      </span>
                    </div>
                  )
                }

              </div>



            </div>
          ))}
      </div>
      
    </div>
  );
};



const VIPScreen = () => {



  const [currentImageIndex, setCurrentImageIndex] = useState(0);



  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % slideshowImages.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen w-full flex bg-gradient-to-br from-[#e0f7fa] to-[#fff] overflow-hidden">
      {/* Left Side - 70% Patient Grid */}
      <div className="w-full flex flex-col">

        {/* Header */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-6">
          <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-[#00b0ff]/40">
            <img
              src={logo}
              alt="MMC Logo"
              className="h-16 w-16 object-contain drop-shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-cyan-600 text-5xl font-bold tracking-wide drop-shadow-lg">
              Memon Medical Complex
            </h1>
            <p className="text-[#a7c8e8] text-2xl italic">
              “Serving with Excellence & Care”
            </p>
          </div>
        </div>

        {/* Main Title */}
        <div className="text-center mt-24 mb-8">
          <h1 className="text-6xl font-bold text-cyan-800 drop-shadow-md">
            VIP Patient Queue
          </h1>
        </div>

        {/* Patient Cards Grid */}
        <div className="grid grid-cols-3 gap-8 px-10 pb-10 flex-1 overflow-y-auto">
          {vipDoctors.map((doc) => (
            <PatientCard key={doc.doctorId} doc={doc} />
          ))}
        </div>

        {/* Powered By */}
        <div className="text-center pb-6">
          <span className="text-cyan-600 text-3xl font-medium flex items-center justify-center gap-4 cursor-pointer">
            Powered by
            <img src={NubitLogo} alt="Nubit" className="h-16" />
          </span>
        </div>

      </div>

      {/* Right Side - 30% Slideshow */}
      {/* <div className="w-3/10 relative">
        <img
          key={currentImageIndex}
          src={slideshowImages[currentImageIndex]}
          alt="Calming Nature"
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div> */}
    </div>
  );
};

export default VIPScreen;













