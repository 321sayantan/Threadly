import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { logout } from "@/http/api";
import useUserStore from "@/lib/store";
import {
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
  const { Theme, ToggleTheme, setTheme } = useUserStore();
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
      setisopen(true);
      navigate("/create-Post", { state: { backgroundLocation: location } });
    } else if (item.name === "Profile") {
      // navigate("/test");
      navigate("test", { state: { backgroundLocation: location } });
    }
    else if(item.name === "Toggle"){
        setTheme(!ToggleTheme);
        window.location.reload();
        console.log(Theme);
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
    <div className="sticky top-0 left-0 h-screen w-[16%] border-r border-2">
      <div className="flex flex-col">
        <h1 className="my-8 font-bold m-auto text-xl">LOGO</h1>
        {sideBaritems.map((item, index) => {
          return (
            <div
              key={index}
              className="flex items-center space-x-2 p-4 hover:bg-gray-200 cursor-pointer dark:hover:bg-gray-800"
              onClick={() => handelSideBarCLick(item)}
            >
              <div>{item.icon}</div>
              <div className="font-medium">{item.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeftSideBar;
