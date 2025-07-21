import React, { useEffect } from "react";
import { Login } from "./components/Login";
import Signup from "./components/Signup.jsx";
import { ThemeProvider } from "./components/theme_Provider";
import {
  BrowserRouter,
  createBrowserRouter,
  Outlet,
  Route,
  RouterProvider,
  Routes,
  useLocation,
} from "react-router";
import HomeLayout from "./components/HomeLayout";
import { ScaleLoader } from "react-spinners";
import { CommentDialog } from "./components/Post/CommentDialog";
import CreatePost from "./components/CreatePost";
import TestDialog from "./components/TestDialog";
import useUserStore from "./lib/store";
import ProfilePage from "./components/ProfilePage/ProfilePage";
import Feed from "./components/Feed";
import LeftSideBar from "./components/LeftSideBar";
import Messages from "./components/Message/messages";
import { useSocketStore } from "./lib/socketStore";
import SelectedMessage from "./components/Message/selectedMessage";

let commentsDialogOpen = false;

function setCommentsDialogOpen() {
  commentsDialogOpen = !commentsDialogOpen;
}
const AuthLayout = () => (
  <>
    <Outlet />
  </>
);

const Layout = () => (
  <div className="flex relative bg-gray-100 dark:bg-transparent">
    <LeftSideBar />
    <Outlet />
  </div>
);

// const router = createBrowserRouter([
//   { path: "/",
//     element: <Layout />,
//     children: [
//       {path: "", element: <Home />},
//       {path: "/login", element: <Login />},
//       {path: "/Signup", element: <Signup />},
//       {path: "/createPost", element: <CreatePost/>},
//       {path: "/test", element: <TestDialog/>},
//       {path: "/profile", element: <ProfilePage/>},
//     ]
//   }
// ]);

// function App() {
//   return (
//     <>
//       <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
//       <RouterProvider router={router} />
//       </ThemeProvider>
//     </>
//   );
// }

function AppRoutes() {
  const location = useLocation();
  const state = location.state;
  // const background = state && state.backgroundLocation;
  const background = location.state?.backgroundLocation;

  return (
    <>
      <Routes location={background || location}>
        <Route path="/" element={<HomeLayout />}>
          <Route index element={<Feed />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        <Route element={<Layout />}>
          <Route path="profile/:id" element={<ProfilePage />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:id" element={<SelectedMessage />} />
        </Route>
      </Routes>

      {/* Modal Route */}
      {background && (
        <Routes>
          <Route path="/create-Post" element={<CreatePost />} />
          <Route path="/test" element={<TestDialog />} />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  const { Theme } = useUserStore();
  const {initSocket, disconnectSocket, onlineUsers} = useSocketStore();

  useEffect(() => {
    console.log(onlineUsers);
  }, [onlineUsers]);

  useEffect(() => {

      const token = document.cookie.includes("token="); // or your logic
      
      if (token) {
        initSocket();
      }
      
      return () => {
        disconnectSocket();
      };

  }, []);

  return (
    <ThemeProvider defaultTheme={Theme} storageKey="vite-ui-theme">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

// export default App;
