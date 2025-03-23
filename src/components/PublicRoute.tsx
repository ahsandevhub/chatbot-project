import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = () => {
  const { user, isLoading } = useAuth(); // Ensure you have a loading state

  if (isLoading) return null; // Wait for authentication state

  if (user) {
    return <Navigate to="/chat" replace />;
  }

  return <Outlet />;
};

export default PublicRoute;
