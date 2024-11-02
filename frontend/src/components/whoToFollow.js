import SidebarExploreFollow from "./sidebarExploreFollow";
import { useEffect, useState } from "react";

function WhoToFollow() {
    const {REACT_APP_BACKEND_URL} = process.env;
    const [activeUserData, setActiveUserData] = useState({});
    const [followSuggestions, setFollowSuggestions] = useState([]);

    useEffect(() => {
        fetch(REACT_APP_BACKEND_URL + "who_to_follow", {
            method: "GET",
            credentials: "include"
        })
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            }
        })
        .then((data) => {
            if (data) {
                setFollowSuggestions(data);
            }
        })

        fetch(REACT_APP_BACKEND_URL + "active_user", {
            method: "GET",
            credentials: "include"
        }).then((res) => {
            if (res.status == 200) {
                return res.json();
            }else {
                return null;
            }
        }).then(data => {
            if (data) {
                setActiveUserData({
                    "username": data.username,
                });
            }
        })
    }, []);

    return (
        <div className="flex flex-col border-[0.5px] border-gray-400 mt-4 rounded-lg">
            <h3 className="text-2xl font-bold p-2">Who to follow</h3>
            
            {
                followSuggestions && followSuggestions.map(({id, fullname, username, profile_pic_filename }) => (
                    <SidebarExploreFollow
                        key={id}
                        id={id}
                        fullName={fullname}
                        userName={username}
                        activeUserName={activeUserData.username}
                        displayPicture={profile_pic_filename}
                    />
                ))
            }

            <div className="p-3 hover:bg-gray-200 cursor-pointer">
                <p className="text-blue-500 text-md">Show more</p>
            </div>
        </div>
    );
}

export default WhoToFollow;