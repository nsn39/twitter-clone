import React from "react";
import { useEffect, useState, Fragment } from "react";
import Tweet from "./tweet";
import EditProfileModal from "./editProfileModal";
import FollowButton from "./followButton";

import { useNavigate } from "react-router-dom";

function ProfileArea(props) {
    const {REACT_APP_BACKEND_URL, REACT_APP_FS_URL} = process.env;
    const [userExists, setUserExists] = React.useState(true);
    const [userData, setUserData] = React.useState({
        "display_picture_link": "undefined"
    });
    const [activeUserData, setActiveUserData] = React.useState({});
    const [userTweets, setTweetState] = React.useState([]);
    const [userAnalytics, setUserAnalytics] = React.useState({});
    const [editMode, setEditMode] = useState(false);

    const navigate = useNavigate();

    let backLink = () => {
        navigate(-1);
    };

    const updateTweetList = (newList) => {
        setTweetState(newList);
    };

    const fetchUserAnalytics = (profile_id) => {
        console.log("Fetche called with id: ", profile_id);
        fetch(REACT_APP_BACKEND_URL + "user_analytics/" + profile_id, {
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
                setUserAnalytics({
                    "follower_count": data.follower_count,
                    "following_count": data.following_count,
                    "posts_count": data.posts_count
                });
            }
        })

    }
    
    useEffect(() => {
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
                console.log(data.fullname);
                setActiveUserData({
                    "username": data.username,
                });
                console.log("user data: ", userData);
            }
        })

        fetch(REACT_APP_BACKEND_URL + "profile/" + props.userName, {
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
                console.log("profile data received: ", data);
                setUserData({
                    "id": data.id,
                    "full_name": data.fullname,
                    "username": data.username,
                    "display_picture_link": data.profile_pic_filename,
                    "joined_date": data.created_on,
                    "birth_date": data.birth_day,
                    "birth_year": data.birth_year,
                    "birth_month": data.birth_month
                });
                fetchUserAnalytics(data.id);
                console.log("User data: ", data);
            }else {
                setUserExists(false);
            }
        })

        fetch(REACT_APP_BACKEND_URL + 'user_tweets/' + props.userName, {
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
                    <p className="text-xl font-bold">{userData.username}</p>
                    <p className="text-gray-500 text-sm">{userAnalytics.posts_count + " posts"}</p>
                </div>
            </div>

            <div className="relative">
                <img src="/cover.jpeg" className="h-[200px] w-[600px]"/>

                <div className="absolute h-30 w-30 rounded-full border-2 border-white top-[150px] left-[20px]">
                    <img src={REACT_APP_FS_URL + userData.display_picture_link} className="h-28 w-28 rounded-full" />
                </div>
            </div>

            <div className="flex flex-row justify-end p-2">
                <FollowButton currentUsername={activeUserData.username} profileUsername={userData.username} setEditModeFunction={setEditMode} />
            </div>

            <div className="flex flex-col mt-5 px-2">
                <p className="font-bold text-2xl">{userData.full_name}</p>
                <p className="text-gray-400">{"@" + userData.username}</p>
                <div className="flex flex-row text-gray-400 mt-2">
                    <p>{"Born " + userData.birth_date + " " + userData.birth_month + " ," + userData.birth_year}</p>
                    <p className="ml-5">{"Joined " + userData.joined_date}</p>
                </div>
                
                <div className="flex flex-row mt-2 items-center">
                    <p className="font-bold mr-1">{userAnalytics.following_count}</p> <p className="text-gray-400 text-md">Following</p>
                    <p className="ml-5 font-bold mr-1">{userAnalytics.follower_count}</p> <p className="text-gray-400 text-md">Followers</p> 
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
//fix reply button in post page.
//  set up .envs for dev and prod react envs, run npm build
//fix the delete complexity, retweet only once and unable to retweet after one level.
//show "this post is deleted."
//no retweets on replies for now.
//show follow count in profile

//docker-compose include
//same domain using nginx
//mobile-reponsiveness and FE touchups..
//deploy..


//finally, onto messages.
//messages sticky button, show messages on expanding.
//users should be able to message each other.

//make tweets with photo upload option.