import { useState } from "react";
import { useNavigate } from "react-router-dom";

function EditProfileModal ({isVisible, onClose}) {
    const {REACT_APP_BACKEND_URL} = process.env;
    const navigate = useNavigate();

    const [updateData, setUpdateData] = useState({
        "selectedFile": null,
        "fullname": "",
        "bio": "",
        "location": "",
        "website": ""
    })

    const handleChange = (event) => {
        const {name, value} = event.target;
        setUpdateData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }


    const onSave = () => {
        var form_data = new FormData();
        form_data.append("profile_pic", updateData.selectedFile);
        form_data.append("fullname", updateData.fullname);
        form_data.append("bio", updateData.bio);
        form_data.append("location", updateData.location);
        form_data.append("website", updateData.website);

        
        fetch(REACT_APP_BACKEND_URL + "profile/", {
            "method": "PATCH",
            "body": form_data,
            credentials: "include"
        })
        .then((res) => {
            return res.json();
        })
        .then((data) => {
            if (data) {
                onClose();
            }
            else {
                console.log("Profile update failed.")
            }
            
        })
        
    };

    const onPhotoUploadClick = () => {
        document.getElementById("image_input_element").click();
    };

    const onFileChange = (event) => {
        setUpdateData((prevFormData) => ({...prevFormData, selectedFile: event.target.files[0]}));

        var image_element = document.getElementById("profile_pic");
        image_element.src = URL.createObjectURL(event.target.files[0]);
    }

    const onMouseOverPic = () => {
        let dropdown = document.querySelector("#wrapper #upload_button");
        dropdown.classList.toggle("hidden");
    }

    const onMouseOutPic = () => {
        let dropdown = document.querySelector("#wrapper #upload_button");
        dropdown.classList.toggle("hidden");
    }

    if (!isVisible) {
        return null;
    }

    const deleteStateAndClose = () => {
        //setSubmitMessage("");
        onClose();
    }

    const handleClose = (e) => {
        if (e.target.id == "wrapper") deleteStateAndClose();
    }

    return (
        <div onClick={handleClose} id="wrapper" className="fixed inset-0 bg-black bg-opacity-25 font-chirp backdrop-blur-sm md:flex items-center justify-center pt-8 md:pt-0">
            <div className="w-full md:w-[45%] flex flex-col bg-white border-b-1 border-black rounded-lg p-4 h-[80vh] overflow-y-scroll">
                <div className="flex flex-row w-full">
                    <button onClick={deleteStateAndClose} className="flex-none h-10 w-10 hover:bg-gray-300 rounded-full flex items-center justify-center cursor-pointer">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.46967 5.46967C5.76256 5.17678 6.23744 5.17678 6.53033 5.46967L18.5303 17.4697C18.8232 17.7626 18.8232 18.2374 18.5303 18.5303C18.2374 18.8232 17.7626 18.8232 17.4697 18.5303L5.46967 6.53033C5.17678 6.23744 5.17678 5.76256 5.46967 5.46967Z" fill="#000000"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5303 5.46967C18.8232 5.76256 18.8232 6.23744 18.5303 6.53033L6.53035 18.5303C6.23745 18.8232 5.76258 18.8232 5.46969 18.5303C5.17679 18.2374 5.17679 17.7626 5.46968 17.4697L17.4697 5.46967C17.7626 5.17678 18.2374 5.17678 18.5303 5.46967Z" fill="#000000"></path> </g></svg>
                    </button>

                    <div className="w-full flex flex-row items-center justify-between px-4">
                        <h3 className="font-bold text-xl">Edit Profile</h3>
                        <button onClick={onSave} className="text-white font-bold py-2 px-4 rounded-full bg-black">Save</button>
                    </div>
                </div>

                <div className="relative mb-16 mt-4">
                    <img src="/cover.jpeg" className="h-full w-full"/>

                    <div className="absolute h-30 w-30 rounded-full border-2 border-white top-[80px] md:top-[120px] left-[20px]">
                        <img id="profile_pic" src="/lex.jpeg" className="h-16 w-16 md:h-28 md:w-28 rounded-full cursor-pointer fill-black-100" />
                        <div class="absolute rounded-full inset-0 bg-slate-800 opacity-50"></div>
                    </div>

                    <div onMouseOver={onMouseOverPic} onMouseOut={onMouseOutPic} onClick={onPhotoUploadClick} className="absolute top-[88px] left-[30px] md:top-[160px] md:left-[55px] flex items-center justify-center h-12 w-12 rounded-full bg-slate-500 opacity-50 hover:bg-slate-200 cursor-pointer">
                        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M22 11.5V14.6C22 16.8402 22 17.9603 21.564 18.816C21.1805 19.5686 20.5686 20.1805 19.816 20.564C18.9603 21 17.8402 21 15.6 21H8.4C6.15979 21 5.03969 21 4.18404 20.564C3.43139 20.1805 2.81947 19.5686 2.43597 18.816C2 17.9603 2 16.8402 2 14.6V9.4C2 7.15979 2 6.03969 2.43597 5.18404C2.81947 4.43139 3.43139 3.81947 4.18404 3.43597C5.03969 3 6.15979 3 8.4 3H12.5M19 8V2M16 5H22M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>

                        <input id="image_input_element" className="hidden" type="file" onChange={onFileChange} accept="image/png, image/jpeg" name="selectedFile" />
                    </div>

                    <div id="upload_button" className="absolute hidden top-[200px] left-[45px] p-1 bg-slate-800 opacity-80 rounded-md">
                        <p className="text-xs text-white">Upload Photo</p>
                    </div>
                </div>

                <input className="pl-2 pr-10 py-4 rounded-lg mb-5 border border-gray-300 focus:outline focus:outline-[2px] focus:outline-sky-300" type="text" placeholder="Fullname"  name="fullname" onChange={handleChange} value={updateData.fullname}/>

                <textarea className="pl-2 pr-10 py-4 rounded-lg mb-5 border border-gray-300 focus:outline focus:outline-[2px] focus:outline-sky-300" type="text" placeholder="Bio"  name="bio" onChange={handleChange} value={updateData.bio}/>

                <input className="pl-2 pr-10 py-4 rounded-lg mb-5 border border-gray-300 focus:outline focus:outline-[2px] focus:outline-sky-300" type="text" placeholder="Location"  name="location" onChange={handleChange} value={updateData.location}/>

                <input className="pl-2 pr-10 py-4 rounded-lg mb-5 border border-gray-300 focus:outline focus:outline-[2px] focus:outline-sky-300" type="text" placeholder="Website"  name="website" onChange={handleChange} value={updateData.website}/>
            </div>
        </div>
    );
}

export default EditProfileModal;