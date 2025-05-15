import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";


const userstore = (set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  user: {},
  setUser: (userdata) => set((state) => ({ user: userdata })),
  
});

const useUserStore = create(
    devtools(
        persist(userstore, {name: "userStore"}), // name of the item in the storage (must be unique)
    )
);
export default useUserStore;