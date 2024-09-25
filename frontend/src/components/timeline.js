import React from 'react';
import { useEffect } from 'react';
import Tweet from "./tweet";
import { v4 as uuidv4 } from 'uuid';


function Timeline () {

    const [inputText, setInputText] = React.useState("");
    const [userTweets, setTweetState] = React.useState([]);
    
    useEffect(() => {
        fetch('http://localhost:8000/twitter-clone-api/tweets/', {
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

        fetch('http://localhost:8000/twitter-clone-api/tweet', options)
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
        <div className="basis-5/12 border border-b-0 border-gray-400 h-fit">
            <div className="flex flex-row font-bold w-full justify-around border-b py-4 border-slate-300">
                <div className="hover:bg-gray-400">
                    <p>
                        <a href="./">For you</a>
                    </p>
                </div>
                
                <div className="hover:bg-gray-400">
                    <p>
                        <a href="./">Following</a>
                    </p>
                </div>
            </div>
            
            <div className="flex flex-row p-3 items-start border-b border-slate-300">
                <img src='/lex.jpeg' className='flex-none h-10 w-10 rounded-full mr-4' />

                <div className='grow flex flex-col items-end'>
                    <textarea className="h-24 w-full mr-2 border-b border-slate-300 outline-none resize-none text-xl" type="text" placeholder="What's happening?" onChange={inputHandler} value={inputText}/>

                    <button className="text-white w-20 font-bold bg-sky-400 mt-2 px-4 py-2 rounded-full" onClick={tweetSubmitter}>Post</button>
                </div>
            </div>

            {
                userTweets && userTweets.map(({id, fullname, username, content, created_on}) => (
                    <Tweet id={id} displayName={fullname} userName={"@" + username} tweetText={content} originalTimestamp={created_on} />
                ))
            }
        </div>
    )
}

export default Timeline;