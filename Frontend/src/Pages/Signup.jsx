import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

// Prefer env base URL, otherwise fall back to localhost
const API_BASE = import.meta.env.VITE_API_URL || "https://ai-chatbot-7-kp56.onrender.com";
// Removed remember-me functionality

export default function Signup() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signup");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Remember-me removed; no preloading from localStorage

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const isSignup = mode === "signup";
      const path = isSignup ? "signup" : "login";
      const res = await axios.post(
        `${API_BASE}/api/auth/${path}`,
        isSignup
          ? {
              firstname: formData.firstName,
              lastname: formData.lastName,
              email: formData.email,
              password: formData.password,
            }
          : {
              email: formData.email,
              password: formData.password,
            },
        { withCredentials: true }
      );
      const data = res.data || {};
      toast.success(data.message || (isSignup ? "Account created successfully." : "Signed in successfully."));
      // Store auth info for client-side route protection
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      setFormData({ firstName: "", lastName: "", email: "", password: "" });
      navigate("/home", { replace: true });
    } catch (err) {
      const data = err?.response?.data;
      const backendMsg = data?.message;
      const validationErrors = data?.errors && typeof data.errors === 'object'
        ? Object.values(data.errors).join(' | ')
        : null;
      toast.error(validationErrors || backendMsg || err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">{mode === "signup" ? "Sign Up" : "Sign In"}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent shadow-sm"
                required
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent shadow-sm"
                required
              />
            </div>
          )}

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent shadow-sm"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent shadow-sm pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-3 my-auto h-5 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FaEyeSlash color="gray" /> : <FaEye color="gray" />}
            </button>
          </div>

          {/* Remember-me checkbox removed */}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg bg-purple-600 text-white font-semibold transition ${
              loading ? "opacity-70 cursor-not-allowed" : "hover:bg-purple-700"
            }`}
          >
            {loading ? (mode === "signup" ? "Signing up..." : "Signing in...") : mode === "signup" ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          {mode === "signup" ? "Already have an account? " : "Need an account? "}
          <button
            type="button"
            onClick={() => setMode((m) => (m === "signup" ? "signin" : "signup"))}
            className="text-purple-600 hover:underline"
          >
            {mode === "signup" ? "Sign in" : "Sign up"}
          </button>
        </p>

        <ToastContainer position="top-center" autoClose={3000} hideProgressBar newestOnTop closeOnClick pauseOnHover={false} theme="colored" />
      </div>
    </div>
  );
}
