// Authentication Types

export interface Region {
  regionId: string;
  regionCode: string;
  regionName: string;
  branches: Branch[] | null; // null = all branches in region
}

export interface Branch {
  branchId: string;
  branchCode: string;
  branchName: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  resource: string;
  action: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  isActive: boolean;
  isEmailVerified: boolean;
  roles: Role[];
  permissions: string[]; // Permission names like 'Users.Create'
  regions: Region[];
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

export interface RegisterResponse {
  userId: string;
  email: string;
  emailVerificationRequired: boolean;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

export interface JwtPayload {
  // Standard claims
  sub: string; // User ID
  email: string;
  iat: number; // Issued at
  exp: number; // Expiration
  jti: string; // JWT ID (for revocation)

  // Custom claims
  userId: string; // User GUID
  firstName: string;
  lastName: string;
  roles: string[]; // ['Admin', 'Manager', 'User']
  permissions: string[]; // ['Users.Create', 'Users.Read', 'Regions.Read']

  // Region-Branch access
  regions: Array<{
    regionId: string;
    regionCode: string;
    regionName: string;
    branches: Array<{
      branchId: string;
      branchCode: string;
      branchName: string;
    }> | null; // null = all branches in region
  }>;

  // Session info
  sessionId: string;
  deviceId?: string;

  // Security
  tokenVersion: number; // For token invalidation
  ipAddress?: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
  clearError: () => void;
}

