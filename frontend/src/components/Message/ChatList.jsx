import React, { useState } from "react";
import { useSocketStore } from "@/lib/socketStore";

const ChatList = ({ chats, selectedChat, onChatSelect }) => {
  // const { onlineUsers } = useSocketStore();
  const onlineUsers = useSocketStore((state) => state.onlineUsers);

  return (
    <div className="space-y-1 p-2">
      {chats.map((chat) => (
        <div
          key={chat._id}
          onClick={() => onChatSelect(chat)}
          className={`flex items-center p-4 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 ${
            selectedChat?._id === chat._id
              ? "bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200 dark:bg-gray-800 dark:border-gray-500 dark:from-transparent dark:to-transparent"
              : ""
          }`}
        >
          {/* Avatar */}
          <div className="relative">
            <img
              src={chat.profilePicture}
              alt={chat.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md"
            />
            {/* {true && ( */}
            {onlineUsers.includes(chat._id) && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
            )}
          </div>

          {/* Chat Info */}
          <div className="ml-4 flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {chat.username}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {chat.timestamp}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {chat.lastMessage}
              </p>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-medium">
                    {chat.unread}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
