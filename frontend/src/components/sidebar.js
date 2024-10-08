import "./search_profile";
import SearchBar from "./searchBar";
import TrendingCard from "./trendingCard";
import WhoToFollow from "./whoToFollow";

function Sidebar () {

    return (
        <div className="hidden md:flex md:w-[29%] flex flex-col p-4 pl-8 pr-1 mr-14 h-full">
            
            <div className=""> 
                <SearchBar />
            </div>
            
            <div className="flex flex-col border border-gray-400 p-2 mt-4 rounded-lg">
                <h3 className="text-xl font-extrabold">Subscribe to Premium</h3>
                <p className="text-base">Subscribe to unlock new features and if eligible, receive a share of ads revenue.</p>
                <button className="text-white font-bold bg-black py-2 px-3 rounded-full">Subscribe</button>
            </div>
            
            <div className="flex flex-col border border-gray-400 pt-2 mt-4 rounded-lg">
                <h3 className="text-xl font-extrabold p-2">What's happening?</h3>
                <TrendingCard trendingType="Television" trendingTopic="Breaking Bad" trendingPosts="996" />
                <TrendingCard trendingType="Trending" trendingTopic="United States" trendingPosts="2000" />
                <TrendingCard trendingType="Trending" trendingTopic="Oppenheimer" trendingPosts="96" />
                <TrendingCard trendingType="Trending in UK" trendingTopic="#Back to Hogwarts" trendingPosts="1000" />
            
                <div className="p-3 hover:bg-gray-200 cursor-pointer">
                    <p className="text-blue-500 text-md">Show more</p>
                </div>
            </div>

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
            

            <h2 className="text-2xl mt-4 font-extrabold">Messages</h2>           
        </div>
    )
}

export default Sidebar;

// 2 - 5 - 3