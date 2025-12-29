import logo from "../assets/MMC logo.png"
import PatientCard from "../components/screen5/PatientCard";
import NubitLogo from ".././assets/nubit logo png.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../reduxToolKit/authSlice";



const Screen5Display = () => {


  const navigate = useNavigate()
  const dispatch = useDispatch()
  const doctors = [
    {
      doctorId: 1,
      doctorName: "Dr. Ahmed",
      patients: [
        { id: 1, token: "A-12", name: "Ali Khan", current: 1, age: 35 },
        { id: 2, token: "A-13", name: "Sara Ali", current: 0, age: 29 },
        { id: 3, token: "A-14", name: "Bilal Shah", current: 0, age: 42 },
      ],
    },
    {
      doctorId: 2,
      doctorName: "Dr. Sana",
      patients: [
        { id: 4, token: "B-07", name: "Ayesha Malik", current: 1, age: 28 },
        { id: 5, token: "B-08", name: "Hina Raza", current: 0, age: 33 },
        { id: 6, token: "B-09", name: "Ali Abbas", current: 0, age: 40 },
      ],
    },
    {
      doctorId: 3,
      doctorName: "Dr. Usman",
      patients: [
        { id: 7, token: "C-03", name: "Hassan Raza", current: 1, age: 41 },
        { id: 8, token: "C-04", name: "Nida Khan", current: 0, age: 36 },
        { id: 9, token: "C-05", name: "Asad Ali", current: 0, age: 45 },
      ],
    },
    {
      doctorId: 4,
      doctorName: "Dr. Hina",
      patients: [
        { id: 10, token: "D-09", name: "Fatima Noor", current: 1, age: 32 },
        { id: 11, token: "D-10", name: "Sara Noor", current: 0, age: 27 },
        { id: 12, token: "D-11", name: "Hassan Tariq", current: 0, age: 38 },
      ],
    },
    {
      doctorId: 5,
      doctorName: "Dr. Bilal",
      patients: [
        { id: 13, token: "E-02", name: "Zain Ahmed", current: 1, age: 22 },
        { id: 14, token: "E-03", name: "Hira Khan", current: 0, age: 25 },
        { id: 15, token: "E-04", name: "Omar Farooq", current: 0, age: 30 },
      ],
    },
    {
      doctorId: 6,
      doctorName: "Dr. Farooq",
      patients: [
        { id: 16, token: "F-15", name: "Imran Sheikh", current: 1, age: 50 },
        { id: 17, token: "F-16", name: "Naveed Malik", current: 0, age: 44 },
        { id: 18, token: "F-17", name: "Amina Riaz", current: 0, age: 39 },
      ],
    },
  ];

  const logoutHandler = () => {
    dispatch(logoutUser())
    toast.success("Logout Scuccessful")
    navigate("/login")
  }



  return (

    <div className="h-[100vh] w-full flex flex-col bg-gradient-to-br from-[#e0f7fa] to-[#fff]">

      <div className="flex absolute top-4 [@media(min-width:4200px)]:top-8 left-4 [@media(min-width:4200px)]:left-8 items-center gap-4 [@media(min-width:3200px)]:gap-8 [@media(min-width:4400px)]:gap-12">
        <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-[#00b0ff]/30">
          <img src={logo} alt="logo" className="h-12 min-[2000px]:h-16 [@media(min-width:3000px)]:h-18  [@media(min-width:4400px)]:h-30 w-12 min-[2000px]:w-16 [@media(min-width:3000px)]:w-18 [@media(min-width:4400px)]:w-30 object-contain" />
        </div>
        <div>
          <h1 className="text-cyan-600 text-3xl font-bold min-[2000px]:text-5xl [@media(min-width:3200px)]:text-6xl  [@media(min-width:4400px)]:text-7xl  tracking-wide drop-shadow">
            Memon Medical Complex
          </h1>
          <p className="text-[#a7c8e8] text-sm italic min-[2000px]:text-2xl [@media(min-width:3000px)]:text-3xl [@media(min-width:4400px)]:text-5xl ">
            “Serving with Excellence & Care”
          </p>
        </div>
      </div>

      <div className="flex justify-center flex-2 pt-10 text-5xl  text-cyan-800 font-[700]">

        <h1>Current Patient Queue Display</h1>

      </div>

      <div className="flex-13 grid grid-cols-3 gap-8 p-6 pt-0">
        {
          doctors?.map((doc) => <PatientCard key={doc.doctorId} doc={doc} />)
        }
      </div>

      <div onClick={logoutHandler} className=" text-cyan-600 flex-1 flex justify-center items-center gap-2 cursor-pointer z-50 [@media(min-width:4200px)]:right-10 bottom-5 [@media(min-width:4200px)]:bottom-8 [@media(min-width:1520px)]:text-2xl [@media(min-width:2200px)]:text-3xl [@media(min-width:3200px)]:text-4xl  [@media(min-width:4200px)]:text-6xl">
        Powered by <img className="w-[50px] [@media(min-width:2200px)]:w-[70px] [@media(min-width:3200px)]:w-[80px]" src={NubitLogo} alt="" />
      </div>

    </div>

  )
}

export default Screen5Display

































