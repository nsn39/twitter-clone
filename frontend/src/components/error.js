import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { useParams } from "react-router-dom";

function Error() {
    const { slug } = useParams();

    return (
        <div className="flex flex-row mx-auto w-[1366px] font-chirp">
            <Navbar></Navbar>

            <div className="w-[46%]">
                <p className="font-bold text-3xl">Slug : {slug}</p>
                <p className="px-2 py-20 font-bold text-3xl">404 Error. Page Not Found</p>
            </div>

            <Sidebar></Sidebar>
        </div>
    );
};

export default Error;