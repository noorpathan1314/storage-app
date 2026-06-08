import { useState, useEffect } from "react";
import { Folder, Star, Trash2, Settings, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  const navItems = [
    { to: "/dashboard", label: "My Drive", icon: <Folder className="w-5 h-5" />, end: true },
    { to: "/starred", label: "Starred", icon: <Star className="w-5 h-5" />, end: false },
    { to: "/trash", label: "Trash", icon: <Trash2 className="w-5 h-5" />, end: false },
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        onClose();
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50 w-64 h-full bg-white dark:bg-gray-800 
          border-r border-gray-200 dark:border-gray-700 flex flex-col transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 md:hidden">
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            Storage App
          </h1>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="hidden md:block p-4 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            Storage App
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer – Settings Link */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <NavLink
            to="/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition ${
                isActive
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`
            }
          >
            <Settings className="w-5 h-5" />
            <span>Settings</span>
          </NavLink>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;