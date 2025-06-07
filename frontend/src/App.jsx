import React from 'react';
import { Login } from './components/Login';
import Signup from './components/Signup.jsx';
import { ThemeProvider } from './components/theme_Provider';
import { BrowserRouter, createBrowserRouter, Outlet, Route, RouterProvider, Routes, useLocation } from "react-router";
import Home from './components/Home';
import { ScaleLoader } from 'react-spinners';
import { CommentDialog } from './components/Post/CommentDialog';
import CreatePost from './components/CreatePost';
import TestDialog from './components/TestDialog';
import useUserStore from './lib/store';


let commentsDialogOpen = false;

function setCommentsDialogOpen() {
  commentsDialogOpen = !commentsDialogOpen;
}
const Layout = () => (
    <>
      <Outlet />
    </>
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
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          {/* <Route path="test" element={<TestDialog />} /> */}
          <Route path="create-Post" element={<div />} /> {/* Dummy fallback */}
        </Route>
      </Routes>

      {/* Modal Route */}
      {background && (
        <Routes>
          <Route path="/create-Post" element={<CreatePost/>} />
          <Route path="/test" element={<TestDialog />} />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  const { Theme } = useUserStore();
  // console.log(Theme)
  return (
    <ThemeProvider defaultTheme={Theme} storageKey="vite-ui-theme">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

// export default App;
