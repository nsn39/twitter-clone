import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOutsideClick } from '../hooks/useOutsideClick';
import beautifyTimestamp from '../utils/beautifyDateTime';

function Tweet(props) {
    const {REACT_APP_BACKEND_URL, REACT_APP_FS_URL} = process.env;
    const [tweetData, setTweetData] = useState({
        "id": props.id,
        "tweetText": props.tweetText,
        "displayName": props.displayName,
        "userName": props.userName,
        "displayPicture": props.displayPicture,
        "originalTimestamp": props.originalTimestamp
    });
    const [tweetAnalytics, setTweetAnalytics] = useState({
        "likes_count": 0,
        "retweets_count": 0,
        "quotes_count": 0,
        "total_retweets": 0,
        "replies_count": 0
    });

    const simplifyUUID = (str) => {
        return str.replaceAll("-", "");
    }

    const navigate = useNavigate();
    const [dateInfo, setDateInfo] = useState({});
    const [tweetElementId, setTweetElementId] = useState(simplifyUUID(props.id));
    const [innerTweetID, setInnerTweetID] = useState("");
    const [isLiked, setIsLiked] = useState(false);
    const [isRetweeted, setIsRetweeted] = useState(false);
    const [likeCountColor, setLikeCountColor] = useState("");
    const [retweetCountColor, setRetweetCountColor] = useState("");

    const ref = useOutsideClick(() => {
        let btn_area = document.getElementById("retweet_icon_" + tweetElementId);
        btn_area.classList.add("hidden");
    });

    const optionsButtonRef = useOutsideClick(() => {
        let div_area = document.getElementById("post_options_div_" + tweetElementId);
        div_area.classList.add("hidden");
    });

    let handleClick = () => {
        navigate("/tweet/" + tweetData.id);
    }

    let handleInnerTweetClick = (e) => {
        e.stopPropagation();
        let parentPostID = props.parentPost.id;
        navigate("/tweet/" + parentPostID);
    }

    //#e01b24
    
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
            svg_element.setAttribute("stroke", "#6b7280")
        }
    }

    const onMouseOverRetweet = () => {
        let svg_element = document.querySelector("#retweet_svg_" + tweetElementId);
        svg_element.setAttribute("fill", "#33d17a")
    }

    const onMouseOutRetweet = () => {
        if (!isRetweeted) {
            let svg_element = document.querySelector("#retweet_svg_" + tweetElementId);
            svg_element.setAttribute("fill", "#6b7280");
        }
    }

    const onMouseOverReply = () => {
        let svg_element = document.querySelector("#reply_svg_" + tweetElementId + " > g > path");
        svg_element.setAttribute("stroke", "#3584e4")
    }

    const onMouseOutReply = () => {
        let svg_element = document.querySelector("#reply_svg_" + tweetElementId + " > g > path");
        svg_element.setAttribute("stroke", "#6b7280")
    }

    const onMouseOverShare = () => {
        let svg_element = document.querySelector("#share_svg_" + tweetElementId + " > g > g > path");
        svg_element.setAttribute("stroke", "#3584e4")
    }

    const onMouseOutShare = () => {
        let svg_element = document.querySelector("#share_svg_" + tweetElementId + " > g > g > path");
        svg_element.setAttribute("stroke", "#6b7280")
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
            setLikeCountColor("text-red-400");
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
            setLikeCountColor("");
            setTweetAnalytics((prevFormData) => ({ ...prevFormData, ["likes_count"]: (tweetAnalytics.likes_count - 1) }));
            fetch(REACT_APP_BACKEND_URL + "unlike/" + tweetData.id, 
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
        if (isRetweeted) {
            return;
        }
        let postType = "retweet";
        
        const currentTimestampUTC = new Date(Date.now());
        const newTweet = {
            "postType": postType,
            "parentPostRef": props.id,
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
                    //setTweetState([data, ...userTweets]);
                    //setInputText("");
                    //console.log("userTweets: ", userTweets);
                }
            })
            .catch(error => console.error(error));
    }

    const onRetweetClick = (e) => {
        e.stopPropagation();

        let btn = document.getElementById("retweet_icon_" + tweetElementId);
        btn.classList.add("hidden");

        if (props.postType == "reply") { //no retweet if a reply.
            return;
        }

        if (!isRetweeted) {
            onMouseOverRetweet();
            retweetSubmitter();
            setIsRetweeted(true);
            setRetweetCountColor("text-green-400");

            setTweetAnalytics((prevFormData) => ({ 
                ...prevFormData, 
                ["retweets_count"]: (tweetAnalytics.retweets_count + 1),
                ["total_retweets"]: (tweetAnalytics.total_retweets + 1)
            }));
        }
        else {
            setIsRetweeted(false);
            onMouseOutRetweet();
        }
        
    }

    const onDeleteClick = (e) => {
        e.stopPropagation();
        fetch(REACT_APP_BACKEND_URL + "tweet/" + props.id, {
            method: "DELETE",
            credentials: "include"
        })
        .then((res) => {
            if (res.status == 204) {
                //console.log(props.tweetList.length);
                const updatedTweets = props.tweetList.filter(item => item.id !== props.id);
                props.updateTweetList([...updatedTweets]);
            }
            else {
                console.log("Delete failed");
            }
        })
    }

    const QuoteTweetComponent = () => {
        if (props.postType != "quote"){
            return null;
        }
        if (props.parentPost == null) {
            return (
                <div className="w-full flex flex-col border-[0.5px] border-slate-400 rounded-2xl p-4 mt-2 hover:bg-gray-300">
                    <p className='font-bold text-gray-400'>
                        This tweet has been deleted by the user.
                    </p>
                </div>
            )
        }

        let originalTweetData = props.parentPost;
        setInnerTweetID(originalTweetData.id);
        let picURL = REACT_APP_FS_URL + originalTweetData.profile_pic_filename;
        let createdOn = beautifyTimestamp(originalTweetData.created_on);

        return (
            <div onClick={handleInnerTweetClick} className="w-full flex flex-col border-[0.5px] border-slate-400 rounded-2xl p-4 mt-2 hover:bg-gray-300">
                <div className="flex flex-row items-center mb-2">
                    <img className='flex-none h-6 w-6 rounded-full mr-1' src={picURL} />
                    <p className="font-bold hover:underline mr-1">
                        <a href={"/" + originalTweetData.username}>{originalTweetData.fullname}</a> 
                    </p>
                    <p className="flex flex-row text-base text-gray-400 mr-1">
                        <p className='mr-1'>&bull;</p>
                        <a href={"/" + originalTweetData.username}>{"@" + originalTweetData.username }</a>
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

    const RetweetMessage = () => {
        if (props.postType != "retweet") {
            return null;
        }
        return (
            <div className='flex flex-row text-sm font-bold text-gray-400 ml-6 mb-1 items-center'>
                <svg className='h-4 w-4 mr-2' fill="#9cafa3" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M136 552h63.6c4.4 0 8-3.6 8-8V288.7h528.6v72.6c0 1.9.6 3.7 1.8 5.2a8.3 8.3 0 0 0 11.7 1.4L893 255.4c4.3-5 3.6-10.3 0-13.2L749.7 129.8a8.22 8.22 0 0 0-5.2-1.8c-4.6 0-8.4 3.8-8.4 8.4V209H199.7c-39.5 0-71.7 32.2-71.7 71.8V544c0 4.4 3.6 8 8 8zm752-80h-63.6c-4.4 0-8 3.6-8 8v255.3H287.8v-72.6c0-1.9-.6-3.7-1.8-5.2a8.3 8.3 0 0 0-11.7-1.4L131 768.6c-4.3 5-3.6 10.3 0 13.2l143.3 112.4c1.5 1.2 3.3 1.8 5.2 1.8 4.6 0 8.4-3.8 8.4-8.4V815h536.6c39.5 0 71.7-32.2 71.7-71.8V480c-.2-4.4-3.8-8-8.2-8z"></path> </g></svg>
                <p>{props.userName + " retweeted"}</p>
            </div>
        );
    }

    const RetweetButtonMessage = () => {
        if (isRetweeted) {
            return (
                <p>Undo Retweet</p>
            );
        } else {
            return (
                <p>Retweet</p>
            );
        }
    }

    const TweetOptionsDiv = () => {
        if (props.contextType == "profile") {
            return (
                <div ref={optionsButtonRef} id={"post_options_div_" + tweetElementId} className='w-64 absolute top-[0px] right-[0px] hidden flex flex-col rounded-2xl bg-white overflow-hidden shadow-2xl border-[0.5px] border-slate-150'>
                    <button onClick={onDeleteClick} className='px-6 py-2 text-base text-red-500 font-bold hover:bg-red-100'>
                        Delete tweet
                    </button>

                    <button className='px-6 py-2 text-base font-bold hover:bg-slate-100 '>
                        Report tweet
                    </button>

                    <button className='px-6 py-2 text-base font-bold hover:bg-slate-100 '>
                        Request Community Note
                    </button>
                </div>
            );
        }
        else {
            return (
                <div ref={optionsButtonRef} id={"post_options_div_" + tweetElementId} className='w-64 absolute top-[0px] right-[0px] hidden flex flex-col rounded-2xl bg-white overflow-hidden shadow-2xl border-[0.5px] border-slate-150'>
                    <button className='px-6 py-2 text-base font-bold hover:bg-slate-100 '>
                        Report tweet
                    </button>

                    <button className='px-6 py-2 text-base font-bold hover:bg-slate-100 '>
                        Request Community Note
                    </button>
                </div>
            );
            
        }
    }


    useEffect(() => {
        if (props.postType == "retweet") {
            setTweetData({
                "id": props.parentPost.id,
                "tweetText": props.parentPost.content,
                "displayName": props.parentPost.fullname,
                "userName": props.parentPost.username,
                "displayPicture": props.parentPost.profile_pic_filename,
                "originalTimestamp": props.parentPost.created_on
            })
        };

        const timeBeautifyResult = beautifyTimestamp(tweetData.originalTimestamp);
        setDateInfo({
            "beautifiedTimeAgo": timeBeautifyResult.beautifiedTimeAgo,
            "beautifiedTimeAgoHover": timeBeautifyResult.beautifiedTimeAgoHover
        })
        //
        //setTweetElementId(simplifyUUID(props.id));

        fetch(REACT_APP_BACKEND_URL + "has_liked/" + tweetData.id, {
            method: "GET",
            credentials: "include"
        })
        .then((res) => {
            if (res.status == 200) {
                colorLikeButton();
                setIsLiked(true);
                setLikeCountColor("text-red-400");
            }
        })

        fetch(REACT_APP_BACKEND_URL + "has_retweeted/" + tweetData.id, {
            method: "GET",
            credentials: "include"
        })
        .then((res) => {
            if (res.status == 200){
                onMouseOverRetweet();
                setIsRetweeted(true);
                setRetweetCountColor("text-green-400");
            }
        })

        fetch(REACT_APP_BACKEND_URL + "post_analytics/" + props.id, {
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
                setTweetAnalytics({
                    "likes_count": data.likes_count,
                    "retweets_count": data.retweets_count,
                    "quotes_count": data.quotes_count,
                    "replies_count": data.replies_count,
                    "total_retweets": (data.quotes_count + data.retweets_count)
                });
            }
        })

    }, [tweetData.id, tweetData.originalTimestamp, tweetElementId]);

    return (
        <div className="flex flex-col border-b border-gray-100 hover:bg-gray-100 px-3 py-2 cursor-pointer" onClick={handleClick}>
            <RetweetMessage />
            <div className='flex flex-row'>
                <img className='flex-none h-10 w-10 rounded-full mr-2' src={REACT_APP_FS_URL + tweetData.displayPicture} />
                <div className='flex-grow'>
                    <div className="flex flex-row items-center justify-between">
                        <div className='flex flex-row items-center'>
                            <p className="font-bold hover:underline mr-1">
                                <a href={"/" + tweetData.userName}>{tweetData.displayName}</a> 
                            </p>
                            <p className="flex flex-row text-base text-gray-400 mr-1">
                                <p className='mr-1'>&bull;</p><a className='hover:underline' href={"/" + tweetData.userName}>{"@" + tweetData.userName}</a>
                            </p>
                            <p className='text-sm text-gray-400'>&bull;</p>
                            <div className='relative w-auto'>
                                <p onMouseOver={onMouseOverPic} onMouseOut={onMouseOutPic} className='text-sm text-gray-400 hover:underline'>{dateInfo.beautifiedTimeAgo}</p>

                                <div id={tweetElementId} className="w-[130px] flex items-center justify-center absolute hidden top-[20px] left-[0px] p-1 bg-slate-800 opacity-80 rounded-md">
                                    <p className="text-xs text-white">{dateInfo.beautifiedTimeAgoHover}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className='relative'>
                            <div onClick={onPostOptionsClick} className='h-9 w-9 rounded-full flex flex-col items-center justify-center hover:bg-sky-200'>
                                <svg className="h-4 w-4" fill="#000000" height="200px" width="200px" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path class="cls-1" d="M8,6.5A1.5,1.5,0,1,1,6.5,8,1.5,1.5,0,0,1,8,6.5ZM.5,8A1.5,1.5,0,1,0,2,6.5,1.5,1.5,0,0,0,.5,8Zm12,0A1.5,1.5,0,1,0,14,6.5,1.5,1.5,0,0,0,12.5,8Z"></path> </g></svg>
                            </div>

                            <TweetOptionsDiv />
                        </div>
                        
                    </div>
                    <p className="border-b-200 text-base leading-tight text-slate-900">{tweetData.tweetText}</p>

                    <QuoteTweetComponent />

                    <div className='flex flex-row p-2 pb-0 items-center justify-stretch'>

                        <div className='flex flex-row w-full items-center text-slate-600 hover:text-blue-400'>
                            <button onClick={onReplyClick} onMouseOver={onMouseOverReply} onMouseOut={onMouseOutReply} className='h-9 w-9 flex items-center justify-center hover:bg-blue-200 rounded-full'>
                                <svg id={"reply_svg_" + tweetElementId} className='h-5 w-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 17V15.8C20 14.1198 20 13.2798 19.673 12.638C19.3854 12.0735 18.9265 11.6146 18.362 11.327C17.7202 11 16.8802 11 15.2 11H4M4 11L8 7M4 11L8 15" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            </button>

                            {
                                (tweetAnalytics.replies_count > 0) && <p className='text-sm'>{tweetAnalytics.replies_count}</p>
                            }
                        </div>

                        <div className='relative flex flex-row w-full items-center text-slate-600 hover:text-green-400'>
                            <button onClick={onRetweetIconClick} onMouseOver={onMouseOverRetweet} onMouseOut={onMouseOutRetweet} className='h-9 w-9 flex items-center justify-center hover:bg-green-200 rounded-full'>
                                <svg id={"retweet_svg_" + tweetElementId} className='h-5 w-5' fill="#6b7280" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M136 552h63.6c4.4 0 8-3.6 8-8V288.7h528.6v72.6c0 1.9.6 3.7 1.8 5.2a8.3 8.3 0 0 0 11.7 1.4L893 255.4c4.3-5 3.6-10.3 0-13.2L749.7 129.8a8.22 8.22 0 0 0-5.2-1.8c-4.6 0-8.4 3.8-8.4 8.4V209H199.7c-39.5 0-71.7 32.2-71.7 71.8V544c0 4.4 3.6 8 8 8zm752-80h-63.6c-4.4 0-8 3.6-8 8v255.3H287.8v-72.6c0-1.9-.6-3.7-1.8-5.2a8.3 8.3 0 0 0-11.7-1.4L131 768.6c-4.3 5-3.6 10.3 0 13.2l143.3 112.4c1.5 1.2 3.3 1.8 5.2 1.8 4.6 0 8.4-3.8 8.4-8.4V815h536.6c39.5 0 71.7-32.2 71.7-71.8V480c-.2-4.4-3.8-8-8.2-8z"></path> </g></svg>
                            </button>

                            {
                                (tweetAnalytics.total_retweets > 0) 
                                && 
                                <p className={'text-sm ' + retweetCountColor}>{tweetAnalytics.total_retweets}</p>
                            }

                            <div ref={ref} id={"retweet_icon_" + tweetElementId} className='absolute right-[80px] hidden flex flex-col rounded-2xl bg-white overflow-hidden shadow-2xl border-[0.5px] border-slate-150'>
                                <button onClick={onRetweetClick} className='px-6 py-2 text-base font-bold hover:bg-slate-100'>
                                    <RetweetButtonMessage />
                                </button>

                                <button onClick={onQuoteTweetClick} className='px-6 py-2 text-base font-bold hover:bg-slate-100 '>
                                    Quote
                                </button>
                            </div>
                        </div>

                        <div className='flex flex-row w-full items-center text-slate-600 hover:text-red-400'>
                            <button onClick={handleLikeClick} onMouseOver={onMouseOverLike} onMouseOut={onMouseOutLike} className='h-9 w-9 flex items-center justify-center hover:bg-red-200 rounded-full'>
                                <svg id={"like_svg_" + tweetElementId} className='hover:bg-red-200 hover:rounded-full h-5 w-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            </button>

                            {
                                (tweetAnalytics.likes_count > 0) 
                                && 
                                <p className={'text-sm ' + likeCountColor}>{tweetAnalytics.likes_count}</p>
                            }
                        </div>

                        <div className='flex flex-row w-full'>
                            <button onMouseOver={onMouseOverShare} onMouseOut={onMouseOutShare} className='h-9 w-9 flex items-center justify-center hover:bg-blue-200 rounded-full'>
                                <svg id={"share_svg_" + tweetElementId} className='h-5 w-5' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Communication / Share_iOS_Export"> <path id="Vector" d="M9 6L12 3M12 3L15 6M12 3V13M7.00023 10C6.06835 10 5.60241 10 5.23486 10.1522C4.74481 10.3552 4.35523 10.7448 4.15224 11.2349C4 11.6024 4 12.0681 4 13V17.8C4 18.9201 4 19.4798 4.21799 19.9076C4.40973 20.2839 4.71547 20.5905 5.0918 20.7822C5.5192 21 6.07899 21 7.19691 21H16.8036C17.9215 21 18.4805 21 18.9079 20.7822C19.2842 20.5905 19.5905 20.2839 19.7822 19.9076C20 19.4802 20 18.921 20 17.8031V13C20 12.0681 19.9999 11.6024 19.8477 11.2349C19.6447 10.7448 19.2554 10.3552 18.7654 10.1522C18.3978 10 17.9319 10 17 10" stroke="#6b7280" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tweet;

//Userno.1
//@userno1
//The most dumbest thing I've heard in my life.
//TODO
//1. active link bold in navbar
//2. gray color when hover over tweet
//3. make tweets clickable
//4. very thin border

//5.tweet post page
//6.search interactive with dummy results
//7.add date metadata to tweet
//8.complete other pages (profile, explore, messages etc.)
//9.expand what's happening sidebar and add people you may follow
//10.add SVG elements in the pages.
//11.make the recent tweet come on top.
//12.add dummy DPs. (in what's happening input element and others.)

//(everyting single profile at this point.)
//13.implement login/signup pages and authentication on both BE&FE.
//14.data structures for different profiles.
//15.show dummy data for different profiles.
//16.fix 60% zoom css responsive error (just seems weird)
//(start working on backend)
//17.work on likes, retweets, quote tweets, notifications, messages etc.
//18.implement authentication on both FE and BE.