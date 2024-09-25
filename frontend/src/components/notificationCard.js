function NotificationCard() {
    return (
        <div className="flex flex-row border-b-[0.5px] border-gray-300 hover:bg-gray-300 p-3">
            <div className="ml-3 mt-1">
                <svg className="h-6 w-6" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1.24264 8.24264L8 15L14.7574 8.24264C15.553 7.44699 16 6.36786 16 5.24264V5.05234C16 2.8143 14.1857 1 11.9477 1C10.7166 1 9.55233 1.55959 8.78331 2.52086L8 3.5L7.21669 2.52086C6.44767 1.55959 5.28338 1 4.05234 1C1.8143 1 0 2.8143 0 5.05234V5.24264C0 6.36786 0.44699 7.44699 1.24264 8.24264Z" fill="#ed333b"></path> </g></svg>
            </div> 
            
            <div className="flex flex-col ml-3">
                <img className="h-8 w-8 mb-2 rounded-full" src="/lex.jpeg" />
                <p className="mb-2"><strong>Random User</strong> liked your tweet.</p>
                <p className="text-gray-400">This is a random tweet that was liked by another random user.</p>
            </div>
        </div>
    );
}

export default NotificationCard;