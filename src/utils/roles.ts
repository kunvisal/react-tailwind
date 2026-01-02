import { User, Role } from "../types/auth";

/**
 * Get all roles for a user
 */
export function getUserRoles(user: User | null): Role[] {
  if (!user) return [];
  return user.roles;
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, roleName: string): boolean {
  if (!user) return false;
  return user.roles.some((role) => role.name === roleName);
}

/**
 * Get role hierarchy (for role-based access control)
 * Higher number = more permissions
 */
export function getRoleHierarchy(): Record<string, number> {
  return {
    SuperAdmin: 100,
    Admin: 90,
    RegionalManager: 80,
    BranchManager: 70,
    Supervisor: 60,
    Staff: 50,
    User: 40,
    Guest: 10,
  };
}

/**
 * Get role level for a user (highest role level)
 */
export function getUserRoleLevel(user: User | null): number {
  if (!user) return 0;

  const hierarchy = getRoleHierarchy();
  let maxLevel = 0;

  user.roles.forEach((role) => {
    const level = hierarchy[role.name] || 0;
    if (level > maxLevel) {
      maxLevel = level;
    }
  });

  return maxLevel;
}

/**
 * Check if user can access a resource based on role hierarchy
 */
export function canAccessResource(
  user: User | null,
  requiredRoleLevel: number
): boolean {
  const userLevel = getUserRoleLevel(user);
  return userLevel >= requiredRoleLevel;
}

/**
 * Check if user has higher role than another user
 */
export function hasHigherRole(user1: User | null, user2: User | null): boolean {
  return getUserRoleLevel(user1) > getUserRoleLevel(user2);
}

/**
 * Get highest role name for a user
 */
export function getHighestRoleName(user: User | null): string | null {
  if (!user || user.roles.length === 0) return null;

  const hierarchy = getRoleHierarchy();
  let highestRole: Role | null = null;
  let maxLevel = 0;

  user.roles.forEach((role) => {
    const level = hierarchy[role.name] || 0;
    if (level > maxLevel) {
      maxLevel = level;
      highestRole = role;
    }
  });

  return highestRole?.name || null;
}

/**
 * Format roles for display
 */
export function formatRolesForDisplay(roles: Role[]): string {
  if (roles.length === 0) return "No roles";
  if (roles.length === 1) return roles[0].name;
  return roles.map((role) => role.name).join(", ");
}

