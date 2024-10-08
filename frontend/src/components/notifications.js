import Navbar from "./navbar";
import Sidebar from "./sidebar";
import NotificationArea from "./notificationArea";

function Notifications() {
    return (
        <div className="flex flex-col-reverse md:flex-row mx-auto lg:w-[1366px] font-chirp">
            <Navbar></Navbar>

            <NotificationArea />

            <Sidebar></Sidebar>
        </div>
    );
};

export default Notifications;