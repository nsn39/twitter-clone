import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useOutsideClick } from '../hooks/useOutsideClick';


function Navbar ({setPostMode, showNotificationCount}) {
    const {REACT_APP_BACKEND_URL, REACT_APP_FS_URL, REACT_APP_BACKEND_WS_URL} = process.env;
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [userData, setUserData] = useState({
        "full_name": "Display Name",
        "username": "",
        "display_picture_link": "undefined"
    })

    const handlePostClick = () => {
        setPostMode(true);
    }

    const LogoutDivRef = useOutsideClick(() => {
        let btn_area = document.getElementById("logout-bar");
        btn_area.classList.add("hidden");
    });

    const toggleDropdown = () => {
        let dropdown = document.querySelector("#profile-bar #logout-bar");
        dropdown.classList.toggle("hidden");
    }
    const navigate = useNavigate();

    let isLinkActive = ({ isActive }) => {
        return isActive ? "font-bold flex flex-row" : "flex flex-row";
    };
    /*
    const toggleNotificationAlert = () => {
        let alert_element = document.getElementById("notification_count_area");
        if (alert_element.classList.contains("hidden")) {
            alert_element.classList.remove("hidden");
        } else {
            alert_element.classList.add("hidden");
        }
        console.log("toggle done;");
    }

    const handleNotificationsClick = (e) => {
        console.log("Clicked navlink notifications.")

        setNotificationsCount(0);
        //toggle something.
        toggleNotificationAlert();
        return true;
    }
    */

    const handleLogoutClick = () => {
        fetch(REACT_APP_BACKEND_URL + "auth/logout",{
            method: "GET",
            credentials: "include"
        }).then((res) => {
            if (res.status == 204) {
                navigate('/landing');
            }
        })
    }

    const fetchUserDetails = () => {
        fetch(REACT_APP_BACKEND_URL + "active_user", {
            method: "GET",
            credentials: "include"
        }).then((res) => {
            if (res.status == 200) {
                return res.json();
            }else {
                return null;
            }
        }).then(data => {
            if (data) {
                setUserData({
                    "full_name": data.fullname,
                    "username": data.username,
                    "display_picture_link": data.profile_pic_filename
                });
            }
        })
    }

    const fetchNotificationsCount = () => {
        fetch(REACT_APP_BACKEND_URL + "unseen_notifications_count", {
            method: "GET",
            credentials: "include"
        })
        .then((res) => {
            if (res.status == 200) {
                return res.json();
            }
        })
        .then((data) => {
            if (data) {
                setNotificationsCount(data.count);
            }
        })
    }

    useEffect(() => {
        fetchUserDetails();
        
        // connect to websocket endpoint.
        const ws = new WebSocket(REACT_APP_BACKEND_WS_URL + "notifications");

        ws.onopen = (event) => {
            console.log("Web socket connection started.");

            fetch(REACT_APP_BACKEND_URL + "ws/get_user_token", {
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
                    //setWebSocketToken(data.token);
                    ws.send(data.token);
                }
            })
        };

        //setup websocket connnection.
        

        ws.onmessage = function (event) {
            const data = JSON.parse(event.data);
            console.log("web socket received message: ", data);
            setNotificationsCount((notificationsCount) => notificationsCount + 1);
            /*
            if (setNotificationData) {
                setNotificationData((prevState) => ([ ...prevState, data]));
            }
            */
        }

        // check if any unseen notifications.
        if (showNotificationCount) {
            fetchNotificationsCount();
        }

    }, []);


    const NotificationAlertCircle = () => {
        if (notificationsCount == 0) {
            return null;
        }
        else {
            return (
                <div id="notification_count_area" className="absolute top-[0px] h-4 w-4 left-[10px] text-xs text-white bg-sky-400 p-1 flex flex-row justify-center items-center rounded-full">
                    {notificationsCount}
                </div>
            );
        }
    };


    return (
        <div className="md:w-[25%] md:py-1 md:pl-16 md:h-screen bg-white sticky left-0 bottom-0 md:top-0">
            <div>
                <a className="hidden md:block h-12 w-12 hover:bg-gray-200 rounded-full" href="/">
                    <svg className="h-12 w-12" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#1D9BF0" d="M13.567 5.144c.008.123.008.247.008.371 0 3.796-2.889 8.173-8.172 8.173v-.002A8.131 8.131 0 011 12.398a5.768 5.768 0 004.25-1.19 2.876 2.876 0 01-2.683-1.995c.431.083.875.066 1.297-.05A2.873 2.873 0 011.56 6.348v-.036c.4.222.847.345 1.304.36a2.876 2.876 0 01-.89-3.836 8.152 8.152 0 005.92 3 2.874 2.874 0 014.895-2.619 5.763 5.763 0 001.824-.697 2.883 2.883 0 01-1.262 1.588A5.712 5.712 0 0015 3.656a5.834 5.834 0 01-1.433 1.488z"></path></g></svg>
                </a>
            </div>
            <nav className="">
                <ul className="relative flex flex-row justify-around md:justify-start md:flex-col md:mt-1">
                    <li className="flex flex-row w-min items-center text-xl p-2 md:py-3 md:pr-4 bg-white hover:bg-gray-200 rounded-full">
                        <NavLink to="/" className={isLinkActive}>
                            <svg className="h-7 w-7 md:mr-4" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M1 6V15H6V11C6 9.89543 6.89543 9 8 9C9.10457 9 10 9.89543 10 11V15H15V6L8 0L1 6Z" fill="#000000"></path> </g></svg>
                            <p className="hidden md:flex text-[22px] text-slate-800">Home</p>
                        </NavLink>
                    </li>

                    <li className="flex flex-row w-min items-center text-xl p-2 md:py-3 md:pr-4 bg-white hover:bg-gray-200 rounded-full">
                        <NavLink to="/explore" className={isLinkActive}>
                            <svg className="h-7 w-7 md:mr-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M16.6725 16.6412L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            <p className="hidden md:flex text-[22px] text-slate-800">Explore</p>
                        </NavLink>
                    </li>

                    <li className="flex flex-row w-min items-center text-xl p-2 md:py-3 md:pr-4 bg-white hover:bg-gray-200 rounded-full">
                        <NavLink to="/notifications" className={isLinkActive}>
                            <div className="relative">
                                <svg className="h-7 w-7 md:mr-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M9.33497 4.72727V5.25342C6.64516 6.35644 4.76592 9.97935 4.83412 13.1192L4.83409 14.8631C3.45713 16.6333 3.53815 19.2727 6.9735 19.2727H9.33497C9.33497 19.996 9.61684 20.6897 10.1186 21.2012C10.6203 21.7127 11.3008 22 12.0104 22C12.72 22 13.4005 21.7127 13.9022 21.2012C14.404 20.6897 14.6858 19.996 14.6858 19.2727H17.0538C20.4826 19.2727 20.5323 16.6278 19.1555 14.8576L19.1938 13.1216C19.2631 9.97811 17.3803 6.35194 14.6858 5.25049V4.72727C14.6858 4.00396 14.404 3.31026 13.9022 2.7988C13.4005 2.28734 12.72 2 12.0104 2C11.3008 2 10.6203 2.28734 10.1186 2.7988C9.61684 3.31026 9.33497 4.00395 9.33497 4.72727ZM12.9022 4.72727C12.9022 4.74573 12.9017 4.76414 12.9006 4.78246C12.6101 4.74603 12.3142 4.72727 12.014 4.72727C11.7113 4.72727 11.413 4.74634 11.1203 4.78335C11.1192 4.76474 11.1186 4.74603 11.1186 4.72727C11.1186 4.48617 11.2126 4.25494 11.3798 4.08445C11.547 3.91396 11.7739 3.81818 12.0104 3.81818C12.2469 3.81818 12.4738 3.91396 12.641 4.08445C12.8083 4.25494 12.9022 4.48617 12.9022 4.72727ZM11.1186 19.2727C11.1186 19.5138 11.2126 19.7451 11.3798 19.9156C11.547 20.086 11.7739 20.1818 12.0104 20.1818C12.2469 20.1818 12.4738 20.086 12.641 19.9156C12.8083 19.7451 12.9022 19.5138 12.9022 19.2727H11.1186ZM17.0538 17.4545C17.8157 17.4545 18.2267 16.5435 17.7309 15.9538C17.49 15.6673 17.3616 15.3028 17.3699 14.9286L17.4106 13.0808C17.4787 9.99416 15.0427 6.54545 12.014 6.54545C8.98598 6.54545 6.55028 9.99301 6.61731 13.0789L6.65748 14.9289C6.66561 15.303 6.53726 15.6674 6.29639 15.9538C5.80054 16.5435 6.21158 17.4545 6.9735 17.4545H17.0538Z" fill="#000000"></path> </g></svg>

                                <NotificationAlertCircle />
                            </div>

                            <p className="hidden md:flex text-[22px] text-slate-800">Notifications</p>
                        </NavLink>
                    </li>

                    <li className="flex flex-row w-min items-center text-xl p-2 md:py-3 md:pr-4 bg-white hover:bg-gray-200 rounded-full">
                        <NavLink to="/messages" className={isLinkActive}>
                            <svg className="h-7 w-7 md:mr-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M21 8L17.4392 9.97822C15.454 11.0811 14.4614 11.6326 13.4102 11.8488C12.4798 12.0401 11.5202 12.0401 10.5898 11.8488C9.53864 11.6326 8.54603 11.0811 6.5608 9.97822L3 8M6.2 19H17.8C18.9201 19 19.4802 19 19.908 18.782C20.2843 18.5903 20.5903 18.2843 20.782 17.908C21 17.4802 21 16.9201 21 15.8V8.2C21 7.0799 21 6.51984 20.782 6.09202C20.5903 5.71569 20.2843 5.40973 19.908 5.21799C19.4802 5 18.9201 5 17.8 5H6.2C5.0799 5 4.51984 5 4.09202 5.21799C3.71569 5.40973 3.40973 5.71569 3.21799 6.09202C3 6.51984 3 7.07989 3 8.2V15.8C3 16.9201 3 17.4802 3.21799 17.908C3.40973 18.2843 3.71569 18.5903 4.09202 18.782C4.51984 19 5.07989 19 6.2 19Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            <p className="hidden md:flex text-[22px] text-slate-800">Messages</p>
                        </NavLink>
                    </li>

                    <li className="flex flex-row w-min items-center text-xl p-2 md:py-3 md:pr-4 bg-white hover:bg-gray-200 rounded-full">
                        <NavLink to="/grok" className={isLinkActive}>
                            <svg className="h-7 w-7 md:mr-4" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g fill="#000000"> <path d="M9.633 4.323a.75.75 0 011.234.854l-4.5 6.5a.75.75 0 01-1.234-.854l4.5-6.5z"></path> <path fill-rule="evenodd" d="M3.25 1A2.25 2.25 0 001 3.25v9.5A2.25 2.25 0 003.25 15h9.5A2.25 2.25 0 0015 12.75v-9.5A2.25 2.25 0 0012.75 1h-9.5zM2.5 3.25a.75.75 0 01.75-.75h9.5a.75.75 0 01.75.75v9.5a.75.75 0 01-.75.75h-9.5a.75.75 0 01-.75-.75v-9.5z" clip-rule="evenodd"></path> </g> </g></svg>
                            <p className="hidden md:flex text-[22px] text-slate-800">Grok</p>
                        </NavLink>
                    </li>

                    <li className="hidden md:flex flex-row w-min items-center text-xl p-2 md:py-3 md:pr-4 bg-white hover:bg-gray-200 rounded-full">
                        <NavLink to="/communities" className={isLinkActive}>
                            <svg className="h-7 w-7 md:mr-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M18 7.16C17.94 7.15 17.87 7.15 17.81 7.16C16.43 7.11 15.33 5.98 15.33 4.58C15.33 3.15 16.48 2 17.91 2C19.34 2 20.49 3.16 20.49 4.58C20.48 5.98 19.38 7.11 18 7.16Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M16.9699 14.44C18.3399 14.67 19.8499 14.43 20.9099 13.72C22.3199 12.78 22.3199 11.24 20.9099 10.3C19.8399 9.59004 18.3099 9.35003 16.9399 9.59003" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M5.96998 7.16C6.02998 7.15 6.09998 7.15 6.15998 7.16C7.53998 7.11 8.63998 5.98 8.63998 4.58C8.63998 3.15 7.48998 2 6.05998 2C4.62998 2 3.47998 3.16 3.47998 4.58C3.48998 5.98 4.58998 7.11 5.96998 7.16Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M6.99994 14.44C5.62994 14.67 4.11994 14.43 3.05994 13.72C1.64994 12.78 1.64994 11.24 3.05994 10.3C4.12994 9.59004 5.65994 9.35003 7.02994 9.59003" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 14.63C11.94 14.62 11.87 14.62 11.81 14.63C10.43 14.58 9.32996 13.45 9.32996 12.05C9.32996 10.62 10.48 9.46997 11.91 9.46997C13.34 9.46997 14.49 10.63 14.49 12.05C14.48 13.45 13.38 14.59 12 14.63Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M9.08997 17.78C7.67997 18.72 7.67997 20.26 9.08997 21.2C10.69 22.27 13.31 22.27 14.91 21.2C16.32 20.26 16.32 18.72 14.91 17.78C13.32 16.72 10.69 16.72 9.08997 17.78Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            <p className="hidden md:flex text-[22px] text-slate-800">Communities</p>
                        </NavLink>
                    </li>

                    <li className="flex flex-row w-min items-center text-xl p-2 md:py-3 md:pr-4 bg-white hover:bg-gray-200 rounded-full">
                        <NavLink to={'/' + userData.username} className={isLinkActive}>
                            <svg className="h-7 w-7 md:mr-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M12.12 12.78C12.05 12.77 11.96 12.77 11.88 12.78C10.12 12.72 8.71997 11.28 8.71997 9.50998C8.71997 7.69998 10.18 6.22998 12 6.22998C13.81 6.22998 15.28 7.69998 15.28 9.50998C15.27 11.28 13.88 12.72 12.12 12.78Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M18.74 19.3801C16.96 21.0101 14.6 22.0001 12 22.0001C9.40001 22.0001 7.04001 21.0101 5.26001 19.3801C5.36001 18.4401 5.96001 17.5201 7.03001 16.8001C9.77001 14.9801 14.25 14.9801 16.97 16.8001C18.04 17.5201 18.64 18.4401 18.74 19.3801Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
                            <p className="hidden md:flex text-[22px] text-slate-800">Profile</p>
                        </NavLink>
                    </li>

                    <li className="hidden md:flex flex-row w-min items-center text-xl p-2 md:py-3 md:pr-4 bg-white hover:bg-gray-200 rounded-full">
                        <NavLink to="/more" className={isLinkActive}>
                            <svg className="h-7 w-7 md:mr-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M8 12H8.01" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M12 12H12.01" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M16 12H16.01" stroke="#323232" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#323232" stroke-width="2"></path> </g></svg>
                            <p className="hidden md:flex text-[22px] text-slate-800">More</p>
                        </NavLink>
                    </li>

                    <div onClick={handlePostClick} className="absolute h-10 w-10 rounded-full bg-sky-400 drop-shadow-xl flex items-center justify-center md:hidden cursor-pointer top-[-45px] right-[20px]">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M22.8013 1.74899C22.6665 1.22946 22.1457 0.908925 21.6212 1.02275C8.65054 3.83745 2.58949 13.7685 0.052924 22.7276C-0.0695134 23.16 0.111594 23.621 0.495639 23.8545C0.671767 23.9616 0.870732 24.0087 1.06614 23.9987C1.30094 22.8623 2.3183 22.0061 3.53976 22L3.82845 21.7288C4.23095 21.3506 4.25066 20.7177 3.87248 20.3153C3.65552 20.0843 3.35472 19.9794 3.06169 20.0033L3.10053 19.9025C3.13285 19.8568 3.16175 19.8078 3.18671 19.7556C3.39169 19.327 3.62105 19.0828 3.85127 18.9282C4.08827 18.769 4.38857 18.663 4.7947 18.6054C5.20936 18.5467 5.69118 18.5437 6.27396 18.5637C6.4627 18.5702 6.66791 18.5794 6.8832 18.5891L6.88328 18.5891C7.29482 18.6077 7.74319 18.6279 8.18371 18.6335C9.57215 18.6515 11.1777 18.5382 12.8464 17.8022C14.5236 17.0625 16.1803 15.7318 17.7487 13.451C17.9918 13.0974 17.9823 12.6281 17.7249 12.2846C17.6946 12.2443 17.6617 12.2067 17.6266 12.1721C18.6722 11.5802 19.5909 10.7793 20.3487 9.88147C21.3629 8.6798 22.1246 7.27154 22.5618 5.86914C22.9956 4.47728 23.1309 3.02041 22.8013 1.74899ZM6.34251 16.5649C5.75764 16.5449 5.15144 16.5409 4.57221 16.6173C7.63752 10.6611 12.7418 5.34921 20.9846 3.22857C20.9893 3.84429 20.8812 4.53976 20.6524 5.27392C20.2948 6.42083 19.663 7.59302 18.8203 8.59148C17.1301 10.5941 14.7335 11.7666 12.0659 10.9528C11.6664 10.8309 11.2332 10.9702 10.9795 11.3021C10.7259 11.634 10.7053 12.0885 10.9278 12.442C11.5713 13.4641 12.8696 14.1643 14.5192 14.2379C13.6686 15.0806 12.8349 15.6214 12.0393 15.9723C10.7466 16.5425 9.46928 16.65 8.20953 16.6337C7.79588 16.6284 7.41308 16.611 7.02596 16.5934H7.02595C6.80185 16.5832 6.57631 16.5729 6.34251 16.5649Z" fill="#ffffff"></path> </g></svg>
                    </div>
                </ul>
            </nav>
            <button onClick={handlePostClick} className="hidden md:block text-xl font-bold text-white bg-sky-400 mt-4 py-3 px-4 rounded-full w-10/12">Post</button>
            
            
            <div className="hidden md:block relative w-11/12" id="profile-bar">
                <div onAuxClick={toggleDropdown} onClick={toggleDropdown} className="flex flex-row items-center mt-4 hover:bg-gray-300 rounded-full p-2 cursor-pointer">
                    <img src={REACT_APP_FS_URL + userData.display_picture_link} className="flex-none h-10 w-10 rounded-full mr-4"/>

                    <div className="grow flex flex-col">
                        <p className="font-bold text-base">{userData.full_name}</p>
                        <p className="text-sm text-gray-400">@{userData.username}</p>
                    </div>

                    <button  className="flex-none h-8 w-8 mr-3 flex items-center justify-center rounded-full">
                        <svg className="h-5 w-5" fill="#000000" height="200px" width="200px" id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path class="cls-1" d="M8,6.5A1.5,1.5,0,1,1,6.5,8,1.5,1.5,0,0,1,8,6.5ZM.5,8A1.5,1.5,0,1,0,2,6.5,1.5,1.5,0,0,0,.5,8Zm12,0A1.5,1.5,0,1,0,14,6.5,1.5,1.5,0,0,0,12.5,8Z"></path> </g></svg>  
                    </button>
                </div>

                <button ref={LogoutDivRef} onClick={handleLogoutClick} id="logout-bar" className="absolute hidden hover:bg-gray-200 shadow-lg rounded-md px-8 py-3 top-[-50px] bg-white">
                    <p className="font-bold text-md">Logout @username</p>
                </button>
            </div>
        </div>
        
    )
}

export default Navbar;