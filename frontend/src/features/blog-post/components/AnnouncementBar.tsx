import { useState } from "react";

export const AnnouncementBar = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div
      className="font-mono text-sm font-bold text-center py-2.5 px-4 relative"
      style={{ backgroundColor: "var(--announce)", color: "#000" }}
    >
      <span>
        🚀 BlogWeb v2 is live — check out the{" "}
        <a href="/blogs" className="underline hover:no-underline">
          new features
        </a>
      </span>
      <button
        onClick={() => setVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-black/60 hover:text-black text-lg leading-none"
        aria-label="Dismiss announcement"
      >
        ×
      </button>
    </div>
  );
};
