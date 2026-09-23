import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { SignUpInput } from "@amitaarav/blog-common";
import { useTheme } from "../context/ThemeContext";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const [postInputs, setPostInputs] = useState<SignUpInput & { name?: string }>({
    name: "",
    username: "",
    password: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  async function sendRequest() {
    setError(null);
    if (!postInputs.email || !postInputs.password) {
      setError("Please fill in all required fields.");
      return;
    }
    if (type === "signup" && !postInputs.username) {
      setError("Username is required.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/users/${type === "signup" ? "signup" : "signin"}`,
        postInputs
      );

      const token =
        typeof response.data === "string"
          ? response.data
          : response.data.token || response.data.jwt;

      const user =
        typeof response.data === "object" ? response.data.user : null;

      if (token) {
        localStorage.setItem("token", token);
      }
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      navigate("/blogs");
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(
        err.response?.data?.message ||
          (typeof err.response?.data === "string"
            ? err.response.data
            : "Something went wrong. Please check your credentials.")
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-screen font-mono flex flex-col justify-center px-4 sm:px-8 py-10 transition-colors relative"
      style={{ backgroundColor: "var(--bg)", color: "var(--text)" }}
    >
      {/* Top Bar for Auth Screen */}
      <div className="absolute top-4 left-6 right-6 flex justify-between items-center text-xs">
        <Link
          to="/"
          className="font-bold flex items-center gap-1.5 hover:opacity-80"
          style={{ color: "var(--text)" }}
        >
          <span
            className="w-2 h-4 rounded-sm inline-block"
            style={{ backgroundColor: "var(--accent)" }}
          />
          BlogWeb
        </Link>
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded border transition hover:opacity-80"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-card)",
          }}
          title="Toggle Theme"
        >
          {theme === "dark" ? "☀️" : "🌙"}
        </button>
      </div>

      <div className="flex justify-center">
        <div
          className="w-full max-w-md p-6 sm:p-8 rounded-lg border shadow-xl"
          style={{
            backgroundColor: "var(--bg-card)",
            borderColor: "var(--border)",
          }}
        >
          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              {type === "signin" ? "Sign In to BlogWeb" : "Create an Account"}
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: "var(--text-dim)" }}>
              {type === "signin"
                ? "Don't have an account yet?"
                : "Already have an account?"}
              <Link
                className="pl-2 underline font-bold transition hover:opacity-80"
                style={{ color: "var(--accent)" }}
                to={type === "signin" ? "/signup" : "/signin"}
              >
                {type === "signin" ? "Sign up" : "Sign in"}
              </Link>
            </p>
          </div>

          {error && (
            <div
              className="my-3 p-3 rounded text-xs border font-semibold"
              style={{
                borderColor: "var(--accent)",
                color: "var(--accent)",
                backgroundColor: "var(--bg-secondary)",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendRequest();
            }}
            className="space-y-4 pt-2"
          >
            {type === "signup" && (
              <>
                <LabelInput
                  type="text"
                  label="Full Name"
                  placeholder="e.g. Amit Kumar"
                  value={postInputs.name || ""}
                  onChange={(e) =>
                    setPostInputs({ ...postInputs, name: e.target.value })
                  }
                />
                <LabelInput
                  type="text"
                  label="Username"
                  placeholder="e.g. amitkumar"
                  value={postInputs.username}
                  onChange={(e) =>
                    setPostInputs({ ...postInputs, username: e.target.value })
                  }
                />
              </>
            )}

            <LabelInput
              type="email"
              label="Email Address"
              placeholder="you@example.com"
              value={postInputs.email}
              onChange={(e) =>
                setPostInputs({ ...postInputs, email: e.target.value })
              }
            />

            <LabelInput
              type="password"
              label="Password"
              placeholder="••••••••"
              value={postInputs.password}
              onChange={(e) =>
                setPostInputs({ ...postInputs, password: e.target.value })
              }
            />

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded text-white text-sm font-bold transition hover:opacity-90 shadow"
                style={{ backgroundColor: "var(--accent)" }}
              >
                {loading
                  ? type === "signin"
                    ? "Signing in..."
                    : "Creating account..."
                  : type === "signin"
                  ? "Sign In →"
                  : "Create Account →"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

interface LabelInputType {
  label: string;
  placeholder: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

function LabelInput({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: LabelInputType) {
  return (
    <div>
      <label
        className="block text-xs uppercase tracking-wider font-bold mb-1"
        style={{ color: "var(--text-dim)" }}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="block w-full px-3 py-2.5 rounded-lg border font-mono text-sm focus:outline-none transition"
        style={{
          backgroundColor: "var(--bg-input)",
          borderColor: "var(--border)",
          color: "var(--text)",
        }}
        required
      />
    </div>
  );
}

export default Auth;
