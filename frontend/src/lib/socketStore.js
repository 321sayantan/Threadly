import { create } from "zustand";
import { io } from "socket.io-client";
import useUserStore from "./store";

const SOCKET_URL = import.meta.env.VITE_PRODUCTION === "1" ? "/" : "http://localhost:8000";
  // import.meta.env.VITE_SOCKET_URL ||
  // "http://13.234.64.165:8000"
  // "http://localhost:8000";

export const useSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,
  onlineUsers: [],

  initSocket: () => {
    const existingSocket = get().socket;
    if (existingSocket) return existingSocket;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      query: {
        userID: useUserStore.getState().user._id,
      },
    });

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
      set({ socket, isConnected: true });
    });

    socket.on("newConversation", (con) => {
      console.log(con);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
      set({ isConnected: false });
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket error:", err.message);
    });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    return socket;
  },

  joinConversation: (conversationId) => {
    const socket = get().socket;
    if (!socket) return;
    console.log("client joined conversation", conversationId);
    socket.emit("joinConversation", conversationId);
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
}));
