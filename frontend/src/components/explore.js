import Navbar from "./navbar";
import SidebarExplore from "./sidebarExplore";
import ExploreArea from "./exploreArea";

function Explore() {
    return (
        <div className="flex flex-row">
            <Navbar></Navbar>

            <ExploreArea />

            <SidebarExplore />
        </div>
    );
};

export default Explore;