import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

const userstore = (set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  ToggleTheme: false,
  Theme: "",
  user: {},
  post: [],
  setUser: (userdata) => set((state) => ({ user: userdata })),
  setPost: (posts) => set(() => ({ post: posts })),
  setTheme: (theme) => set(() => ({ Theme: theme ? "light" : "dark", ToggleTheme: theme}))
});

const useUserStore = create(
  devtools(
    persist(userstore, { name: "userStore" }) // name of the item in the storage (must be unique)
  )
);
export default useUserStore;
