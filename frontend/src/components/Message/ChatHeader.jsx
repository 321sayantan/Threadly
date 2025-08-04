import React, { useEffect, useState } from "react";
import { Phone, Video, Info } from "lucide-react";
import { useSocketStore } from "@/lib/socketStore";
import { useNavigate } from "react-router";
import { useSidebar } from "@/hooks/MessageSidebarContext";
import useMessageStore from "@/lib/messageStore";

const ChatHeader = ({ chat, isTyping }) => {
  const navigate = useNavigate();
  const onlineUsers = useSocketStore((state) => state.onlineUsers);
  const { socket } = useSocketStore();
  const { setRecieverSocketID } = useSidebar();
  // const setShowCallInterface = useMessageStore((s) => s.setShowCallInterface);
  const setIsCallLobbyOpen = useMessageStore((s) => s.setIsCallLobbyOpen);
  const setCallType = useMessageStore((s) => s.setCallType);
  console.log(chat);

  const handleProfileClick = (id) => {
    console.log(id);
    navigate(`/profile/${id}`);
  };

  const handleCall = (type) => {
    // socket.emit("join:room", {ConversationID: chat.ConversationID});
    console.log("video call started");
    setCallType(type);
    setIsCallLobbyOpen(true);
  };



  return (
    <div className="bg-white/80 dark:bg-black backdrop-blur-md border-b border-white/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div
            className="relative"
            onClick={() => handleProfileClick(chat?.receiver._id)}
          >
            <img
              src={chat?.receiver?.profilePicture}
              alt={chat?.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-md"
            />
            {onlineUsers.includes(chat?.receiver?._id) && (
              <>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full animate-ping opacity-75"></div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </>
            )}
          </div>
          <div className="ml-3">
            <h2
              className="font-semibold text-gray-900 dark:text-white"
              onClick={() => handleProfileClick(chat?.receiver._id)}
            >
              {chat?.receiver?.username}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isTyping ? (
                <div className="flex gap-2 items-end text-green-500">
                  <span>typing</span>
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: `200ms` }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"
                      style={{ animationDelay: `300ms` }}
                    />
                  </div>
                </div>
              ) : onlineUsers.includes(chat?.receiver?._id) ? (
                "Active now"
              ) : (
                "Last seen recently"
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={() => handleCall("voice")}
          >
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button
            className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            onClick={() => handleCall("video")}
          >
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <Info className="w-5 h-5 text-gray-600 dark:text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
