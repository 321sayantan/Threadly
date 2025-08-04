import React from "react";
import { Navigate, Outlet } from "react-router";

const ProtectedRoutes = () => {
  const token = document.cookie.includes("token=");
  console.log(token);
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
