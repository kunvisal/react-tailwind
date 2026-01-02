---
name: Enterprise Admin Panel Transformation
overview: Transform the basic TailAdmin React dashboard into a production-ready enterprise admin panel with authentication, API integration (.NET backend), enhanced UX, logging, and security features.
todos:
  - id: auth-context
    content: Create AuthContext with JWT token management, session persistence, and auto-logout
    status: pending
  - id: protected-routes
    content: Implement ProtectedRoute component and update App.tsx with route guards
    status: pending
    dependencies:
      - auth-context
  - id: auth-forms
    content: Enhance SignIn/SignUp forms with react-hook-form, zod validation, and API integration
    status: pending
    dependencies:
      - auth-context
  - id: rbac-system
    content: Implement role-based access control with permission utilities and component guards
    status: pending
    dependencies:
      - auth-context
  - id: api-client
    content: Create axios-based API client with interceptors, error handling, and token injection
    status: pending
  - id: api-services
    content: Create API service layer for auth and users with TypeScript types
    status: pending
    dependencies:
      - api-client
  - id: react-query
    content: Setup React Query provider and create custom hooks for data fetching
    status: pending
    dependencies:
      - api-services
  - id: loading-states
    content: Create LoadingSpinner, SkeletonLoader components and integrate throughout app
    status: pending
  - id: error-handling
    content: Implement ErrorBoundary, toast notifications, and centralized error handling
    status: pending
  - id: form-validation
    content: Add react-hook-form + zod validation to all forms with error display
    status: pending
  - id: table-enhancements
    content: Enhance tables with pagination, sorting, filtering, and export functionality
    status: pending
  - id: logging-system
    content: Implement error logging, activity tracking, and performance monitoring
    status: pending
  - id: security-hardening
    content: Add input sanitization, CSRF protection, and secure token storage
    status: pending
  - id: performance-optimization
    content: Implement code splitting, lazy loading, memoization, and API caching
    status: pending
  - id: testing-setup
    content: Setup Vitest, testing-library, and create tests for critical components
    status: pending
---

# Enterprise Admin Pan

el Transformation Plan

## Current State Analysis

**Strengths:**

- Modern tech stack (React 19, TypeScript, Tailwind CSS v4)
- Clean component architecture
- Dark mode support
- Responsive design

**Critical Gaps:**

- No authentication/authorization system
- No API integration layer
- No protected routes
- No error handling/error boundaries
- No form validation
- No loading state management
- No logging/monitoring
- No testing infrastructure
- Hardcoded user data

## Implementation Plan

### Phase 1: Authentication & Authorization System

#### 1.1 Authentication Context & State Management

- **Create** `src/context/AuthContext.tsx`
- Manage user session (JWT tokens, user data)
- Handle login/logout
- Token refresh logic
- Session persistence (localStorage/sessionStorage)
- Auto-logout on token expiry
- **Create** `src/types/auth.ts`
- User interface
- Login/Register request/response types
- Role/permission types

#### 1.2 Protected Routes

- **Create** `src/components/auth/ProtectedRoute.tsx`
- Route guard component
- Redirect to login if unauthenticated
- Role-based route protection
- **Update** `src/App.tsx`
- Wrap protected routes with `ProtectedRoute`
- Add public routes (signin, signup, forgot-password)
- Implement route-based role checking

#### 1.3 Authentication Forms Enhancement

- **Update** `src/components/auth/SignInForm.tsx`
- Add form validation (react-hook-form + zod)
- Connect to authentication API
- Handle loading/error states
- Implement "Remember me" functionality
- Add OAuth integration structure (Google, Microsoft)
- **Update** `src/components/auth/SignUpForm.tsx`
- Add comprehensive form validation
- Password strength indicator
- Email verification flow
- **Create** `src/components/auth/ForgotPasswordForm.tsx`
- **Create** `src/components/auth/ResetPasswordForm.tsx`

#### 1.4 Role-Based Access Control (RBAC)

- **Create** `src/utils/permissions.ts`
- Permission checking utilities
- Role hierarchy management
- **Create** `src/components/common/RequirePermission.tsx`
- Component-level permission guard
- Hide/show UI elements based on permissions
- **Update** `src/layout/AppSidebar.tsx`
- Filter menu items based on user permissions
- Dynamic sidebar based on roles

### Phase 2: API Integration Layer

#### 2.1 API Client Setup

- **Install dependencies**: `axios`, `@tanstack/react-query` (or `swr`)
- **Create** `src/services/api/client.ts`
- Axios instance configuration
- Request/response interceptors
- Automatic token injection
- Error handling interceptor
- Request timeout configuration
- Retry logic for failed requests
- **Create** `src/services/api/types.ts`
- API response wrapper types
- Error response types
- Pagination types

#### 2.2 API Service Layer

