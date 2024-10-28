function SidebarExploreFollow(props) {
    const {REACT_APP_FS_URL} = process.env;

    return (
        <div className="flex flex-row p-2 hover:bg-gray-200 cursor-pointer items-center">
            <img className="flex-none h-10 w-10 rounded-full mr-2" src={REACT_APP_FS_URL + props.displayPicture} />

            <div className="grow flex flex-col">
                <p className="font-bold text-md">{props.fullName}</p>
                <p className="text-gray-500">{"@" + props.userName}</p>
            </div>

            <button className="flex-none p-2 px-3 bg-black text-white rounded-full font-bold">
                Follow
            </button>
        </div>
    );
}

export default SidebarExploreFollow;