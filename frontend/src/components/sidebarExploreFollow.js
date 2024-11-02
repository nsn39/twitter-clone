import { useNavigate } from "react-router-dom";
import FollowButton from "./followButton";

function SidebarExploreFollow(props) {
    const {REACT_APP_FS_URL} = process.env;
    const navigate = useNavigate();

    const handleProfileClick = (e) => {
        e.stopPropagation();
        navigate("/" + props.userName);
    }

    return (
        <div onClick={handleProfileClick} className="flex flex-row p-2 hover:bg-gray-200 cursor-pointer items-center">
            <img className="flex-none h-10 w-10 rounded-full mr-2" src={REACT_APP_FS_URL + props.displayPicture} />

            <div className="grow flex flex-col">
                <p className="font-bold text-md">{props.fullName}</p>
                <p className="text-gray-500">{"@" + props.userName}</p>
            </div>

            <FollowButton 
                currentUsername={props.activeUsername} 
                profileUsername={props.userName} 
            />
        </div>
    );
}

export default SidebarExploreFollow;