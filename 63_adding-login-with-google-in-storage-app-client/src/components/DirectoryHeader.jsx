// components/DirectoryHeader.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FolderPlus,
  Upload,
  User,
  LogOut,
  LogIn,
  Menu,
  Search,
  Settings,
  ChevronDown,
  Shield,
} from "lucide-react";

function DirectoryHeader({
  directoryName,
  onCreateFolderClick,
  onUploadFilesClick,
  fileInputRef,
  handleFileSelect,
  disabled = false,
  onMenuClick,
  onSearch,
  searchTerm = "",
  breadcrumb = [],
}) {
  // ✅ Use environment variable for backend URL
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("Guest");
  const [userEmail, setUserEmail] = useState("");
  const [userPicture, setUserPicture] = useState("");

  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${BASE_URL}/user`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUserName(data.name);
          setUserEmail(data.email);
          setUserPicture(data.picture);
          setLoggedIn(true);
        } else {
          setLoggedIn(false);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchUser();
  }, [BASE_URL]);

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/user/logout`, { method: "POST", credentials: "include" });
      setLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
    setShowUserMenu(false);
  };

  const handleLogoutAll = async () => {
    try {
      await fetch(`${BASE_URL}/user/logout-all`, { method: "POST", credentials: "include" });
      setLoggedIn(false);
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
    setShowUserMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleBreadcrumbClick = (id) => {
    if (id === null) navigate("/dashboard");
    else navigate(`/dashboard/directory/${id}`);
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-800/50 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 sm:px-6 lg:px-8">
        {/* Left section */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1 text-sm font-medium">
            {breadcrumb.length > 0 ? (
              breadcrumb.map((item, idx) => (
                <div key={item.id ?? "root"} className="flex items-center">
                  {idx > 0 && <span className="text-gray-400 mx-1">/</span>}
                  <button
                    onClick={() => handleBreadcrumbClick(item.id)}
                    className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
                  >
                    {item.name}
                  </button>
                </div>
              ))
            ) : (
              <h1 className="text-gray-800 dark:text-gray-100 font-semibold truncate">
                {directoryName}
              </h1>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-md px-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-500 transition" />
            <input
              type="text"
              placeholder="Search files and folders..."
              value={searchTerm}
              onChange={(e) => onSearch?.(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onCreateFolderClick}
            disabled={disabled}
            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition disabled:opacity-50"
            title="New Folder"
          >
            <FolderPlus className="w-5 h-5" />
          </button>
          <button
            onClick={onUploadFilesClick}
            disabled={disabled}
            className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 transition disabled:opacity-50"
            title="Upload Files"
          >
            <Upload className="w-5 h-5" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />

          {/* User dropdown - advanced */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-1 p-1 rounded-full hover:ring-2 hover:ring-indigo-400/50 transition"
            >
              {userPicture ? (
                <img
                  src={userPicture}
                  alt={userName}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-white dark:ring-gray-800 shadow-sm"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
                  {loggedIn ? getInitials(userName) : <User className="w-4 h-4" />}
                </div>
              )}
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${showUserMenu ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown panel */}
            {showUserMenu && (
              <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden animate-fadeInDown z-30">
                {loggedIn ? (
                  <>
                    {/* Header with user info */}
                    <div className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-b border-gray-100 dark:border-gray-700">
                      <div className="flex items-center gap-4">
                        {userPicture ? (
                          <img
                            src={userPicture}
                            alt={userName}
                            className="w-14 h-14 rounded-full object-cover ring-4 ring-white dark:ring-gray-800 shadow-md"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-md">
                            {getInitials(userName)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-base font-bold text-gray-900 dark:text-white truncate">
                            {userName}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate flex items-center gap-1 mt-0.5">
                            <Shield className="w-3 h-3" />
                            {userEmail}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu items */}
                    <div className="py-2">
                      <Link
                        to="/settings"
                        className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="w-4 h-4 text-gray-500" />
                        Account Settings
                      </Link>
                      <div className="my-1 border-t border-gray-100 dark:border-gray-700 mx-3"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition group"
                      >
                        <LogOut className="w-4 h-4 transition group-hover:scale-110" />
                        Logout (this device)
                      </button>
                      <button
                        onClick={handleLogoutAll}
                        className="w-full flex items-center gap-3 px-5 py-3 text-sm text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition group"
                      >
                        <LogOut className="w-4 h-4 transition group-hover:scale-110" />
                        Logout All Devices
                      </button>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      navigate("/login");
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-5 py-4 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                  >
                    <LogIn className="w-4 h-4 text-indigo-500" />
                    Sign In to your account
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-15px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInDown {
          animation: fadeInDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </header>
  );
}

export default DirectoryHeader;