function MessageCard() {
    return (
        <div className="flex flex-row items-center hover:bg-gray-100 p-3 cursor-pointer">
            <img className="flex-none h-10 w-10 rounded-full mr-3" src="/lex.jpeg" />
            <div className="grow flex flex-col">
                <p className="font-bold">Random User</p>
                <p className="text-gray-500">Hey what's up man. New to twitter?</p>
            </div>

            <button className="flex-none flex h-8 w-8 hover:bg-sky-100 rounded-full justify-center items-center">
                <svg className="h-4 w-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000" class="bi bi-three-dots"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path> </g></svg>
            </button>
        </div>    
    );
}

export default MessageCard;