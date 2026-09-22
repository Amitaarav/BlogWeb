import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { Avatar } from "../components/BlogCard";
import { useCurrentUser } from "../hooks/useBlogs";
import { BACKEND_URL } from "../config";

export const Profile: React.FC = () => {
  const { user, refetchUser } = useCurrentUser();
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

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
    } catch (err: any) {
      console.error("Profile update error:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }, [name, username, refetchUser]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <Appbar />
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">Profile Settings</h1>

          <div className="flex justify-center mb-6">
            <Avatar name={name || username || "User"} size="xlarge" />
          </div>

          <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
            {successMsg && (
              <div className="p-3 bg-green-100 text-green-800 border border-green-200 rounded text-sm">
                {successMsg}
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-100 text-red-700 border border-red-200 rounded text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-gray-700 font-semibold text-sm mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm text-gray-900"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-gray-700 font-semibold text-sm mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-sm text-gray-900"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold text-sm mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                disabled
                className="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 text-sm cursor-not-allowed"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full px-6 py-2.5 font-bold rounded-lg text-white text-sm transition
                  ${loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gray-800 hover:bg-gray-900"
                  }
                `}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};


