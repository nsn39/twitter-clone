import Navbar from "./navbar";
import Sidebar from "./sidebar";
import PostDetail from "./postdetail";
import { useParams } from "react-router-dom";

function Post(props) { 
    // Fetch slug from route parameters
    const { slug } = useParams();

    return (
        <div className="flex flex-row">
            <Navbar></Navbar>

            <PostDetail tweetSlug={slug}></PostDetail>
            <p>{props.slug}</p>

            <Sidebar></Sidebar>
        </div>
    );
};

export default Post;