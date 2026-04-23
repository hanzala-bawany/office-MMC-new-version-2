import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logoutUser } from "../reduxToolKit/authSlice";
import { useDispatch } from "react-redux";


const ErrorFallback = ({ error, resetErrorBoundary }) => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {

        dispatch(logoutUser());
        toast.success("Logout Successful");
        navigate("/login");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center">

                {/* Icon */}
                <div className="text-red-500 text-5xl mb-4">
                    ⚠️
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    Something went wrong
                </h2>

                {/* Error message */}
                <p className="text-sm text-gray-500 mb-6 break-words">
                    {error.message}
                </p>

                {/* Buttons */}
                <div className="flex gap-3 justify-center">

                    <button
                        onClick={resetErrorBoundary}
                        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                    >
                        Try Again
                    </button>

                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
                    >
                        Logout
                    </button>

                </div>

            </div>
        </div>
    )
}

export default ErrorFallback