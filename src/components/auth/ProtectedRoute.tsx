import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { hasPermission, hasRole, hasAnyPermission } from "../../utils/permissions";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requireAll?: boolean; // If true, user must have all permissions. If false, user must have at least one
  requiredRole?: string;
  requiredRoles?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requiredPermissions,
  requireAll = false,
  requiredRole,
  requiredRoles,
  redirectTo = "/signin",
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-gray-300 border-t-brand-500"></div>
      </div>
    );
  }

  // Redirect to signin if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && !hasRole(user, requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredRoles && requiredRoles.length > 0) {
    const hasRequiredRole = requiredRoles.some((role) => hasRole(user, role));
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(user, requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (requiredPermissions && requiredPermissions.length > 0) {
    if (requireAll) {
      // User must have all permissions
      const hasAllPermissions = requiredPermissions.every((permission) =>
        hasPermission(user, permission)
      );
      if (!hasAllPermissions) {
        return <Navigate to="/unauthorized" replace />;
      }
    } else {
      // User must have at least one permission
      const hasAnyPerm = hasAnyPermission(user, requiredPermissions);
      if (!hasAnyPerm) {
        return <Navigate to="/unauthorized" replace />;
      }
    }
  }

  // User is authenticated and has required permissions/roles
  return <>{children}</>;
};

export default ProtectedRoute;

