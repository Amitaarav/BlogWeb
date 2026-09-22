import { useState, useRef, useEffect } from "react";
import { Avatar } from "./BlogCard";
import { Link, useNavigate } from "react-router-dom";
import { useCurrentUser } from "../hooks/useBlogs";

export const Appbar = () => {
    const { user } = useCurrentUser();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const isAuthenticated = !!token;

    const displayName = user?.name || user?.username || "User";

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
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
        <div className="border-b border-slate-200 bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-10 py-3.5">
                {/* Brand Logo */}
                <Link to={isAuthenticated ? "/blogs" : "/"} className="font-extrabold text-2xl text-black cursor-pointer tracking-tight">
                    BlogWeb
                </Link>

                {/* Right Action Items */}
                <div className="flex items-center gap-3 sm:gap-4">
                    <Link 
                        to="/blogs" 
                        className="text-sm font-medium text-slate-600 hover:text-black px-2 py-1 transition"
                    >
                        Blogs
                    </Link>

                    {isAuthenticated ? (
                        <>
                            <Link to="/publish">
                                <button 
                                    type="button" 
                                    className="text-white bg-green-600 hover:bg-green-700 font-medium rounded-full text-xs sm:text-sm px-4 sm:px-5 py-2 text-center transition"
                                >
                                    New
                                </button>
                            </Link>

                            {/* User Avatar Dropdown */}
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center focus:outline-none"
                                    aria-label="User menu"
                                >
                                    <Avatar size="medium" name={displayName} />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50">
                                        <div className="px-4 py-2 border-b border-slate-100">
                                            <p className="text-xs text-slate-400">Signed in as</p>
                                            <p className="text-sm font-bold text-slate-800 truncate">{displayName}</p>
                                        </div>

                                        <Link 
                                            to="/profile" 
                                            onClick={() => setDropdownOpen(false)}
                                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
                                        >
                                            Profile
                                        </Link>

                                        <Link 
                                            to="/publish" 
                                            onClick={() => setDropdownOpen(false)}
                                            className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 transition"
                                        >
                                            New Blog
                                        </Link>

                                        <div className="border-t border-slate-100 my-1"></div>

                                        <button
                                            onClick={handleSignOut}
                                            className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-slate-100 transition font-medium"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Link 
                                to="/signin" 
                                className="text-sm font-medium text-slate-700 hover:text-black px-2 py-1"
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/signup" 
                                className="text-xs sm:text-sm font-medium text-white bg-slate-900 hover:bg-black px-4 py-2 rounded-full transition"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};



