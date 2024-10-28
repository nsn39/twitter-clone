import { useState, useEffect } from "react";

function NotificationCard(props) {
    const {REACT_APP_BACKEND_URL, REACT_APP_FS_URL} = process.env;
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
            fetch(REACT_APP_BACKEND_URL + "tweet/" + props.postID, {
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
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="#3584e4" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
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
                <img className="h-8 w-8 mb-2 rounded-full" src={REACT_APP_FS_URL + props.displayPicture} />
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