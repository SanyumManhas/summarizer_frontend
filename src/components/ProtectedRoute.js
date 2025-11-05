import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("udata"); // or use your auth context

  return isAuthenticated !== null ? children : <Navigate to="/login" replace />;
}