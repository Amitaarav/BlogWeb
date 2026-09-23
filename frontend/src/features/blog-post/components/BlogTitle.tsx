import { Link } from "react-router-dom";
import { Avatar } from "../../../components/BlogCard";

interface BlogTitleProps {
  title: string;
  authors: string[];
  date: string;
  readTime?: string;
  isAuthor?: boolean;
  onDelete?: () => void;
  deleting?: boolean;
  editHref?: string;
}

export const BlogTitle = ({
  title,
  authors,
  date,
  readTime,
  isAuthor,
  onDelete,
  deleting,
  editHref,
}: BlogTitleProps) => {
  return (
    <div className="font-mono mb-8">
      {/* Title with orange accent bar */}
      <div className="flex items-stretch gap-4 mb-4">
        <div
          className="w-1.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: "var(--accent)" }}
        />
        <h1
          className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
          style={{ color: "var(--text)" }}
        >
          {title}
        </h1>
      </div>

      {/* Byline + Action cluster */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm ml-5 pl-2 pb-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <Avatar name={authors[0] || "User"} size="small" />
          <span className="font-bold" style={{ color: "var(--text)" }}>
            {authors.join(", ")}
          </span>
          <span style={{ color: "var(--text-dim)" }}>|</span>
          <time style={{ color: "var(--text-dim)" }}>{date}</time>
          {readTime && (
            <>
              <span style={{ color: "var(--text-dim)" }}>|</span>
              <span style={{ color: "var(--text-dim)" }}>⏱ {readTime}</span>
            </>
          )}
        </div>

        {/* Author Controls */}
        {isAuthor && (
          <div className="flex items-center gap-2">
            {editHref && (
              <Link
                to={editHref}
                className="px-3 py-1 rounded border text-xs font-bold transition hover:opacity-80"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text)",
                }}
              >
                ✏️ Edit
              </Link>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                disabled={deleting}
                className="px-3 py-1 rounded text-xs font-bold text-white transition hover:opacity-90"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {deleting ? "Deleting..." : "🗑️ Delete"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
