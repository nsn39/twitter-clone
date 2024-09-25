import Navbar from "./navbar";
import Sidebar from "./sidebar";
import NotificationArea from "./notificationArea";

function Notifications() {
    return (
        <div className="flex flex-row">
            <Navbar></Navbar>

            <NotificationArea />

            <Sidebar></Sidebar>
        </div>
    );
};

export default Notifications;