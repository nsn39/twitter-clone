import Navbar from "./navbar";
import Sidebar from "./sidebar";
import PostDetail from "./postdetail";
import PostModal from "./postModal";
import { useParams } from "react-router-dom";

import { Fragment, useState } from "react";

function Post() { 
    // Fetch slug from route parameters
    const { slug } = useParams();
    const [postMode, setPostMode] = useState(false);
    const [activeTweetData, setActiveTweetData] = useState(null)

    return (
        <Fragment>
        <div className="flex flex-col-reverse md:flex-row mx-auto md:w-[1366px] font-chirp">
            <Navbar setPostMode={setPostMode} showNotificationCount={true}></Navbar>

            <PostDetail setPostMode={setPostMode} setActiveTweetData={setActiveTweetData} tweetSlug={slug}></PostDetail>

            <Sidebar></Sidebar>
        </div>

        <PostModal isVisible={postMode} onClose={() => setPostMode(false)} activeTweetData={activeTweetData} setActiveTweetData={setActiveTweetData}/>
        </Fragment>
    );
};

export default Post;