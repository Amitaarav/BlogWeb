import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { SignUpInput } from "@amitaarav/blog-common";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
    const [postInputs, setPostInputs] = useState<SignUpInput & { name?: string }>({
        name: "",
        username: "",
        password: "",
        email: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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

            const token = typeof response.data === "string" 
                ? response.data 
                : response.data.token || response.data.jwt;
            
            const user = typeof response.data === "object" ? response.data.user : null;

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
                (typeof err.response?.data === "string" ? err.response.data : "Something went wrong. Please check your credentials.")
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen flex justify-center flex-col px-4 sm:px-8">
            <div className="flex justify-center">
                <div className="w-full max-w-md">
                    <div className="px-6 py-4">
                        <div className="text-3xl font-extrabold text-center text-slate-900">
                            {type === "signin" ? "Sign in to account" : "Create an account"}
                        </div>
                        <div className="text-sm font-semibold text-gray-500 text-center mt-1">
                            {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                            <Link 
                                className="pl-2 underline font-bold text-slate-800 hover:text-black" 
                                to={type === "signin" ? "/signup" : "/signin"}
                            >
                                {type === "signin" ? "Sign up" : "Sign in"}
                            </Link>
                        </div>
                    </div>

                    {error && (
                        <div className="my-2 p-3 bg-red-100 border border-red-300 text-red-700 text-xs sm:text-sm rounded">
                            {error}
                        </div>
                    )}

                    <div className="pt-2">
                        {type === "signup" && (
                            <>
                                <LabelInput 
                                    type="text"
                                    label="Full Name" 
                                    placeholder="Amit Kumar" 
                                    value={postInputs.name || ""}
                                    onChange={(e) => setPostInputs({ ...postInputs, name: e.target.value })}
                                />
                                <LabelInput 
                                    type="text"
                                    label="Username" 
                                    placeholder="amitkumar" 
                                    value={postInputs.username}
                                    onChange={(e) => setPostInputs({ ...postInputs, username: e.target.value })}
                                />
                            </>
                        )}
                        
                        <LabelInput 
                            type="email"
                            label="Email" 
                            placeholder="aaravamit555@gmail.com" 
                            value={postInputs.email}
                            onChange={(e) => setPostInputs({ ...postInputs, email: e.target.value })}
                        />
                        
                        <LabelInput 
                            type="password"
                            label="Password" 
                            placeholder="123456789" 
                            value={postInputs.password}
                            onChange={(e) => setPostInputs({ ...postInputs, password: e.target.value })}
                        />

                        <div className="flex justify-center pt-4">
                            <button 
                                onClick={sendRequest} 
                                type="button" 
                                disabled={loading}
                                className={`text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 w-full transition
                                    ${loading ? "opacity-75 cursor-not-allowed" : ""}
                                `}
                            >
                                {loading 
                                    ? (type === "signin" ? "Signing in..." : "Signing up...") 
                                    : (type === "signin" ? "Sign in" : "Sign up")
                                }
                            </button>
                        </div>
                    </div>
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

function LabelInput({ label, placeholder, value, onChange, type = "text" }: LabelInputType) {
    return (
        <div className="pt-3">
            <label className="block text-sm font-medium text-gray-700">{label}</label>
            <input 
                type={type} 
                value={value}
                onChange={onChange} 
                placeholder={placeholder} 
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-slate-500 focus:border-slate-900 text-sm text-black"
            />
        </div>
    );
}

