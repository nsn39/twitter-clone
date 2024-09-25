function SidebarExploreFollow() {
    return (
        <div className="flex flex-row p-2 hover:bg-gray-200 cursor-pointer items-center">
            <img className="flex-none h-10 w-10 rounded-full mr-2" src="/lex.jpeg" />

            <div className="grow flex flex-col">
                <p className="font-bold text-md">Display Name</p>
                <p className="text-gray-500">@username</p>
            </div>

            <button className="flex-none p-2 px-3 bg-black text-white rounded-full font-bold">
                Follow
            </button>
        </div>
    );
}

export default SidebarExploreFollow;