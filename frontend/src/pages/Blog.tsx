import { FullBlog } from "../components/FullBlog";
import { useBlog } from "../hooks/useBlogs";
import { Appbar } from "../components/Appbar";
import { useParams, Link } from "react-router-dom";
import { Spinner } from "../components/Spinner";

export const Blog = () => {
  const { id } = useParams<{ id: string }>();
  const { loading, blog, error, refetch } = useBlog({
    id: id || ""
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Appbar />
        <div className="flex-1 flex justify-center items-center">
          <Spinner />
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Appbar />
        <div className="flex-1 flex flex-col justify-center items-center p-6 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Blog Post Not Found
          </h2>
          <p className="text-gray-500 max-w-md mb-6">
            The article you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <div className="flex gap-4">
            <button
              onClick={refetch}
              className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-xl text-sm font-semibold transition"
            >
              Retry
            </button>
            <Link
              to="/blogs"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow transition"
            >
              Back to Stories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <FullBlog blog={blog} />;
};