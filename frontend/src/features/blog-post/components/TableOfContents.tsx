import { useScrollSpy } from "../hooks/useScrollSpy";

export interface TocItem {
  id: string;
  label: string;
  level: 2 | 3;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export const TableOfContents = ({ items }: TableOfContentsProps) => {
  const ids = items.map((item) => item.id);
  const activeId = useScrollSpy(ids, 100);

  const handleClick = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <aside
      className="font-mono sticky top-24 hidden lg:block"
      aria-label="Table of Contents"
    >
      <h4
        className="text-xs font-bold uppercase tracking-widest mb-4"
        style={{ color: "var(--text-dim)" }}
      >
        On this page
      </h4>
      <ul className="space-y-1.5 text-sm border-l-2" style={{ borderColor: "var(--border)" }}>
        {items.map((item) => {
          const isActive = activeId === item.id;
          const isSubItem = item.level === 3;

          return (
            <li key={item.id}>
              <button
                onClick={() => handleClick(item.id)}
                className={`
                  block w-full text-left py-1 transition-all duration-150
                  ${isSubItem ? "pl-6 text-xs" : "pl-4 font-bold"}
                  ${isActive ? "border-l-2 -ml-[2px]" : ""}
                `}
                style={{
                  color: isActive ? "var(--accent)" : isSubItem ? "var(--text-dim)" : "var(--text)",
                  borderColor: isActive ? "var(--accent)" : "transparent",
                }}
              >
                {item.label}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
