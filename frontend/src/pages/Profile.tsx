import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BlogNav } from "../features/blog-post/components/BlogNav";
import { AnnouncementBar } from "../features/blog-post/components/AnnouncementBar";
import { BlogFooter } from "../features/blog-post/components/BlogFooter";
import { Avatar } from "../components/BlogCard";
import { useCurrentUser } from "../hooks/useBlogs";
import { useTheme } from "../context/useTheme";
import { BACKEND_URL } from "../config";

export const Profile: React.FC = () => {
  const { user, refetchUser } = useCurrentUser();
  const { theme, toggleTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  // Sync user state when loaded
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setUsername(user.username || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccessMsg(null);

      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.put(
          `${BACKEND_URL}/api/v1/user/profile`,
          {
            name: name.trim(),
            username: username.trim(),
          },
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        if (response.data?.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
          refetchUser();
        }

        setSuccessMsg("Profile updated successfully!");
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            "Failed to update profile"
              );
        } else {
          setError("Failed to update profile");
        }
      } finally {
        setLoading(false);
      }
    },
    [name, username, refetchUser]
  );

  return (
    <div
      className="min-h-screen font-mono flex flex-col transition-colors"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      <AnnouncementBar />
      <BlogNav />

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 my-8">
        <div
          className="rounded-lg border p-6 sm:p-8"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: "var(--border)" }}>
            <div
              className="w-1.5 h-6 rounded-full"
              style={{ backgroundColor: "var(--accent)" }}
            />
            <h1 className="text-xl sm:text-2xl font-bold">Profile Settings</h1>
          </div>

          {/* Avatar Center */}
          <div className="flex flex-col items-center justify-center mb-6">
            <Avatar name={name || username || "User"} size="xlarge" />
            <span className="font-bold text-base mt-3" style={{ color: "var(--text)" }}>
              {name || username || "User"}
            </span>
            <span className="text-xs" style={{ color: "var(--text-dim)" }}>
              @{username || "user"}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            {successMsg && (
              <div
                className="p-3 rounded text-xs sm:text-sm border font-bold"
                style={{
                  borderColor: "var(--syn-string)",
                  color: "var(--syn-string)",
                  backgroundColor: "var(--bg-secondary)",
                }}
              >
                ✓ {successMsg}
              </div>
            )}

            {error && (
              <div
                className="p-3 rounded text-xs sm:text-sm border font-bold"
                style={{
                  borderColor: "var(--accent)",
                  color: "var(--accent)",
                  backgroundColor: "var(--bg-secondary)",
                }}
              >
                ⚠️ {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-xs uppercase tracking-wider font-bold mb-1"
                style={{ color: "var(--text-dim)" }}
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-2.5 rounded-lg border font-mono text-sm focus:outline-none transition"
                style={{
                  backgroundColor: "var(--bg-input)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
              />
            </div>

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="block text-xs uppercase tracking-wider font-bold mb-1"
                style={{ color: "var(--text-dim)" }}
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full px-4 py-2.5 rounded-lg border font-mono text-sm focus:outline-none transition"
                style={{
                  backgroundColor: "var(--bg-input)",
                  borderColor: "var(--border)",
                  color: "var(--text)",
                }}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-xs uppercase tracking-wider font-bold mb-1"
                style={{ color: "var(--text-dim)" }}
              >
                Email (Read-only)
              </label>
              <input
                type="email"
                id="email"
                value={email}
                disabled
                className="w-full px-4 py-2.5 rounded-lg border font-mono text-sm opacity-60 cursor-not-allowed"
                style={{
                  backgroundColor: "var(--bg-secondary)",
                  borderColor: "var(--border)",
                  color: "var(--text-dim)",
                }}
              />
            </div>

            {/* Theme Preference Setting */}
            <div
              className="p-4 rounded-lg border flex items-center justify-between mt-4"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border)",
              }}
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
                  Color Theme
                </p>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-dim)" }}>
                  Current: <strong className="capitalize">{theme} mode</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="px-3 py-1.5 rounded border text-xs font-bold transition hover:opacity-80 flex items-center gap-1.5"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text)",
                }}
              >
                <span>{theme === "dark" ? "☀️" : "🌙"}</span>
                Switch to {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 rounded text-white text-sm font-bold transition hover:opacity-90 shadow"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {loading ? "Updating..." : "Save Profile Changes"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <BlogFooter />
    </div>
  );
};

export default Profile;
