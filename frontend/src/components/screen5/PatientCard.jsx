import { memo } from "react";

const PatientCard = ({ doc }) => {


  // const currentPatient = doc.find(p => p.current === 1);

  const patient = doc;

  return (

    <div className="bg-white/95 backdrop-blur-xl rounded-2xl border border-cyan-100 shadow-lg  transition-shadow p-2 4xl:p-4  flex flex-col h-full">
      <div
        key={patient.id}
        className={`p-6 4xl:p-7 5xl:p-10 rounded-xl border-2 transition-all duration-300 flex justify-between flex-1 bg-gradient-to-r from-cyan-100 to-cyan-50 border-yellow-200 3xl:border-yellow-400 shadow-md `}
      >
        <div className="flex flex-col justify-between  space-y-2 text-gray-700">
          <p className="text-lg xl:text-2xl  4xl:text-4xl  5xl:text-5xl  text-cyan-600 font-semibold">
            <span className="font-semibold text-gray-700">Name:</span> {patient.name}
          </p>
          <p className="text-lg xl:text-2xl 4xl:text-4xl 5xl:text-5xl text-cyan-600 font-semibold">
            <span className="font-semibold text-gray-700">Age:</span> {patient.age} years
          </p>
          <p className="text-lg xl:text-2xl  4xl:text-4xl 5xl:text-5xl text-cyan-600 font-semibold">
            <span className="font-semibold text-gray-700">Doctor:</span> {patient.doctorName}
          </p>
        </div>

        <div className="flex flex-col justify-between items-center">
          <span className={`text-4xl 4xl:text-5xl 5xl:text-6xl font-bold text-cyan-600 `}>
            {patient.token}
          </span>


          <span className="mt-4 inline-block px-6 py-2 bg-yellow-500 text-white font-bold rounded-full text-lg 4xl:text-xl 5xl:text-2xl 4xl:tracking-[2px] 5xl:tracking-[4px]  shadow-lg animate-pulse">
            NOW SERVING
          </span>

        </div>

      </div>
    </div>
  );
};

export default memo(PatientCard);