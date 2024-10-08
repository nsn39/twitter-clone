import { Fragment } from "react";
import { useState, useEffect } from "react";

import LoginModal from "./loginModal";
import SignupModal from "./signupModal";

function LandingPage() {
    const [loginMode, setLoginMode] = useState(false);
    const [signupMode, setSignupMode] = useState(false);

    const handleLoginClick = () => {
        setLoginMode(true);
    }

    const handleSignupClick = () => {
        setSignupMode(true);
    }

    useEffect(() => {
        document.title = "Twitter"
    }, []);

    return (
        <Fragment>
        <div className="flex flex-col font-chirp">
            <div className="flex flex-col lg:flex-row">
                <div className="lg:basis-7/12 flex items-center justify-center w-full p-8 lg:p-32">
                    <svg className="h-16 w-16 lg:h-96 lg:w-96" viewBox="0 0 406.067 406.067" xmlns="http://www.w3.org/2000/svg" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M0 72.883v260.304c0 40.172 32.708 72.881 72.888 72.881H333.18c40.179 0 72.885-32.709 72.885-72.881V72.883C406.064 32.709 373.358 0 333.18 0H72.887C32.708 0 0 32.709 0 72.883z" fill="#6ebedf"></path><path d="M.015 137.778c56.04 17.901 126.999 28.597 204.196 28.597 76.094 0 146.162-10.396 201.839-27.85V71.27c-.587-35.795-27.114-65.416-61.567-70.8-2.618-.3-5.275-.47-7.973-.47H68.783c-1.8 0-3.578.091-5.345.226C27.715 4.885.015 35.508.015 72.474v65.304z" fill="#81c7e8"></path><path d="M22.969 83.728c0-33.553 27.208-60.845 60.847-60.845h238.433c33.641 0 60.848 27.292 60.848 60.845v238.521c0 33.643-27.207 60.852-60.848 60.852H83.816c-33.639 0-60.847-27.209-60.847-60.852V83.728zM9.322 78.86v248.345c0 38.336 31.206 69.541 69.54 69.541h248.341c38.335 0 69.539-31.205 69.539-69.541V78.86c0-38.332-31.204-69.538-69.539-69.538H78.862c-38.334 0-69.54 31.206-69.54 69.538z" opacity=".5" fill="#ffffff"></path><path d="M197.464 172.475c10.352-32.311 23.004-53.25 37.561-68.429 10.863-11.329 16.468-14.924 10.093-2.452 2.816-2.257 6.87-5.26 10.013-6.864 17.615-8.311 16.366-1.344 4.229 6.124 33.122-11.85 31.974 3.24-3.059 10.756 28.644.54 59.095 18.767 67.858 57.537 1.212 5.366-.239 4.856 5.256 5.828 11.863 2.1 23.023 1.971 33.904-1.485-1.178 8.021-11.772 13.233-28.301 16.676-6.124 1.275-7.38.94-.039 2.591 9.037 2.033 19.15 2.559 29.84 2.058-8.328 9.585-21.6 14.486-38.019 14.687-10.269 37.498-33.732 64.35-63.43 81.204-69.728 39.577-171.229 33.834-222.127-38.092 33.398 26.208 82.877 31.981 119.625-4.548-24.073.005-30.307-18.023-11.222-27.762-18.074-.185-29.563-5.901-36.306-16.254-2.561-3.93-2.587-4.232 1.588-7.249 4.593-3.319 10.849-4.795 17.312-5.292-18.705-5.354-30.144-15.129-34.104-28.235-1.311-4.335-1.515-4.115 2.897-5.235 4.312-1.094 9.863-1.678 14.84-1.923-14.691-8.912-23.471-19.833-25.706-31.908-2.108-11.396.062-8.472 8.598-5.207 38.149 14.596 76.181 30.269 98.699 53.474z" fill="#ffffff"></path></g></svg>
                </div>

                <div className="lg:basis-5/12 flex flex-col justify-center items-center lg:justify-start lg:items-start">
                    <div className="w-full lg:pt-20 mb-2 lg:mb-8 flex justify-center items-center lg:justify-start lg:items-start"> 
                        <h1 className="font-bold text-2xl lg:text-6xl">Happening now.</h1>
                    </div>
                    
                    <div className="lg:w-1/2 flex flex-col justify-center items-center lg:justify-start lg:items-start p-6 lg:p-0">
                        <h3 className="font-bold text-base lg:text-4xl mb-8">Join today</h3>

                        <button className="flex flex-row items-center justify-center w-full px-10 py-2 mb-4 border-[0.5px] border-gray-300 rounded-full hover:bg-gray-200">
                            <svg className="h-5 w-5 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M19.76 10.77L19.67 10.42H12.23V13.58H16.68C16.4317 14.5443 15.8672 15.3974 15.0767 16.0029C14.2863 16.6084 13.3156 16.9313 12.32 16.92C11.0208 16.9093 9.77254 16.4135 8.81999 15.53C8.35174 15.0685 7.97912 14.5191 7.72344 13.9134C7.46777 13.3077 7.33407 12.6575 7.33 12C7.34511 10.6795 7.86792 9.41544 8.79 8.47002C9.7291 7.58038 10.9764 7.08932 12.27 7.10002C13.3779 7.10855 14.4446 7.52101 15.27 8.26002L17.47 6.00002C16.02 4.70638 14.1432 3.9941 12.2 4.00002C11.131 3.99367 10.0713 4.19793 9.08127 4.60115C8.09125 5.00436 7.19034 5.59863 6.43 6.35002C4.98369 7.8523 4.16827 9.85182 4.15152 11.9371C4.13478 14.0224 4.918 16.0347 6.34 17.56C7.12784 18.3449 8.06422 18.965 9.09441 19.3839C10.1246 19.8029 11.2279 20.0123 12.34 20C13.3484 20.0075 14.3479 19.8102 15.2779 19.42C16.2078 19.0298 17.0488 18.4549 17.75 17.73C19.1259 16.2171 19.8702 14.2347 19.83 12.19C19.8408 11.7156 19.8174 11.2411 19.76 10.77Z" fill="#000000"></path> </g></svg>
                            <p className="font-bold">Sign up with Google</p>
                        </button>

                        <button className="flex flex-row items-center justify-center w-full px-10 py-2 border-[0.5px] border-gray-300 hover:bg-gray-200 rounded-full">
                            <svg className="h-5 w-5 mr-1" fill="#000000" viewBox="-6.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>apple</title> <path d="M13.313 7.219c0.25-0.688 0.406-1.281 0.406-1.844 0-0.094-0.031-0.156-0.031-0.25s-0.031-0.219-0.063-0.344c-1.563 0.344-2.656 1.031-3.344 2.031-0.688 0.969-1.031 2.125-1.063 3.469 0.563-0.063 1.031-0.156 1.375-0.25 0.469-0.156 0.969-0.469 1.469-0.938 0.563-0.563 1-1.25 1.25-1.875zM11.531 10.344c-0.938 0.313-1.594 0.438-1.938 0.438-0.281 0-0.875-0.125-1.844-0.375-0.938-0.281-1.719-0.438-2.406-0.438-1.531 0-2.813 0.656-3.844 1.969-1 1.313-1.5 2.969-1.5 5.031 0 2.219 0.656 4.469 1.969 6.781 1.344 2.313 2.719 3.438 4.063 3.438 0.438 0 1-0.156 1.781-0.438 0.719-0.281 1.344-0.438 1.906-0.438s1.25 0.125 2.031 0.406c0.813 0.281 1.438 0.406 1.906 0.406 1.156 0 2.313-0.875 3.469-2.594 0.375-0.563 0.719-1.156 1-1.719 0.25-0.531 0.469-1.094 0.656-1.625-0.844-0.25-1.563-0.844-2.156-1.719-0.594-0.906-0.906-1.906-0.906-3 0-1.031 0.281-1.938 0.844-2.781 0.344-0.438 0.875-1 1.563-1.594-0.219-0.281-0.469-0.563-0.688-0.781-0.25-0.219-0.469-0.406-0.688-0.563-0.875-0.563-1.844-0.875-2.906-0.875-0.625 0-1.406 0.188-2.313 0.469z"></path> </g></svg>
                            <p className="font-bold">Sign up with Apple</p>
                        </button>

                        <div className="relative flex items-center w-full">
                            <div className="flex-grow border-t-[0.5px] border-gray-400"></div>
                            <div className="flex w-full justify-center items-center">
                                <p>&nbsp; or &nbsp;</p>
                            </div>
                            
                            <div className="flex-grow border-t-[0.5px] border-gray-400"></div>
                        </div>
                        

                        <button onClick={handleSignupClick} className="px-10 py-2 mb-1 w-full border-[0.5px] border-gray-300 bg-sky-400 hover:bg-sky-500 text-white font-bold rounded-full">
                            Create account
                        </button>

                        <p className="text-xs text-gray-500 mb-2">By signing up, you agree to the <a href="/landing" className="text-sky-900 hover:underline cursor-pointer">Terms of Service</a> and <a href="/landing" className="text-sky-900 hover:underline cursor-pointer">Privacy Policy</a>, including <a href="/landing" className="text-sky-900 hover:underline cursor-pointer">Cookie use</a></p>
                        <p className="text-md font-bold mb-4">Already have an account?</p>
                        
                        <button onClick={handleLoginClick} className="px-10 py-2 w-full border-[0.5px] border-gray-300 text-sky-400 font-bold rounded-full hover:bg-gray-200">Sign in</button>
                    </div>
                </div>
            </div>

            <div className="flex flex-row flex-wrap justify-center mb-4">
                <a href="/landing" className="mr-4 text-gray-400 hover:underline text-sm">About</a>
                <a href="/landing" className="mr-4 text-gray-400 hover:underline text-sm">Download the X app</a>
                <a href="/landing" className="mr-4 text-gray-400 hover:underline text-sm">Help Center</a>
                <a href="/landing" className="mr-4 text-gray-400 hover:underline text-sm">Terms of Service</a>
                <a href="/landing" className="mr-4 text-gray-400 hover:underline text-sm">Privacy Policy</a>
                <a href="/landing" className="mr-4 text-gray-400 hover:underline text-sm">Cookie Policy</a>
                <a href="/landing" className="mr-4 text-gray-400 hover:underline text-sm">Accessibility</a>
                <a href="/landing" className="mr-4 text-gray-400 hover:underline text-sm">Ads info</a>
                <a href="/landing" className="mr-4 text-gray-400 hover:underline text-sm">Blog</a>
                <a href="/landing" className="mr-4 text-gray-400 hover:underline text-sm">Careers</a>
                <a href="/landing" className="mr-4 text-gray-400 hover:underline text-sm">Brand Resources</a>
                <a href="/landing" className="mr-4 text-gray-400 hover:underline text-sm">Advertising</a>
                <a href="/landing" className="mr-4 text-gray-400 hover:underline text-sm">Marketing</a>
                <a href="/landing" className="mr-4 text-gray-400 hover:underline text-sm">X for Business</a>
                <a href="/landing" className="mr-4 text-gray-400 hover:underline text-sm">Developers</a>
                <a href="/landing" className="mr-4 text-gray-400 hover:underline text-sm">Directory</a>
                <a href="/landing" className="mr-4 text-gray-400 hover:underline text-sm">Settings</a>
                <a href="/landing" className="mr-4 text-gray-400 hover:underline text-sm">&copy; 2024 X Corp.</a>
            </div>
        </div>

        <SignupModal isVisible={signupMode} onClose={() => setSignupMode(false)} />
        <LoginModal isVisible={loginMode} onClose={() => setLoginMode(false)}/>

        </Fragment>
    );
}

export default LandingPage;