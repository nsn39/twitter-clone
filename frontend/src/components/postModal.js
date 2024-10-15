import { useState } from "react";

function PostModal({isVisible, onClose, activeTweetData, setActiveTweetData}) {
    const [inputText, setInputText] = useState("");

    let tweetSubmitter = () => {
        let postType = "tweet";
        let parentPostRef = null;
        if (activeTweetData) {
            postType = activeTweetData.type;
            parentPostRef = activeTweetData.parentPostRef;
        }

        const currentTimestampUTC = new Date(Date.now());
        const newTweet = {
            "postType": postType,
            "parentPostRef": parentPostRef,
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
                    //setTweetState([data, ...userTweets]);
                    setInputText("");
                    //console.log("userTweets: ", userTweets);
                }
            })
            .catch(error => console.error(error));

        deleteStateAndClose();
    }

    if (!isVisible) {
        return null;
    }

    const ReplyTweetComponent = () => {
        if (!activeTweetData) {
            return null;
        }
        else if (activeTweetData.type == "reply") {
            return (
                <div className="flex flex-row p-3 w-full">
                    <div className="w-[7%] flex flex-col items-center h-full">
                        <img src={activeTweetData.pic} className="h-10 w-10 rounded-full mb-1" />

                        <div className="w-0.5 h-full bg-gray-500"></div>
                    </div>

                    <div className="w-[93%] flex flex-col pl-2 pb-8">
                        <div className="flex flex-row mb-2">
                            <p className="font-bold mr-1">
                                <a href="./">{activeTweetData.fullname}</a> 
                            </p>
                            <p className="flex flex-row text-base text-gray-400 mr-1">
                                <p className='mr-1'>&bull;</p>
                                <a href="./">{activeTweetData.username }</a>
                            </p>
                            <p className='text-gray-400 mr-1'>&bull;</p>
                            <p className='text-gray-400'>{activeTweetData.datetime}</p>
                        </div>

                        <p className="border-b-200">{activeTweetData.content}</p>
                    </div>
                </div>
            )
        }
        else {
            return null;
        }
    }

    const QuoteTweetComponent = () => {
        if (!activeTweetData) {
            return null;
        }
        else if (activeTweetData.type == "quote") {
            return (
                <div className="w-full flex flex-col border-[0.5px] border-slate-400 rounded-2xl p-4">
                    <div className="flex flex-row items-center mb-2">
                        <img className='flex-none h-6 w-6 rounded-full mr-1' src={activeTweetData.pic} />
                        <p className="font-bold hover:underline mr-1">
                            <a href="./">{activeTweetData.fullname}</a> 
                        </p>
                        <p className="flex flex-row text-base text-gray-400 mr-1">
                            <p className='mr-1'>&bull;</p>
                            <a href="./">{activeTweetData.username }</a>
                        </p>
                        <p className='text-gray-400 mr-1'>&bull;</p>
                        <p className='text-gray-400'>{activeTweetData.datetime}</p>
                    
                    </div>
                    <p className="border-b-200 text-base">{activeTweetData.content}</p>
                </div>
            )
        }
        else {
            return null;
        }
    }

    let inputHandler = (e) => {
        console.log(e);
        //e.preventDefault();
        setInputText(e.target.value);
    }

    const deleteStateAndClose = () => {
        setInputText("");
        setActiveTweetData(null);
        onClose();
    }

    const handleClose = (e) => {
        if (e.target.id == "wrapper") deleteStateAndClose();
    }

    return (
        <div onClick={handleClose} id="wrapper" className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-[46%] bg-white flex flex-col rounded-2xl p-2 font-chirp">
                <button onClick={deleteStateAndClose} className="flex-none h-10 w-10 hover:bg-gray-300 mb-4 rounded-full flex items-center justify-center cursor-pointer">
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.46967 5.46967C5.76256 5.17678 6.23744 5.17678 6.53033 5.46967L18.5303 17.4697C18.8232 17.7626 18.8232 18.2374 18.5303 18.5303C18.2374 18.8232 17.7626 18.8232 17.4697 18.5303L5.46967 6.53033C5.17678 6.23744 5.17678 5.76256 5.46967 5.46967Z" fill="#000000"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5303 5.46967C18.8232 5.76256 18.8232 6.23744 18.5303 6.53033L6.53035 18.5303C6.23745 18.8232 5.76258 18.8232 5.46969 18.5303C5.17679 18.2374 5.17679 17.7626 5.46968 17.4697L17.4697 5.46967C17.7626 5.17678 18.2374 5.17678 18.5303 5.46967Z" fill="#000000"></path> </g></svg>
                </button>

                <ReplyTweetComponent />

                <div className="flex flex-row px-3 pb-3 items-start border-slate-300">
                    <img src='/lex.jpeg' className='flex-none h-10 w-10 rounded-full mr-4' />

                    <div className='grow flex flex-col items-end'>
                        <textarea className="h-24 w-full mr-2 border-slate-300 outline-none resize-none text-xl" type="text" placeholder="What's happening?" onChange={inputHandler} value={inputText}/>

                        <QuoteTweetComponent />
                        <button onClick={tweetSubmitter} className="text-white w-20 font-bold bg-sky-400 mt-2 px-4 py-2 rounded-full">Post</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostModal;