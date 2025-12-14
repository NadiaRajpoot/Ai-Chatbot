
import React from 'react'
import logoFull from "../assets/logo_full_dark.svg";

const API_BASE = import.meta.env.VITE_API_URL || "https://ai-chatbot-7-kp56.onrender.com";

const handleLogout = () => {
  fetch(`${API_BASE}/api/auth/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  }).finally(() => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      sessionStorage.removeItem("authToken");
      sessionStorage.removeItem("user");
    } catch (_) {
      // ignore storage errors
    }
    window.location.href = "/";
  });
};

const Header = () => {
  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-50">
        <img src={logoFull} alt="QuickGPT" className="h-10" />
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 text-md font-medium text-white bg-purple-600 hover:bg-purple-700 active:bg-purple-800 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          Logout
        </button>
      </div>
  )
}

export default Header


