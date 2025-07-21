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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ChatList from "./ChatList";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import useUserStore from "@/lib/store";
import { useSocketStore } from "@/lib/socketStore";
import { getChatList, getMessage, sendMessage } from "@/http/api";
import useChatScroll from "@/hooks/useChatScroll";
import { useNavigate } from "react-router";
import useMessageStore from "@/lib/messageStore";

const Messages = () => {
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, suggestedUsers } = useUserStore();
  const { socket, joinConversation } = useSocketStore();
  const chatref = useChatScroll(messages);
  const [filteredChats, setFilteredChats] = useState([]);
  // const { chatList, setChatList } = useMessageStore();
  // let filteredChats;

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      console.log("new Message");
      setMessages((prev) => [...prev, newMessage]);
    });

    socket?.on("chatList", ({ parsedMessage }) => {
      console.log("run chatlist");
      console.log(parsedMessage);
      console.log(chatList)
      const newMessage = parsedMessage;

      // const updatedChatList = chatList.map((chat) => {
      //   if (chat.conversationID === newMessage.conversationID) {
      //     return {
      //       ...chat,
      //       lastMessage: newMessage.text,
      //       updatedAt: newMessage.createdAt,
      //       unseen: (chat.unseen || 0) + 1,
      //     };
      //   }
      //   return chat;
      // });
      // console.log("updated chatlist", updatedChatList);

      setChatList((prevChatList) =>
        prevChatList.map((chat) =>
          chat.conversationID === parsedMessage.conversationID
            ? {
                ...chat,
                lastMessage: parsedMessage.text,
                updatedAt: parsedMessage.createdAt,
                unseen: parsedMessage.seen ? 0 : (chat.unseen || 0) + 1,
              }
            : chat
        )
      );

      // setChatList(updatedChatList);
    });

    return () => {
      socket?.off("newMessage");
      socket?.off("chatList");
    };
  }, [socket]);

  useEffect(() => {
    socket?.on("newConversation", (newConv) => {
      console.log("new Conversation", newConv);

      // const exists = chatList.some(
      //   (chat) => chat.conversationID === newConv.conversationID
      // );
      // if (exists) return chatList;

      // const updated = [
      //   { ...newConv, updatedAt: new Date().toISOString() },
      //   ...chatList,
      // ];
      // console.log("Updated chatList:", updated);

      // setChatList(updated);

          setChatList((prev) => {
            const exists = prev.some(
              (chat) => chat.conversationID === newConv.conversationID
            );
            if (exists) return prev;

            return [
              { ...newConv, updatedAt: new Date().toISOString() },
              ...prev, // ← fresh array every time
            ];
          });
    });

    return () => {
      socket?.off("newConversation");
    };
  }, [socket]); // <- only socket (or nothing if socket never changes)

  // useEffect(() => {
  //   // const handleChatListUpdate = ({ parsedMessage }) => {
  //   //   console.log("run chatlist");
  //   //   console.log(parsedMessage);
  //   //   const newMessage = parsedMessage;
  //   //   setChatList((prevChats) => {
  //   //     return prevChats.map((chat) => {
  //   //       if (chat.conversationID === newMessage.conversationID) {
  //   //         return {
  //   //           ...chat,
  //   //           lastMessage: newMessage.text,
  //   //           updatedAt: newMessage.createdAt,
  //   //           unseen: (chat.unseen || 0) + 1,
  //   //         };
  //   //       }
  //   //       return chat;
  //   //     });
  //   //   });
  //   // };

  //   socket?.on("chatList", ({ parsedMessage }) => {
  //     console.log("run chatlist");
  //     console.log(parsedMessage);
  //     const newMessage = parsedMessage;
  //     setChatList((prevChats) =>
  //       prevChats.map((chat) => {
  //         if (chat.conversationID === newMessage.conversationID) {
  //           return {
  //             ...chat,
  //             lastMessage: newMessage.text,
  //             updatedAt: newMessage.createdAt,
  //             unseen: (chat.unseen || 0) + 1,
  //           };
  //         }
  //         return chat;
  //       })
  //     );
  //   });

  //   return () => {
  //     socket?.off("chatList");
  //   };
  // }, [socket, chatList, setChatList]);

  useEffect(() => {
    const getchatlist = async () => {
      const res = await getChatList();
      setChatList(res.chatList);
      console.log(res.chatList);
    };
    getchatlist();
  }, []);

  useEffect(() => {
    console.log(chatList);
    if (!Array.isArray(chatList)) return;

    const filtered = chatList
      .filter((chat) =>
        chat.receiver.username.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    setFilteredChats(filtered);
  }, [chatList, searchTerm]);

  const handleChatSelect = async (chat) => {
    // Mark chat as seen in chatList
    const updatedChatList = chatList.map((item) =>
      item.conversationID === chat.conversationID
        ? { ...item, unseen: 0 }
        : item
    );
    setChatList(updatedChatList);

    navigate(`/messages/${chat.conversationID}`);
  };

  // const handleSendMessage = async (text) => {
  //   // const newMessage = {
  //   //   senderID: user._id,
  //   //   text,
  //   //   timestamp: new Date().toLocaleTimeString([], {
  //   //     hour: "2-digit",
  //   //     minute: "2-digit",
  //   //   }),
  //   // };
  //   // setMessages([...messages, newMessage]);

  //   // console.log(selectedChat)

  //   const receiver = selectedChat.participants.filter((p) => {
  //     return p._id !== user._id;
  //   })[0];
  //   const res = await sendMessage(
  //     receiver._id,
  //     text,
  //     selectedChatConversationID
  //   );
  //   // console.log(res);
  // };

  // return (
  //   <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-y-hidden dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
  //     <div className="max-w-full h-screen flex">
  //       {/* Sidebar */}
  //       <div className="w-80 bg-white/80 backdrop-blur-md border-r border-white/20 dark:bg-black dark:border-slate-700/50 shadow-xl">
  //         {/* Header */}
  //         <div className="p-6 ">
  //           <div className="flex items-center justify-between mb-4">
  //             <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
  //               Messages
  //             </h1>
  //             <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
  //               <MessageCircle className="w-4 h-4 text-white" />
  //             </div>
  //           </div>

  //           {/* Search */}
  //           <div className="relative">
  //             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
  //             <input
  //               type="text"
  //               placeholder="Search conversations..."
  //               value={searchTerm}
  //               onChange={(e) => setSearchTerm(e.target.value)}
  //               className="w-full pl-10 pr-4 py-2 bg-gray-200 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
  //             />
  //           </div>
  //         </div>

  //         {/* Chat List */}
  //         <div className="overflow-y-auto h-full pb-20">
  //           <ChatList
  //             chats={filteredChats}
  //             selectedChat={selectedChat}
  //             onChatSelect={handleChatSelect}
  //           />
  //         </div>
  //       </div>

  //       {/* Main Chat Area */}
  //       <div className="flex-1 flex flex-col">
  //         {/* Welcome Screen  */}
  //         <div className="flex-1 flex items-center justify-center">
  //           <div className="text-center">
  //             <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
  //               <MessageCircle className="w-12 h-12 text-white" />
  //             </div>
  //             <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
  //               Welcome to Messages
  //             </h2>
  //             <p className="text-gray-600 dark:text-gray-400">
  //               Select a conversation to start chatting
  //             </p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );


  const [showSidebar, setShowSidebar] = useState(true);

  // close sidebar automatically when a chat is picked
  const selectAndClose = (chat) => {
    handleChatSelect(chat);
    if (window.innerWidth < 1024) setShowSidebar(false);
  };


    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-hidden dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="relative w-full h-screen flex">
          {/* ---- Sidebar (mobile slides, desktop fixed) ---- */}
          <aside
            className={`
            absolute lg:relative top-0 left-0 h-full z-30
            w-80 bg-white/80 backdrop-blur-md border-r border-white/20
            dark:bg-black dark:border-slate-700/50 shadow-xl
            transition-transform duration-300 ease-in-out
            ${showSidebar ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0
          `}
          >
            {/* Header */}
            <div className="p-4 border-b dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Messages
                </h1>
                {/* Close button (mobile only) */}
                <button
                  className="lg:hidden p-1"
                  onClick={() => setShowSidebar(false)}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-200 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="overflow-y-auto h-[calc(100%-108px)]">
              <ChatList
                chats={filteredChats}
                selectedChat={selectedChat}
                onChatSelect={selectAndClose}
              />
            </div>
          </aside>

          {/* Close button (mobile only) */}
          <div className="lg:hidden absolute h-screen flex items-center">
            <button className="relative border rounded-xl ml-1 p-2 h-fit" onClick={() => setShowSidebar(!showSidebar)}>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* ---- Main Chat Area ---- */}
          <main className="flex-1 flex flex-col">
            {/* Show “Open Sidebar” header on mobile when none selected */}
            {(!selectedChat || window.innerWidth < 1024) && (
              <header className="lg:hidden p-4 flex items-center gap-3 border-b dark:border-slate-700/50">
                <button onClick={() => setShowSidebar(true)}>
                  <MessageCircle className="w-6 h-6" />
                </button>
                <span className="font-semibold">Messages</span>
              </header>
            )}

            {/* Welcome / actual chat window */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-4">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                  Welcome
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select a conversation to start chatting
                </p>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
};

export default Messages;
