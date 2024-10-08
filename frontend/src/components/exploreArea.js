import TrendingCard from "./trendingCard";
import SearchBar from "./searchBar";

function ExploreArea() {
    return (
        <div className="h-screen md:w-[46%] border-x-[0.5px] border-gray-300">
            <div className="p-2">
                <SearchBar />
            </div>
            

            <div className="flex flex-row border-b-[0.5px] border-gray-300 overflow-x-scroll">
                <button className="flex-auto hover:bg-gray-300 p-3 text-sm md:text-base font-bold text-gray-500">For You</button>
                <button className="flex-auto hover:bg-gray-300 p-3 text-sm md:text-base font-bold text-gray-500">Trending</button>
                <button className="flex-auto hover:bg-gray-300 p-3 text-sm md:text-base font-bold text-gray-500">News</button>
                <button className="flex-auto hover:bg-gray-300 p-3 text-sm md:text-base font-bold text-gray-500">Sports</button>
                <button className="flex-auto hover:bg-gray-300 p-3 text-sm md:text-base font-bold text-gray-500">Entertainment</button>
            </div>

            <TrendingCard trendingType="Television" trendingTopic="Breaking Bad" trendingPosts="996" />
            <TrendingCard trendingType="Trending" trendingTopic="United States" trendingPosts="2000" />
            <TrendingCard trendingType="Trending" trendingTopic="Oppenheimer" trendingPosts="96" />
            <TrendingCard trendingType="Trending in UK" trendingTopic="#Back to Hogwarts" trendingPosts="1000" />
            <TrendingCard trendingType="Sports" trendingTopic="Mbappe" trendingPosts="1996" />
        </div>
    );
}

export default ExploreArea;