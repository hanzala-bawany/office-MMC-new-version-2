import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-toastify";

const DocotorParent = () => {

    const isUserLogin = JSON.parse(localStorage.getItem("loginUser"));
    const loginUserData = JSON.parse(localStorage.getItem("loginUserData"));



    useEffect(() => {
        if (!isUserLogin) {
            toast.warning("You have to login first");
        } else if (loginUserData?.role !== "doctor" && loginUserData?.role !== "admin") {
            toast.error("Access denied");
        }
    }, [isUserLogin, loginUserData]);

    return (
        <>
            {
                loginUserData?.role == "doctor" ? <Outlet /> : <Navigate to={"/"} />
            }
        </>
    )
}

export default DocotorParent