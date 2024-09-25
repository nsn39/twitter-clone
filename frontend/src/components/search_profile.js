function SearchProfile () {
    return (
        <div className="p-2 hover:bg-gray-100">
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center">
                    <img src="/lex.jpeg" className="h-10 w-10 mr-2 rounded-full" />
                    <div className="flex flex-col">
                        <p className="font-bold text-md hover:underline">Profile Name</p>
                        <p className="text-gray-400">@username</p>
                    </div>
                </div>
                <div>
                    <button className="flex justify-center h-8 w-8 mr-2 hover:rounded-full hover:bg-sky-200">
                        <svg className="self-center h-5 w-5" fill="#000000" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M0 14.545L1.455 16 8 9.455 14.545 16 16 14.545 9.455 8 16 1.455 14.545 0 8 6.545 1.455 0 0 1.455 6.545 8z" fill-rule="evenodd"></path> </g></svg>
                    </button>
                </div>
                
            </div>
        </div>
    );
}

export default SearchProfile;