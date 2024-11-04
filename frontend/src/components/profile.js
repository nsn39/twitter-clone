import Navbar from "./navbar";
import Sidebar from "./sidebar";
import ProfileArea from "./profilearea";
import PostModal from "./postModal";

import { useParams } from "react-router-dom";
import { useEffect, useState, Fragment } from "react";


function Profile() {
    const { slug } = useParams();
    const [postMode, setPostMode] = useState(false);
    const [activeTweetData, setActiveTweetData] = useState(null);

    useEffect(() => {
        document.title = "@" + slug + " / Twitter";
    }, []);

    return (
        <Fragment>
            <div className="flex flex-col-reverse md:flex-row mx-auto lg:w-[1366px] font-chirp">
                <Navbar setPostMode={setPostMode} showNotificationCount={true}></Navbar>

                <ProfileArea userName={slug}/>

                <Sidebar></Sidebar>
            </div>

            <PostModal isVisible={postMode} onClose={() => setPostMode(false)} activeTweetData={activeTweetData} setActiveTweetData={setActiveTweetData}/>
        </Fragment>
    );
};

export default Profile;