import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Tweet(props) {
    const simplifyUUID = (str) => {
        return str.replaceAll("-", "");
    }

    const navigate = useNavigate();
    const [dateInfo, setDateInfo] = useState({});
    const [tweetElementId, setTweetElementId] = useState(simplifyUUID(props.id));
    const [isLiked, setIsLiked] = useState(false);

    let handleClick = () => {
        navigate("/tweet/" + props.id)
    }
    //#e01b24
    const beautifyTimestamp = (originalTimestamp) => {
        const monthIntToStr = {
            1: "Jan",
            2: "Feb",
            3: "Mar",
            4: "Apr",
            5: "May",
            6: "Jun",
            7: "Jul",
            8: "Aug",
            9: "Sep",
            10: "Oct",
            11: "Nov",
            12: "Dec"
        }

        const timestampObj = new Date(originalTimestamp);
        const timestampValue = timestampObj.valueOf();
        const dateObj = new Date(timestampValue);

        const year = dateObj.getFullYear();
        const month = dateObj.getMonth();
        const date = dateObj.getDate();
        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes();
        const seconds = dateObj.getSeconds();

        console.log(year, month, date, hours, minutes, seconds);

        const currentTimestampValue = Date.now();

        const timestampDifferenceSeconds = (currentTimestampValue - timestampValue)/1000.0;
        var beautifiedTimeAgo = "";

        if (timestampDifferenceSeconds < 59) {
            //seconds
            beautifiedTimeAgo = (Math.floor(timestampDifferenceSeconds)).toString() + " sec"
        }
        else if (timestampDifferenceSeconds < 3599) {
            //minutes
            beautifiedTimeAgo = (Math.floor(timestampDifferenceSeconds / 60.0)).toString() + " min"
        }
        else if (timestampDifferenceSeconds < 86399) {
            //hours
            beautifiedTimeAgo = (Math.floor(timestampDifferenceSeconds / 3600.0)).toString() + "h"
        }
        else if (timestampDifferenceSeconds < 1036799) {
            //within same year; show only month and day
            beautifiedTimeAgo = monthIntToStr[month] + " " + date;
        }
        else {
            //show full date
            beautifiedTimeAgo = monthIntToStr[month] + " " + date + " ," + year;
        }
        const beautifiedTimeAgoHover = hours + ":" + minutes + " - " + date + " " + monthIntToStr[month] + ", " + year;
        return {
            "beautifiedTimeAgo": beautifiedTimeAgo,
            "beautifiedTimeAgoHover": beautifiedTimeAgoHover
        };
    }
    const onMouseOverPic = () => {
        let dropdown = document.getElementById(tweetElementId);
        dropdown.classList.toggle("hidden");
    }

    const onMouseOutPic = () => {
        let dropdown = document.getElementById(tweetElementId);
        dropdown.classList.toggle("hidden");
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

    const colorLikeButton = () => {
        console.log("Calling colorLikeButton with: ", tweetElementId);
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
            //BE changes
            fetch("http://localhost:8000/twitter-clone-api/like/" + props.id, {
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
            fetch("http://localhost:8000/twitter-clone-api/unlike/" + props.id, 
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

    useEffect(() => {
        const timeBeautifyResult = beautifyTimestamp(props.originalTimestamp);
        setDateInfo({
            "beautifiedTimeAgo": timeBeautifyResult.beautifiedTimeAgo,
            "beautifiedTimeAgoHover": timeBeautifyResult.beautifiedTimeAgoHover
        })
        //
        //setTweetElementId(simplifyUUID(props.id));

        fetch("http://localhost:8000/twitter-clone-api/has_liked/" + props.id, {
            method: "GET",
            credentials: "include"
        })
        .then((res) => {
            if (res.status == 200) {
                console.log("tweet_el_id: ", tweetElementId);
                colorLikeButton();
                setIsLiked(true);
            }
        })
    }, [props.id, props.originalTimestamp, tweetElementId]);

    return (
        <div className="flex flex-row border-b border-slate-300 hover:bg-slate-200 p-3 cursor-pointer" onClick={handleClick}>
            <img className='flex-none h-10 w-10 rounded-full mr-2' src={"http://localhost:8000/twitter-clone-api/fs/" + props.displayPicture} />
            <div className='flex-grow'>
                <div className="flex flex-row items-center">
                    <p className="font-bold hover:underline mr-1">
                        <a href="./">{props.displayName}</a> 
                    </p>
                    <p className="flex flex-row text-base text-gray-400 mr-1">
                        <p className='mr-1'>&bull;</p><a href="./">{props.userName }</a>
                    </p>
                    <p className='text-sm text-gray-400'>&bull;</p>
                    <div className='relative w-auto'>
                        <p onMouseOver={onMouseOverPic} onMouseOut={onMouseOutPic} className='text-sm text-gray-400 hover:underline'>{dateInfo.beautifiedTimeAgo}</p>

                        <div id={tweetElementId} className="w-[130px] flex items-center justify-center absolute hidden top-[20px] left-[0px] p-1 bg-slate-800 opacity-80 rounded-md">
                            <p className="text-xs text-white">{dateInfo.beautifiedTimeAgoHover}</p>
                        </div>
                    </div>
                    
                </div>
                <p className="border-b-200 text-base">{props.tweetText}</p>
                <div className='flex flex-row p-2 items-center justify-stretch'>
                    

                    <div className='flex flex-row w-full'>
                        <button onMouseOver={onMouseOverReply} onMouseOut={onMouseOutReply} className='h-9 w-9 flex items-center justify-center hover:bg-blue-200 rounded-full'>
                            <svg id={"reply_svg_" + tweetElementId} className='h-6 w-6' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M20 17V15.8C20 14.1198 20 13.2798 19.673 12.638C19.3854 12.0735 18.9265 11.6146 18.362 11.327C17.7202 11 16.8802 11 15.2 11H4M4 11L8 7M4 11L8 15" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        </button>
                    </div>

                    <div className='flex flex-row w-full'>
                        <button onMouseOver={onMouseOverRetweet} onMouseOut={onMouseOutRetweet} className='h-9 w-9 flex items-center justify-center hover:bg-green-200 rounded-full'>
                            <svg id={"retweet_svg_" + tweetElementId} className='h-6 w-6' fill="#000000" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M136 552h63.6c4.4 0 8-3.6 8-8V288.7h528.6v72.6c0 1.9.6 3.7 1.8 5.2a8.3 8.3 0 0 0 11.7 1.4L893 255.4c4.3-5 3.6-10.3 0-13.2L749.7 129.8a8.22 8.22 0 0 0-5.2-1.8c-4.6 0-8.4 3.8-8.4 8.4V209H199.7c-39.5 0-71.7 32.2-71.7 71.8V544c0 4.4 3.6 8 8 8zm752-80h-63.6c-4.4 0-8 3.6-8 8v255.3H287.8v-72.6c0-1.9-.6-3.7-1.8-5.2a8.3 8.3 0 0 0-11.7-1.4L131 768.6c-4.3 5-3.6 10.3 0 13.2l143.3 112.4c1.5 1.2 3.3 1.8 5.2 1.8 4.6 0 8.4-3.8 8.4-8.4V815h536.6c39.5 0 71.7-32.2 71.7-71.8V480c-.2-4.4-3.8-8-8.2-8z"></path> </g></svg>
                        </button>
                    </div>

                    <div className='flex flex-row w-full'>
                        <button onClick={handleLikeClick} onMouseOver={onMouseOverLike} onMouseOut={onMouseOutLike} className='h-9 w-9 flex items-center justify-center hover:bg-red-200 rounded-full'>
                            <svg id={"like_svg_" + tweetElementId} className='hover:bg-red-200 hover:rounded-full h-6 w-6' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                        </button>
                    </div>

                    <div className='flex flex-row w-full'>
                        <button onMouseOver={onMouseOverShare} onMouseOut={onMouseOutShare} className='h-9 w-9 flex items-center justify-center hover:bg-blue-200 rounded-full'>
                            <svg id={"share_svg_" + tweetElementId} className='h-6 w-6' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Communication / Share_iOS_Export"> <path id="Vector" d="M9 6L12 3M12 3L15 6M12 3V13M7.00023 10C6.06835 10 5.60241 10 5.23486 10.1522C4.74481 10.3552 4.35523 10.7448 4.15224 11.2349C4 11.6024 4 12.0681 4 13V17.8C4 18.9201 4 19.4798 4.21799 19.9076C4.40973 20.2839 4.71547 20.5905 5.0918 20.7822C5.5192 21 6.07899 21 7.19691 21H16.8036C17.9215 21 18.4805 21 18.9079 20.7822C19.2842 20.5905 19.5905 20.2839 19.7822 19.9076C20 19.4802 20 18.921 20 17.8031V13C20 12.0681 19.9999 11.6024 19.8477 11.2349C19.6447 10.7448 19.2554 10.3552 18.7654 10.1522C18.3978 10 17.9319 10 17 10" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g> </g></svg>
                        </button>
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