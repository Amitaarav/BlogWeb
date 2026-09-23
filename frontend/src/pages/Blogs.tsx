import { useState } from "react";
import { BlogCard } from "../components/BlogCard";
import { BlogNav } from "../features/blog-post/components/BlogNav";
import { AnnouncementBar } from "../features/blog-post/components/AnnouncementBar";
import { BlogFooter } from "../features/blog-post/components/BlogFooter";
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
    const authorMatch = (
      blog.author?.name ||
      blog.author?.username ||
      ""
    )
      .toLowerCase()
      .includes(query);
    return titleMatch || contentMatch || authorMatch;
  });

  return (
    <div
      className="min-h-screen font-mono flex flex-col transition-colors"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <AnnouncementBar />
      <BlogNav />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
        {/* Header Title Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-1.5 h-6 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              All Stories & Engineering Insights
            </h1>
          </div>
          <p className="text-xs sm:text-sm pl-4" style={{ color: "var(--text-dim)" }}>
            Articles, tutorials, and architecture walkthroughs written by developers.
          </p>
        </div>

        {/* Featured Engineering Architecture Demo Card */}
        <div
          className="mb-8 p-4 sm:p-5 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--accent)",
          }}
        >
          <div>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1.5 inline-block text-white"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Interactive Post
            </span>
            <h3 className="font-bold text-base" style={{ color: "var(--text)" }}>
              Distributed System Architecture & Capacity Analysis
            </h3>
            <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
              Features live Mermaid diagrams, interactive system flow walkthroughs, and an executable JavaScript sandbox.
            </p>
          </div>
          <Link
            to="/blog/demo"
            className="px-4 py-2 rounded text-white text-xs font-bold transition hover:opacity-90 shadow-sm flex-shrink-0"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Launch Interactive Demo →
          </Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search stories by title, author, or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border text-sm font-mono transition focus:outline-none"
              style={{
                backgroundColor: "var(--bg-input)",
                borderColor: "var(--border)",
                color: "var(--text)",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs px-2 py-1 rounded"
                style={{ color: "var(--text-dim)" }}
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex justify-between items-center text-xs mt-2.5 px-1" style={{ color: "var(--text-dim)" }}>
            <span>
              {loading ? "Loading articles..." : `Showing ${filteredBlogs.length} article${filteredBlogs.length === 1 ? "" : "s"}`}
            </span>
            <Link to="/publish" className="hover:underline flex items-center gap-1 font-bold" style={{ color: "var(--accent)" }}>
              <span>+</span> Write your own story
            </Link>
          </div>
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div>
            <BlogSkeleton />
            <BlogSkeleton />
            <BlogSkeleton />
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div
            className="p-6 rounded-lg border text-center my-6"
            style={{
              borderColor: "var(--accent)",
              backgroundColor: "var(--bg-card)",
            }}
          >
            <p className="text-sm mb-3" style={{ color: "var(--accent)" }}>
              ⚠️ {error}
            </p>
            <button
              onClick={refetch}
              className="px-4 py-2 rounded text-xs font-bold text-white transition hover:opacity-90"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredBlogs.length === 0 && (
          <div
            className="p-10 text-center my-8 rounded-lg border border-dashed"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-card)",
            }}
          >
            <h3 className="text-lg font-bold mb-2">
              {searchQuery ? "No matching stories found" : "No stories published yet"}
            </h3>
            <p className="text-xs sm:text-sm mb-6" style={{ color: "var(--text-dim)" }}>
              {searchQuery
                ? "Try searching for another topic or clear the search query."
                : "Be the first developer to publish an article on BlogWeb."}
            </p>
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="px-4 py-2 rounded border text-xs font-bold transition hover:opacity-80"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              >
                Clear Search
              </button>
            ) : (
              <Link
                to="/publish"
                className="px-5 py-2.5 rounded text-xs font-bold text-white transition hover:opacity-90 shadow"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Write First Story
              </Link>
            )}
          </div>
        )}

        {/* Blog Post List */}
        {!loading && !error && filteredBlogs.length > 0 && (
          <div className="space-y-4">
            {filteredBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                authorName={blog.author?.name || blog.author?.username || "Anonymous"}
                title={blog.title || "Untitled"}
                content={blog.content}
                createdAt={blog.createdAt}
                updatedAt={blog.updatedAt}
              />
            ))}
          </div>
        )}
      </main>

      <BlogFooter />
    </div>
  );
};

export default Blogs;