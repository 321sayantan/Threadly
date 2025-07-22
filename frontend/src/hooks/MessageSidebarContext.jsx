import { createContext, useContext, useState } from "react";


const SidebarCtx = createContext();

export const SidebarProvider = ({ children }) => {
  const [showSidebar, setShowSidebar] = useState(true);
  return (
    <SidebarCtx.Provider value={{ showSidebar, setShowSidebar }}>
      {children}
    </SidebarCtx.Provider>
  );
};

export const useSidebar = () => useContext(SidebarCtx);
