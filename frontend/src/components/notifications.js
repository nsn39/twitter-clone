import Navbar from "./navbar";
import Sidebar from "./sidebar";
import NotificationArea from "./notificationArea";

import { useState } from "react";

function Notifications() {
    const [notificationData, setNotificationData] = useState(null);

    return (
        <div className="flex flex-col-reverse md:flex-row mx-auto lg:w-[1366px] font-chirp">
            <Navbar showNotificationCount={false}></Navbar>

            <NotificationArea/>

            <Sidebar></Sidebar>
        </div>
    );
};

export default Notifications;