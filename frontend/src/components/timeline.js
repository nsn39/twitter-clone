import React from 'react';
import { useEffect, Fragment } from 'react';
import Tweet from "./tweet";
import { v4 as uuidv4 } from 'uuid';

import MobileNavModal from './mobileNavModal';


function Timeline ({setPostMode, setActiveTweetData}) {
    const {REACT_APP_BACKEND_URL, REACT_APP_FS_URL} = process.env;
    
    const [userData, setUserData] = React.useState({
        "display_picture_link": "undefined"
    });

    const [inputText, setInputText] = React.useState("");
    const [userTweets, setTweetState] = React.useState([]);
    const [mobileNavMode, setMobileNavMode] = React.useState(false);

    const handleMobileNavClick = () => {
        setMobileNavMode(true);
    }

    const handleFeedStateChange = (state_id) => {
        if (state_id == "state1") {
            console.log("for you");
            document.getElementById("feed_state_2").classList.remove("underline");
            document.getElementById("feed_state_1").classList.add("underline");
        }
        else if (state_id == "state2") {
            console.log("following");
            document.getElementById("feed_state_2").classList.add("underline");
            document.getElementById("feed_state_1").classList.remove("underline");
        }
    }
    
    useEffect(() => {
        console.log(".env variable: ", REACT_APP_BACKEND_URL);
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
                setUserData({
                    "full_name": data.fullname,
                    "username": data.username,
                    "display_picture_link": data.profile_pic_filename
                });
                console.log("user data: ", userData);
            }
        })

        fetch(REACT_APP_BACKEND_URL + 'tweets/', {
            "method": "GET",
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
    

    let inputHandler = (e) => {
        console.log(e);
        //e.preventDefault();
        setInputText(e.target.value);
    }

    let tweetSubmitter = () => {
        const currentTimestampUTC = new Date(Date.now());
        const newTweet = {
            "id": uuidv4(),
            "displayName": "Dummy",
            "userName": "Dummy",
            "postType": "tweet",
            "parentPostRef": null,
            "tweetText": inputText,
            "originalTimestamp": currentTimestampUTC.toISOString()
        };
    
        const options = {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTweet)
        };

        fetch(REACT_APP_BACKEND_URL + 'tweet', options)
            .then((res) => {
                if (res.status == 201) {
                    return res.json();
                }else {
                    return null;
                }
            })
            .then((data) => {
                if (data) {
                    setTweetState([data, ...userTweets]);
                    setInputText("");
                    console.log("userTweets: ", userTweets);
                }
            })
            .catch(error => console.error(error));
    }

    return (
        <Fragment>
        <div className="md:w-[46%] border-x-[0.5px] border-gray-200">
            <div className='flex flex-row md:hidden px-4 py-3 items-center'>
                <button onClick={handleMobileNavClick} className='h-9 w-9'>
                    <img className='h-8 w-8 rounded-full' src={REACT_APP_FS_URL + userData.display_picture_link} />
                </button>

                <div className='w-full h-9 flex items-center justify-center'>
                    <svg className="h-8 w-8" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#1D9BF0" d="M13.567 5.144c.008.123.008.247.008.371 0 3.796-2.889 8.173-8.172 8.173v-.002A8.131 8.131 0 011 12.398a5.768 5.768 0 004.25-1.19 2.876 2.876 0 01-2.683-1.995c.431.083.875.066 1.297-.05A2.873 2.873 0 011.56 6.348v-.036c.4.222.847.345 1.304.36a2.876 2.876 0 01-.89-3.836 8.152 8.152 0 005.92 3 2.874 2.874 0 014.895-2.619 5.763 5.763 0 001.824-.697 2.883 2.883 0 01-1.262 1.588A5.712 5.712 0 0015 3.656a5.834 5.834 0 01-1.433 1.488z"></path></g></svg>
                </div>
            </div>

            <div className="flex flex-row font-bold w-full justify-around border-b border-slate-300">
                <button onClick={() => handleFeedStateChange("state1")} className="hover:bg-gray-400 h-full w-full py-4 flex items-center justify-center">
                    <p className='underline decoration-4 decoration-sky-400 underline-offset-[18px]' id='feed_state_1'>For you</p>                    
                </button>
                
                <button onClick={() => handleFeedStateChange("state2")} className="hover:bg-gray-400 h-full w-full py-4 flex items-center justify-center">
                    <p className='decoration-4 decoration-sky-400 underline-offset-[18px]' id='feed_state_2'>Following</p>
                </button>
            </div>
            
            <div className="flex flex-row p-3 items-start border-b border-slate-300">
                <img src={REACT_APP_FS_URL + userData.display_picture_link} className='flex-none h-10 w-10 rounded-full mr-4' />

                <div className='grow flex flex-col'>
                    <textarea className="h-24 w-full mr-2 border-b border-slate-300 outline-none resize-none text-xl" type="text" placeholder="What's happening?" onChange={inputHandler} value={inputText}/>

                    <div className='flex flex-row items-center justify-between mt-2'>
                        <div className='flex flex-row items-center justify-center'>
                            <div className='h-9 w-9 flex items-center justify-center hover:bg-sky-200 rounded-full cursor-pointer'>
                                <svg className='h-5 w-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 8.976C3 4.05476 4.05476 3 8.976 3H15.024C19.9452 3 21 4.05476 21 8.976V15.024C21 19.9452 19.9452 21 15.024 21H8.976C4.05476 21 3 19.9452 3 15.024V8.976Z" stroke="#38bdf8" stroke-width="2"></path> <path d="M17.0045 16.5022L12.7279 12.2256C9.24808 8.74578 7.75642 8.74578 4.27658 12.2256L3 13.5022" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"></path> <path d="M21 13.6702C18.9068 12.0667 17.4778 12.2919 15.198 14.3459" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"></path> <path d="M17 8C17 8.55228 16.5523 9 16 9C15.4477 9 15 8.55228 15 8C15 7.44772 15.4477 7 16 7C16.5523 7 17 7.44772 17 8Z" stroke="#38bdf8" stroke-width="2"></path> </g></svg>
                            </div>
                            
                            <div className='h-9 w-9 flex items-center justify-center hover:bg-sky-200 rounded-full cursor-pointer'>
                                <svg className='h-5 w-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 4C4 3.44772 4.44772 3 5 3H14H14.5858C14.851 3 15.1054 3.10536 15.2929 3.29289L19.7071 7.70711C19.8946 7.89464 20 8.149 20 8.41421V20C20 20.5523 19.5523 21 19 21H5C4.44772 21 4 20.5523 4 20V4Z" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"></path> <path d="M20 8H15V3" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 13H8C7.44772 13 7 13.4477 7 14V16C7 16.5523 7.44772 17 8 17H8.5C9.05228 17 9.5 16.5523 9.5 16V15.5" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9 15.5H9.5" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 13V17" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15 17V13L17 13" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15.5 15H16.5" stroke="#38bdf8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            </div>
                            
                            <div className='h-9 w-9 flex items-center justify-center hover:bg-sky-200 rounded-full cursor-pointer'>
                                <svg className='h-5 w-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8.5 11C9.32843 11 10 10.3284 10 9.5C10 8.67157 9.32843 8 8.5 8C7.67157 8 7 8.67157 7 9.5C7 10.3284 7.67157 11 8.5 11Z" fill="#38bdf8"></path> <path d="M17 9.5C17 10.3284 16.3284 11 15.5 11C14.6716 11 14 10.3284 14 9.5C14 8.67157 14.6716 8 15.5 8C16.3284 8 17 8.67157 17 9.5Z" fill="#38bdf8"></path> <path d="M8.88875 13.5414C8.63822 13.0559 8.0431 12.8607 7.55301 13.1058C7.05903 13.3528 6.8588 13.9535 7.10579 14.4474C7.18825 14.6118 7.29326 14.7659 7.40334 14.9127C7.58615 15.1565 7.8621 15.4704 8.25052 15.7811C9.04005 16.4127 10.2573 17.0002 12.0002 17.0002C13.7431 17.0002 14.9604 16.4127 15.7499 15.7811C16.1383 15.4704 16.4143 15.1565 16.5971 14.9127C16.7076 14.7654 16.8081 14.6113 16.8941 14.4485C17.1387 13.961 16.9352 13.3497 16.4474 13.1058C15.9573 12.8607 15.3622 13.0559 15.1117 13.5414C15.0979 13.5663 14.9097 13.892 14.5005 14.2194C14.0401 14.5877 13.2573 15.0002 12.0002 15.0002C10.7431 15.0002 9.96038 14.5877 9.49991 14.2194C9.09071 13.892 8.90255 13.5663 8.88875 13.5414Z" fill="#38bdf8"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM12 20.9932C7.03321 20.9932 3.00683 16.9668 3.00683 12C3.00683 7.03321 7.03321 3.00683 12 3.00683C16.9668 3.00683 20.9932 7.03321 20.9932 12C20.9932 16.9668 16.9668 20.9932 12 20.9932Z" fill="#38bdf8"></path> </g></svg>
                            </div>
                            
                            <div className='h-9 w-9 flex items-center justify-center hover:bg-sky-200 rounded-full cursor-pointer'>
                                <svg className='h-5 w-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12 21C15.5 17.4 19 14.1764 19 10.2C19 6.22355 15.866 3 12 3C8.13401 3 5 6.22355 5 10.2C5 14.1764 8.5 17.4 12 21Z" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            </div>
                        </div>

                        <button className="text-white w-20 font-bold bg-sky-400 px-4 py-2 rounded-full" onClick={tweetSubmitter}>Post</button>
                    </div>
                </div>
            </div>


            {
                userTweets && userTweets.map(({id, fullname, username, content, created_on, profile_pic_filename, post_type, parent_post}) => (
                    <Tweet 
                        key={id} 
                        id={id} 
                        displayName={fullname} 
                        userName={username} 
                        tweetText={content} 
                        originalTimestamp={created_on} 
                        displayPicture={profile_pic_filename} 
                        setPostMode={setPostMode} 
                        setActiveTweetData={setActiveTweetData} 
                        postType={post_type} 
                        parentPost={parent_post} 
                        contextType="timeline" 
                        setUserTweets={setTweetState} 
                    />
                ))
            }
        </div>
        
        <MobileNavModal isVisible={mobileNavMode} onClose={() => setMobileNavMode(false)} userData={userData} />
        </Fragment>
    )
}

export default Timeline;
//#38bdf8