import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { BACKEND_URL } from "../config";

export const Publish: React.FC = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleChange =
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setter(e.target.value);

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
        const { data } = await axios.post(
          `${BACKEND_URL}/api/v1/blog`,
          { title: title.trim(), content: description.trim() },
          { headers: { Authorization: token ? `Bearer ${token}` : "" } }
        );

        navigate(`/blog/${data.id}`);
      } catch (err: any) {
        console.error(err);
        setError(err.response?.data?.message || "An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    },
    [title, description, navigate]
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Appbar />
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Publish New Blog</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
          )}

          <TitleInput value={title} onChange={handleChange(setTitle)} />
          <TextEditor value={description} onChange={handleChange(setDescription)} />

          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center px-6 py-3 font-bold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2
              ${loading ? "bg-gray-800 cursor-not-allowed text-white" : "bg-gray-600 hover:bg-gray-700 text-white focus:ring-blue-400"}
            `}
          >
            {loading ? "Publishing..." : "Publish Blog"}
          </button>
        </form>
      </main>
    </div>
  );
};

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<any>) => void;
}

const TitleInput: React.FC<InputProps> = ({ value, onChange }) => (
  <div>
    <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
      Blog Title
    </label>
    <input
      id="title"
      type="text"
      value={value}
      onChange={onChange}
      placeholder="Enter the title"
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      required
    />
  </div>
);

const TextEditor: React.FC<InputProps> = ({ value, onChange }) => (
  <div>
    <label htmlFor="content" className="block text-sm font-semibold text-gray-700">
      Content
    </label>
    <textarea
      id="content"
      value={value}
      onChange={onChange}
      placeholder="Write your content here..."
      rows={10}
      className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
      required
    />
  </div>
);
