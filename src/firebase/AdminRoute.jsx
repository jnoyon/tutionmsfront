// AdminRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router";
import { AuthContext } from "./AuthProvider";
import { toast } from "react-toastify";

export default function AdminRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex justify-center items-center">
        <span className="loading loading-bars loading-xl"></span>
      </div>
    );
  }

  // Admin users have email in Auth (Firebase email/password)
  if (!user || !user.email) {
    toast.error("You must be an admin to access this page!");
    return <Navigate to="/login" replace />;
  }

  return children;
}
