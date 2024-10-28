import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const PrivateRoutes = () => {
    const {REACT_APP_BACKEND_URL} = process.env;
    const [isLoading, setIsLoading] = useState(true);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    //var isUserLoggedIn = false;
    useEffect(() => {
        const isLoggedIn = async () => {
            const res = await fetch(REACT_APP_BACKEND_URL + "auth/check_session", {
                "method": "GET",
                credentials: "include"
            })

            if (res.status == 200) {
                setIsUserLoggedIn(true);
            }
            console.log("isUserLoggedIn: ", isUserLoggedIn, " res.status: ", res.status);
            setIsLoading(false);
        }
        
        isLoggedIn();
    }, []);

    if (isLoading) {
        return null;//(<div>Loading</div>);
    }

    return isUserLoggedIn ? <Outlet /> : <Navigate to="/landing" />;
}

export default PrivateRoutes;