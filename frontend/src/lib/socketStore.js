import { create } from "zustand";
import { io } from "socket.io-client";
import useUserStore from "./store";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

export const useSocketStore = create((set, get) => ({
  socket: null,
  isConnected: false,
  onlineUsers:[],

  initSocket: () => {
    const existingSocket = get().socket;
    if (existingSocket) return existingSocket;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      query: {
        userID: useUserStore.getState().user._id,
      }
    });

    socket.on("connect", () => {
      console.log("🟢 Socket connected:", socket.id);
      set({ socket, isConnected: true });
    });

    socket.on("disconnect", () => {
      console.log("🔌 Socket disconnected");
      set({ isConnected: false });
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket error:", err.message);
    });


    socket.on("getOnlineUsers", (userIds)=>{
        set({onlineUsers: userIds});
    })

    return socket;
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null, isConnected: false });
    }
  },
}));
