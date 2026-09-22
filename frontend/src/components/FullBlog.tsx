import { useState } from "react";
import { Appbar } from "./Appbar";
import { Avatar } from "./BlogCard";
import { Blog, useCurrentUser } from "../hooks/useBlogs";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";

export const FullBlog = ({ blog }: { blog: Blog }) => {
    const { user } = useCurrentUser();
    const navigate = useNavigate();
    const [deleting, setDeleting] = useState(false);

    const authorName = blog.author?.name || blog.author?.username || "Anonymous";
    const isAuthor = user && (blog.authorId === user.id || blog.author?.username === user.username);

    // Reading time calculation
    const cleanContent = blog.content.replace(/<[^>]*>?/gm, '');
    const wordCount = cleanContent.trim().split(/\s+/).length;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this blog post?")) {
            return;
        }

        try {
            setDeleting(true);
            const token = localStorage.getItem("token");
            await axios.delete(`${BACKEND_URL}/api/v1/blog/${blog.id}`, {
                headers: { Authorization: token ? `Bearer ${token}` : "" }
            });
            navigate("/blogs");
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to delete blog post");
            setDeleting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Appbar />
            <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-10 py-8">
                {/* Back navigation */}
                <div className="mb-6">
                    <Link to="/blogs" className="text-xs sm:text-sm font-medium text-slate-500 hover:text-black transition flex items-center gap-1">
                        ← Back to all stories
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                    {/* Main Article Content */}
                    <div className="lg:col-span-8">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-black leading-tight tracking-tight mb-3">
                            {blog.title || "Untitled"}
                        </h1>

                        <div className="flex flex-wrap items-center justify-between gap-3 text-slate-500 text-xs sm:text-sm pb-6 mb-6 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                                <Avatar name={authorName} size="small" />
                                <span className="font-medium text-slate-800">{authorName}</span>
                                <span>•</span>
                                <span>{`${readTime} min read`}</span>
                            </div>

                            {/* Author Action Buttons */}
                            {isAuthor && (
                                <div className="flex items-center gap-2">
                                    <Link 
                                        to={`/edit/${blog.id}`}
                                        className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition"
                                    >
                                        Edit
                                    </Link>
                                    <button 
                                        onClick={handleDelete}
                                        disabled={deleting}
                                        className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs font-medium transition disabled:opacity-50"
                                    >
                                        {deleting ? "Deleting..." : "Delete"}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Prose Body */}
                        <div className="text-slate-800 text-base sm:text-lg leading-relaxed space-y-4">
                            {blog.content.split('\n').map((paragraph, index) => (
                                paragraph.trim() ? (
                                    <p key={index} className="leading-relaxed">
                                        {paragraph}
                                    </p>
                                ) : <div key={index} className="h-2"></div>
                            ))}
                        </div>
                    </div>

                    {/* Author Sidebar */}
                    <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-200 pt-6 lg:pt-0 lg:pl-8">
                        <p className="text-slate-600 text-sm font-medium mb-3">Author</p>
                        <div className="flex items-start gap-4">
                            <Avatar name={authorName} size="large" />
                            <div>
                                <h3 className="text-lg sm:text-xl font-bold text-slate-900">{authorName}</h3>
                                <p className="text-slate-500 text-xs sm:text-sm mt-1 leading-normal">
                                    Author and contributor on BlogWeb.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
