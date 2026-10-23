import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "../config";
import { queryKeys } from "../lib/queryClient";

const API_REQUEST_TIMEOUT_MS = 5_000;

export interface BlogAuthor {
    id?: string;
    name?: string | null;
    username?: string;
}

export interface Blog {
    id: string;
    title: string;
    content: string;
    published?: boolean;
    authorId?: string;
    createdAt: string;
    updatedAt: string;
    author: BlogAuthor;
}

export interface UserProfile {
    id: string;
    email: string;
    username: string;
    name?: string | null;
}

function getErrorMessage(error: unknown, fallback: string): string | null {
    if (!error) return null;
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || fallback;
    }
    return fallback;
}

export const useBlog = ({ id }: { id: string }) => {
    const query = useQuery({
        queryKey: queryKeys.blog(id),
        enabled: Boolean(id),
        queryFn: async ({ signal }) => {
        const token = localStorage.getItem("token");
            const response = await axios.get(`${BACKEND_URL}/api/v1/blogs/${id}`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                signal,
                timeout: API_REQUEST_TIMEOUT_MS,
            });
            return response.data.blog as Blog;
        },
    });

    return {
        loading: query.isLoading,
        blog: query.data ?? null,
        error: getErrorMessage(query.error, "Failed to fetch blog"),
        isNotFound: axios.isAxiosError(query.error) && query.error.response?.status === 404,
        refetch: () => query.refetch(),
    };
};

export const useBlogs = () => {
    const query = useQuery({
        queryKey: queryKeys.blogList,
        queryFn: async ({ signal }) => {
        const token = localStorage.getItem("token");
            const response = await axios.get(`${BACKEND_URL}/api/v1/blogs/bulk`, {
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                signal,
                timeout: API_REQUEST_TIMEOUT_MS,
            });
            return (response.data.blogs || []) as Blog[];
        },
    });

    return {
        loading: query.isLoading,
        blogs: query.data ?? [],
        error: getErrorMessage(query.error, "Failed to fetch blogs"),
        refetch: () => query.refetch(),
    };
};

export const useCurrentUser = () => {
    const token = localStorage.getItem("token");
    const query = useQuery({
        queryKey: queryKeys.currentUser,
        enabled: Boolean(token),
        initialData: () => {
            if (!token) return undefined;
            try {
                const saved = localStorage.getItem("user");
                return saved ? JSON.parse(saved) as UserProfile : undefined;
            } catch {
                return undefined;
            }
        },
        queryFn: async ({ signal }) => {
            const currentToken = localStorage.getItem("token");
            if (!currentToken) return null;

            const response = await axios.get(`${BACKEND_URL}/api/v1/users/me`, {
                headers: { Authorization: `Bearer ${currentToken}` },
                signal,
                timeout: API_REQUEST_TIMEOUT_MS,
            });
            const user = response.data?.user as UserProfile | undefined;
            if (user) localStorage.setItem("user", JSON.stringify(user));
            return user ?? null;
        },
    });

    return {
        user: token ? query.data ?? null : null,
        loading: query.isFetching,
        refetchUser: () => query.refetch(),
    };
};
