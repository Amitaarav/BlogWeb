import { Link } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import { Footer } from "../components/Footer"

export const Landing = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Appbar />
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-600 text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white drop-shadow-lg">
            Welcome to BlogWeb
          </h1>
          <p className="mt-4 text-lg md:text-xl">
            Discover amazing content, tutorials, and stories written by experts.
          </p>
          <div className="mt-6">
            <Link to="/blogs">
              <button className="px-6 py-3 bg-white text-blue-600 font-bold rounded-md shadow-md hover:shadow-xl hover:scale-105 transform transition-all duration-300">
                Explore Blogs
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Why You'll Love Our Blog
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Expert Insights",
                description:
                  "Learn from experienced professionals sharing their knowledge across various domains.",
              },
              {
                title: "Diverse Topics",
                description:
                  "Explore content on technology, lifestyle, productivity, and more!",
              },
              {
                title: "Community Driven",
                description:
                  "Join a thriving community of readers and writers to share and engage with ideas.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl hover:-translate-y-2 transform transition-all duration-300"
              >
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Blogs Section */}
        <div className="py-16 bg-gray-100">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Featured Blogs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((id) => (
                <div
                key={id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl hover:scale-105 transform transition-all duration-300"
                >
                <img
                    src={`https://via.placeholder.com/300x200?text=Blog+${id}`}
                    alt={`Blog ${id}`}
                    className="w-full h-48 object-cover"
                />
                <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">Blog Title {id}</h3>
                    <p className="text-gray-600 mb-4">
                    A short description or excerpt from the blog goes here.
                    </p>
                    <Link to={`/blogs/${id}`}>
                    <button className="text-gray-600 font-bold hover:underline">
                        Read More
                    </button>
                    </Link>
                </div>
            </div>
            ))}
            </div>
        </div>
        </div>

      {/* Footer Section */}
      <Footer/>
    </div>
  );
};
