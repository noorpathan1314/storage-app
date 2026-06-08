// src/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "./apis/loginWithGoogle";
import { 
  Mail, Lock, AlertCircle, Cloud, ArrowRight 
} from "lucide-react";

// Custom GitHub icon (same as Register)
const GithubIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.49.5.09.68-.21.68-.48 0-.24-.01-.88-.01-1.72-2.78.6-3.37-1.34-3.37-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.64 0 0 .84-.27 2.75 1.02.8-.22 1.65-.33 2.5-.33.85 0 1.7.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.37.2 2.39.1 2.64.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48C19.13 20.17 22 16.42 22 12c0-5.52-4.48-10-10-10z" />
  </svg>
);

const Login = () => {
  // ✅ Use environment variable for backend URL
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const navigate = useNavigate();

  // Auto‑redirect if already logged in
  useEffect(() => {
    fetch(`${BASE_URL}/user`, { credentials: "include" })
      .then((res) => {
        if (res.ok) navigate("/dashboard", { replace: true });
      })
      .catch(() => {});
  }, [navigate, BASE_URL]);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (serverError) setServerError("");
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (data.error) {
        setServerError(data.error);
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error:", error);
      setServerError("Something went wrong. Please try again.");
    }
  };

  // GitHub login handler – redirect to backend
  const handleGitHubLogin = () => {
    window.location.href = `${BASE_URL}/auth/github`;
  };

  const hasError = Boolean(serverError);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* LEFT SIDE – FORM */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-white dark:bg-gray-950">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <Cloud className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-semibold text-gray-900 dark:text-white">StorageApp</span>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to your account</p>

          <div className="mt-6 space-y-3">
            {/* GitHub button – real redirect */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              onClick={handleGitHubLogin}
            >
              <GithubIcon />
              <span className="text-sm font-medium">GitHub</span>
            </button>

            {/* Google button – wrapped to match GitHub button size, with One-Tap */}
            <div className="w-full google-button-wrapper">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const data = await loginWithGoogle(credentialResponse.credential);
                  if (data.error) return;
                  navigate("/dashboard");
                }}
                theme="filled_blue"
                text="continue_with"
                shape="pill"
                width="100%"
                onError={() => console.log("Google login failed")}
                useOneTap
              />
            </div>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white dark:bg-gray-950 px-2 text-gray-400">or</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-800 dark:text-white ${
                    hasError ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:bg-gray-800 dark:text-white ${
                    hasError ? "border-red-500" : "border-gray-300 dark:border-gray-600"
                  }`}
                  placeholder="••••••••"
                  required
                />
              </div>
              {serverError && (
                <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                  <AlertCircle className="h-3 w-3" /> {serverError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Sign in
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-indigo-600 hover:underline">
              Create one
            </Link>
          </p>

          <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
            By signing in, you agree to our{" "}
            <Link to="/terms" className="underline hover:text-indigo-500">Terms</Link> and{" "}
            <Link to="/privacy" className="underline hover:text-indigo-500">Privacy Policy</Link>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE – TESTIMONIAL (same as Register) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 items-center justify-center p-12">
        <div className="max-w-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <Cloud className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-semibold text-gray-600">StorageApp</span>
            </div>
            <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
              “StorageApp gives our team the perfect balance of security and simplicity. The OTP verification is seamless, and the UI is a joy to use.”
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                PC
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Paul Copplestone</p>
                <p className="text-xs text-gray-500">Supabase, CEO</p>
              </div>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">Secured by StorageApp</p>
        </div>
      </div>

      <style>{`
        /* Force Google button to match GitHub button dimensions */
        .google-button-wrapper > div {
          width: 100% !important;
          max-width: 100% !important;
        }
        .google-button-wrapper iframe {
          width: 100% !important;
          min-width: 100% !important;
        }
      `}</style>
    </div>
  );
};

export default Login;