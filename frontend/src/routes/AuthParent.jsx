import { useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { toast } from "react-toastify"


const AuthParent = () => {

  const isUserLogin = JSON.parse(localStorage.getItem("loginUser"));
  const loginUserData = JSON.parse(localStorage.getItem("loginUserData"));

  const screenAccessMap = {
    "001Screen1": "/screen1display",
    "002Screen2": "/screen2display",
    "003Screen3": "/screen3display",
    "004Screen4": "/screen4display",
    "005Screen5": "/screen5display",
  };

  const allowedPath = screenAccessMap[loginUserData?.username];


  useEffect(() => {
    if (isUserLogin) toast.warning("You are already logged in");
  }, [isUserLogin])

  return (
    <>
      {
        isUserLogin ?
          <Navigate to={loginUserData?.role == "screen" ? allowedPath : "/"} />
          : <Outlet />
      }
    </>
  )
}

export default AuthParent