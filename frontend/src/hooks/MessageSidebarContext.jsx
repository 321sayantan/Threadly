import { createContext, useContext, useState } from "react";


const SidebarCtx = createContext();

export const SidebarProvider = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [receiverSocketID, setRecieverSocketID] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  return (
    <SidebarCtx.Provider
      value={{
        showSidebar,
        setShowSidebar,
        receiverSocketID,
        setRecieverSocketID,
        selectedChat,
        setSelectedChat
      }}
    >
      {children}
    </SidebarCtx.Provider>
  );
};

export const useSidebar = () => useContext(SidebarCtx);
