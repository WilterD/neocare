import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getToken } from "../../services/api.js";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const token = getToken();

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
