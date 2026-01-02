import { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
} from "../../utils/permissions";

interface RequirePermissionProps {
  children: ReactNode;
  permission?: string;
  permissions?: string[];
  requireAll?: boolean; // If true, user must have all permissions. If false, user must have at least one
  fallback?: ReactNode;
}

const RequirePermission: React.FC<RequirePermissionProps> = ({
  children,
  permission,
  permissions,
  requireAll = false,
  fallback = null,
}) => {
  const { user } = useAuth();

  // Check single permission
  if (permission) {
    if (!hasPermission(user, permission)) {
      return <>{fallback}</>;
    }
  }

  // Check multiple permissions
  if (permissions && permissions.length > 0) {
    if (requireAll) {
      // User must have all permissions
      if (!hasAllPermissions(user, permissions)) {
        return <>{fallback}</>;
      }
    } else {
      // User must have at least one permission
      if (!hasAnyPermission(user, permissions)) {
        return <>{fallback}</>;
      }
    }
  }

  // User has required permissions
  return <>{children}</>;
};

export default RequirePermission;

