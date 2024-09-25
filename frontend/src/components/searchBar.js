import SearchProfile from "./search_profile";

function SearchBar() {
    const toggleDropdown = () => {
        let dropdown = document.querySelector("#search-bar #dropdown");
        dropdown.classList.toggle("hidden");
    }

    return (
        <div className="relative" id="search-bar">
            <div className="flex">
                <input onBlur={toggleDropdown} onFocus={toggleDropdown} placeholder="Search" type="text" className="flex-auto bg-gray-300 focus:outline focus:outline-sky-300 h-18 py-3 px-6 rounded-full" />
            </div>

            <div id="dropdown" className="absolute rounded border-[1px] border-sky-300 top-[60px] w-[350px] shadow-md hidden bg-white">
                <div className="flex flex-row justify-between items-center h-12">
                    <h3 className="font-bold text-xl pl-4">Recent</h3>

                    <div className="p-2 rounded-full hover:bg-sky-100 mr-5">
                        <p className="font-bold text-sky-400">Clear all</p>
                    </div>
                </div>

                <SearchProfile />
                <SearchProfile />
                <SearchProfile />
                <SearchProfile />
            </div>
        </div>
    );
}

export default SearchBar;