import React, { useEffect, useState } from "react";
import LeftSideBar from "../LeftSideBar.jsx";
import ChatSideBar from "./ChatSideBar.jsx";
import { Outlet } from "react-router";
import { SidebarProvider } from "../../hooks/MessageSidebarContext";
import useMessageStore from "@/lib/messageStore";
// import CallLobby from "../Call/CallLobby";
// import { toast } from "sonner";
// import { Phone } from "lucide-react";
// import CallInterface from "../Call/CallInterface";
import { useSocketStore } from "@/lib/socketStore";

const MessageLayout = () => {
  const [isCallActive, setIsCallActive] = useState(false);
  // const [callType, setCallType] = useState("voice");
  const isCallLobbyOpen = useMessageStore((s) => s.isCallLobbyOpen);
  const callType = useMessageStore((s) => s.callType);
  const setIsCallLobbyOpen = useMessageStore((s) => s.setIsCallLobbyOpen);
  const { socket } = useSocketStore();

  // useEffect(() => {
  //   socket?.on("room:joined", ({ id }) => {
  //     console.log(`${id} joined room`);
  //   });

  //   socket?.on("incomming", (data) => {
  //     console.log("incomming call", data);
  //   });

  //   return () => {
  //     socket?.off("room:joined");
  //     socket?.off("incomming");
  //   };
  // }, [socket]);

  useEffect(() => {
    console.log(isCallLobbyOpen);
  }, [isCallLobbyOpen]);

  // const handleStartCall = () => {
  //   setIsCallActive(true);
  //   setIsCallLobbyOpen(false);

  //   toast(
  //     <div className="flex">
  //       <Phone className="w-5 h-5 mr-3" /> Call Started
  //     </div>
  //   );
  // };

  // const handleCancelCall = () => {
  //   setIsCallLobbyOpen(false);

  //   toast(
  //     <div className="flex">
  //       <Phone className="w-5 h-5 mr-3" /> Call Cancelled
  //     </div>
  //   );
  // };

  // const handleEndCall = () => {
  //   setIsCallActive(false);

  //   toast("The call has been disconnected.");
  // };

  return (
    <div>
      <SidebarProvider>
        <div className="flex relative bg-gray-100 dark:bg-transparent overflow-hidden">
          <LeftSideBar />
          <ChatSideBar />
          <Outlet />
        </div>
      </SidebarProvider>
    </div>
  );
};

export default MessageLayout;
