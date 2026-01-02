import apiClient, { handleApiResponse } from "./client";
import { ApiResponse } from "./types";

export interface MenuItem {
  id: string;
  parentId?: string | null;
  name: string;
  displayName: string;
  icon?: string;
  path?: string | null;
  orderIndex: number;
  isVisible: boolean;
  requiredPermission?: string | null;
  componentName?: string;
  children?: MenuItem[];
}

export interface CreateMenuItemRequest {
  parentId?: string | null;
  name: string;
  displayName: string;
  icon?: string;
  path?: string | null;
  orderIndex: number;
  requiredPermissionId?: string | null;
  componentName?: string;
}

export interface UpdateMenuItemRequest {
  parentId?: string | null;
  name?: string;
  displayName?: string;
  icon?: string;
  path?: string | null;
  orderIndex?: number;
  isVisible?: boolean;
  requiredPermissionId?: string | null;
  componentName?: string;
}

export const menusApi = {
  /**
   * Get all menu items (hierarchical structure)
   */
  getMenuStructure: async (): Promise<MenuItem[]> => {
    const response = await apiClient.get<ApiResponse<MenuItem[]>>("/menus");
    return handleApiResponse(response);
  },

  /**
   * Get menu filtered by user permissions
   */
  getUserMenu: async (): Promise<MenuItem[]> => {
    const response = await apiClient.get<ApiResponse<MenuItem[]>>(
      "/menus/user-menu"
    );
    return handleApiResponse(response);
  },

  /**
   * Get menu item by ID
   */
  getMenuById: async (id: string): Promise<MenuItem> => {
    const response = await apiClient.get<ApiResponse<MenuItem>>(
      `/menus/${id}`
    );
    return handleApiResponse(response);
  },

  /**
   * Create new menu item
   */
  createMenuItem: async (data: CreateMenuItemRequest): Promise<MenuItem> => {
    const response = await apiClient.post<ApiResponse<MenuItem>>(
      "/menus",
      data
    );
    return handleApiResponse(response);
  },

  /**
   * Update menu item
   */
  updateMenuItem: async (
    id: string,
    data: UpdateMenuItemRequest
  ): Promise<MenuItem> => {
    const response = await apiClient.put<ApiResponse<MenuItem>>(
      `/menus/${id}`,
      data
    );
    return handleApiResponse(response);
  },

  /**
   * Delete menu item
   */
  deleteMenuItem: async (id: string): Promise<void> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/menus/${id}`
    );
    return handleApiResponse(response);
  },
};

