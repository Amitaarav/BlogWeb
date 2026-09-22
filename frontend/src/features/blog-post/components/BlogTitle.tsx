interface BlogTitleProps {
  title: string;
  authors: string[];
  date: string;
}

export const BlogTitle = ({ title, authors, date }: BlogTitleProps) => {
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

      {/* Byline */}
      <div className="flex items-center gap-2 text-sm ml-5 pl-2">
        <span className="font-bold" style={{ color: "var(--text)" }}>
          {authors.join(", ")}
        </span>
        <span style={{ color: "var(--text-dim)" }}>|</span>
        <time style={{ color: "var(--text-dim)" }}>{date}</time>
      </div>
    </div>
  );
};
