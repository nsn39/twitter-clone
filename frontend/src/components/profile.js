import Navbar from "./navbar";
import Sidebar from "./sidebar";
import ProfileArea from "./profilearea";
import { useParams } from "react-router-dom";


function Profile() {
    const { slug } = useParams();

    return (
        <div className="flex flex-row">
            <Navbar></Navbar>

            <ProfileArea userName={slug}/>

            <Sidebar></Sidebar>
        </div>
    );
};

export default Profile;