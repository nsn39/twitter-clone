import Navbar from "./navbar";
import Sidebar from "./sidebar";
import MessageArea from "./messageArea";
import PostModal from "./postModal";

import { useEffect, useState, Fragment } from "react";

function Messages() {
    const [postMode, setPostMode] = useState(false);
    const [activeTweetData, setActiveTweetData] = useState(null);

    useEffect(() => {
        document.title =  "Messages";
    }, []);

    return (
        <Fragment>
            <div className="flex flex-col-reverse md:flex-row mx-auto lg:w-[1366px] font-chirp">
                <Navbar setPostMode={setPostMode} showNotificationCount={true}></Navbar>

                <MessageArea />

                <Sidebar></Sidebar>
            </div>

            <PostModal isVisible={postMode} onClose={() => setPostMode(false)} activeTweetData={activeTweetData} setActiveTweetData={setActiveTweetData}/>
        </Fragment>
    );
};

export default Messages;