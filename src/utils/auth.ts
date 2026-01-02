import { JwtPayload } from "../types/auth";

const TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_KEY = "user_data";

/**
 * Decode JWT token without verification (client-side only)
 * For production, token validation should be done on the server
 */
export function decodeJwt(token: string): JwtPayload | null {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    return JSON.parse(jsonPayload) as JwtPayload;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
}

/**
 * Check if JWT token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

/**
 * Check if token will expire soon (within 5 minutes)
 */
export function isTokenExpiringSoon(token: string): boolean {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  const fiveMinutes = 5 * 60;
  return decoded.exp - currentTime < fiveMinutes;
}

/**
 * Store authentication tokens in localStorage
 */
export function storeTokens(
  accessToken: string,
  refreshToken: string,
  rememberMe: boolean = false
): void {
  if (rememberMe) {
    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } else {
    sessionStorage.setItem(TOKEN_KEY, accessToken);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
}

/**
 * Store user data in localStorage
 */
export function storeUserData(user: unknown, rememberMe: boolean = false): void {
  const userData = JSON.stringify(user);
  if (rememberMe) {
    localStorage.setItem(USER_KEY, userData);
  } else {
    sessionStorage.setItem(USER_KEY, userData);
  }
}

/**
 * Get stored tokens from storage
 */
export function getStoredTokens(): {
  accessToken: string | null;
  refreshToken: string | null;
} {
  const accessToken =
    localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  const refreshToken =
    localStorage.getItem(REFRESH_TOKEN_KEY) ||
    sessionStorage.getItem(REFRESH_TOKEN_KEY);

  return { accessToken, refreshToken };
}

/**
 * Get stored user data from storage
 */
export function getStoredUserData(): unknown | null {
  const userData =
    localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  if (!userData) return null;

  try {
    return JSON.parse(userData);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
}

/**
 * Clear all authentication data from storage
 */
export function clearAuthData(): void {
  // Clear from localStorage
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);

  // Clear from sessionStorage
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}

/**
 * Validate token format (basic check)
 */
export function isValidTokenFormat(token: string): boolean {
  if (!token) return false;
  const parts = token.split(".");
  return parts.length === 3;
}

/**
 * Get token expiration time in milliseconds
 */
export function getTokenExpirationTime(token: string): number | null {
  const decoded = decodeJwt(token);
  if (!decoded || !decoded.exp) return null;
  return decoded.exp * 1000; // Convert to milliseconds
}

