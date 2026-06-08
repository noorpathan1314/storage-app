// src/pages/Settings.jsx
import { useEffect, useState, useRef } from "react";
import { User, KeyRound, Mail, Shield, AlertCircle, CheckCircle2, Edit2, Sun, Moon, Monitor, Trash2, Upload } from "lucide-react";

// ✅ Use environment variable for backend URL
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export default function Settings() {
  const [user, setUser] = useState(null);
  const [fetching, setFetching] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

  // Profile
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [avatarColor] = useState(() => `hsl(${Math.random() * 360}, 70%, 60%)`);

  // Avatar upload
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [avatarSuccess, setAvatarSuccess] = useState("");
  const fileInputRef = useRef(null);

  // Password
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Email change
  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailChangeLoading, setEmailChangeLoading] = useState(false);
  const [emailChangeError, setEmailChangeError] = useState("");
  const [emailChangeSuccess, setEmailChangeSuccess] = useState("");

  // Theme
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else if (theme === "light") root.classList.remove("dark");
    else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches)
        root.classList.add("dark");
      else root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${BASE_URL}/user`, { credentials: "include" });
        if (!res.ok) throw new Error("Not logged in");
        const data = await res.json();
        setUser(data);
        setNewName(data.name);
      } catch (err) {
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchUser();
  }, [BASE_URL]);

  // Avatar upload handler
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      setAvatarError("Only JPEG, PNG images are allowed");
      setTimeout(() => setAvatarError(""), 3000);
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("Image size must be less than 2MB");
      setTimeout(() => setAvatarError(""), 3000);
      return;
    }

    const formData = new FormData();
    formData.append("avatar", file);
    setUploadingAvatar(true);
    setAvatarError("");
    setAvatarSuccess("");

    try {
      const res = await fetch(`${BASE_URL}/user/avatar`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUser(prev => ({ ...prev, picture: data.picture }));
      setAvatarSuccess("Avatar updated successfully");
      setTimeout(() => setAvatarSuccess(""), 3000);
    } catch (err) {
      setAvatarError(err.message);
      setTimeout(() => setAvatarError(""), 3000);
    } finally {
      setUploadingAvatar(false);
      // clear file input
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // Name update
  const handleUpdateName = async () => {
    if (!newName.trim() || newName.trim().length < 3) {
      setError("Name must be at least 3 characters");
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/user/update-name`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setUser(prev => ({ ...prev, name: data.user.name }));
      setIsEditingName(false);
      setSuccess("Name updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 3000);
    }
  };

  // Password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (newPassword.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/user/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ oldPassword, newPassword }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to change password");
      setSuccess("Password changed successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Email OTP request
  const handleSendEmailOtp = async () => {
    setEmailChangeError("");
    setEmailChangeSuccess("");
    if (!newEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newEmail)) {
      setEmailChangeError("Valid email is required");
      return;
    }
    setEmailChangeLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/user/change-email-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEmailOtpSent(true);
      setEmailChangeSuccess("OTP sent to new email. Please check your inbox.");
      setTimeout(() => setEmailChangeSuccess(""), 5000);
    } catch (err) {
      setEmailChangeError(err.message);
      setTimeout(() => setEmailChangeError(""), 3000);
    } finally {
      setEmailChangeLoading(false);
    }
  };

  const handleVerifyEmailChange = async () => {
    setEmailChangeError("");
    setEmailChangeSuccess("");
    if (!emailOtp) {
      setEmailChangeError("OTP is required");
      return;
    }
    setEmailChangeLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/user/change-email-verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail, otp: emailOtp }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEmailChangeSuccess("Email changed successfully!");
      setUser(prev => ({ ...prev, email: newEmail }));
      setEmailOtpSent(false);
      setNewEmail("");
      setEmailOtp("");
      setTimeout(() => setEmailChangeSuccess(""), 3000);
    } catch (err) {
      setEmailChangeError(err.message);
      setTimeout(() => setEmailChangeError(""), 3000);
    } finally {
      setEmailChangeLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-indigo-200 dark:border-indigo-800"></div>
          <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl text-center">
          <Shield className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-800 dark:text-gray-200 text-lg">Please login to access settings.</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { id: "security", label: "Security", icon: <Shield className="w-5 h-5" /> },
    { id: "preferences", label: "Preferences", icon: <Monitor className="w-5 h-5" /> },
  ];

  // ✅ Fix avatar URL: if picture is full URL (http:// or https://), use directly, else prepend BASE_URL
  const avatarUrl = user.picture 
    ? (user.picture.startsWith("http") ? user.picture : `${BASE_URL}${user.picture}`)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Manage your profile, security and preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8 border-b border-gray-200 dark:border-gray-700 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative px-5 py-2.5 rounded-full font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              <span className="flex items-center gap-2">
                {tab.icon}
                {tab.label}
              </span>
              {activeTab === tab.id && (
                <span className="absolute inset-x-0 -bottom-2 h-0.5 bg-indigo-500 rounded-full mx-auto w-12 transition-all"></span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="transition-all duration-300">
          {activeTab === "profile" && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6 md:p-8">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Avatar section */}
                <div className="flex flex-col items-center gap-3 lg:w-64">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={user.name}
                      className="w-32 h-32 rounded-full object-cover shadow-lg"
                    />
                  ) : (
                    <div
                      className="w-32 h-32 rounded-full shadow-lg flex items-center justify-center text-5xl font-bold text-white"
                      style={{ background: avatarColor }}
                    >
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    accept="image/jpeg,image/png,image/jpg"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="flex items-center gap-1 px-4 py-1.5 text-sm bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition disabled:opacity-50"
                  >
                    <Upload className="w-4 h-4" />
                    {uploadingAvatar ? "Uploading..." : "Change Avatar"}
                  </button>
                  {avatarError && <p className="text-red-500 text-xs">{avatarError}</p>}
                  {avatarSuccess && <p className="text-green-600 text-xs">{avatarSuccess}</p>}
                  <p className="text-xs text-gray-500 dark:text-gray-400">JPG, PNG up to 2MB</p>
                </div>

                {/* Info form */}
                <div className="flex-1">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                    {isEditingName ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                          autoFocus
                        />
                        <button onClick={handleUpdateName} className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition">Save</button>
                        <button onClick={() => { setIsEditingName(false); setNewName(user.name); }} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl hover:bg-gray-300 transition">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                        <span className="text-lg font-medium text-gray-900 dark:text-white">{user.name}</span>
                        <button onClick={() => setIsEditingName(true)} className="text-indigo-600 hover:text-indigo-700 transition">
                          <Edit2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
                      <span className="text-gray-900 dark:text-white">{user.email}</span>
                      <span className="text-xs text-gray-500">(change via Security tab)</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account type</label>
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-xs font-medium">Free</span>
                      <span className="text-gray-500 text-xs">Upgrade to Pro</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Change Password Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
                    <KeyRound className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Change Password</h2>
                </div>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Current Password</label>
                    <input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 transition"
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                      placeholder="Minimum 4 characters"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                      placeholder="••••••••"
                    />
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl text-sm">
                      <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                  )}
                  {success && (
                    <div className="flex items-center gap-2 text-green-600 bg-green-50 dark:bg-green-900/20 p-3 rounded-xl text-sm">
                      <CheckCircle2 className="w-4 h-4" /> {success}
                    </div>
                  )}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50"
                  >
                    {loading ? "Changing..." : "Update Password"}
                  </button>
                </form>
              </div>

              {/* Change Email Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
                    <Mail className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Change Email</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Email Address</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      disabled={emailOtpSent}
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                      placeholder="you@example.com"
                    />
                  </div>
                  {!emailOtpSent ? (
                    <button
                      onClick={handleSendEmailOtp}
                      disabled={emailChangeLoading}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition"
                    >
                      {emailChangeLoading ? "Sending..." : "Send OTP"}
                    </button>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Enter OTP</label>
                        <input
                          type="text"
                          value={emailOtp}
                          onChange={(e) => setEmailOtp(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700"
                          placeholder="6-digit code"
                          maxLength={6}
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={handleVerifyEmailChange}
                          disabled={emailChangeLoading}
                          className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl transition"
                        >
                          {emailChangeLoading ? "Verifying..." : "Verify & Change"}
                        </button>
                        <button
                          onClick={() => { setEmailOtpSent(false); setNewEmail(""); setEmailOtp(""); }}
                          className="flex-1 py-2.5 bg-gray-200 dark:bg-gray-700 text-gray-800 rounded-xl hover:bg-gray-300 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                  {emailChangeError && <div className="text-red-600 bg-red-50 p-2 rounded-xl text-sm">{emailChangeError}</div>}
                  {emailChangeSuccess && <div className="text-green-600 bg-green-50 p-2 rounded-xl text-sm">{emailChangeSuccess}</div>}
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl">
                  <Monitor className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Appearance</h2>
              </div>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <span className="text-gray-700 dark:text-gray-300">Theme mode</span>
                  <div className="flex gap-3">
                    {[
                      { value: "light", icon: Sun, label: "Light" },
                      { value: "dark", icon: Moon, label: "Dark" },
                      { value: "system", icon: Monitor, label: "System" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setTheme(opt.value)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                          theme === opt.value
                            ? "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 shadow-md"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        <opt.icon className="w-4 h-4" />
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button className="text-red-600 hover:text-red-700 transition flex items-center gap-2 text-sm">
                    <Trash2 className="w-4 h-4" />
                    Delete account (coming soon)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}