import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutsideClick } from '../hooks/useOutsideClick';
import beautifyTimestamp from '../utils/beautifyDateTime';
import Tweet from "./tweet";

function PostDetail(props) {
    const {REACT_APP_BACKEND_URL, REACT_APP_FS_URL} = process.env;
    const [tweetData, setTweetData] = useState({
        "id": props.tweetSlug,
        "tweetText": "",
        "displayName": "",
        "userName": "",
        "displayPicture": "",
        "originalTimestamp": "",
        "postType": "",
        "parentPost": ""
    });
    const [tweetAnalytics, setTweetAnalytics] = useState({
        "likes_count": 0
    });
    const [activeUserData, setActiveUserData] = useState({});
    const simplifyUUID = (str) => {
        return str.replaceAll("-", "");
    }
    const [dateInfo, setDateInfo] = useState({});
    const [tweetElementId, setTweetElementId] = useState(simplifyUUID(props.tweetSlug));
    const [innerTweetID, setInnerTweetID] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [replyText, setReplyText] = useState("");
    const [tweetReplies, setTweetReplies] = useState([]);
    const navigate = useNavigate();

    const replyInputHandler = (e) => {
        setReplyText(e.target.value);
    }

    let backLink = () => {
        navigate(-1);
    };

    const ref = useOutsideClick(() => {
        let btn_area = document.getElementById("retweet_icon_" + tweetElementId);
        btn_area.classList.add("hidden");
    });

    const onMouseOverPic = () => {
        let dropdown = document.getElementById(tweetElementId);
        dropdown.classList.toggle("hidden");
    }

    const onMouseOutPic = () => {
        let dropdown = document.getElementById(tweetElementId);
        dropdown.classList.toggle("hidden");
    }

    const onMouseOverInnerTweetDate = () => {
        let dropdown = document.getElementById(innerTweetID);
        dropdown.classList.toggle("hidden");
    }

    const onMouseOutInnerTweetDate = () => {
        let dropdown = document.getElementById(innerTweetID);
        dropdown.classList.toggle("hidden");
    }

    const onRetweetIconClick = (e) => {
        e.stopPropagation();
        let dropdown = document.getElementById("retweet_icon_" + tweetElementId);
        dropdown.classList.remove("hidden");
    }

    const onPostOptionsClick = (e) => {
        e.stopPropagation();
        let div_element = document.getElementById("post_options_div_" + tweetElementId);
        div_element.classList.toggle("hidden");
    }

    const onMouseOverLike = () => {
        let svg_element = document.querySelector("#like_svg_" + tweetElementId + " > g > path");
        svg_element.setAttribute("stroke", "#e01b24")
    }

    const onMouseOutLike = () => {
        let svg_element = document.querySelector("#like_svg_" + tweetElementId + " > g > path");
        if (!isLiked) {
            svg_element.setAttribute("stroke", "#000000")
        }
    }

    const onMouseOverRetweet = () => {
        let svg_element = document.querySelector("#retweet_svg_" + tweetElementId);
        svg_element.setAttribute("fill", "#33d17a")
    }

    const onMouseOutRetweet = () => {
        let svg_element = document.querySelector("#retweet_svg_" + tweetElementId);
        svg_element.setAttribute("fill", "#000000")
    }

    const onMouseOverReply = () => {
        let svg_element = document.querySelector("#reply_svg_" + tweetElementId + " > g > path");
        svg_element.setAttribute("stroke", "#3584e4")
    }

    const onMouseOutReply = () => {
        let svg_element = document.querySelector("#reply_svg_" + tweetElementId + " > g > path");
        svg_element.setAttribute("stroke", "#000000")
    }

    const onMouseOverShare = () => {
        let svg_element = document.querySelector("#share_svg_" + tweetElementId + " > g > g > path");
        svg_element.setAttribute("stroke", "#3584e4")
    }

    const onMouseOutShare = () => {
        let svg_element = document.querySelector("#share_svg_" + tweetElementId + " > g > g > path");
        svg_element.setAttribute("stroke", "#000000")
    }

    const onQuoteTweetClick = (e) => {
        e.stopPropagation();
        props.setPostMode(true);
        props.setActiveTweetData({
            "type": "quote",
            "pic": REACT_APP_FS_URL + props.displayPicture,
            "datetime": dateInfo.beautifiedTimeAgo,
            "content": props.tweetText,
            "fullname": props.displayName,
            "username": props.userName,
            "parentPostRef": props.id,
        });
    }

    const onReplyClick = (e) => {
        e.stopPropagation();
        props.setPostMode(true);
        props.setActiveTweetData({
            "type": "reply",
            "pic": REACT_APP_FS_URL + props.displayPicture,
            "datetime": dateInfo.beautifiedTimeAgo,
            "content": tweetData.tweetText,
            "fullname": tweetData.displayName,
            "username": tweetData.userName,
            "parentPostRef": tweetData.id,
        });
    }

    const onReplySend = () => {
        const currentTimestampUTC = new Date(Date.now());

        const newTweet = {
            "postType": "reply",
            "parentPostRef": tweetData.id,
            "tweetText": replyText,
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
                setTweetReplies([data, ...tweetReplies]);
                setReplyText("");
            }
        })
        .catch(error => console.error(error));
    };

    const colorLikeButton = () => {
        let svg_element = document.querySelector("#like_svg_" + tweetElementId);
        svg_element.setAttribute("fill", "#e01b24");
        let svg_element_path = document.querySelector("#like_svg_" + tweetElementId + " > g > path");
        svg_element_path.setAttribute("stroke", "#e01b24");
    }

    const uncolorLikeButton = () => {
        let svg_element = document.querySelector("#like_svg_" + tweetElementId);
        svg_element.setAttribute("fill", "none")
        let svg_element_path = document.querySelector("#like_svg_" + tweetElementId + " > g > path");
        svg_element_path.setAttribute("stroke", "#000000")
    }

    const handleLikeClick = (e) => {
        e.stopPropagation();
        //handle unlike as well.

        if (!isLiked) {
            //FE changes.
            colorLikeButton();
            setIsLiked(true);
            setTweetAnalytics((prevFormData) => ({ ...prevFormData, ["likes_count"]: (tweetAnalytics.likes_count + 1) }));
            //BE changes
            fetch(REACT_APP_BACKEND_URL + "like/" + props.id, {
                method: "POST",
                credentials: "include"
            })
            .then((res) => {
                if (res.status != 201) {
                    //rever FE changes.
                    uncolorLikeButton();

                }
            })
        }
        else {
            uncolorLikeButton();
            setIsLiked(false);
            setTweetAnalytics((prevFormData) => ({ ...prevFormData, ["likes_count"]: (tweetAnalytics.likes_count - 1) }));
            fetch(REACT_APP_BACKEND_URL + "unlike/" + props.id, 
                {
                    method: "DELETE",
                    credentials: "include"
                }
            )
            .then((res) => {
                if (res.status != 204) {
                    //rever FE changes.
                    colorLikeButton();
                }
            })
        }
    };

    let retweetSubmitter = () => {
        const currentTimestampUTC = new Date(Date.now());
        const newTweet = {
            "postType": "retweet",
            "parentPostRef": tweetData.id,
            "tweetText": "",
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
                //NOTHING
            }
        })
        .catch(error => console.error(error));
    }

    const onRetweetClick = (e) => {
        e.stopPropagation();
        let btn = document.getElementById("retweet_icon_" + tweetElementId);
        btn.classList.add("hidden");
        retweetSubmitter();
    }

    const ReplyButton = () => {
        if (replyText == "") {
            return (
                <button className='h-9 px-4 cursor-default rounded-full text-white bg-sky-200 font-bold'>
                    Reply
                </button>
            );
        }
        else {
            return (
                <button onClick={onReplySend} className='h-9 px-4 rounded-full text-white bg-sky-400 hover:bg-sky-500 font-bold'>
                    Reply
                </button>
            );
        }
    }

    const fetchActiveUserDetails = () => {
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
                    "full_name": data.fullname,
                    "username": data.username,
                    "displayPicture": data.profile_pic_filename
                });
            }
        })
    }

    const handleInnerTweetClick = (e) => {
        e.stopPropagation();
        const parentPostID = tweetData.parentPost.id;
        navigate("/tweet/" + parentPostID);
    }

    const QuoteTweetComponent = () => {
        if (tweetData.postType != "quote"){
            return null;
        }
        let originalTweetData = tweetData.parentPost;

        if (originalTweetData == null) {
            return (
                <div className="w-full flex flex-col border-[0.5px] border-slate-400 rounded-2xl p-4 mt-2 hover:bg-gray-300">
                    <p className='font-bold text-gray-400'>
                        This tweet has been deleted by the user.
                    </p>
                </div>
            )
        }

        setInnerTweetID(originalTweetData.id);
        let picURL = REACT_APP_FS_URL + originalTweetData.profile_pic_filename;
        let createdOn = beautifyTimestamp(originalTweetData.created_on);

        return (
            <div onClick={handleInnerTweetClick} className="w-full flex flex-col cursor-pointer border-[0.5px] border-slate-400 rounded-2xl p-4 mt-2 hover:bg-gray-300">
                <div className="flex flex-row items-center mb-2">
                    <img className='flex-none h-6 w-6 rounded-full mr-1' src={picURL} />
                    <p className="font-bold hover:underline mr-1">
                        <a href="./">{originalTweetData.fullname}</a> 
                    </p>
                    <p className="flex flex-row text-base text-gray-400 mr-1">
                        <p className='mr-1'>&bull;</p>
                        <a href="./">{"@" + originalTweetData.username }</a>
                    </p>
                    <p className='text-gray-400 mr-1'>&bull;</p>
                    <div className='relative w-auto'>
                        <p onMouseOver={onMouseOverInnerTweetDate} onMouseOut={onMouseOutInnerTweetDate} className='text-sm text-gray-400 hover:underline'>{createdOn.beautifiedTimeAgo}</p>

                        <div id={originalTweetData.id} className="w-[130px] flex items-center justify-center absolute hidden top-[20px] left-[0px] p-1 bg-slate-800 opacity-80 rounded-md">
                            <p className="text-xs text-white">{createdOn.beautifiedTimeAgoHover}</p>
                        </div>
                    </div>
                
                </div>
                <p className="border-b-200 text-base">{originalTweetData.content}</p>
            </div>
        );
    };

    // search for the post in JSON file.
    //id, fullname, username, content, created_on, profile_pic_filename, post_type, parent_post
    useEffect(() => {
        window.scrollTo(0, 0);

        fetch(REACT_APP_BACKEND_URL + "tweet/" + props.tweetSlug, {
            "method": "GET",
            credentials: "include"
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            console.log("tweet Data:" , data);
            setTweetData({
                "id": data.id,
                "tweetText": data.content,
                "displayName": data.fullname,
                "userName": data.username,
                "displayPicture": data.profile_pic_filename,
                "originalTimestamp": data.created_on,
                "parentPost": data.parent_post,
                "postType": data.post_type
            });
            const timeBeautifyResult = beautifyTimestamp(data.created_on);
            setDateInfo({
                "beautifiedTimeAgoPost": timeBeautifyResult.beautifiedTimeAgoPost
            });
        });

        fetch(REACT_APP_BACKEND_URL + "replies/" + props.tweetSlug, {
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
                setTweetReplies(data);
            }
        })

        fetch(REACT_APP_BACKEND_URL + "has_liked/" + props.tweetSlug, {
            method: "GET",
            credentials: "include"
        })
        .then((res) => {
            if (res.status == 200) {
                colorLikeButton();
                setIsLiked(true);
            }
        })

        fetch(REACT_APP_BACKEND_URL + "post_analytics/" + props.tweetSlug, {
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
                setTweetAnalytics(data);
            }
        })

        fetchActiveUserDetails();

    }, []);

    return (
        <div className="h-screen md:w-[46%] border-x-[0.5px] border-gray-200 flex flex-col">
            <div className="flex flex-row px-2 py-3 items-center">
                <button onClick={backLink} className="h-10 w-10 hover:bg-slate-300 rounded-full flex flex-col items-center justify-center">
                    <svg className="h-5 w-5" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path><path fill="#000000" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path></g></svg>
                </button>
                <h3 className="font-bold text-xl ml-6">Post</h3>
            </div>

            <div className="flex flex-row items-center px-4">
                <img src={REACT_APP_FS_URL + tweetData.displayPicture} className="h-10 w-10 rounded-full"></img>
                <div className="flex flex-col ml-2">
                    <a href="/" className="font-bold hover:underline">{tweetData.displayName}</a>
                    <a href="/" className="text-slate-400">@{tweetData.userName}</a>
                </div>
            </div>

            <div className="flex flex-col px-4 mt-2">
                <p className="mb-2">{tweetData.tweetText}</p>
                <QuoteTweetComponent />
                <p className="text-slate-400 mt-1 pb-2">{dateInfo.beautifiedTimeAgoPost}</p>

                <div className='flex flex-row p-2 items-center justify-stretch border-y-[0.1px] border-gray-300'>
                    <div className='flex flex-row w-full'>
                        <button onClick={onReplyClick} onMouseOver={onMouseOverReply} onMouseOut={onMouseOutReply} className='h-9 w-9 flex items-center justify-center hover:bg-blue-200 rounded-full'>
                            <svg id={"reply_svg_" + tweetElementId} className='h-6 w-6' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 17V15.8C20 14.1198 20 13.2798 19.673 12.638C19.3854 12.0735 18.9265 11.6146 18.362 11.327C17.7202 11 16.8802 11 15.2 11H4M4 11L8 7M4 11L8 15" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        </button>
                    </div>

                    <div className='relative flex flex-row w-full'>
                        <button onClick={onRetweetIconClick} onMouseOver={onMouseOverRetweet} onMouseOut={onMouseOutRetweet} className='h-9 w-9 flex items-center justify-center hover:bg-green-200 rounded-full'>
                            <svg id={"retweet_svg_" + tweetElementId} className='h-6 w-6' fill="#000000" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M136 552h63.6c4.4 0 8-3.6 8-8V288.7h528.6v72.6c0 1.9.6 3.7 1.8 5.2a8.3 8.3 0 0 0 11.7 1.4L893 255.4c4.3-5 3.6-10.3 0-13.2L749.7 129.8a8.22 8.22 0 0 0-5.2-1.8c-4.6 0-8.4 3.8-8.4 8.4V209H199.7c-39.5 0-71.7 32.2-71.7 71.8V544c0 4.4 3.6 8 8 8zm752-80h-63.6c-4.4 0-8 3.6-8 8v255.3H287.8v-72.6c0-1.9-.6-3.7-1.8-5.2a8.3 8.3 0 0 0-11.7-1.4L131 768.6c-4.3 5-3.6 10.3 0 13.2l143.3 112.4c1.5 1.2 3.3 1.8 5.2 1.8 4.6 0 8.4-3.8 8.4-8.4V815h536.6c39.5 0 71.7-32.2 71.7-71.8V480c-.2-4.4-3.8-8-8.2-8z"></path> </g></svg>
                        </button>

                        <div ref={ref} id={"retweet_icon_" + tweetElementId} className='absolute right-[80px] hidden flex flex-col rounded-2xl bg-white overflow-hidden shadow-2xl border-[0.5px] border-slate-150'>
                            <button onClick={onRetweetClick} className='px-6 py-2 text-base font-bold hover:bg-slate-100'>
                                Retweet
                            </button>

                            <button onClick={onQuoteTweetClick} className='px-6 py-2 text-base font-bold hover:bg-slate-100 '>
                                Quote
                            </button>
                        </div>
                    </div>

                    <div className='flex flex-row w-full items-center text-slate-600 hover:text-red-400'>
                        <button onClick={handleLikeClick} onMouseOver={onMouseOverLike} onMouseOut={onMouseOutLike} className='h-9 w-9 flex items-center justify-center hover:bg-red-200 rounded-full'>
                            <svg id={"like_svg_" + tweetElementId} className='hover:bg-red-200 hover:rounded-full h-6 w-6' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        </button>

                        {
                            (tweetAnalytics.likes_count > 0) && <p className='ml-1 text-sm'>{tweetAnalytics.likes_count}</p>
                        }
                    </div>

                    <div className='flex flex-row w-full'>
                        <button onMouseOver={onMouseOverShare} onMouseOut={onMouseOutShare} className='h-9 w-9 flex items-center justify-center hover:bg-blue-200 rounded-full'>
                            <svg id={"share_svg_" + tweetElementId} className='h-6 w-6' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Communication / Share_iOS_Export"> <path id="Vector" d="M9 6L12 3M12 3L15 6M12 3V13M7.00023 10C6.06835 10 5.60241 10 5.23486 10.1522C4.74481 10.3552 4.35523 10.7448 4.15224 11.2349C4 11.6024 4 12.0681 4 13V17.8C4 18.9201 4 19.4798 4.21799 19.9076C4.40973 20.2839 4.71547 20.5905 5.0918 20.7822C5.5192 21 6.07899 21 7.19691 21H16.8036C17.9215 21 18.4805 21 18.9079 20.7822C19.2842 20.5905 19.5905 20.2839 19.7822 19.9076C20 19.4802 20 18.921 20 17.8031V13C20 12.0681 19.9999 11.6024 19.8477 11.2349C19.6447 10.7448 19.2554 10.3552 18.7654 10.1522C18.3978 10 17.9319 10 17 10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className='flex flex-row p-4 border-b-[0.1px] border-slate-300'>
                <img src={REACT_APP_FS_URL + activeUserData.displayPicture} className='h-10 w-10 rounded-full'></img>
                <textarea className='w-full h-20 mx-2 outline-none text-xl resize-none' placeholder='Post your reply' onChange={replyInputHandler} value={replyText}></textarea>

                <ReplyButton />
            </div>
            
            {
                tweetReplies && tweetReplies.map(({id, fullname, username, content, created_on, profile_pic_filename}) => (
                    <Tweet key={id} 
                        id={id} 
                        displayName={fullname} 
                        userName={username} 
                        tweetText={content} 
                        originalTimestamp={created_on}
                        displayPicture={profile_pic_filename}
                        contextType="timeline"
                        postType="reply"
                    />
                ))
            }
        </div>
    );
};

export default PostDetail;