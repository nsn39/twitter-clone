import Navbar from "./navbar";
import Sidebar from "./sidebar";
import Timeline from "./timeline";

function Home() {
    return (
        <div className="flex flex-col-reverse md:flex-row mx-auto lg:w-[1366px] font-chirp">
            <Navbar></Navbar>

            <Timeline></Timeline>

            <Sidebar></Sidebar>
        </div>
    );
};

export default Home;

//3 - 4 - 7