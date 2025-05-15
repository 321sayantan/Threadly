import React from 'react';
import { Login } from './components/Login';
import Signup from './components/Signup.jsx';
import { ThemeProvider } from './components/theme_Provider';
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Home from './components/Home';
import { ScaleLoader } from 'react-spinners';
import { CommentDialog } from './components/Post/CommentDialog';
import CreatePost from './components/CreatePost';
import TestDialog from './components/TestDialog';
let commentsDialogOpen = false;
function setCommentsDialogOpen() {
  commentsDialogOpen = !commentsDialogOpen;
}
const Layout = () => (
    <>
      <Outlet />
    </>
  );

const router = createBrowserRouter([
  { path: "/",
    element: <Layout />,
    children: [
      {path: "", element: <Home />},
      {path: "/login", element: <Login />},
      {path: "/Signup", element: <Signup />},
      {path: "/createPost", element: <CreatePost/>},
      {path: "/test", element: <TestDialog/>},
    ] 
  }
]);

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
