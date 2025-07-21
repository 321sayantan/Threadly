import React, { useState } from "react";
import { Send, Image, Smile } from "lucide-react";

const MessageInput = ({ onSendMessage, handleTyping }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="bg-white/80 dark:bg-black backdrop-blur-md border-t border-white/20 px-6 py-4">
      <form onSubmit={handleSubmit} className="flex items-center space-x-3">
        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
        >
          <Image className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <button
          type="button"
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-200"
        >
          <Smile className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            value={message}
            onChange={(e) => {handleTyping(e.target.value); setMessage(e.target.value)}}
            placeholder="Type a message..."
            className="w-full px-4 py-3 bg-gray-50 dark:bg-transparent border border-gray-200 dark:border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        <button
          type="submit"
          disabled={!message.trim()}
          className={`p-3 rounded-full transition-all duration-200 ${
            message.trim()
              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg transform hover:scale-105"
              : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
          }`}
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
