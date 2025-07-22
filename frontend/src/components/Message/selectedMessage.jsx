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
import { useNavigate, useParams } from "react-router";
import useMessageStore from "@/lib/messageStore";

const SelectedMessage = () => {
  const [selectedChatConversationID, setSelectedChatConversationID] =
    useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatList, setChatList] = useState([]);
  // const { chatList, setChatList } = useMessageStore();
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, suggestedUsers } = useUserStore();
  const { socket, joinConversation } = useSocketStore();
  const chatref = useChatScroll(messages);
  const [filteredChats, setFilteredChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeOut, setTypingTimeOut] = useState(null);
  const params = useParams();
  const navigate = useNavigate();
  // let filteredChats;

  useEffect(() => {
    const handleChatSelect = async () => {
      const res = await getMessage(params.id);
      console.log(res);
      setSelectedChat(res.conversation);
      setMessages(res.conversation.messages);
      setSelectedChatConversationID(params.id);
      joinConversation(res.conversation._id);
    };

    handleChatSelect();

    return () => {
      console.log("leaving conversation", params.id);
      socket?.emit("leaveConversation", params.id);
    };
  }, [params.id]);

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      console.log("newMessage");
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket?.off("newMessage");
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

  useEffect(() => {
    socket?.on("chatList", ({ parsedMessage }) => {
      console.log("run chatlist");
      console.log(parsedMessage);
      console.log(chatList);
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

      setChatList((prevChatList) =>
        prevChatList.map((chat) =>
          chat.conversationID === parsedMessage.conversationID
            ? {
                ...chat,
                lastMessage: parsedMessage.text,
                updatedAt: parsedMessage.createdAt,
                unseen: parsedMessage.senderID === user._id ? 0 : parsedMessage.seen ? 0 : (chat.unseen || 0) + 1,
              }
            : chat
        )
      );

      // console.log("updated chatlsit", updatedChatList);
      // setChatList(updatedChatList);
    });

    return () => {
      socket?.off("chatList");
    };
  }, [socket]);

  useEffect(() => {
    const getchatlist = async () => {
      // if (!chatList) {
      const res = await getChatList();
      setChatList(res.chatList);
      // }
      console.log(1, res.chatList);
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
    console.log(filtered);
  }, [chatList, searchTerm, setChatList]);

  const handleChatSelect = async (chat) => {
    // const res = await getMessage(params.id);
    // console.log(res);
    // setSelectedChat(res.conversation);
    // setMessages(res.conversation.messages);
    // setSelectedChatConversationID(res.conversation._id);
    // joinConversation(res.conversation._id);

    // Mark chat as seen in chatList
    const updatedChatList = chatList.map((item) =>
      item.conversationID === chat.conversationID
        ? { ...item, unseen: 0 }
        : item
    );
    setChatList(updatedChatList);

    navigate(`/messages/${chat.conversationID}`);
  };

  const handleSendMessage = async (text) => {
    // const newMessage = {
    //   senderID: user._id,
    //   text,
    //   timestamp: new Date().toLocaleTimeString([], {
    //     hour: "2-digit",
    //     minute: "2-digit",
    //   }),
    // };
    // setMessages([...messages, newMessage]);

    // console.log(selectedChat)

    //socket
    if (typingTimeOut) {
      clearTimeout(typingTimeOut);
      setTypingTimeOut(null);
    }

    socket?.emit("stopTyping", {
      chatID: selectedChatConversationID,
      userID: user._id,
    });

    const receiver = selectedChat.participants.filter((p) => {
      return p._id !== user._id;
    })[0];
    const res = await sendMessage(
      receiver._id,
      text,
      selectedChatConversationID
    );
    // console.log(res);
  };

  const handleTyping = (msg) => {
    if (!socket || !selectedChatConversationID || !user?._id) return;
    if (msg.trim()) {
      socket.emit("typing", {
        chatID: selectedChatConversationID,
        userID: user._id,
      });
    }

    if (typingTimeOut) {
      clearTimeout(typingTimeOut);
    }
    console.log("inside handle typing");

    const timeout = setTimeout(() => {
      socket.emit("stopTyping", {
        chatID: selectedChatConversationID,
        userID: user._id,
      });
    }, 2000);

    setTypingTimeOut(timeout);
  };

  useEffect(() => {
    socket?.on("messageSeen", (data) => {
      console.log("message seen", data);
      if (selectedChatConversationID === data.chatID) {
        setMessages((prev) => {
          if (!prev) return null;
          return prev.map((m) => {
            if (
              m.senderID === user._id &&
              data.messageIDs &&
              data.messageIDs.includes(m._id)
            ) {
              return {
                ...m,
                seen: true,
              };
            } else if (m.senderID === user._id && !data.messageIDs) {
              return {
                ...m,
                seen: true,
              };
            }
            return m;
          });
        });
      }
    });

    socket?.on("userTyping", (data) => {
      console.log("receiver typing");
      if (
        data.chatID === selectedChatConversationID &&
        data.userID != user?._id
      ) {
        console.log("typing true");
        setIsTyping(true);
      }
    });

    socket?.on("userStoppedTyping", (data) => {
      console.log("receiver stopped typing");
      if (
        data.chatID === selectedChatConversationID &&
        data.userID != user?._id
      ) {
        console.log("not typing");
        setIsTyping(false);
      }
    });

    return () => {
      socket?.off("messageSeen");
      socket?.off("userTyping");
      socket?.off("userStoppedTyping");
    };
  }, [socket, selectedChatConversationID, user?._id]);


    const [showSidebar, setShowSidebar] = useState(true);
  
    // close sidebar automatically when a chat is picked
    const selectAndClose = (chat) => {
      handleChatSelect(chat);
      if (window.innerWidth < 1024) setShowSidebar(false);
    };

  // useEffect(() => {
  //   if (typingTimeOut) clearTimeout(typingTimeOut);
  // }, [typingTimeOut]);

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
        // <div className="flex-1 flex flex-col">
        //   {/* Chat Header */}
        //   <ChatHeader chat={selectedChat} isTyping={isTyping} />

        //   {/* Messages */}
        //   <div
        //     className="flex-1 overflow-y-auto p-6 space-y-4 dark:bg-black"
        //     ref={chatref}
        //   >
        //     {messages.map((message) => (
        //       <MessageBubble
        //         key={message._id}
        //         message={message}
        //         profilePic={selectedChat?.receiver.profilePicture}
        //       />
        //     ))}
        //   </div>

        //   {/* Message Input */}
        //   <MessageInput
        //     onSendMessage={handleSendMessage}
        //     handleTyping={handleTyping}
        //   />
        // </div>
  //     </div>
  //   </div>
  // );



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
              <button
                className="relative border rounded-xl ml-1 p-2 h-fit bg-gray-600"
                onClick={() => setShowSidebar(!showSidebar)}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* ---- Main Chat Area ---- */}
            {/* <main className="flex-1 flex flex-col"> */}
              <div className="flex-1 flex flex-col mb-16 md:mb-0">
                {/* Chat Header */}
                <ChatHeader chat={selectedChat} isTyping={isTyping} />

                {/* Messages */}
                <div
                  className="flex-1 overflow-y-auto p-6 space-y-4 dark:bg-black"
                  ref={chatref}
                >
                  {messages.map((message) => (
                    <MessageBubble
                      key={message._id}
                      message={message}
                      profilePic={selectedChat?.receiver.profilePicture}
                    />
                  ))}
                </div>

                {/* Message Input */}
                <MessageInput
                  onSendMessage={handleSendMessage}
                  handleTyping={handleTyping}
                />
              </div>
            {/* </main> */}
          </div>
        </div>
      );
};

export default SelectedMessage;
