import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

const PrivateRoutes = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    //var isUserLoggedIn = false;
    useEffect(() => {
        const isLoggedIn = async () => {
            const res = await fetch("http://localhost:8000/twitter-clone-api/auth/check_session", {
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

    console.log("isUserLoggedIn: ", isUserLoggedIn);
    if (isLoading) {
        return null;//(<div>Loading</div>);
    }

    return isUserLoggedIn ? <Outlet /> : <Navigate to="/landing" />;
}

export default PrivateRoutes;