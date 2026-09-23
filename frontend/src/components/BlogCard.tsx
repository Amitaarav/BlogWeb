import { Link } from "react-router-dom";

interface BlogCardProps {
  authorName: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export const BlogCard = ({
  authorName,
  title,
  content,
  createdAt,
  updatedAt,
  id,
}: BlogCardProps) => {
  const cleanContent = content.replace(/<[^>]*>?/gm, "");
  const readTime = Math.max(
    1,
    Math.ceil(cleanContent.trim().split(/\s+/).length / 200)
  );

  const isUpdated = updatedAt !== createdAt;

  return (
    <Link to={`/blog/${id}`} className="block w-full group my-4">
      <article
        className="p-5 sm:p-6 rounded-lg border font-mono transition-all duration-150 hover:translate-y-[-1px]"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
      >
        {/* Byline / Author Header */}
        <div className="flex items-center gap-2 mb-3 text-xs">
          <Avatar name={authorName || "Anonymous"} size="small" />
          <span className="font-bold" style={{ color: "var(--text)" }}>
            {authorName || "Anonymous"}
          </span>
          <span style={{ color: "var(--text-dim)" }}>|</span>
          <span style={{ color: "var(--text-dim)" }}>
          {isUpdated
            ? `Updated ${formatDate(updatedAt)}`
            : `Published ${formatDate(createdAt)}`}
        </span>
        </div>

        {/* Title with left accent bar on hover */}
        <div className="flex items-stretch gap-3 mb-2">
          <div
            className="w-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <h2
            className="font-bold text-lg sm:text-xl leading-snug group-hover:underline"
            style={{ color: "var(--text)" }}
          >
            {title || "Untitled Blog"}
          </h2>
        </div>

        {/* Content Snippet */}
        <p
          className="text-xs sm:text-sm line-clamp-2 sm:line-clamp-3 mb-4 leading-relaxed pl-4"
          style={{ color: "var(--text-dim)" }}
        >
          {cleanContent.slice(0, 180) + (cleanContent.length > 180 ? "..." : "")}
        </p>

        {/* Card Footer: Reading time + Read Post prompt */}
        <div
          className="flex items-center justify-between text-xs pt-3 border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <span style={{ color: "var(--text-dim)" }}>
            ⏱ {readTime} min read
          </span>
          <span
            className="font-bold text-xs flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            style={{ color: "var(--accent)" }}
          >
            Read story →
          </span>
        </div>
      </article>
    </Link>
  );
};

export function Avatar({
  name = "User",
  size = "medium",
  imageUrl,
}: {
  name?: string;
  size?: "small" | "medium" | "large" | "xlarge" | number;
  imageUrl?: string;
}) {
  const sizeClasses =
    typeof size === "number"
      ? size > 12
        ? "w-16 h-16 text-2xl"
        : "w-8 h-8 text-sm"
      : size === "small"
      ? "w-6 h-6 text-xs"
      : size === "large"
      ? "w-12 h-12 text-lg"
      : size === "xlarge"
      ? "w-16 h-16 text-2xl"
      : "w-8 h-8 text-sm";

  const initial =
    name && name.trim().length > 0 ? name.trim()[0].toUpperCase() : "U";

  return (
    <div
      className={`relative inline-flex items-center justify-center ${sizeClasses} rounded-full flex-shrink-0 font-bold font-mono overflow-hidden select-none`}
      style={{
        backgroundColor: "var(--bg-secondary)",
        color: "var(--accent)",
        border: "1px solid var(--border)",
      }}
    >
      {imageUrl ? (
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initial}</span>
      )}
    </div>
  );
}