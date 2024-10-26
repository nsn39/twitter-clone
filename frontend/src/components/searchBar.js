import { useState } from "react";
import { useOutsideClick } from "../hooks/useOutsideClick";
import SearchProfile from "./search_profile";

function SearchBar() {
    const [inputText, setInputText] = useState("");
    const [searchResult, setSearchResult] = useState([]);

    const handleClearAll = () => {
        setSearchResult([]);
    }

    let inputHandler = (e) => {
        setInputText(e.target.value);

        var dropdown = document.getElementById("dropdown");
        if (inputText == "") {
            dropdown.classList.add("hidden");
        }
        else {
            dropdown.classList.remove("hidden");
        }

        fetch("http://localhost:8000/twitter-clone-api/search/" + inputText, {
            method: "GET",
            credentials: "include"
        })
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            }
            else {
                return null;
            }
        })
        .then((data) => {
            if (data) {
                console.log("search result: ", data);
                setSearchResult(data);
            }
        })
    }

    const ref = useOutsideClick(() => {
        let dropdown = document.querySelector("#search-bar #dropdown");
        dropdown.classList.add("hidden");
    });

    return (
        <div className="relative" id="search-bar">
            <div className="flex">
                <input placeholder="Search" type="text" className="flex-auto bg-gray-300 focus:outline focus:outline-sky-300 h-18 py-3 px-6 rounded-full" value={inputText} onChange={inputHandler} />
            </div>

            <div ref={ref} id="dropdown" className="absolute rounded border-[1px] border-sky-300 top-[60px] w-[350px] shadow-md hidden bg-white">
                <div className="flex flex-row justify-between items-center h-12">
                    <h3 className="font-bold text-xl pl-4">Recent</h3>

                    <button onClick={handleClearAll} className="p-2 rounded-full hover:bg-sky-100 mr-5 font-bold text-sky-400">
                        Clear all
                    </button>
                </div>

                {
                    searchResult && searchResult.map(({id, fullname, username, profile_pic_filename}) => (
                        <SearchProfile key={id} id={id} fullName={fullname} userName={username} displayPicture={profile_pic_filename} searchResult={searchResult} setSearchResult={setSearchResult} />
                    ))
                }

            </div>
        </div>
    );
}

export default SearchBar;