- **Create** `src/services/api/auth.ts`
- `login(email, password)`
- `register(userData)`
- `logout()`
- `refreshToken()`
- `forgotPassword(email)`
- `resetPassword(token, newPassword)`
- **Create** `src/services/api/users.ts`
- `getUsers(params)`
- `getUserById(id)`
- `createUser(userData)`
- `updateUser(id, userData)`
- `deleteUser(id)`
- `updateUserRole(id, role)`
- **Create** `src/services/api/index.ts`
- Export all API services
- Centralized API configuration

#### 2.3 React Query Integration

- **Create** `src/providers/QueryProvider.tsx`
- React Query client setup
- Default query options
- Error handling configuration
- **Create** `src/hooks/api/useUsers.ts`
- Custom hooks for user data fetching
- Mutations for create/update/delete
- Optimistic updates
- **Update** `src/main.tsx`
- Wrap app with QueryProvider

#### 2.4 Environment Configuration

- **Create** `.env.example`
- `VITE_API_BASE_URL`
- `VITE_API_TIMEOUT`
- `VITE_APP_NAME`
- **Create** `.env.local` (gitignored)
- **Update** `vite.config.ts` if needed for env variable handling

### Phase 3: Enhanced User Experience

#### 3.1 Loading States & Skeletons

- **Create** `src/components/common/LoadingSpinner.tsx`
- **Create** `src/components/common/SkeletonLoader.tsx`
- Table skeleton
- Card skeleton
- Form skeleton
- **Update** existing components to use loading states
- **Create** `src/hooks/useLoading.ts` for global loading state

#### 3.2 Error Handling & User Feedback

- **Create** `src/components/common/ErrorBoundary.tsx`
- React Error Boundary
- Fallback UI
- Error reporting integration
- **Install & Setup** toast notifications (`react-hot-toast` or `sonner`)
- **Create** `src/components/common/ToastProvider.tsx`
- **Create** `src/utils/toast.ts`
- Success/error/info/warning toast helpers
- **Update** `src/main.tsx`
- Wrap app with ErrorBoundary
- Add ToastProvider

#### 3.3 Form Validation & Error Display

- **Install** `react-hook-form` and `zod`
- **Create** `src/utils/validation/schemas.ts`
- User validation schemas
- Login/register schemas
- Reusable validation rules
- **Update** all form components
- Replace manual state with react-hook-form
- Add zod validation
- Display field-level errors
- **Create** `src/components/form/ErrorMessage.tsx`
- **Create** `src/components/form/FormField.tsx` (wrapper component)

#### 3.4 Data Tables Enhancement

- **Update** `src/components/tables/BasicTables/BasicTableOne.tsx`
- Add pagination
- Add sorting
- Add filtering/search
- Add row selection
- Add bulk actions
- Add export functionality (CSV, Excel)
- **Create** `src/components/tables/DataTable.tsx` (reusable table component)
- **Create** `src/hooks/useTable.ts` (table state management)

#### 3.5 Search & Filtering

- **Create** `src/components/common/SearchInput.tsx`
- **Create** `src/components/common/FilterPanel.tsx`
- **Create** `src/hooks/useDebounce.ts` (for search debouncing)

#### 3.6 Confirmation Dialogs

- **Create** `src/components/ui/modal/ConfirmDialog.tsx`
- Reusable confirmation modal
- Delete confirmations
- Unsaved changes warnings

### Phase 4: Logging & Monitoring

#### 4.1 Error Logging

- **Install** error tracking service (Sentry, LogRocket, or custom)
- **Create** `src/utils/logger.ts`
- Error logging utility
- Different log levels (error, warn, info, debug)
- User context attachment
- API error logging
- **Create** `src/utils/errorHandler.ts`
- Centralized error handling
- Error classification
- User-friendly error messages

#### 4.2 Activity Logging

- **Create** `src/hooks/useActivityLog.ts`
- Track user actions
- Log API calls
- Log route changes
- **Create** `src/services/api/activityLog.ts`
- Send activity logs to backend

#### 4.3 Performance Monitoring

- **Create** `src/utils/performance.ts`
- Page load tracking
- API response time tracking
- Component render time tracking
- **Add** Web Vitals tracking
- **Create** `src/components/common/PerformanceMonitor.tsx`

#### 4.4 Analytics Integration (Optional)

- **Create** `src/utils/analytics.ts`
- Page view tracking
- Event tracking
- User behavior tracking

### Phase 5: Security Enhancements

#### 5.1 Input Sanitization

- **Install** `DOMPurify` for XSS protection
- **Create** `src/utils/sanitize.ts`
- **Update** components that render user input

#### 5.2 CSRF Protection

- **Create** `src/utils/csrf.ts`
- CSRF token management
- Token injection in API requests

#### 5.3 Content Security Policy

- **Update** `index.html`
- Add CSP meta tags
- Configure allowed sources

#### 5.4 Secure Token Storage

