import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="p-10">Loading...</div>;

  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}
