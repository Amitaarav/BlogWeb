import { Link } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { Footer } from "../components/Footer";
import { useBlogs } from "../hooks/useBlogs";
import { BlogCard } from "../components/BlogCard";

export const Landing = () => {
  const { blogs } = useBlogs();
  const token = localStorage.getItem("token");
  const isAuthenticated = !!token;

  const featuredBlogs = blogs.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Appbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-sm">
            Welcome to BlogWeb
          </h1>
          <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Discover insightful blogs, tutorials, and stories written by developers and writers.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/blogs">
              <button className="px-6 py-2.5 bg-white text-gray-900 font-bold rounded-md shadow hover:bg-gray-100 transition">
                Explore Blogs
              </button>
            </Link>
            <Link to={isAuthenticated ? "/publish" : "/signup"}>
              <button className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-md shadow hover:bg-black transition">
                {isAuthenticated ? "Write a Story" : "Get Started"}
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
            Why You'll Love Our Blog
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
              {
                title: "Expert Insights",
                description:
                  "Learn from experienced professionals sharing their knowledge across various domains.",
              },
              {
                title: "Diverse Topics",
                description:
                  "Explore content on technology, lifestyle, productivity, and software engineering.",
              },
              {
                title: "Community Driven",
                description:
                  "Join a thriving community of readers and writers to share and engage with ideas.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow transition"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Blogs Section */}
      {featuredBlogs.length > 0 && (
        <div className="py-12 bg-gray-100">
          <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Featured Blogs
              </h2>
              <Link to="/blogs" className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-black">
                View all →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {featuredBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  id={blog.id}
                  title={blog.title}
                  content={blog.content}
                  authorName={blog.author?.name || blog.author?.username || "Anonymous"}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <Footer />
    </div>
  );
};

