import React from "react";
import { useEffect, useState, Fragment } from "react";
import Tweet from "./tweet";
import EditProfileModal from "./editProfileModal";
import FollowButton from "./followButton";

import { useNavigate } from "react-router-dom";

function ProfileArea(props) {
    const [userExists, setUserExists] = React.useState(true);
    const [userData, setUserData] = React.useState({
        "display_picture_link": "undefined"
    });
    const [activeUserData, setActiveUserData] = React.useState({});
    const [userTweets, setTweetState] = React.useState([]);
    const [editMode, setEditMode] = useState(false);

    const navigate = useNavigate();

    let backLink = () => {
        navigate(-1);
    };

    const updateTweetList = (newList) => {
        setTweetState(newList);
    };
    
    useEffect(() => {
        fetch("http://localhost:8000/twitter-clone-api/active_user", {
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
                console.log(data.fullname);
                setActiveUserData({
                    "username": data.username,
                });
                console.log("user data: ", userData);
            }
        })

        fetch("http://localhost:8000/twitter-clone-api/profile/" + props.userName, {
            method: "GET",
            credentials: "include"
        })
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            }
            else {
                return null;
            }
        })
        .then((data) => {
            if (data) {//accessing fields individually works but setting data at once doesn't ??
                setUserData({
                    "full_name": data.fullname,
                    "username": data.username,
                    "display_picture_link": data.profile_pic_filename
                });
                console.log("User data: ", data);
            }else {
                setUserExists(false);
            }
        })

        fetch('http://localhost:8000/twitter-clone-api/user_tweets/' + props.userName, {
            method: "GET",
            credentials: "include"
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log(data);
            setTweetState(data);
        });
    }, []);

    if (!userExists) {
        return (
            <div className="w-[46%] border-x-[0.5px] border-gray-200">
                <h3 className="font-bold text-3xl mt-24 p-4">Sorry, the user @{props.userName} doesn't exist.</h3>
            </div>
        );
    }

    return (
        <Fragment>
        <div className="md:w-[46%] border-x-[0.5px] border-gray-200">

            <div className="flex flex-row p-2 items-center">
                <button onClick={backLink} className="flex flex-row items-center justify-center h-8 w-8 hover:bg-gray-300 hover:rounded-full">
                    <svg className="h-5 w-5" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path><path fill="#000000" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path></g></svg>
                </button>

                <div className="flex flex-col ml-6">
                    <p className="text-xl font-bold">username</p>
                    <p className="text-gray-500 text-sm">1000 posts</p>
                </div>
            </div>

            <div className="relative">
                <img src="/cover.jpeg" className="h-[200px] w-[600px]"/>

                <div className="absolute h-30 w-30 rounded-full border-2 border-white top-[150px] left-[20px]">
                    <img src={"http://localhost:8000/twitter-clone-api/fs/" + userData.display_picture_link} className="h-28 w-28 rounded-full" />
                </div>
            </div>

            <div className="flex flex-row justify-end p-2">
                <FollowButton currentUsername={activeUserData.username} profileUsername={userData.username} setEditModeFunction={setEditMode} />
            </div>

            <div className="flex flex-col mt-5 px-2">
                <p className="font-bold text-2xl">{userData.full_name}</p>
                <p className="text-gray-400">{"@" + userData.username}</p>
                <div className="flex flex-row text-gray-400 mt-2">
                    <p>Born October 1, 2000</p>
                    <p className="ml-5">Joined October 2015</p>
                </div>
                
                <div className="flex flex-row mt-2 items-center">
                    <p className="font-bold mr-1">746</p> <p className="text-gray-400 text-md">Following</p>
                    <p className="ml-5 font-bold mr-1">399 </p> <p className="text-gray-400 text-md">Followers</p> 
                </div>
            </div>

            <div className="flex flex-row border-b-[0.5px] overflow-x-scroll">
                <button className="flex-auto text-xs md:text-base p-4 font-bold text-gray-500 hover:bg-gray-300">Posts</button>
                <button className="flex-auto text-xs md:text-base p-4 font-bold text-gray-500 hover:bg-gray-300">Replies</button>
                <button className="flex-auto text-xs md:text-base p-4 font-bold text-gray-500 hover:bg-gray-300">Highlights</button>
                <button className="flex-auto text-xs md:text-base p-4 font-bold text-gray-500 hover:bg-gray-300">Articles</button>
                <button className="flex-auto text-xs md:text-base p-4 font-bold text-gray-500 hover:bg-gray-300">Media</button>
                <button className="flex-auto text-xs md:text-base p-4 font-bold text-gray-500 hover:bg-gray-300">Likes</button>
            </div>
            
            
            {
                userTweets && userTweets.map(({id, fullname, username, content, created_on, profile_pic_filename, post_type, parent_post}) => (
                    <Tweet key={id} id={id} displayName={fullname} userName={"@" + username} tweetText={content} originalTimestamp={created_on} displayPicture={profile_pic_filename} contextType="profile" postType={post_type} parentPost={parent_post} tweetList={userTweets} updateTweetList={updateTweetList} />
                ))
            }

        </div>
        <EditProfileModal isVisible={editMode} onClose={() => setEditMode(false)}/>
        </Fragment>
    );
}

export default ProfileArea;

//photos on tweet component
//user friendly time in tweets
//rem mobile responsiveness work
//post modal rem upload work
//hidden header and modal for mobile devices.
//edit profile should work on incomplete form data

//show edit/profile or follow button depending on active user.
//like, notification, follow, following, retweets, quote-tweet, replies etc.
//option to delete tweets from user profile.
//make search bar usable to search other profiles based on name.
//dynamic content for who to follow section.
//complete the inner post page.
//show like and retweet counts.
//option to change cover photo in edit profile.
//reset scroll when going to a post page.

//docker-compose include
//same domain using nginx
//mobile-reponsiveness and FE touchups..
//deploy..


//finally, onto messages.
//messages sticky button, show messages on expanding.
//users should be able to message each other.

//make tweets with photo upload option.