import { useState } from "react";

function PostModal({isVisible, onClose}) {
    const [inputText, setInputText] = useState("");

    if (!isVisible) {
        return null;
    }

    let inputHandler = (e) => {
        console.log(e);
        //e.preventDefault();
        setInputText(e.target.value);
    }

    const deleteStateAndClose = () => {
        setInputText("");
        onClose();
    }

    const handleClose = (e) => {
        if (e.target.id == "wrapper") deleteStateAndClose();
    }

    return (
        <div onClick={handleClose} id="wrapper" className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="w-[46%] bg-white flex flex-col rounded-2xl p-4">
                <button onClick={deleteStateAndClose} className="flex-none h-10 w-10 hover:bg-gray-300 mb-4 rounded-full flex items-center justify-center cursor-pointer">
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M5.46967 5.46967C5.76256 5.17678 6.23744 5.17678 6.53033 5.46967L18.5303 17.4697C18.8232 17.7626 18.8232 18.2374 18.5303 18.5303C18.2374 18.8232 17.7626 18.8232 17.4697 18.5303L5.46967 6.53033C5.17678 6.23744 5.17678 5.76256 5.46967 5.46967Z" fill="#000000"></path> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5303 5.46967C18.8232 5.76256 18.8232 6.23744 18.5303 6.53033L6.53035 18.5303C6.23745 18.8232 5.76258 18.8232 5.46969 18.5303C5.17679 18.2374 5.17679 17.7626 5.46968 17.4697L17.4697 5.46967C17.7626 5.17678 18.2374 5.17678 18.5303 5.46967Z" fill="#000000"></path> </g></svg>
                </button>

                <div className="flex flex-row p-3 items-start border-slate-300">
                    <img src='/lex.jpeg' className='flex-none h-10 w-10 rounded-full mr-4' />

                    <div className='grow flex flex-col items-end'>
                        <textarea className="h-24 w-full mr-2 border-b border-slate-300 outline-none resize-none text-xl" type="text" placeholder="What's happening?" onChange={inputHandler} value={inputText}/>

                        <button className="text-white w-20 font-bold bg-sky-400 mt-2 px-4 py-2 rounded-full">Post</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PostModal;