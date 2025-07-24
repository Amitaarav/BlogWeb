import React, { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { Avatar } from "../components/BlogCard";
import { BACKEND_URL } from "../config";

export const Profile: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [username, setUsername] = useState("User"); // You can get this from your auth context/state

  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!profileImage) {
      setError("Please select an image to upload");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const formData = new FormData();
      formData.append('profileImage', profileImage);

      const { data } = await axios.post(
        `${BACKEND_URL}/api/v1/user/profile-image`,
        formData,
        { 
          headers: { 
            Authorization: token ? `Bearer ${token}` : "",
            'Content-Type': 'multipart/form-data'
          } 
        }
      );

      // Handle successful upload
      // You might want to update the user's profile image URL in your app state
      navigate("/blogs");
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to upload profile image");
    } finally {
      setLoading(false);
    }
  }, [profileImage, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Appbar />
      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-gray-800">Profile Settings</h1>

          <div className="flex flex-col items-center space-y-6">
            <div className="relative group">
              <Avatar name={username} size={24} imageUrl={previewUrl || undefined} />
              <label 
                htmlFor="profile-image" 
                className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
              >
                <span className="text-white text-sm">Change Photo</span>
              </label>
              <input
                id="profile-image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 w-full">
                {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading || !profileImage}
              className={`px-6 py-3 font-bold rounded-lg transition-all duration-200 w-full max-w-xs
                ${loading || !profileImage
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg transform hover:-translate-y-0.5"
                }
              `}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </span>
              ) : (
                "Update Profile Picture"
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}; 