import useUserStore from "@/lib/store";
import React from "react";

const MessageBubble = ({ message, profilePic }) => {
  const {user} = useUserStore();
  const isSender = message.senderID === user._id;
  return (
    <div
      className={`flex ${
        isSender ? "justify-end" : "justify-start"
      } animate-fade-in`}
    >
      <div
        className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
          isSender ? "flex-row-reverse space-x-reverse" : ""
        }`}
      >
        {!isSender && (
          <img
            src={profilePic}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        )}

        <div
          className={`px-4 py-2 rounded-2xl shadow-sm max-w-xl wrap-anywhere ${
            isSender
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md"
              : "bg-white dark:bg-gray-800 border text-gray-800 dark:text-white rounded-bl-md"
          }`}
        >
          <p className="text-sm">{message.text}</p>
          <p
            className={`text-xs mt-1 ${
              isSender ? "text-purple-100" : "text-gray-500"
            }`}
          >
            {message.timestamp}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
