import React from "react";
import { useEffect } from "react";
import Tweet from "./tweet";

import { useNavigate } from "react-router-dom";

function ProfileArea(props) {
    const [userExists, setUserExists] = React.useState(true);
    const [userData, setUserData] = React.useState({});
    const [userTweets, setTweetState] = React.useState([]);
    const navigate = useNavigate();

    let backLink = () => {
        navigate(-1);
    };
    
    useEffect(() => {
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
            if (data) {
                setUserData(data);
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
            <div className="basis-5/12">
                <h3 className="font-bold text-3xl mt-24 p-4">Sorry, the user @{props.userName} doesn't exist.</h3>
            </div>
        );
    }

    return (
        <div className="basis-5/12">
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
                    <img src="/lex.jpeg" className="h-28 w-28 rounded-full" />
                </div>
            </div>

            <div className="flex flex-row justify-end p-2">
                <button className="font-bold p-2 border-[0.5px] border-gray-300 rounded-full hover:bg-gray-300">Edit profile</button>
            </div>

            <div className="flex flex-col mt-5 px-2">
                <p className="font-bold text-2xl">{userData.fullname}</p>
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

            <div className="flex flex-row border-b-[0.5px]">
                <button className="flex-auto p-4 font-bold text-gray-500 hover:bg-gray-300">Posts</button>
                <button className="flex-auto p-4 font-bold text-gray-500 hover:bg-gray-300">Replies</button>
                <button className="flex-auto p-4 font-bold text-gray-500 hover:bg-gray-300">Highlights</button>
                <button className="flex-auto p-4 font-bold text-gray-500 hover:bg-gray-300">Articles</button>
                <button className="flex-auto p-4 font-bold text-gray-500 hover:bg-gray-300">Media</button>
                <button className="flex-auto p-4 font-bold text-gray-500 hover:bg-gray-300">Likes</button>
            </div>

            <div className="flex flex-col">
                {
                    userTweets && userTweets.map(({id, fullname, username, content, created_on}) => (
                        <Tweet id={id} displayName={fullname} userName={"@" + username} tweetText={content} originalTimestamp={created_on} />
                    ))
                }
            </div>

        </div>
    );
}

export default ProfileArea;