import axios from "axios";
import { QueryClient } from "@tanstack/react-query";

export const queryKeys = {
  blogs: ["blogs"] as const,
  blogList: ["blogs", "bulk"] as const,
  blog: (id: string) => ["blogs", id] as const,
  currentUser: ["users", "me"] as const,
};

export function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) return false;

  if (axios.isAxiosError(error) && error.response) {
    return error.response.status >= 500;
  }

  return true;
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: shouldRetryQuery,
      retryDelay: (attempt) => Math.min(1_000 * 2 ** attempt, 4_000),
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});