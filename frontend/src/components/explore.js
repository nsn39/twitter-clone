import Navbar from "./navbar";
import SidebarExplore from "./sidebarExplore";
import ExploreArea from "./exploreArea";
import PostModal from "./postModal";

import { useEffect, useState, Fragment } from "react";

function Explore() {
    const [postMode, setPostMode] = useState(false);
    const [activeTweetData, setActiveTweetData] = useState(null);

    useEffect(() => {
        document.title =  "Explore";
    }, []);

    return (
        <Fragment>
            <div className="flex flex-col-reverse md:flex-row mx-auto lg:w-[1366px] font-chirp">
                <Navbar setPostMode={setPostMode} showNotificationCount={true}></Navbar>

                <ExploreArea />

                <SidebarExplore />
            </div>

            <PostModal isVisible={postMode} onClose={() => setPostMode(false)} activeTweetData={activeTweetData} setActiveTweetData={setActiveTweetData}/>
        </Fragment>
    );
};

export default Explore;