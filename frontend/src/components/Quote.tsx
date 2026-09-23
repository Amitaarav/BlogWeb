export const Quote = () => {
  return (
    <div
      className="min-h-screen font-mono flex justify-center items-center flex-col px-8 border-l transition-colors"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border)",
        color: "var(--text)",
      }}
    >
      <div className="max-w-lg">
        {/* Quote Block with Accent Bar */}
        <div className="flex items-stretch gap-4 mb-6">
          <div
            className="w-1.5 rounded-full flex-shrink-0"
            style={{ backgroundColor: "var(--accent)" }}
          />
          <blockquote className="text-xl sm:text-2xl font-bold leading-relaxed">
            "The one excellent thing that can be learned from a lion is that
            whatever a man intends doing should be done by him with a
            whole-hearted and strenuous effort."
          </blockquote>
        </div>

        <div className="pl-6">
          <div className="text-base font-bold" style={{ color: "var(--text)" }}>
            Chanakya
          </div>
          <div className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>
            Ancient Indian Philosopher & Statesman
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quote;