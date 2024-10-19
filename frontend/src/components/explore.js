import Navbar from "./navbar";
import SidebarExplore from "./sidebarExplore";
import ExploreArea from "./exploreArea";

function Explore() {
    return (
        <div className="flex flex-col-reverse md:flex-row mx-auto lg:w-[1366px] font-chirp">
            <Navbar showNotificationCount={true}></Navbar>

            <ExploreArea />

            <SidebarExplore />
        </div>
    );
};

export default Explore;