import Navbar from "./navbar";
import Sidebar from "./sidebar";
import Timeline from "./timeline";

function Home() {
    return (
        <div className="flex flex-row">
            <Navbar></Navbar>

            <Timeline></Timeline>

            <Sidebar></Sidebar>
        </div>
    );
};

export default Home;