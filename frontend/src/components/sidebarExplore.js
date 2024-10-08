import WhoToFollow from "./whoToFollow";

function SidebarExplore() {
    return (
        <div className="hidden md:flex md:w-[29%] mr-14 flex flex-col p-4 pr-1 pl-8">
            <WhoToFollow />

            <div className="flex flex-row flex-wrap text-sm mt-4 text-gray-400">
                <a href="./terms-of-service" className="mr-2 hover:underline">Terms of Service</a>
                <a href="./privacy-policy" className="mr-2 hover:underline">Privacy policy</a>
                <a href="./cookie-policy" className="mr-2 hover:underline">Cookie Policy</a>
                <a href="./accessibility" className="mr-2 hover:underline">Accessibility</a>
                <a href="./ads-info" className="mr-2 hover:underline">Ads info</a>
                <a href="./more" className="mr-2 hover:underline">More..</a>
                <a href="./copyright" className="mr-2 hover:underline">&c 2024 X Corp.</a>
            </div>

            <h2 className="text-2xl mt-4 font-bold">Messages</h2>
        </div>
    );
}

export default SidebarExplore;