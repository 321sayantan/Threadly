import React from "react";
import { Phone, Video, Info } from "lucide-react";

const ChatHeader = ({ chat }) => {
  return (
    <div className="bg-white/80 dark:bg-black backdrop-blur-md border-b border-white/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="relative">
            <img
              src={chat.profilePicture}
              alt={chat.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-md"
            />
            {chat.online && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>
          <div className="ml-3">
            <h2 className="font-semibold text-gray-900 dark:text-white">{chat.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {chat.online ? "Active now" : "Last seen recently"}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
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
