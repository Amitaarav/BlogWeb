import { Link } from "react-router-dom";
import { BlogNav } from "../features/blog-post/components/BlogNav";
import { AnnouncementBar } from "../features/blog-post/components/AnnouncementBar";
import { BlogFooter } from "../features/blog-post/components/BlogFooter";
import { useBlogs } from "../hooks/useBlogs";
import { BlogCard } from "../components/BlogCard";

export const Landing = () => {
  const { blogs } = useBlogs();
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const featuredBlogs = blogs.slice(0, 3);

  return (
    <div
      className="min-h-screen font-mono flex flex-col justify-between transition-colors"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <AnnouncementBar />
      <BlogNav />

      {/* Hero Section */}
      <section
        className="py-16 sm:py-24 border-b relative overflow-hidden"
        style={{
          backgroundColor: "var(--bg-secondary)",
          borderColor: "var(--border)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-6"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--accent)",
            }}
          >
            <span>✨</span> Built for Developers & Engineering Writers
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            Where Developers Share <br />
            <span style={{ color: "var(--accent)" }}>Code & Ideas</span>
          </h1>

          <p
            className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
            style={{ color: "var(--text-dim)" }}
          >
            Discover deep-dive technical tutorials, architectural designs, and engineering stories written by developers across the globe.
          </p>

          <div className="flex flex-wrap justify-center gap-3 text-sm font-bold">
            <Link
              to="/blog/demo"
              className="px-6 py-3 rounded text-white transition hover:opacity-90 shadow-md flex items-center gap-2"
              style={{ backgroundColor: "var(--accent)" }}
            >
              <span>📐</span> System Design Demo
            </Link>
            <Link
              to="/blogs"
              className="px-6 py-3 rounded border transition hover:opacity-80 flex items-center gap-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text)",
              }}
            >
              Explore Stories <span>→</span>
            </Link>
            <Link
              to={isAuthenticated ? "/publish" : "/signup"}
              className="px-6 py-3 rounded border transition hover:opacity-80 flex items-center gap-2"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text)",
              }}
            >
              {isAuthenticated ? "✍️ Creator Studio" : "Join the Community"}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 max-w-6xl mx-auto px-6 w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Engineered for Readability
          </h2>
          <p className="text-xs sm:text-sm" style={{ color: "var(--text-dim)" }}>
            Everything you need for an unmatched technical reading and authoring experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: "⚡",
              title: "Monospace Typography",
              description:
                "Zero distractions. Clean monospace font hierarchy designed specifically for reading code and engineering prose.",
            },
            {
              icon: "🔍",
              title: "Syntax Highlighting",
              description:
                "High-contrast code blocks with keyword and string highlighting, line wrapping, and one-click copy to clipboard.",
            },
            {
              icon: "📌",
              title: "Sticky Table of Contents",
              description:
                "Two-level persistent navigation with intelligent scroll-spy tracking what section you are currently reading.",
            },
            {
              icon: "🌓",
              title: "Dark & Light Themes",
              description:
                "Switch seamlessly between deep near-black contrast and crisp gray/white modes with persistent preference.",
            },
            {
              icon: "🚀",
              title: "Cloudflare Edge Powered",
              description:
                "Blazing fast reads and global low-latency content delivery backed by Cloudflare Workers and Hyperdrive.",
            },
            {
              icon: "🛡️",
              title: "Clean Auth & Security",
              description:
                "Lightweight JWT session management, author permission guards, and zero boilerplate.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-lg border transition hover:translate-y-[-2px]"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border)",
              }}
            >
              <div className="text-2xl mb-3">{feature.icon}</div>
              <h3 className="font-bold text-base mb-2">{feature.title}</h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Blogs Section */}
      {featuredBlogs.length > 0 && (
        <section
          className="py-16 border-t"
          style={{
            backgroundColor: "var(--bg-secondary)",
            borderColor: "var(--border)",
          }}
        >
          <div className="max-w-5xl mx-auto px-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  Featured Stories
                </h2>
                <p className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
                  Hand-picked articles from our community
                </p>
              </div>
              <Link
                to="/blogs"
                className="text-xs sm:text-sm font-bold hover:underline"
                style={{ color: "var(--accent)" }}
              >
                View all stories →
              </Link>
            </div>

            <div className="space-y-4">
              {featuredBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title || "Untitled"}
                  content={blog.content}
                  createdAt={blog.createdAt}
                  updatedAt={blog.updatedAt}
                  authorName={blog.author?.name || blog.author?.username || "Anonymous"}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      <BlogFooter />
    </div>
  );
};

export default Landing;
