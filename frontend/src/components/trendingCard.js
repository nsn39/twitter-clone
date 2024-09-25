function TrendingCard(props) {
    return (
        <div className="flex flex-row p-3 hover:bg-gray-200 cursor-pointer">
            <div className="grow">
                <p className="text-gray-500 text-sm">{props.trendingType}</p>
                <p className="font-bold text-md">{props.trendingTopic}</p>
                <p className="text-gray-500 text-sm">{props.trendingPosts} posts</p>
            </div>
            
            <button className="flex-none flex justify-center items-center h-6 w-6 hover:bg-sky-100 rounded-full">
                <svg className="h-4 w-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#000000" class="bi bi-three-dots"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"></path> </g></svg>
            </button>
        </div>
    );
};

export default TrendingCard;