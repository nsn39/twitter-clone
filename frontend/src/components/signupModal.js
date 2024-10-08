import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SignupModal({isVisible, onClose}) {
    const [submitMessage, setSubmitMessage] = useState("");
    const navigate = useNavigate();

    function Message({content}) {
        if (content) {
            return (
                <p className="mb-2 text-red-500 font-bold">{content}</p>
            );
        }else {
            return null;
        }
    }

    const [formData, setFormData] = useState({
        "fullname": "",
        "password": "",
        "confirmPassword": "",
        "email": "",
        "phoneNo": "",
        "birthYear": "2000",
        "birthMonth": "January",
        "birthDay": "1",
        "gender": "Male",
        "username": "",
        "country": "Nepal"
    })

    const handleChange = (event) => {
        const {name, value} = event.target;
        console.log("Name -> value: ", name, value)
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        //console.log(formData);
        //get a token and save it to local state.
        var form_data = new FormData();
        form_data.append("username", formData.username);
        form_data.append("password", formData.password);
        form_data.append("email", formData.email);
        form_data.append("full_name", formData.fullname);
        form_data.append("phone_no", formData.phoneNo);
        form_data.append("birth_day", formData.birthDay);
        form_data.append("birth_month", formData.birthMonth);
        form_data.append("birth_year", formData.birthYear);
        form_data.append("country", formData.country);
        form_data.append("gender", formData.gender);

        console.log(form_data);
        //get a token and save it to local state.
        fetch("http://localhost:8000/twitter-clone-api/auth/signup", {
            "method": "POST",
            "body": form_data,
            credentials: "include"
        })
        .then((res) => {
            if (res.status == 201) {
                console.log("signup successful");
                navigate("/")
            }
            else {
                console.log("signup failed");
                console.log(res);
                setSubmitMessage("Something went wrong!!! Unable to Sign Up.");
            }
        })
    }

    if (!isVisible) {
        return null;
    }

    const deleteStateAndClose = () => {
        setSubmitMessage("");
        setFormData({
            "fullname": "",
            "password": "",
            "confirmPassword": "",
            "email": "",
            "phoneNo": "",
            "birthYear": "",
            "birthMonth": "",
            "birthDay": "",
            "gender": "",
            "username": "",
            "country": ""
        })
        onClose();
    }

    const handleClose = (e) => {
        if (e.target.id == "wrapper") deleteStateAndClose();
    }

    return (
        <div onClick={handleClose} id="wrapper" className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex font-chirp justify-center items-center">
            <div className="w-11/12 md:w-1/2 flex flex-col bg-white rounded-lg h-[80vh] overflow-y-scroll">
                <div className="flex flex-row p-4">
                    <button onClick={deleteStateAndClose} className="flex-none h-10 w-10 hover:bg-gray-300 rounded-full flex items-center justify-center cursor-pointer">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.46967 5.46967C5.76256 5.17678 6.23744 5.17678 6.53033 5.46967L18.5303 17.4697C18.8232 17.7626 18.8232 18.2374 18.5303 18.5303C18.2374 18.8232 17.7626 18.8232 17.4697 18.5303L5.46967 6.53033C5.17678 6.23744 5.17678 5.76256 5.46967 5.46967Z" fill="#000000"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5303 5.46967C18.8232 5.76256 18.8232 6.23744 18.5303 6.53033L6.53035 18.5303C6.23745 18.8232 5.76258 18.8232 5.46969 18.5303C5.17679 18.2374 5.17679 17.7626 5.46968 17.4697L17.4697 5.46967C17.7626 5.17678 18.2374 5.17678 18.5303 5.46967Z" fill="#000000"></path> </g></svg>
                    </button>

                    <div className="grow flex items-center justify-center">
                        <svg className="h-10 w-10" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#1D9BF0" d="M13.567 5.144c.008.123.008.247.008.371 0 3.796-2.889 8.173-8.172 8.173v-.002A8.131 8.131 0 011 12.398a5.768 5.768 0 004.25-1.19 2.876 2.876 0 01-2.683-1.995c.431.083.875.066 1.297-.05A2.873 2.873 0 011.56 6.348v-.036c.4.222.847.345 1.304.36a2.876 2.876 0 01-.89-3.836 8.152 8.152 0 005.92 3 2.874 2.874 0 014.895-2.619 5.763 5.763 0 001.824-.697 2.883 2.883 0 01-1.262 1.588A5.712 5.712 0 0015 3.656a5.834 5.834 0 01-1.433 1.488z"></path></g></svg>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col px-8 py-4 md:px-24 md:py-12">
                    <h3 className="font-bold text-base md:text-3xl mb-2">Create your account.</h3>

                    <input onChange={handleChange} className="pl-2 pr-10 py-2 md:py-4 rounded-lg mb-4 border border-gray-300 focus:outline focus:outline-[2px] focus:outline-sky-300" type="text" placeholder="Full name" name="fullname" value={formData.fullname} />

                    <input onChange={handleChange} className="pl-2 pr-10 py-2 md:py-4 rounded-lg mb-4 border border-gray-300 focus:outline focus:outline-[2px] focus:outline-sky-300" type="text" placeholder="E-mail address" name="email" value={formData.email}/>

                    <input onChange={handleChange} className="pl-2 pr-10 py-2 md:py-4 rounded-lg mb-4 border border-gray-300 focus:outline focus:outline-[2px] focus:outline-sky-300" type="text" placeholder="Phone no." name="phoneNo" value={formData.phoneNo} />

                    <label className="font-bold mb-2">Date of Birth</label>
                    <p className="text-sm text-gray-600 mb-3">This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.</p>
                    <div className="flex flex-row">
                        <div className="relative">
                            <select onChange={handleChange} className="flex-none pl-2 pr-4 md:pr-10 py-2 pt-5 md:pt-7 md:pb-2 mr-4 rounded-lg mb-4 border border-gray-300 focus:outline focus:outline-[2px] focus:outline-sky-300 bg-white" name="birthDay" value={formData.birthDay}>
                                <option selected='selected'>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>

                            <p className="absolute top-[7px] left-[7px] text-xs">Day</p>
                        </div>

                        <div className="relative">
                            <select onChange={handleChange} className="grow pl-2 pr-4 md:pr-10 py-2 pt-5 md:pt-7 md:pb-2 rounded-lg mb-4 mr-4 border border-gray-300 focus:outline focus:outline-[2px] focus:outline-sky-300 bg-white" name="birthMonth" value={formData.birthMonth}>
                                <option selected='selected'>January</option>
                                <option>February</option>
                                <option>March</option>
                                <option>April</option>
                            </select>

                            <p className="absolute top-[7px] left-[7px] text-xs">Month</p>
                        </div>

                        <div className="relative">
                            <select onChange={handleChange} className="flex-none pl-2 pr-4 md:pr-10 py-2 pt-5 md:pt-7 md:pb-2 rounded-lg mb-4 border border-gray-300 focus:outline focus:outline-[2px] focus:outline-sky-300 bg-white" name="birthYear" value={formData.birthYear}>
                                <option selected='selected'>2000</option>
                                <option>2001</option>
                                <option>2002</option>
                            </select>
                            
                            <p className="absolute top-[7px] left-[7px] text-xs">Year</p>
                        </div>
                    </div>
                    

                    <label className="mb-2 font-bold">Select your gender.</label>
                    <select onChange={handleChange} className="pl-2 pr-10 py-2 md:py-4 rounded-lg mb-4 border border-gray-300 focus:outline focus:outline-[2px] focus:outline-sky-300 bg-white" name="gender" value={formData.gender}>
                        <option selected='selected'>Male</option>
                        <option>Female</option>
                        <option>Non-binary</option>
                        <option>Other</option>
                        <option>Don't want to share</option>
                    </select>

                    <label className="font-bold mb-1">Write your username</label>
                    <p className="text-sm text-gray-500 mb-2">Username is a unique identifier of your Twitter profile. Best to make it short and precise for convenience.</p>
                    <input onChange={handleChange} className="pl-2 pr-10 py-2 md:py-4 rounded-lg mb-4 border border-gray-300 focus:outline focus:outline-[2px] focus:outline-sky-300" type="text" placeholder="Preferred username" name="username" value={formData.username} />
                
                    <label className="font-bold mb-1">Choose a password</label>
                    <p className="text-sm text-gray-500 mb-2">12 characters minimum. Make sure to include at least one uppercase, one symbol and one numerical character.</p>
                    <input onChange={handleChange} className="pl-2 pr-10 py-2 md:py-4 rounded-lg mb-4 border border-gray-300 focus:outline focus:outline-[2px] focus:outline-sky-300" type="password" placeholder="Enter Password." name="password" value={formData.password} />
                    <input onChange={handleChange} className="pl-2 pr-10 py-2 md:py-4 rounded-lg mb-4 border border-gray-300 focus:outline focus:outline-[2px] focus:outline-sky-300" type="password" placeholder="Re-enter Pasword." name="confirmPassword" value={formData.confirmPassword} />

                    <label className="font-bold mb-1">Select the country you're from</label>
                    <select onChange={handleChange} className="pl-2 pr-10 py-2 md:py-4 rounded-lg mb-4 border border-gray-300 focus:outline focus:outline-[2px] focus:outline-sky-300 bg-white" name="country" value={formData.country}>
                        <option selected='selected'>US</option>
                        <option>Russia</option>
                        <option>Nepal</option>
                        <option>China</option>
                        <option>France</option>
                    </select>
                    
                    <Message content={submitMessage} />
                    <button type="submit" className="bg-sky-400 text-white font-bold px-10 py-2 md:py-4 border-[0.5px] border-gray-300 rounded-full mx-4">Join Twitter</button>
                </form>
                
            
            </div>
            
        </div>
    );
}

export default SignupModal;

//what to include in signup page.
//1. full name
//2. email
//3. date of birth
//4. preferred username
//5. phone no
//6. password
//7. reenter password
//8. gender
//9. country
//10. address