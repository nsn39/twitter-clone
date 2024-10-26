import Navbar from "./navbar";
import Sidebar from "./sidebar";
import Timeline from "./timeline";
import PostModal from "./postModal";

import { Fragment, useState } from "react";


function Home() {
    const [postMode, setPostMode] = useState(false);
    const [activeTweetData, setActiveTweetData] = useState(null);

    return (
        <Fragment>
        <div className="flex flex-col-reverse md:flex-row mx-auto lg:w-[1366px] font-chirp">
            <Navbar setPostMode={setPostMode} showNotificationCount={true}></Navbar>

            <Timeline setPostMode={setPostMode} setActiveTweetData={setActiveTweetData}></Timeline>

            <Sidebar></Sidebar>
        </div>

        <PostModal isVisible={postMode} onClose={() => setPostMode(false)} activeTweetData={activeTweetData} setActiveTweetData={setActiveTweetData}/>
        </Fragment>
    );
};

export default Home;

//3 - 4 - 7