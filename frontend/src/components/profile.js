import Navbar from "./navbar";
import Sidebar from "./sidebar";
import ProfileArea from "./profilearea";
import { useParams } from "react-router-dom";


function Profile() {
    const { slug } = useParams();

    return (
        <div className="flex flex-col-reverse md:flex-row mx-auto lg:w-[1366px] font-chirp">
            <Navbar showNotificationCount={true}></Navbar>

            <ProfileArea userName={slug}/>

            <Sidebar></Sidebar>
        </div>
    );
};

export default Profile;