import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protect student/user routes
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (user.role === "mentor") return <Navigate to="/mentor/dashboard" replace />;

  return children;
};

// Protect mentor routes
export const MentorRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "mentor" && user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
};

// Protect admin routes
export const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/admin/login" replace />;
  if (user.role !== "admin") return <Navigate to="/dashboard" replace />;

  return children;
};

export default ProtectedRoute;
