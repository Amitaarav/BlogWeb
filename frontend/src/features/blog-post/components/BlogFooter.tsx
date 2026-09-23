import { Link } from "react-router-dom";

const columns = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/" },
      { label: "Blog", href: "/blogs" },
      { label: "Careers", href: "/" },
      { label: "Press", href: "/" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "/" },
      { label: "Guides", href: "/" },
      { label: "API Reference", href: "/" },
      { label: "Community", href: "/" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/" },
      { label: "Terms of Service", href: "/" },
      { label: "Cookie Policy", href: "/" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Twitter / X", href: "https://x.com/AmitAarav1205" },
      { label: "GitHub", href: "https://github.com/Amitaarav" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/amitkrgupta8" },
      { label: "Discord", href: "https://discord.com/users/aaravamit8667" },
    ],
  },
];

export const BlogFooter = () => {
  return (
    <footer
      className="font-mono mt-20 border-t"
      style={{
        backgroundColor: "var(--bg-secondary)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h5
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: "var(--text-dim)" }}
              >
                {col.title}
              </h5>
              <ul className="space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="hover:underline transition-colors"
                      style={{ color: "var(--text)" }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 border-t text-center text-xs"
          style={{
            borderColor: "var(--border)",
            color: "var(--text-dim)",
          }}
        >
          &copy; {new Date().getFullYear()} BlogWeb. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
