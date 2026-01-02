import { ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  QueryCache,
  MutationCache,
} from "@tanstack/react-query";
import { ApiException, ApiErrorCode } from "../services/api/types";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error instanceof ApiException) {
          if (
            error.code === ApiErrorCode.UNAUTHORIZED ||
            error.code === ApiErrorCode.FORBIDDEN ||
            error.code === ApiErrorCode.NOT_FOUND ||
            error.code === ApiErrorCode.VALIDATION_ERROR
          ) {
            return false;
          }
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => {
      // Global error handling for queries
      console.error("Query error:", error);
      
      // Handle specific error codes
      if (error instanceof ApiException) {
        if (error.code === ApiErrorCode.UNAUTHORIZED) {
          // Token expired or invalid - handled by axios interceptor
          console.log("Unauthorized - redirecting to login");
        } else if (error.code === ApiErrorCode.FORBIDDEN) {
          console.log("Forbidden - insufficient permissions");
        }
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      // Global error handling for mutations
      console.error("Mutation error:", error);
    },
  }),
});

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export { queryClient };

