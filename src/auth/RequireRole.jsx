import { Navigate } from "react-router-dom";
import { useAuthStore } from "./useAuthStore";
import { hasAnyRole } from "./roles";

const RequireRole = ({ roles = [], children }) => {
  const { user } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;
  if (!hasAnyRole(user, roles)) return <Navigate to="/dashboard" replace />;

  return children;
};

export default RequireRole;

