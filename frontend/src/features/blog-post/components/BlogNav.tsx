import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../../hooks/useBlogs";
import { useTheme } from "../../../context/useTheme";
export const BlogNav = () => {
  const { user } = useCurrentUser();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const displayName = user?.name || user?.username || "User";
  const initial = displayName.trim().charAt(0).toUpperCase() || "U";

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setDropdownOpen(false);
    navigate("/signin");
  };

  return (
    <nav
      className="font-mono sticky top-0 z-50 border-b backdrop-blur-md transition-colors"
      style={{
        backgroundColor: "var(--bg-nav)",
        borderColor: "var(--border)",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            to={isAuthenticated ? "/blogs" : "/"}
            className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2"
            style={{ color: "var(--text)" }}
          >
            <span
              className="w-2.5 h-6 rounded-sm inline-block"
              style={{ backgroundColor: "var(--accent)" }}
            />
            BlogWeb
          </Link>

          {/* Nav links with pipe separators */}
          <ul className="hidden md:flex items-center text-sm font-bold">
            <li className="flex items-center">
              <Link
                to="/blogs"
                className="hover:opacity-70 transition-opacity"
                style={{ color: "var(--text)" }}
              >
                Explore
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-3 select-none" style={{ color: "var(--border)" }}>
                |
              </span>
              <Link
                to="/blogs"
                className="hover:opacity-70 transition-opacity"
                style={{ color: "var(--text)" }}
              >
                Stories
              </Link>
            </li>
            <li className="flex items-center">
              <span className="mx-3 select-none" style={{ color: "var(--border)" }}>
                |
              </span>
              <Link
                to="/publish"
                className="hover:opacity-70 transition-opacity"
                style={{ color: "var(--text)" }}
              >
                Write
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Section: Theme Toggle + Auth Cluster */}
        <div className="flex items-center gap-2 sm:gap-3 text-sm font-bold">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border transition hover:opacity-80 flex items-center justify-center text-base"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text)",
            }}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>

          {isAuthenticated ? (
            /* Logged-in State: Write button + Avatar Dropdown */
            <div className="flex items-center gap-3">
              <Link
                to="/publish"
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded text-white text-xs sm:text-sm font-bold transition hover:opacity-90 shadow-sm"
                style={{ backgroundColor: "var(--accent)" }}
              >
                <span>+</span> Write
              </Link>

              {/* Avatar Button */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 focus:outline-none p-0.5 rounded-full border-2 transition"
                  style={{
                    borderColor: dropdownOpen ? "var(--accent)" : "var(--border)",
                  }}
                  aria-label="User menu"
                >
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold select-none text-white shadow-inner"
                    style={{ backgroundColor: "var(--accent)" }}
                  >
                    {initial}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-lg shadow-xl border py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
                    style={{
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--border)",
                      color: "var(--text)",
                    }}
                  >
                    <div className="px-4 py-2.5 border-b" style={{ borderColor: "var(--border)" }}>
                      <p className="text-xs uppercase tracking-wider font-semibold" style={{ color: "var(--text-dim)" }}>
                        Signed in as
                      </p>
                      <p className="font-bold text-sm truncate mt-0.5" style={{ color: "var(--text)" }}>
                        {displayName}
                      </p>
                      {user?.email && (
                        <p className="text-xs truncate" style={{ color: "var(--text-dim)" }}>
                          {user.email}
                        </p>
                      )}
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:opacity-80 transition"
                      style={{ color: "var(--text)" }}
                    >
                      <span>👤</span> Profile Settings
                    </Link>

                    <Link
                      to="/publish"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:opacity-80 transition"
                      style={{ color: "var(--text)" }}
                    >
                      <span>✍️</span> New Blog Post
                    </Link>

                    <Link
                      to="/blogs"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 hover:opacity-80 transition"
                      style={{ color: "var(--text)" }}
                    >
                      <span>📖</span> Browse Stories
                    </Link>

                    <div className="border-t my-1" style={{ borderColor: "var(--border)" }} />

                    <button
                      onClick={handleSignOut}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 font-bold transition hover:opacity-80"
                      style={{ color: "var(--accent)" }}
                    >
                      <span>🚪</span> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Logged-out State: plain text link → outlined button → filled button */
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/signin"
                className="px-2 py-1 hover:opacity-70 transition-opacity"
                style={{ color: "var(--text)" }}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="hidden sm:inline px-3.5 py-1.5 rounded border transition hover:opacity-80"
                style={{
                  color: "var(--accent)",
                  borderColor: "var(--accent)",
                }}
              >
                Sign Up
              </Link>
              <Link
                to="/signup"
                className="px-3.5 py-1.5 rounded text-white transition hover:opacity-90 shadow-sm"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};
