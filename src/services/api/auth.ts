import apiClient, { handleApiResponse } from "./client";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../../types/auth";
import { ApiResponse } from "./types";

export const authApi = {
  /**
   * Login user
   */
  login: async (_data: LoginRequest): Promise<LoginResponse> => {
    // For json-server, we'll use the /login endpoint which returns the mock data
    // Note: json-server doesn't actually validate credentials, it just returns mock data
    const response = await apiClient.get<{ success?: boolean; data?: LoginResponse } | LoginResponse>("/login");
    // json-server returns data directly, check if it's wrapped in ApiResponse or not
    if ('success' in response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    return response.data as LoginResponse;
  },

  /**
   * Register new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<ApiResponse<RegisterResponse>>(
      "/users",
      data
    );
    return handleApiResponse(response);
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    // For json-server, logout is just a client-side operation
    return Promise.resolve();
  },

  /**
   * Refresh access token
   */
  refreshToken: async (
    _data: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> => {
    // For json-server, return the same mock data
    const response = await apiClient.get<{ success?: boolean; data?: LoginResponse } | LoginResponse>("/login");
    const loginData = ('success' in response.data && response.data.success && response.data.data) 
      ? response.data.data 
      : response.data as LoginResponse;
    return {
      accessToken: loginData.accessToken,
      refreshToken: loginData.refreshToken,
      expiresIn: loginData.expiresIn,
    };
  },

  /**
   * Request password reset
   */
  forgotPassword: async (_data: ForgotPasswordRequest): Promise<void> => {
    // For json-server, this is just a mock operation
    return Promise.resolve();
  },

  /**
   * Reset password with token
   */
  resetPassword: async (_data: ResetPasswordRequest): Promise<void> => {
    // For json-server, this is just a mock operation
    return Promise.resolve();
  },

  /**
   * Validate token
   */
  validateToken: async (_token: string): Promise<boolean> => {
    // For json-server, always return true
    return Promise.resolve(true);
  },

  /**
   * Get current user info
   */
  getCurrentUser: async () => {
    const response = await apiClient.get<{ success?: boolean; data?: LoginResponse } | LoginResponse>("/login");
    const loginData = ('success' in response.data && response.data.success && response.data.data) 
      ? response.data.data 
      : response.data as LoginResponse;
    return loginData.user;
  },

  /**
   * Update current user profile
   */
  updateCurrentUser: async (data: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
  }) => {
    // For json-server, return the updated user
    const response = await apiClient.get<{ success?: boolean; data?: LoginResponse } | LoginResponse>("/login");
    const loginData = ('success' in response.data && response.data.success && response.data.data) 
      ? response.data.data 
      : response.data as LoginResponse;
    return { ...loginData.user, ...data };
  },

  /**
   * Change password
   */
  changePassword: async (_data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<void> => {
    // For json-server, this is just a mock operation
    return Promise.resolve();
  },
};

