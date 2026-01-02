import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { ApiResponse, ApiErrorCode, ApiException } from "./types";
import { getStoredTokens, clearAuthData } from "../../utils/auth";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - Add JWT token to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = getStoredTokens();

    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Return the response data directly
    return response;
  },
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const { refreshToken } = getStoredTokens();

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post<ApiResponse>(
          `${apiClient.defaults.baseURL}/auth/refresh-token`,
          { refreshToken }
        );

        if (response.data.success && response.data.data) {
          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data as {
              accessToken: string;
              refreshToken: string;
            };

          // Update tokens in storage
          const rememberMe = !!localStorage.getItem("access_token");
          if (rememberMe) {
            localStorage.setItem("access_token", accessToken);
            localStorage.setItem("refresh_token", newRefreshToken);
          } else {
            sessionStorage.setItem("access_token", accessToken);
            sessionStorage.setItem("refresh_token", newRefreshToken);
          }

          // Retry original request with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          }
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed - clear auth data and redirect to login
        clearAuthData();
        window.location.href = "/signin";
        return Promise.reject(refreshError);
      }
    }

    // Handle 403 Forbidden - Permission denied
    if (error.response?.status === 403) {
      throw new ApiException(
        ApiErrorCode.FORBIDDEN,
        error.response.data.error?.message ||
          "You don't have permission to access this resource",
        error.response.data.error?.details
      );
    }

    // Handle 404 Not Found
    if (error.response?.status === 404) {
      throw new ApiException(
        ApiErrorCode.NOT_FOUND,
        error.response.data.error?.message || "Resource not found",
        error.response.data.error?.details
      );
    }

    // Handle 422 Validation Error
    if (error.response?.status === 422) {
      throw new ApiException(
        ApiErrorCode.VALIDATION_ERROR,
        error.response.data.error?.message || "Validation error",
        error.response.data.error?.details
      );
    }

    // Handle 500+ Server Errors
    if (error.response && error.response.status >= 500) {
      throw new ApiException(
        ApiErrorCode.SERVER_ERROR,
        error.response.data.error?.message ||
          "Server error. Please try again later.",
        error.response.data.error?.details
      );
    }

    // Handle network errors
    if (error.code === "ERR_NETWORK") {
      throw new ApiException(
        ApiErrorCode.NETWORK_ERROR,
        "Network error. Please check your connection.",
        error
      );
    }

    // Handle timeout
    if (error.code === "ECONNABORTED") {
      throw new ApiException(
        ApiErrorCode.TIMEOUT,
        "Request timeout. Please try again.",
        error
      );
    }

    // Handle other errors
    throw new ApiException(
      ApiErrorCode.UNKNOWN,
      error.response?.data.error?.message ||
        error.message ||
        "An unexpected error occurred",
      error.response?.data.error?.details || error
    );
  }
);

// Helper function to handle API responses
export function handleApiResponse<T>(response: AxiosResponse<ApiResponse<T>>): T {
  if (response.data.success && response.data.data !== undefined) {
    return response.data.data;
  }

  throw new ApiException(
    ApiErrorCode.UNKNOWN,
    response.data.error?.message || "Invalid API response",
    response.data.error?.details
  );
}

export default apiClient;

