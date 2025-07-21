import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const messageStore = (set) => ({
  chatList:[],
  setChatList: (list) => set((state) => ({ chatList: list })),
});

const useMessageStore = create(
  devtools(
    persist(messageStore, { name: "messageStore" }) // name of the item in the storage (must be unique)
  )
);
export default useMessageStore;