- **Update** `src/context/AuthContext.tsx`
- Use httpOnly cookies (if supported by backend)
- Secure localStorage usage
- Token encryption (if needed)

### Phase 6: Performance Optimization

#### 6.1 Code Splitting & Lazy Loading

- **Update** `src/App.tsx`
- Lazy load routes with `React.lazy()`
- Add `Suspense` boundaries
- **Create** `src/components/common/PageLoader.tsx`
- Loading component for route transitions

#### 6.2 Memoization

- **Update** expensive components with `React.memo`
- **Add** `useMemo` and `useCallback` where appropriate
- **Create** `src/hooks/useMemoizedCallback.ts`

#### 6.3 Image Optimization

- **Create** `src/components/common/OptimizedImage.tsx`
- Lazy loading images
- Responsive images
- Placeholder support

#### 6.4 API Caching Strategy

- **Configure** React Query caching
- Stale time configuration
- Cache invalidation strategies
- Background refetching

### Phase 7: Testing Infrastructure

#### 7.1 Testing Setup

- **Install** testing dependencies:
- `vitest` (or `jest`)
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`
- **Create** `vitest.config.ts` (or update existing)
- **Create** `src/test/setup.ts`

#### 7.2 Component Tests

- **Create** test files for critical components
- **Test** authentication flows
- **Test** form validation
- **Test** API integration

#### 7.3 E2E Testing (Optional)

- **Setup** Playwright or Cypress
- **Create** critical path tests

### Phase 8: Code Quality & Documentation

#### 8.1 Enhanced TypeScript

- **Update** `tsconfig.json`
- Enable stricter type checking
- Add path aliases (`@/components`, `@/utils`, etc.)
- **Create** `src/types/index.ts` (centralized types)

#### 8.2 ESLint Enhancements

- **Update** `eslint.config.js`
- Add more strict rules
- Add import ordering rules
- Add accessibility rules

#### 8.3 Documentation

- **Create** `docs/API.md` (API integration guide)
- **Create** `docs/AUTHENTICATION.md` (auth flow documentation)
- **Update** `README.md` with setup instructions
- **Add** JSDoc comments to complex functions

### Phase 9: Additional Enterprise Features

#### 9.1 User Management UI

- **Create** `src/pages/Users/UserList.tsx`
- **Create** `src/pages/Users/UserDetail.tsx`
- **Create** `src/pages/Users/UserCreate.tsx`
- **Create** `src/pages/Users/UserEdit.tsx`

#### 9.2 Settings & Configuration

- **Create** `src/pages/Settings/GeneralSettings.tsx`
- **Create** `src/pages/Settings/UserSettings.tsx`
- **Create** `src/pages/Settings/SecuritySettings.tsx`

#### 9.3 Audit Logs

- **Create** `src/pages/AuditLogs/AuditLogList.tsx`
- **Create** `src/components/audit/AuditLogTable.tsx`

#### 9.4 Notifications System

- **Create** `src/components/notifications/NotificationCenter.tsx`
- **Create** `src/hooks/useNotifications.ts`
- **Integrate** with backend notification API

## Implementation Order

**Week 1-2: Foundation**

- Phase 1 (Authentication & Authorization)
- Phase 2.1-2.2 (API Client & Services)

**Week 3: Integration**

- Phase 2.3-2.4 (React Query & Environment)
- Phase 3.1-3.2 (Loading & Error Handling)

**Week 4: UX Polish**

- Phase 3.3-3.6 (Forms, Tables, Search, Dialogs)
- Phase 4.1-4.2 (Error & Activity Logging)

**Week 5: Security & Performance**

- Phase 5 (Security)
- Phase 6 (Performance)

**Week 6: Quality & Features**

- Phase 7 (Testing)
- Phase 8 (Code Quality)
- Phase 9 (Additional Features)

## Key Files to Create/Modify

**New Files:**

- `src/context/AuthContext.tsx`
- `src/components/auth/ProtectedRoute.tsx`
- `src/services/api/client.ts`
- `src/services/api/auth.ts`
- `src/services/api/users.ts`
- `src/components/common/ErrorBoundary.tsx`
- `src/components/common/LoadingSpinner.tsx`
- `src/utils/logger.ts`
- `src/utils/validation/schemas.ts`

**Modified Files:**

- `src/App.tsx` (add protected routes)
- `src/main.tsx` (add providers)
- `src/components/auth/SignInForm.tsx` (add validation & API)
- `src/layout/AppSidebar.tsx` (add permission filtering)
- `package.json` (add dependencies)

## Dependencies to Add

```json
{
  "axios": "^1.6.0",
  "@tanstack/react-query": "^5.0.0",
  "react-hook-form": "^7.48.0",
  "zod": "^3.22.0",
  "react-hot-toast": "^2.4.0",
  "@sentry/react": "^7.80.0",
  "vitest": "^1.0.0",
  "@testing-library/react": "^14.0.0",
  "dompurify": "^3.0.0"
}
```