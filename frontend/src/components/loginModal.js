import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginModal({isVisible, onClose}) {
    const {REACT_APP_BACKEND_URL} = process.env;
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        "identifier": "",
        "password": ""
    });

    const [submitMessage, setSubmitMessage] = useState("");

    function Message({content}) {
        if (content) {
            return (
                <p className="mb-2 text-red-500 font-bold">{content}</p>
            );
        }else {
            return null;
        }
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        var form_data = new FormData();
        form_data.append("username", formData.identifier);
        form_data.append("password", formData.password)

        //get a token and save it to local state.
        fetch(REACT_APP_BACKEND_URL + "auth/login", {
            method: "POST",
            body: form_data,
            credentials: "include"
        })
        .then((res) => {
            if (res.status == 200) {
                navigate("/")
            }
            else {
                setSubmitMessage("Incorrect username or password. Please try again!!!");
            }
        })
    }

    if (!isVisible) {
        return null;
    }

    const deleteStateAndClose = () => {
        setSubmitMessage("");
        setFormData({
            "identifier": "",
            "password": ""
        })
        onClose();
    }

    const handleClose = (e) => {
        if (e.target.id == "wrapper") deleteStateAndClose();
    }

    return (
        <div onClick={handleClose} id="wrapper" className="fixed inset-0 bg-black bg-opacity-25 font-chirp backdrop-blur-sm flex items-start justify-center md:items-center">
            <div className="w-10/12 md:w-1/2 flex flex-col mt-20 md:mt-0 bg-white rounded-lg shadow">
                <div className="flex flex-row p-4">
                    <button onClick={deleteStateAndClose} className="flex-none h-10 w-10 hover:bg-gray-300 rounded-full flex items-center justify-center cursor-pointer">
                        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.46967 5.46967C5.76256 5.17678 6.23744 5.17678 6.53033 5.46967L18.5303 17.4697C18.8232 17.7626 18.8232 18.2374 18.5303 18.5303C18.2374 18.8232 17.7626 18.8232 17.4697 18.5303L5.46967 6.53033C5.17678 6.23744 5.17678 5.76256 5.46967 5.46967Z" fill="#000000"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5303 5.46967C18.8232 5.76256 18.8232 6.23744 18.5303 6.53033L6.53035 18.5303C6.23745 18.8232 5.76258 18.8232 5.46969 18.5303C5.17679 18.2374 5.17679 17.7626 5.46968 17.4697L17.4697 5.46967C17.7626 5.17678 18.2374 5.17678 18.5303 5.46967Z" fill="#000000"></path> </g></svg>
                    </button>

                    <div className="grow flex items-center justify-center">
                        <svg className="h-10 w-10" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#1D9BF0" d="M13.567 5.144c.008.123.008.247.008.371 0 3.796-2.889 8.173-8.172 8.173v-.002A8.131 8.131 0 011 12.398a5.768 5.768 0 004.25-1.19 2.876 2.876 0 01-2.683-1.995c.431.083.875.066 1.297-.05A2.873 2.873 0 011.56 6.348v-.036c.4.222.847.345 1.304.36a2.876 2.876 0 01-.89-3.836 8.152 8.152 0 005.92 3 2.874 2.874 0 014.895-2.619 5.763 5.763 0 001.824-.697 2.883 2.883 0 01-1.262 1.588A5.712 5.712 0 0015 3.656a5.834 5.834 0 01-1.433 1.488z"></path></g></svg>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col p-6 md:px-24 md:py-12">
                    <h3 className="font-bold text-xl md:text-3xl mb-2">Sign in to Twitter</h3>
                    
                    <p className="text-sm md:text-base mb-8">Don't have an account? <a href="/landing" className="text-sky-900 hover:underline">Sign up</a></p>
                    
                    <Message content={submitMessage} />
                    
                    <input className="pl-2 pr-10 py-4 rounded-lg mb-5 border border-gray-300 focus:outline focus:outline-[2px] focus:outline-sky-300" type="text" placeholder="Phone, e-mail or username." onChange={handleChange} name="identifier" value={formData.identifier}/>

                    <input className="pl-2 pr-10 py-4 rounded-lg mb-4 border border-gray-300 focus:outline focus:outline-[2px] focus:outline-sky-300" type="password" placeholder="Password" onChange={handleChange} name="password" value={formData.password} />

                    <button type="submit" className="bg-sky-400 text-white font-bold px-10 py-4 border-[0.5px] border-gray-300 rounded-full mx-4">Login</button>
                </form>
                
            
            </div>
            
        </div>
    );
}

export default LoginModal;