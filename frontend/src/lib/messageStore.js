import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const messageStore = (set) => ({
  chatList: [],

  isCallLobbyOpen: false,
  callType: null,
  selectedChat: {},
  callContact: {},
  stream: {},
  receiverSocketId: null,
  callConnected: false,
  timebound: null,
  setChatList: (list) => set((state) => ({ chatList: list })),
  setCallType: (value) => set({ callType: value }),
  setIsCallLobbyOpen: (value) => set({ isCallLobbyOpen: value }),
  setSelectedChat: (chat) => set({ selectedChat: chat }),
  setCallContact: (contact) => set({ callContact: contact }),
  setStream: (newStream) => set({ stream: newStream }),
  setReceiverSocketId: (id) => set({ receiverSocketId: id }),
  setCallConnected: (val) => set({ callConnected: val }),
  setTimebound: (timeout) => set({ timebound: timeout }),
});

const useMessageStore = create(
  // devtools(
  persist(
    messageStore,
    { name: "messageStore" } // name of the item in the storage (must be unique)
  )
  // )
);
export default useMessageStore;
