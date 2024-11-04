import Navbar from "./navbar";
import Sidebar from "./sidebar";
import NotificationArea from "./notificationArea";
import PostModal from "./postModal";

import { useState, useEffect, Fragment } from "react";

function Notifications() {
    const [postMode, setPostMode] = useState(false);
    const [activeTweetData, setActiveTweetData] = useState(null);
    const [notificationData, setNotificationData] = useState(null);

    useEffect(() => {
        document.title =  "Notifications";
    }, []);

    return (
        <Fragment>
            <div className="flex flex-col-reverse md:flex-row mx-auto lg:w-[1366px] font-chirp">
                <Navbar setPostMode={setPostMode} showNotificationCount={false}></Navbar>

                <NotificationArea/>

                <Sidebar></Sidebar>
            </div>

            <PostModal isVisible={postMode} onClose={() => setPostMode(false)} activeTweetData={activeTweetData} setActiveTweetData={setActiveTweetData}/>
        </Fragment>
    );
};

export default Notifications;