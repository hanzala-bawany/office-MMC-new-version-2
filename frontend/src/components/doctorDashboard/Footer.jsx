import NubitLogo from "../../assets/nubit logo png.png";


const Footer = () => {

    return (

        < footer className="flex-1 flex justify-center items-center  pr-2" >
            <button
                className="flex items-center  gap-2 text-blue-500 hover:text-blue-700 text-lg font-medium transition-colors   border-none"
            >
                Powered by
                <img src={NubitLogo} alt="Nubit" className="w-12 object-contain" />
            </button>
        </footer >
    )
}

export default Footer