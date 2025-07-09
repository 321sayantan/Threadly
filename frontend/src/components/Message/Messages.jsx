import React, { useEffect, useState } from "react";
import {
  MessageCircle,
  Search,
  Phone,
  Video,
  Info,
  Send,
  Image,
  Smile,
} from "lucide-react";
import ChatList from "./ChatList";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import useUserStore from "@/lib/store";
import { useSocketStore } from "@/lib/socketStore";
import { getMessage, sendMessage } from "@/http/api";
import useChatScroll from "@/hooks/useChatScroll";


const Messages = () => {
  const [selectedChatConversationID, setSelectedChatConversationID] = useState();
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const {user,suggestedUsers} = useUserStore();
  const {socket, joinConversation} = useSocketStore();
  const chatref = useChatScroll(messages);


  useEffect(()=>{
    socket?.on("newMessage", (newMessage)=>{
      setMessages([...messages, newMessage]);
    });

    return () =>{
      socket?.off("newMessage");
    }
  },[messages, setMessages])


  // Mock data for chats
  // const chats = [
  //   {
  //     id: 1,
  //     name: "Sarah Johnson",
  //     avatar:
  //       "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  //     lastMessage: "Hey! How are you doing?",
  //     timestamp: "2m",
  //     unread: 2,
  //     online: true,
  //   },
  //   {
  //     id: 2,
  //     name: "Mike Chen",
  //     avatar:
  //       "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  //     lastMessage: "Thanks for the photos!",
  //     timestamp: "1h",
  //     unread: 0,
  //     online: false,
  //   },
  //   {
  //     id: 3,
  //     name: "Emily Davis",
  //     avatar:
  //       "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  //     lastMessage: "See you tomorrow 👋",
  //     timestamp: "3h",
  //     unread: 1,
  //     online: true,
  //   },
  //   {
  //     id: 4,
  //     name: "Alex Rodriguez",
  //     avatar:
  //       "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  //     lastMessage: "That sounds great!",
  //     timestamp: "1d",
  //     unread: 0,
  //     online: false,
  //   },
  // ];

  // useEffect(() => {
  //   console.log(suggestedUsers);
  //   console.log(user);
  // }, [suggestedUsers]);

  // Mock messages for selected chat  
  const mockMessages = [
    {
      id: 1,
      text: "Hey! How are you doing?",
      timestamp: "10:30 AM",
      isSender: false,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 2,
      text: "I'm doing great! Just finished a really cool project. How about you?",
      timestamp: "10:32 AM",
      isSender: true,
    },
    {
      id: 3,
      text: "That's awesome! I'd love to hear more about it",
      timestamp: "10:33 AM",
      isSender: false,
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
    {
      id: 4,
      text: "Sure! It's a new messaging app with a really modern design. I think you'll love it! 🚀",
      timestamp: "10:35 AM",
      isSender: true,
    },
  ];

  const handleChatSelect = async (chat) => {
    const res = await getMessage(chat._id); 
    console.log(res)
    setSelectedChat(chat);
    setMessages(res.conversation.messages);
    setSelectedChatConversationID(res.conversation._id);
    joinConversation(res.conversation._id);
  };

  const handleSendMessage = async (text) => {
    const newMessage = {
      senderID: user._id,
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    // setMessages([...messages, newMessage]);


    // console.log(selectedChat)
    const res = await sendMessage(selectedChat._id, text, selectedChatConversationID);
    // console.log(res);
  };

  const filteredChats = suggestedUsers.filter((chat) =>
    chat.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-y-hidden dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-full h-screen flex">
        {/* Sidebar */}
        <div className="w-80 bg-white/80 backdrop-blur-md border-r border-white/20 dark:bg-black dark:border-slate-700/50 shadow-xl">
          {/* Header */}
          <div className="p-6 ">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Messages
              </h1>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-200 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Chat List */}
          <div className="overflow-y-auto h-full pb-20">
            <ChatList
              chats={filteredChats}
              selectedChat={selectedChat}
              onChatSelect={handleChatSelect}
            />
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <ChatHeader chat={selectedChat} />

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 dark:bg-black" ref={chatref}>
                {messages.map((message) => (
                  <MessageBubble key={message._id} message={message} profilePic={selectedChat.profilePicture}/>
                ))}
              </div>

              {/* Message Input */}
              <MessageInput onSendMessage={handleSendMessage} />
            </>
          ) : (
            /* Welcome Screen */
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Welcome to Messages
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Select a conversation to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
