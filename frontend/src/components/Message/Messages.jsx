import React, { useState } from "react";
import { MessageCircle, ChevronRight } from "lucide-react";
// import ChatSideBar from "./ChatSideBar.jsx";
import { useSidebar } from "@/hooks/MessageSidebarContext";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const {showSidebar, setShowSidebar} = useSidebar();
  console.log(showSidebar)

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-hidden dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="relative w-full h-screen flex">
        {/* ---- Sidebar (mobile slides, desktop fixed) ---- */}
        {/* <ChatSideBar
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        /> */}

        {/* Close button (mobile only) */}
        <div className="lg:hidden absolute h-screen flex items-center">
          <button
            className="relative border rounded-xl ml-1 p-2 h-fit"
            onClick={() => setShowSidebar(!showSidebar)}
          >
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

//  <aside
//   className={`
//             absolute lg:relative top-0 left-0 h-full z-30
//             w-80 bg-white/80 backdrop-blur-md border-r border-white/20
//             dark:bg-black dark:border-slate-700/50 shadow-xl
//             transition-transform duration-300 ease-in-out
//             ${showSidebar ? "translate-x-0" : "-translate-x-full"}
//             lg:translate-x-0
//           `}
// >
//   {/* Header */}
//   <div className="p-4 border-b dark:border-slate-700/50">
//     <div className="flex items-center justify-between mb-3">
//       <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
//         Messages
//       </h1>
//       {/* Close button (mobile only) */}
//       <button className="lg:hidden p-1" onClick={() => setShowSidebar(false)}>
//         <ChevronLeft className="w-5 h-5" />
//       </button>
//     </div>

//     {/* Search */}
//     <div className="relative">
//       <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
//       <input
//         type="text"
//         placeholder="Search conversations..."
//         value={searchTerm}
//         onChange={(e) => setSearchTerm(e.target.value)}
//         className="w-full pl-10 pr-4 py-2 bg-gray-200 dark:bg-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
//       />
//     </div>
//   </div>

//   {/* Chat List */}
//   <div className="overflow-y-auto h-[calc(100%-108px)]">
//     <ChatList
//       chats={filteredChats}
//       selectedChat={selectedChat}
//       onChatSelect={selectAndClose}
//     />
//   </div>
// </aside>;
