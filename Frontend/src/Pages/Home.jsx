import React, { useState, useRef, useEffect } from "react";
import logoFull from "../assets/logo_full_dark.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../Componenets/header.jsx";
// Reusable Input Component
function PromptInput({ prompt, setPrompt, sendPrompt, loading }) {
  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendPrompt();
    }
  };

  return (
    <div className="flex-1 text-left flex items-center bg-purple-50 px-4 py-3 rounded-full border border-purple-200 focus-within:shadow-md transition">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={onKeyDown}
        aria-label="prompt"
        placeholder="Type your prompt here..."
        className="flex-1 bg-transparent outline-none text-gray-700 placeholder-gray-400 resize-none h-10 text-left"
        style={{ textAlign: "left" }}
      />
      <button
        onClick={sendPrompt}
        disabled={loading || !prompt.trim()}
        className="ml-3 bg-purple-600 hover:bg-purple-700 transition text-white rounded-full w-10 h-10 flex items-center justify-center shadow-md disabled:opacity-60"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M3 12L21 3L14 21L11 14L3 12Z" fill="white" />
        </svg>
      </button>
    </div>
  );
}

// Reusable Chat Bubble Component
function ChatBubble({ msg }) {
  const isUser = msg.type === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex gap-3 max-w-md ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            isUser ? "bg-purple-600" : "bg-gray-300"
          }`}
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div
          className={`rounded-lg p-3 ${isUser ? "bg-purple-100 text-gray-800" : "bg-gray-100 text-gray-800"}`}
        >
          <p className="text-md text-left whitespace-pre-wrap">{msg.text}</p>
          <p className="text-sm text-left  text-gray-500 mt-1">{getTimeAgo(msg.timestamp)}</p>
        </div>
      </div>
    </div>
  );
}

// Helper to format timestamps
function getTimeAgo(date) {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 60) return "a few seconds ago";
  if (minutes === 1) return "a minute ago";
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours === 1) return "an hour ago";
  return `${hours} hours ago`;
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const API_BASE = import.meta.env.VITE_API_URL  || "https://ai-chatbot-5-zjoa.onrender.com";
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    const userMessage = prompt;
    setPrompt("");
    setLoading(true);

    setMessages((prev) => [...prev, { type: "user", text: userMessage, timestamp: new Date() }]);

    try {
      const res = await fetch(`${API_BASE}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");

      setMessages((prev) => [...prev, { type: "ai", text: data.result || "", timestamp: new Date() }]);
    } catch (err) {
      toast.error(err.message || "Request failed", {
        autoClose: 5000,
        position: "top-center",
        hideProgressBar: true,
        closeButton: true,
        pauseOnHover: false,
        pauseOnFocusLoss: false,
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Fixed Header */}
      <Header/>
      {/* Main Content */}
      <div className="pt-20 flex-1 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-5xl px-6 flex flex-col items-center text-center">
              <img src={logoFull} alt="QuickGPT" className="h-14" />
              <h1 className="mt-20 text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-gray-800">
                Ask me <span className="text-purple-600">anything</span>
              </h1>
              <p className="mt-6 max-w-2xl text-base md:text-md mb-20 text-gray-500 leading-relaxed">
                Get instant answers, creative ideas, and smart drafts from your friendly AI assistant.
              </p>
              <div className="w-[86%] md:w-3/4 lg:w-2/3">
                <PromptInput prompt={prompt} setPrompt={setPrompt} sendPrompt={sendPrompt} loading={loading} />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
              {messages.map((msg, idx) => (
                <ChatBubble key={idx} msg={msg} />
              ))}
              {loading && (
                <div className="flex gap-3">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="max-w-4xl mx-auto flex items-center gap-3">
                <PromptInput prompt={prompt} setPrompt={setPrompt} sendPrompt={sendPrompt} loading={loading} />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Default Toast Container */}
      <ToastContainer
        autoClose={3000}
        position="top-center"
        hideProgressBar
        closeButton={false}
        pauseOnHover={false}
        pauseOnFocusLoss={false}
      />
    </div>
  );
}
