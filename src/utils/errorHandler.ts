import { ApiException, ApiErrorCode } from "../services/api/types";
import { showError } from "./toast";

/**
 * Centralized error handler
 */
export function handleError(error: unknown, showToast: boolean = true): string {
  let errorMessage = "An unexpected error occurred";

  if (error instanceof ApiException) {
    errorMessage = getApiErrorMessage(error);
  } else if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === "string") {
    errorMessage = error;
  }

  // Log error for debugging
  console.error("Error:", error);

  // Show toast notification if requested
  if (showToast) {
    showError(errorMessage);
  }

  return errorMessage;
}

/**
 * Get user-friendly error message for API errors
 */
function getApiErrorMessage(error: ApiException): string {
  switch (error.code) {
    case ApiErrorCode.UNAUTHORIZED:
      return "Your session has expired. Please sign in again.";
    case ApiErrorCode.FORBIDDEN:
      return "You don't have permission to perform this action.";
    case ApiErrorCode.NOT_FOUND:
      return "The requested resource was not found.";
    case ApiErrorCode.VALIDATION_ERROR:
      return error.message || "Please check your input and try again.";
    case ApiErrorCode.SERVER_ERROR:
      return "Server error. Please try again later.";
    case ApiErrorCode.NETWORK_ERROR:
      return "Network error. Please check your connection.";
    case ApiErrorCode.TIMEOUT:
      return "Request timeout. Please try again.";
    default:
      return error.message || "An unexpected error occurred";
  }
}

/**
 * Handle form validation errors
 */
export function handleValidationError(
  error: unknown
): Record<string, string> | null {
  if (error instanceof ApiException && error.code === ApiErrorCode.VALIDATION_ERROR) {
    if (error.details && typeof error.details === "object") {
      return error.details as Record<string, string>;
    }
  }
  return null;
}

/**
 * Check if error is a specific type
 */
export function isApiError(error: unknown, code: ApiErrorCode): boolean {
  return error instanceof ApiException && error.code === code;
}

/**
 * Log error to monitoring service
 */
export function logErrorToService(error: Error, context?: Record<string, unknown>) {
  // TODO: Implement error logging to monitoring service (e.g., Sentry)
  console.error("Error logged:", error, context);
  
  // Example Sentry integration:
  // Sentry.captureException(error, { extra: context });
}

