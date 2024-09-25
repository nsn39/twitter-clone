import SidebarExploreFollow from "./sidebarExploreFollow";

function WhoToFollow() {
    return (
        <div className="flex flex-col border-[0.5px] border-gray-400 mt-4 rounded-lg">
            <h3 className="text-2xl font-bold p-2">Who to follow</h3>
            
            <SidebarExploreFollow />
            <SidebarExploreFollow />
            <SidebarExploreFollow />

            <div className="p-3 hover:bg-gray-200 cursor-pointer">
                <p className="text-blue-500 text-md">Show more</p>
            </div>
        </div>
    );
}

export default WhoToFollow;