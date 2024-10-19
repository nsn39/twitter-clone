import { useState, useEffect } from "react";

function NotificationCard(props) {
    const simplifyUUID = (str) => {
        return str.replaceAll("-", "");
    }

    const [cardID, setCardID] = useState(simplifyUUID(props.id));
    const [postData, setPostData] = useState(null);

    let notificationMessage = ""; 
    if (props.eventType == "like"){
        notificationMessage = " liked your tweet."
    } else if (props.eventType == "retweet") {
        notificationMessage = " retweeted your tweet."
    } else if (props.eventType == "quote") {
        notificationMessage = " quoted your tweet."
    } else if (props.eventType == "follow") {
        notificationMessage = " started following you."
    }

    useEffect(() => {
        if (props.postID) {
            fetch("http://localhost:8000/twitter-clone-api/tweet/" + props.postID, {
                method: "GET",
                credentials: "include"
            })
            .then((res) => {
                if (res.status == 200) {
                    return res.json();
                }
            })
            .then((data) => {
                setPostData(data);
            })
        }

        let el = document.getElementById(cardID);
        if (props.seen == false) {
            el.classList.add("bg-sky-200");
        }
        else {
            el.classList.add("bg-white");
        }
    }, []);

    const CardSVG = () => {
        if (props.eventType == "like") {
            return (
                <svg className="h-6 w-6" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z" fill="#ed333b"></path> </g></svg>
            );
        }
        else if (props.eventType == "quote" || props.eventType == "retweet") {
            return (
                <svg  className='h-6 w-6' fill="#33d17a" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M136 552h63.6c4.4 0 8-3.6 8-8V288.7h528.6v72.6c0 1.9.6 3.7 1.8 5.2a8.3 8.3 0 0 0 11.7 1.4L893 255.4c4.3-5 3.6-10.3 0-13.2L749.7 129.8a8.22 8.22 0 0 0-5.2-1.8c-4.6 0-8.4 3.8-8.4 8.4V209H199.7c-39.5 0-71.7 32.2-71.7 71.8V544c0 4.4 3.6 8 8 8zm752-80h-63.6c-4.4 0-8 3.6-8 8v255.3H287.8v-72.6c0-1.9-.6-3.7-1.8-5.2a8.3 8.3 0 0 0-11.7-1.4L131 768.6c-4.3 5-3.6 10.3 0 13.2l143.3 112.4c1.5 1.2 3.3 1.8 5.2 1.8 4.6 0 8.4-3.8 8.4-8.4V815h536.6c39.5 0 71.7-32.2 71.7-71.8V480c-.2-4.4-3.8-8-8.2-8z"></path> </g></svg>
            );
        }
        else if (props.eventType == "reply") {
            return (
                <div></div>
            );
        }
        else if (props.eventType == "follow") {
            return (
                <div></div>
            );
        }
        else {
            return null;
        }
    };

    const Content = () => {
        if (!postData) {
            return null;
        }

        if (props.eventType == "like" || props.eventType == "retweet" || props.eventType == "quote") {
            return (
                <p  className="text-gray-400">{postData.content}</p>
            )
        } 
        else {
            return null;
        }
    }

    return (
        <div id={cardID} className="flex flex-row border-b-[0.5px] border-gray-300 hover:bg-gray-300 p-3">
            <div className="ml-3 mt-1">
                <CardSVG />
            </div> 
            
            <div className="flex flex-col ml-3">
                <img className="h-8 w-8 mb-2 rounded-full" src={"http://localhost:8000/twitter-clone-api/fs/" + props.displayPicture} />
                <p className="mb-2">
                    <a className="font-bold hover:underline" href={"/" + props.userName}>{props.fullName}</a>
                    {notificationMessage}
                </p>
                <Content />
            </div>
        </div>
    );
}

export default NotificationCard;