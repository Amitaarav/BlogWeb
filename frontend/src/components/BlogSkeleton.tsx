export const BlogSkeleton = () => {
  return (
    <div
      className="p-5 sm:p-6 my-4 rounded-lg border font-mono animate-pulse"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border)",
      }}
    >
      {/* Author Section */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-7 h-7 rounded-full"
          style={{ backgroundColor: "var(--border)" }}
        />
        <div
          className="h-3 w-32 rounded"
          style={{ backgroundColor: "var(--border)" }}
        />
        <div
          className="h-3 w-16 rounded"
          style={{ backgroundColor: "var(--border)" }}
        />
      </div>

      {/* Title */}
      <div className="mb-3">
        <div
          className="h-6 w-3/4 rounded"
          style={{ backgroundColor: "var(--border)" }}
        />
      </div>

      {/* Content Preview */}
      <div className="space-y-2 mb-4">
        <div
          className="h-3 w-full rounded"
          style={{ backgroundColor: "var(--border)" }}
        />
        <div
          className="h-3 w-5/6 rounded"
          style={{ backgroundColor: "var(--border)" }}
        />
      </div>

      {/* Footer */}
      <div
        className="flex items-center justify-between pt-3 border-t"
        style={{ borderColor: "var(--border)" }}
      >
        <div
          className="h-3 w-20 rounded"
          style={{ backgroundColor: "var(--border)" }}
        />
        <div
          className="h-3 w-16 rounded"
          style={{ backgroundColor: "var(--border)" }}
        />
      </div>
    </div>
  );
};
