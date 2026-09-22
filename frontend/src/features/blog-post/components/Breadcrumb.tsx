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
    <nav aria-label="Breadcrumb" className="font-mono text-sm mb-4">
      <ol className="flex items-center flex-wrap gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && (
              <span style={{ color: "var(--text-dim)" }}>/</span>
            )}
            {item.href ? (
              <Link
                to={item.href}
                className="hover:underline"
                style={{ color: "var(--link)" }}
              >
                {item.label}
              </Link>
            ) : (
              <span style={{ color: "var(--text-dim)" }}>{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
