import Navbar from "./navbar";
import Sidebar from "./sidebar";
import MessageArea from "./messageArea";

function Messages() {
    return (
        <div className="flex flex-row">
            <Navbar></Navbar>

            <MessageArea />

            <Sidebar></Sidebar>
        </div>
    );
};

export default Messages;