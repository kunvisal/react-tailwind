import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  AuthContextType,
  AuthState,
  User,
  RegisterRequest,
} from "../types/auth";
import {
  storeTokens,
  storeUserData,
  getStoredTokens,
  getStoredUserData,
  clearAuthData,
  isTokenExpired,
  isTokenExpiringSoon,
} from "../utils/auth";
import { authApi } from "../services/api/auth";
import { toast } from "react-hot-toast";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Define refreshAccessToken first
  const refreshAccessToken = useCallback(async () => {
    try {
      const { refreshToken } = getStoredTokens();

      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      // Call refresh token API
      const data = await authApi.refreshToken({ refreshToken });

      const { accessToken, refreshToken: newRefreshToken } = data;

      // Update tokens in storage
      const rememberMe = !!localStorage.getItem("access_token");
      storeTokens(accessToken, newRefreshToken, rememberMe);

      setState((prev) => ({
        ...prev,
        accessToken,
        refreshToken: newRefreshToken,
      }));
    } catch (error) {
      console.error("Error refreshing token:", error);
      // If refresh fails, clear auth data
      clearAuthData();
      setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      throw error;
    }
  }, []);

  // Auto token refresh interval
  useEffect(() => {
    let refreshInterval: ReturnType<typeof setInterval> | null = null;

    if (state.accessToken && state.refreshToken) {
      // Check token every minute
      refreshInterval = setInterval(() => {
        if (isTokenExpiringSoon(state.accessToken!)) {
          refreshAccessToken();
        }
      }, 60000); // 1 minute
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [state.accessToken, state.refreshToken, refreshAccessToken]);

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { accessToken, refreshToken } = getStoredTokens();
        const userData = getStoredUserData() as User | null;

        if (accessToken && refreshToken && userData) {
          // Check if token is expired
          if (isTokenExpired(accessToken)) {
            // Try to refresh token
            await refreshAccessToken();
          } else {
            setState({
              user: userData,
              accessToken,
              refreshToken,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          }
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        clearAuthData();
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();
  }, [refreshAccessToken]);

  const login = useCallback(
    async (email: string, password: string, rememberMe: boolean = false) => {
      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        // Call login API
        const data = await authApi.login({ email, password, rememberMe });

        const { accessToken, refreshToken, user } = data;

        // Store tokens and user data
        storeTokens(accessToken, refreshToken, rememberMe);
        storeUserData(user, rememberMe);

        setState({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });

        toast.success("Login successful!");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Login failed";
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
        toast.error(errorMessage);
        throw error;
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      // Call logout API endpoint
      await authApi.logout();
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      // Clear local state and storage regardless of API call result
      clearAuthData();
      setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // Call register API
      await authApi.register(data);

      setState((prev) => ({ ...prev, isLoading: false }));
      toast.success("Registration successful! Please check your email for verification.");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Registration failed";
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
      }));
      toast.error(errorMessage);
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    register,
    refreshAccessToken,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

