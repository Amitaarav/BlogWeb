import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";

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
    author: BlogAuthor;
}

export interface UserProfile {
    id: string;
    email: string;
    username: string;
    name?: string | null;
}

export const useBlog = ({ id }: { id: string }) => {
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBlog = useCallback(() => {
        if (!id) return;
        setLoading(true);
        const token = localStorage.getItem("token");
        axios.get(`${BACKEND_URL}/api/v1/blogs/${id}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
            .then((res) => {
                setBlog(res.data.blog);
                setError(null);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching blog:", err);
                setError(err.response?.data?.message || "Failed to fetch blog");
                setLoading(false);
            });
    }, [id]);

    useEffect(() => {
        fetchBlog();
    }, [fetchBlog]);

    return {
        loading,
        blog,
        error,
        refetch: fetchBlog
    };
};

export const useBlogs = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchBlogs = useCallback(() => {
        setLoading(true);
        const token = localStorage.getItem("token");
        axios.get(`${BACKEND_URL}/api/v1/blogs/bulk`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
            .then((res) => {
                setBlogs(res.data.blogs || []);
                setError(null);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching blogs:", err);
                setError(err.response?.data?.message || "Failed to fetch blogs");
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchBlogs();
    }, [fetchBlogs]);

    return {
        loading,
        blogs,
        error,
        refetch: fetchBlogs
    };
};

export const useCurrentUser = () => {
    const [user, setUser] = useState<UserProfile | null>(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });
    const [loading, setLoading] = useState(false);

    const fetchUser = useCallback(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            return;
        }

        setLoading(true);
        axios.get(`${BACKEND_URL}/api/v1/users/me`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((res) => {
                if (res.data?.user) {
                    setUser(res.data.user);
                    localStorage.setItem("user", JSON.stringify(res.data.user));
                }
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    return { user, loading, refetchUser: fetchUser };
};
