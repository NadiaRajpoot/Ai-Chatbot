import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

// Prefer env base URL, otherwise fall back to localhost
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const REMEMBER_KEY = "auth_remember";

export default function Signup() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("signup");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    remember: false,
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load remembered credentials on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(REMEMBER_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({
          ...prev,
          firstName: parsed.firstName || "",
          lastName: parsed.lastName || "",
          email: parsed.email || "",
          password: parsed.password || "",
          remember: true,
        }));
      }
    } catch (_) {
      // ignore corrupted storage
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
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
      // Remember credentials only if user asked
      if (formData.remember) {
        localStorage.setItem(
          REMEMBER_KEY,
          JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
          })
        );
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }
      setFormData({ firstName: "", lastName: "", email: "", password: "", remember: false });
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

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
              className="h-4 w-4 accent-purple-600"
            />
            <span className="text-sm text-gray-600">Remember me</span>
          </div>

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
