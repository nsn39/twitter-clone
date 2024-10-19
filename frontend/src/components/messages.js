import Navbar from "./navbar";
import Sidebar from "./sidebar";
import MessageArea from "./messageArea";

function Messages() {
    return (
        <div className="flex flex-col-reverse md:flex-row mx-auto lg:w-[1366px] font-chirp">
            <Navbar showNotificationCount={true}></Navbar>

            <MessageArea />

            <Sidebar></Sidebar>
        </div>
    );
};

export default Messages;