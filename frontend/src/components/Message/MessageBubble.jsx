import useUserStore from "@/lib/store";
import { Check, CheckCheck } from "lucide-react";
import React from "react";

const MessageBubble = ({ message, profilePic }) => {
  const { user } = useUserStore();
  const isSender = message.senderID === user._id;

  const getTime = (timestamp) => {
    const time = new Date(timestamp).toLocaleTimeString("en-US", {
      hour12: true, // Use true for 12-hour format with AM/PM
      hour: "2-digit",
      minute: "2-digit",
      // second: "2-digit",
    });

    return time;
  };

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
          <div className="flex gap-2">
            <p
              className={`text-xs mt-1  ${
                isSender ? "text-purple-100" : "text-gray-500"
              }`}
            >
              {getTime(message.createdAt)}
            </p>
            {isSender && (message.seen ? <CheckCheck className="text-red-600 w-5 h-5"/> : <Check />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
