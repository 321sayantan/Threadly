import React from 'react';
import { Login } from './components/Login';
import Signup from './components/Signup.jsx';
import { ThemeProvider } from './components/theme_Provider';
import { createBrowserRouter, Outlet, RouterProvider } from "react-router";
import Home from './components/Home';

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
    ] 
  }
]);

function App() {
  return (
    <>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      </ThemeProvider>
    </>
  );
}

export default App;
