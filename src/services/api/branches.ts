import apiClient, { handleApiResponse } from "./client";
import { ApiResponse, PaginationParams, PaginatedResponse } from "./types";

export interface Branch {
  id: string;
  regionId: string;
  regionCode: string;
  code: string;
  name: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBranchRequest {
  regionId: string;
  code: string;
  name: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
}

export interface UpdateBranchRequest {
  code?: string;
  name?: string;
  description?: string;
  address?: string;
  phoneNumber?: string;
}

export const branchesApi = {
  /**
   * Get all branches with pagination and filtering
   */
  getBranches: async (
    params?: PaginationParams & {
      regionId?: string;
      isActive?: boolean;
    }
  ): Promise<PaginatedResponse<Branch>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Branch>>
    >("/branches", { params });
    return handleApiResponse(response);
  },

  /**
   * Get branch by ID
   */
  getBranchById: async (id: string): Promise<Branch> => {
    const response = await apiClient.get<ApiResponse<Branch>>(
      `/branches/${id}`
    );
    return handleApiResponse(response);
  },

  /**
   * Create new branch
   */
  createBranch: async (data: CreateBranchRequest): Promise<Branch> => {
    const response = await apiClient.post<ApiResponse<Branch>>(
      "/branches",
      data
    );
    return handleApiResponse(response);
  },

  /**
   * Update branch
   */
  updateBranch: async (
    id: string,
    data: UpdateBranchRequest
  ): Promise<Branch> => {
    const response = await apiClient.put<ApiResponse<Branch>>(
      `/branches/${id}`,
      data
    );
    return handleApiResponse(response);
  },

  /**
   * Delete branch
   */
  deleteBranch: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/branches/${id}`
    );
    return handleApiResponse(response);
  },

  /**
   * Get users in a branch
   */
  getBranchUsers: async (
    id: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<unknown>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<unknown>>
    >(`/branches/${id}/users`, { params });
    return handleApiResponse(response);
  },

  /**
   * Activate branch
   */
  activateBranch: async (id: string): Promise<void> => {
    const response = await apiClient.put<ApiResponse<void>>(
      `/branches/${id}/activate`
    );
    return handleApiResponse(response);
  },

  /**
   * Deactivate branch
   */
  deactivateBranch: async (id: string): Promise<void> => {
    const response = await apiClient.put<ApiResponse<void>>(
      `/branches/${id}/deactivate`
    );
    return handleApiResponse(response);
  },
};

