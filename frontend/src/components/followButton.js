import { useEffect, useState } from "react";

function FollowButton ({currentUsername, profileUsername, setEditModeFunction}) {
    const [isUserFollowingProfile, setIsUserFollowingProfile] = useState(false);
    const handleEditClick = () => {
        setEditModeFunction(true);
    }

    const handleFollowClick = () => {
        fetch("http://localhost:8000/twitter-clone-api/follow/" + profileUsername, {
            method: "POST",
            credentials: "include"
        })
        .then((res) => {
            if (res.status == 201) {
                setIsUserFollowingProfile(true);
            }
        })
    }

    const handleUnfollowClick = () => {
        fetch("http://localhost:8000/twitter-clone-api/unfollow/" + profileUsername, {
            method: "DELETE",
            credentials: "include"
        })
        .then((res) => {
            if (res.status == 204) {
                setIsUserFollowingProfile(false);
            }
        })
    }

    const onMouseOverFollowing = () => {
        let btn = document.getElementById("unfollow_btn");
        btn.textContent = "Unfollow";
        btn.classList.remove("border-gray-300");
        btn.classList.add("border-red-400");
    }

    const onMouseOutFollowing = () => {
        let btn = document.getElementById("unfollow_btn");
        btn.textContent = "Following";
        btn.classList.remove("border-red-400");
        btn.classList.add("border-gray-300");
    }

    useEffect(() => {
        // check if user follows profile or not.
        
        fetch("http://localhost:8000/twitter-clone-api/is_following/" + profileUsername, {
            method: "GET",
            credentials: "include"
        })
        .then((res) => {
            if (res.status == 200) {
                setIsUserFollowingProfile(true);
            }
        })
        
    }, [profileUsername]);

    if (currentUsername == profileUsername) {
        return (
            <button onClick={handleEditClick} className="font-bold p-2 border-[0.5px] border-gray-300 rounded-full hover:bg-gray-300">Edit profile</button>
        );
    }
    else if (isUserFollowingProfile) {
        return (
            <button id="unfollow_btn" onMouseOver={onMouseOverFollowing} onMouseOut={onMouseOutFollowing} onClick={handleUnfollowClick} className="font-bold px-4 py-2 border-[0.5px] border-gray-300 border-black rounded-full bg-white hover:bg-red-100 hover:text-red-600">Following</button>
        )
    }
    else {
        return (
            <button onClick={handleFollowClick} className="font-bold px-4 py-2 rounded-full bg-black text-white hover:bg-slate-800">Follow</button>
        );
    }

}

export default FollowButton;