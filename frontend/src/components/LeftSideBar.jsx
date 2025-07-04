import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/http/api";
import useUserStore from "@/lib/store";
import {
  Calendar,
  CircuitBoardIcon,
  Heart,
  Home,
  LogOut,
  MessageCircle,
  Moon,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import CreatePost from "./CreatePost";

const LeftSideBar = () => {
  const { Theme, ToggleTheme, setTheme, user } = useUserStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isopen, setisopen] = useState(false);
  const profilePicture = useUserStore.getState().user.profilePicture;

  const handleLogout = async () => {
    const result = await logout();
    if (result.success === true) {
      toast.success(result.message);
      navigate("/login");
    } else {
      toast.error(result.message);
    }
  };

  const handelSideBarCLick = (item) => {
    if (item.name === "Logout") {
      handleLogout();
    } else if (item.name === "Create") {
      navigate("/create-Post", { state: { backgroundLocation: location } });
    } else if (item.name === "Profile") {
      navigate(`/profile/${user._id}`);
    }
    else if(item.name === "Toggle"){
        setTheme(!ToggleTheme);
        window.location.reload();
        console.log(Theme);
    }
    else if(item.name === "Home"){
        navigate("/");
    }
    else if(item.name === "Messages"){
        navigate("/messages");
    }
    // else if(item.name === "Search"){
    //     navigate("/search");
    // }
    // else if(item.name === "Explore"){
    //     navigate("/explore");
    // }
  };

  const sideBaritems = [
    { icon: <Home />, name: "Home" },
    { icon: <Search />, name: "Search" },
    { icon: <TrendingUp />, name: "Explore" },
    { icon: <CircuitBoardIcon />, name: "Leaderboard" },
    { icon: <Calendar />, name: "Events" },
    { icon: <MessageCircle />, name: "Messages" },
    { icon: <Heart />, name: "Notifications" },
    {
      icon: <PlusSquare />,
      name: "Create",
    },
    {
      icon: (
        <Avatar>
          <AvatarImage src={profilePicture} className="object-cover" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
      name: "Profile",
    },
    { icon: <Moon />, name: "Toggle" },
    { icon: <LogOut />, name: "Logout" },
  ];

  return (
    // <div className="sticky top-0 left-0 h-screen w-[16%] border-r border-2 bg-white dark:bg-transparent">
    //   <div className="flex flex-col">
    //     <h1 className="my-10 font-bold m-auto text-xl">LOGO</h1>
    //     {sideBaritems.map((item, index) => {
    //       return (
    //         <div
    //           key={index}
    //           className="flex items-center space-x-2 p-4 hover:bg-gray-200 cursor-pointer dark:hover:bg-gray-800"
    //           onClick={() => handelSideBarCLick(item)}
    //         >
    //           <div>{item.icon}</div>
    //           <div className="font-medium hidden sm:block">{item.name}</div>
    //         </div>
    //       );
    //     })}
    //   </div>
    // </div>
    <div className="sticky top-0 left-0 h-screen w-[60px] lg:w-[16%] border-r border-2 bg-white dark:bg-transparent flex-shrink-0 transition-all duration-300">
      <div className="flex flex-col items-center sm:items-start">
        <h1 className="my-10 font-bold m-auto text-xl hidden sm:block">LOGO</h1>
        {sideBaritems.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-center sm:justify-start space-x-0 sm:space-x-2 p-4 
                     hover:bg-gray-200 cursor-pointer dark:hover:bg-gray-800 w-full"
            onClick={() => handelSideBarCLick(item)}
          >
            <div className="text-lg">{item.icon}</div>
            <div className="ml-2 font-medium hidden lg:block">{item.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeftSideBar;
