import { User } from "../types/auth";

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;
  return user.permissions.includes(permission);
}

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, role: string): boolean {
  if (!user) return false;
  return user.roles.some((r) => r.name === role);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  user: User | null,
  permissions: string[]
): boolean {
  if (!user || permissions.length === 0) return false;
  return permissions.some((permission) =>
    user.permissions.includes(permission)
  );
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
  user: User | null,
  permissions: string[]
): boolean {
  if (!user || permissions.length === 0) return false;
  return permissions.every((permission) =>
    user.permissions.includes(permission)
  );
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(user: User | null, roles: string[]): boolean {
  if (!user || roles.length === 0) return false;
  return roles.some((role) => user.roles.some((r) => r.name === role));
}

/**
 * Check if user has all of the specified roles
 */
export function hasAllRoles(user: User | null, roles: string[]): boolean {
  if (!user || roles.length === 0) return false;
  return roles.every((role) => user.roles.some((r) => r.name === role));
}

/**
 * Check if user can access a specific region
 */
export function canAccessRegion(user: User | null, regionId: string): boolean {
  if (!user) return false;
  return user.regions.some((region) => region.regionId === regionId);
}

/**
 * Check if user can access a specific branch
 */
export function canAccessBranch(
  user: User | null,
  regionId: string,
  branchId: string
): boolean {
  if (!user) return false;

  const region = user.regions.find((r) => r.regionId === regionId);
  if (!region) return false;

  // If branches is null, user has access to all branches in the region
  if (region.branches === null) return true;

  // Check if user has access to the specific branch
  return region.branches.some((branch) => branch.branchId === branchId);
}

/**
 * Get all accessible region IDs for the user
 */
export function getAccessibleRegionIds(user: User | null): string[] {
  if (!user) return [];
  return user.regions.map((region) => region.regionId);
}

/**
 * Get all accessible branch IDs for the user
 */
export function getAccessibleBranchIds(user: User | null): string[] {
  if (!user) return [];

  const branchIds: string[] = [];
  user.regions.forEach((region) => {
    if (region.branches) {
      region.branches.forEach((branch) => {
        branchIds.push(branch.branchId);
      });
    }
  });

  return branchIds;
}

/**
 * Check if user is an admin
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, "Admin");
}

/**
 * Check if user is a super admin (has all permissions)
 */
export function isSuperAdmin(user: User | null): boolean {
  return hasRole(user, "SuperAdmin") || hasRole(user, "Admin");
}

