import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { toast } from "react-toastify";


const AdminDisplayParent = () => {

  const screenAccessMap = {
    "001Screen1": "/screen1display",
    "002Screen2": "/screen2display",
    "003Screen3": "/screen3display",
    "004Screen4": "/screen4display",
  };
  const loginUserData = useSelector((state) => state?.authSlice?.loginUser);
  const allowedPath = screenAccessMap[loginUserData?.username];
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    if (toastMessage) {
      toast.error(toastMessage);
    }
  }, [toastMessage]);

  if (!loginUserData) {
    return <Navigate to="/login" replace />;
  }

  if (loginUserData.role === "admin") {
    return <Outlet />;
  }

  if (loginUserData.role == "doctor") {
    toast.error("Only Admin Can Access");
    return <Navigate to="/doctorDashboard" replace />;
  }

  if (allowedPath) {
    toast.error("Only Admin Can Access");
    return <Navigate to={allowedPath} replace />;
  }

  // ✅ Unknown user
  setToastMessage("Unauthorized user");
  return <Navigate to="/login" replace />;
};

export default AdminDisplayParent;


