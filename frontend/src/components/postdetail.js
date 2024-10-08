import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function PostDetail(props) {
    const [tweetData, setTweetData] = useState({});
    const navigate = useNavigate();

    let backLink = () => {
        navigate(-1);
    };

    const UTCToLocalTimestamp = (utcTimestamp) => {
        // convert utc timestamp into local timestamp
        const timestampObj = new Date(utcTimestamp);
        const timestampValue = timestampObj.valueOf();
        const localTimestamp = new Date(timestampValue);
        const localTimestampString = localTimestamp.toString();
        return localTimestampString;
    }

    // search for the post in JSON file.
    useEffect(() => {
        console.log("Tweet slug: " + props.tweetSlug);
        fetch("http://localhost:8000/twitter-clone-api/tweet/" + props.tweetSlug, {
            "method": "GET",
            credentials: "include"
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                console.log(data);
                setTweetData(data);
            })
    }, []);

    return (
        <div className="h-screen md:w-[46%] border-x-[0.5px] border-gray-200">
            <div className="flex flex-row p-2 items-center">
                <button onClick={backLink} className="hover:bg-slate-200 hover:rounded-full ml-2">
                    <svg className="h-8 w-8" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#000000" d="M224 480h640a32 32 0 1 1 0 64H224a32 32 0 0 1 0-64z"></path><path fill="#000000" d="m237.248 512 265.408 265.344a32 32 0 0 1-45.312 45.312l-288-288a32 32 0 0 1 0-45.312l288-288a32 32 0 1 1 45.312 45.312L237.248 512z"></path></g></svg>
                </button>
                <h3 className="font-bold text-xl ml-8">Post</h3>
            </div>
            <div className="flex flex-row items-center px-2">
                <img src="/lex.jpeg" className="h-10 w-10 rounded-full ml-3"></img>
                <div className="flex flex-col ml-2">
                    <a href="/" className="font-bold hover:underline">{tweetData.fullname}</a>
                    <a href="/" className="text-slate-400">@{tweetData.username}</a>
                </div>
            </div>

            <div className="px-5 mt-2">
                <p className="mb-2">{tweetData.content}</p>
                <p className="text-slate-400 border-b-2 border-gray-400 pb-2">{UTCToLocalTimestamp(tweetData.created_on)}</p>
            </div>
            
        </div>
    );
};

export default PostDetail;