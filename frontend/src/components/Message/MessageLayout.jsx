import React, { useState } from "react";
import LeftSideBar from "../LeftSideBar";
import ChatSideBar from "./chatSideBar";
import { Outlet } from "react-router";
import { SidebarProvider } from "../../hooks/MessageSidebarContext";

const MessageLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex relative bg-gray-100 dark:bg-transparent overflow-hidden">
        <LeftSideBar />
        <ChatSideBar/>
        <Outlet />
      </div>
    </SidebarProvider>
  );
};

export default MessageLayout;
