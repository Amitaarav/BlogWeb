import { useState } from "react";
import { BlogCard } from "../components/BlogCard";
import { Appbar } from "../components/Appbar";
import { useBlogs } from "../hooks/useBlogs";
import { BlogSkeleton } from "../components/BlogSkeleton";
import { Link } from "react-router-dom";

export const Blogs = () => {
    const { loading, blogs, error, refetch } = useBlogs();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredBlogs = blogs.filter((blog) => {
        const query = searchQuery.toLowerCase();
        const titleMatch = blog.title?.toLowerCase().includes(query);
        const contentMatch = blog.content?.toLowerCase().includes(query);
        const authorMatch = (blog.author?.name || blog.author?.username || "").toLowerCase().includes(query);
        return titleMatch || contentMatch || authorMatch;
    });

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Appbar />

            <main className="flex-1 flex justify-center w-full px-4 py-6">
                <div className="w-full max-w-2xl">
                    {/* Search Bar */}
                    <div className="mb-6">
                        <input
                            type="text"
                            placeholder="Search stories by title, author, or content..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 transition"
                        />
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div>
                            <BlogSkeleton />
                            <BlogSkeleton />
                            <BlogSkeleton />
                        </div>
                    )}

                    {/* Error State */}
                    {!loading && error && (
                        <div className="p-4 bg-red-100 border border-red-300 text-red-700 rounded text-center my-6 text-sm">
                            <p>{error}</p>
                            <button
                                onClick={refetch}
                                className="mt-2 px-4 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded text-xs font-semibold"
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && !error && filteredBlogs.length === 0 && (
                        <div className="p-8 text-center my-6 border border-dashed border-gray-300 rounded-lg">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">
                                {searchQuery ? "No matching stories" : "No stories published yet"}
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">
                                {searchQuery ? "Try refining your search keyword." : "Be the first to share your thoughts."}
                            </p>
                            {searchQuery ? (
                                <button
                                    onClick={() => setSearchQuery("")}
                                    className="px-4 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded text-xs font-semibold"
                                >
                                    Clear Search
                                </button>
                            ) : (
                                <Link to="/publish">
                                    <button className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-md text-xs font-semibold">
                                        Write a Story
                                    </button>
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Blogs Feed */}
                    {!loading && !error && filteredBlogs.length > 0 && (
                        <div>
                            {filteredBlogs.map((blog) => (
                                <BlogCard
                                    key={blog.id}
                                    id={blog.id}
                                    authorName={blog.author?.name || blog.author?.username || "Anonymous"}
                                    title={blog.title}
                                    content={blog.content}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};
