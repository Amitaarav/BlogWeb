import { Link } from "react-router-dom";
import { AnnouncementBar } from "../features/blog-post/components/AnnouncementBar";
import { BlogFooter } from "../features/blog-post/components/BlogFooter";
import { BlogNav } from "../features/blog-post/components/BlogNav";

export function NotFound() {
  return (
    <div
      className="min-h-screen font-mono flex flex-col"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <AnnouncementBar />
      <BlogNav />
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-20 text-center">
        <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "var(--accent)" }}>
          Error 404
        </p>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">Page not found</h1>
        <p className="max-w-md mb-8 text-sm" style={{ color: "var(--text-dim)" }}>
          This page may have moved, or the address may be incorrect.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="px-4 py-2 rounded text-sm font-bold text-white transition hover:opacity-90"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Go home
          </Link>
          <Link
            to="/blogs"
            className="px-4 py-2 rounded border text-sm font-bold transition hover:opacity-80"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Browse stories
          </Link>
        </div>
      </main>
      <BlogFooter />
    </div>
  );
}