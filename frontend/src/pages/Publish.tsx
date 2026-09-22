import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { Spinner } from "../components/Spinner";
import { BACKEND_URL } from "../config";

export const Publish: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditing);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  // Auth guard
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  // Fetch blog if editing
  useEffect(() => {
    if (isEditing && id) {
      setFetching(true);
      const token = localStorage.getItem("token");
      axios
        .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        .then((res) => {
          const blog = res.data.blog;
          if (blog) {
            setTitle(blog.title || "");
            setDescription(blog.content || "");
          }
          setFetching(false);
        })
        .catch((err) => {
          console.error("Error fetching blog for editing:", err);
          setError("Failed to load blog for editing");
          setFetching(false);
        });
    }
  }, [isEditing, id]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);

      if (!title.trim() || !description.trim()) {
        setError("Both title and content are required.");
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const headers = { Authorization: token ? `Bearer ${token}` : "" };

        if (isEditing && id) {
          await axios.put(
            `${BACKEND_URL}/api/v1/blog`,
            { id, title: title.trim(), content: description.trim() },
            { headers }
          );
          navigate(`/blog/${id}`);
        } else {
          const { data } = await axios.post(
            `${BACKEND_URL}/api/v1/blog`,
            { title: title.trim(), content: description.trim() },
            { headers }
          );
          navigate(`/blog/${data.id}`);
        }
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    },
    [title, description, isEditing, id, navigate]
  );

  if (fetching) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Appbar />
        <div className="flex-1 flex justify-center items-center">
          <Spinner />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Appbar />
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? "Edit Blog" : "Publish New Blog"}
          </h1>
          <Link
            to={isEditing && id ? `/blog/${id}` : "/blogs"}
            className="text-sm font-medium text-gray-500 hover:text-black transition"
          >
            Cancel
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 text-sm rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1">
              Blog Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter the title"
              className="block w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 text-base font-semibold shadow-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="content"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write your content here..."
              rows={12}
              className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-slate-500 text-base leading-relaxed shadow-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center px-6 py-3 font-bold rounded-lg text-white text-sm transition focus:outline-none focus:ring-4 focus:ring-gray-300
              ${loading ? "bg-gray-800 cursor-not-allowed" : "bg-gray-800 hover:bg-gray-900"}
            `}
          >
            {loading 
              ? (isEditing ? "Saving changes..." : "Publishing...") 
              : (isEditing ? "Save & Publish" : "Publish Blog")
            }
          </button>
        </form>
      </main>
    </div>
  );
};


