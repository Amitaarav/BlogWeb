import { Link } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-xs sm:text-sm mb-4">
      <ol className="flex items-center flex-wrap gap-2">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && (
              <span
                className="select-none text-xs"
                style={{ color: "var(--border)" }}
              >
                |
              </span>
            )}
            {item.href ? (
              <Link
                to={item.href}
                className="font-bold hover:underline"
                style={{ color: "var(--link)" }}
              >
                {item.label}
              </Link>
            ) : (
              <span
                className="truncate max-w-[200px] sm:max-w-md"
                style={{ color: "var(--text-dim)" }}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
