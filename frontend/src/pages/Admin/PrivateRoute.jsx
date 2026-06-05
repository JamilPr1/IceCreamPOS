import React from 'react';
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
    const isAuth = sessionStorage.getItem("Rtoken") || "";
    console.log(isAuth)
    const location = useLocation();
    console.log("PrivateRoteLocation", location);
    if (!isAuth) {
        return <Navigate to={"/login"} state={location.pathname} replace></Navigate>
    }
    return children;
}

export default PrivateRoute