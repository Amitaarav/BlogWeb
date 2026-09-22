import { Link } from "react-router-dom";

const navLinks = [
  { label: "Products", hasDropdown: true },
  { label: "Resources", hasDropdown: true },
  { label: "Docs", href: "/blogs" },
  { label: "Blog", href: "/blogs" },
];

export const BlogNav = () => {
  return (
    <nav
      className="font-mono sticky top-0 z-50 border-b"
      style={{
        backgroundColor: "var(--bg-nav)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="text-xl font-bold tracking-tight"
          style={{ color: "var(--text)" }}
        >
          BlogWeb
        </Link>

        {/* Center links — hidden on mobile */}
        <ul className="hidden md:flex items-center gap-0 text-sm">
          {navLinks.map((item, i) => (
            <li key={item.label} className="flex items-center">
              {i > 0 && (
                <span
                  className="mx-3 select-none"
                  style={{ color: "var(--border)" }}
                >
                  |
                </span>
              )}
              {item.href ? (
                <Link
                  to={item.href}
                  className="font-bold hover:opacity-70 transition-opacity"
                  style={{ color: "var(--text)" }}
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  className="font-bold hover:opacity-70 transition-opacity flex items-center gap-1"
                  style={{ color: "var(--text)" }}
                >
                  {item.label}
                  {item.hasDropdown && (
                    <svg
                      className="w-3 h-3 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  )}
                </button>
              )}
            </li>
          ))}
        </ul>

        {/* Right CTA cluster */}
        <div className="flex items-center gap-3 text-sm font-bold">
          <Link
            to="/signin"
            className="hidden sm:inline hover:opacity-70 transition-opacity"
            style={{ color: "var(--text)" }}
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="hidden sm:inline px-4 py-1.5 rounded border hover:opacity-80 transition-opacity"
            style={{
              color: "var(--accent)",
              borderColor: "var(--accent)",
            }}
          >
            Sign Up
          </Link>
          <Link
            to="/publish"
            className="px-4 py-1.5 rounded text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "var(--accent)" }}
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
};
