import apiClient, { handleApiResponse } from "./client";
import { User } from "../../types/auth";
import { ApiResponse, PaginationParams, PaginatedResponse } from "./types";

export interface CreateUserRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  roleIds: string[];
  regionBranchAssignments?: Array<{
    regionId: string;
    branchIds: string[] | null;
  }>;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  isActive?: boolean;
}

export interface UserRegionBranchAssignment {
  regionId: string;
  regionCode: string;
  regionName: string;
  branches: Array<{
    branchId: string;
    branchCode: string;
    branchName: string;
  }> | null;
  hasAllBranches: boolean;
}

export const usersApi = {
  /**
   * Get all users with pagination and filtering
   */
  getUsers: async (
    params?: PaginationParams & {
      isActive?: boolean;
      roleId?: string;
    }
  ): Promise<PaginatedResponse<User>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<User>>
    >("/users", { params });
    return handleApiResponse(response);
  },

  /**
   * Get user by ID
   */
  getUserById: async (id: string): Promise<User> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return handleApiResponse(response);
  },

  /**
   * Create new user
   */
  createUser: async (data: CreateUserRequest): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>("/users", data);
    return handleApiResponse(response);
  },

  /**
   * Update user
   */
  updateUser: async (id: string, data: UpdateUserRequest): Promise<User> => {
    const response = await apiClient.put<ApiResponse<User>>(
      `/users/${id}`,
      data
    );
    return handleApiResponse(response);
  },

  /**
   * Delete user
   */
  deleteUser: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/users/${id}`
    );
    return handleApiResponse(response);
  },

  /**
   * Assign roles to user
   */
  assignRoles: async (id: string, roleIds: string[]): Promise<void> => {
    const response = await apiClient.post<ApiResponse<void>>(
      `/users/${id}/assign-roles`,
      { roleIds }
    );
    return handleApiResponse(response);
  },

  /**
   * Assign regions and branches to user
   */
  assignRegionsBranches: async (
    id: string,
    assignments: Array<{
      regionId: string;
      branchIds: string[] | null;
    }>
  ): Promise<void> => {
    const response = await apiClient.post<ApiResponse<void>>(
      `/users/${id}/assign-regions-branches`,
      { assignments }
    );
    return handleApiResponse(response);
  },

  /**
   * Get user's regions and branches
   */
  getUserRegionsBranches: async (
    id: string
  ): Promise<{
    userId: string;
    assignments: UserRegionBranchAssignment[];
  }> => {
    const response = await apiClient.get<
      ApiResponse<{
        userId: string;
        assignments: UserRegionBranchAssignment[];
      }>
    >(`/users/${id}/regions-branches`);
    return handleApiResponse(response);
  },

  /**
   * Activate user
   */
  activateUser: async (id: string): Promise<void> => {
    const response = await apiClient.put<ApiResponse<void>>(
      `/users/${id}/activate`
    );
    return handleApiResponse(response);
  },

  /**
   * Deactivate user
   */
  deactivateUser: async (id: string): Promise<void> => {
    const response = await apiClient.put<ApiResponse<void>>(
      `/users/${id}/deactivate`
    );
    return handleApiResponse(response);
  },

  /**
   * Reset user password
   */
  resetUserPassword: async (id: string, newPassword: string): Promise<void> => {
    const response = await apiClient.post<ApiResponse<void>>(
      `/users/${id}/reset-password`,
      { newPassword }
    );
    return handleApiResponse(response);
  },

  /**
   * Get user audit logs
   */
  getUserAuditLogs: async (
    id: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<unknown>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<unknown>>
    >(`/users/${id}/audit-logs`, { params });
    return handleApiResponse(response);
  },
};

