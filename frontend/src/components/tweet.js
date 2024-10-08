import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Tweet(props) {
    const navigate = useNavigate();
    const [dateInfo, setDateInfo] = useState({});
    const [tweetElementId, setTweetElementId] = useState("");

    let handleClick = () => {
        navigate("/tweet/" + props.id)
    }

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
    const onMouseOverPic = (id) => {
        let dropdown = document.getElementById(tweetElementId);
        dropdown.classList.toggle("hidden");
    }

    const onMouseOutPic = (id) => {
        let dropdown = document.getElementById(tweetElementId);
        dropdown.classList.toggle("hidden");
    }

    const simplifyUUID = (str) => {
        return str.replaceAll("-", "");
    }

    useEffect(() => {
        const timeBeautifyResult = beautifyTimestamp(props.originalTimestamp);
        setDateInfo({
            "beautifiedTimeAgo": timeBeautifyResult.beautifiedTimeAgo,
            "beautifiedTimeAgoHover": timeBeautifyResult.beautifiedTimeAgoHover
        })
        setTweetElementId(simplifyUUID(props.id));
    }, []);

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