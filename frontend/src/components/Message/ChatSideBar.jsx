// import useChatScroll from "@/hooks/useChatScroll";
import { useSocketStore } from "@/lib/socketStore";
import useUserStore from "@/lib/store";
import { ChevronLeft, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ChatList from "./ChatList";
import { getChatList } from "@/http/api";
import { useSidebar } from "@/hooks/MessageSidebarContext";
import useMessageStore from "@/lib/messageStore";

const ChatSideBar = () => {
  const navigate = useNavigate();
  // const [selectedChat, setSelectedChat] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { user } = useUserStore();
  const { socket } = useSocketStore();
  const [filteredChats, setFilteredChats] = useState([]);
  const { showSidebar, setShowSidebar } = useSidebar();
  const {selectedChat, setSelectedChat} = useMessageStore();

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      console.log("new Message");
      setMessages((prev) => [...prev, newMessage]);
    });

    socket?.on("chatList", ({ parsedMessage }) => {
      console.log("run chatlist");
      console.log(parsedMessage);
      console.log(chatList);
      //   const newMessage = parsedMessage;

      setChatList((prevChatList) =>
        prevChatList.map((chat) =>
          chat.conversationID === parsedMessage.conversationID
            ? {
                ...chat,
                lastMessage: parsedMessage.text,
                updatedAt: parsedMessage.createdAt,
                unseen:
                  parsedMessage.senderID === user._id
                    ? 0
                    : parsedMessage.seen
                    ? 0
                    : (chat.unseen || 0) + 1,
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
    const getchatlist = async () => {
      const res = await getChatList();
      setChatList(res.chatList);
      console.log(res.chatList);
    };

    if (!chatList || chatList.length === 0) getchatlist();
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
    setSelectedChat(chat);

    navigate(`/messages/${chat.conversationID}`);
  };

  //   const [showSidebar, setShowSidebar] = useState(true);

  // close sidebar automatically when a chat is picked
  const selectAndClose = (chat) => {
    handleChatSelect(chat);
    // if (window.innerWidth < 1024) setShowSidebar(false);
  };

  return (
    <div>
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
    </div>
  );
};

export default ChatSideBar;
