import apiClient, { handleApiResponse } from "./client";
import { ApiResponse, PaginationParams, PaginatedResponse } from "./types";

export interface Region {
  id: string;
  code: string;
  name: string;
  description?: string;
  isActive: boolean;
  branchCount?: number;
  createdAt: string;
  updatedAt: string;
  createdBy?: {
    id: string;
    name: string;
  };
}

export interface CreateRegionRequest {
  code: string;
  name: string;
  description?: string;
}

export interface UpdateRegionRequest {
  code?: string;
  name?: string;
  description?: string;
}

export const regionsApi = {
  /**
   * Get all regions with pagination and filtering
   */
  getRegions: async (
    params?: PaginationParams & {
      isActive?: boolean;
    }
  ): Promise<PaginatedResponse<Region>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<Region>>
    >("/regions", { params });
    return handleApiResponse(response);
  },

  /**
   * Get region by ID
   */
  getRegionById: async (id: string): Promise<Region> => {
    const response = await apiClient.get<ApiResponse<Region>>(
      `/regions/${id}`
    );
    return handleApiResponse(response);
  },

  /**
   * Create new region
   */
  createRegion: async (data: CreateRegionRequest): Promise<Region> => {
    const response = await apiClient.post<ApiResponse<Region>>(
      "/regions",
      data
    );
    return handleApiResponse(response);
  },

  /**
   * Update region
   */
  updateRegion: async (
    id: string,
    data: UpdateRegionRequest
  ): Promise<Region> => {
    const response = await apiClient.put<ApiResponse<Region>>(
      `/regions/${id}`,
      data
    );
    return handleApiResponse(response);
  },

  /**
   * Delete region
   */
  deleteRegion: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/regions/${id}`
    );
    return handleApiResponse(response);
  },

  /**
   * Get branches in a region
   */
  getRegionBranches: async (
    id: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<unknown>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<unknown>>
    >(`/regions/${id}/branches`, { params });
    return handleApiResponse(response);
  },

  /**
   * Get users in a region
   */
  getRegionUsers: async (
    id: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<unknown>> => {
    const response = await apiClient.get<
      ApiResponse<PaginatedResponse<unknown>>
    >(`/regions/${id}/users`, { params });
    return handleApiResponse(response);
  },

  /**
   * Activate region
   */
  activateRegion: async (id: string): Promise<void> => {
    const response = await apiClient.put<ApiResponse<void>>(
      `/regions/${id}/activate`
    );
    return handleApiResponse(response);
  },

  /**
   * Deactivate region
   */
  deactivateRegion: async (id: string): Promise<void> => {
    const response = await apiClient.put<ApiResponse<void>>(
      `/regions/${id}/deactivate`
    );
    return handleApiResponse(response);
  },
};

