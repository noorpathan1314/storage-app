// src/pages/Trash.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, RotateCcw, File, Folder, AlertTriangle, X } from "lucide-react";

const BASE_URL = "http://localhost:4000";

export default function Trash() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(null);
  const navigate = useNavigate();

  const fetchTrashedItems = async () => {
    try {
      const [filesRes, dirsRes] = await Promise.all([
        fetch(`${BASE_URL}/file/trash`, { credentials: "include" }),
        fetch(`${BASE_URL}/directory/trash`, { credentials: "include" }),
      ]);
      if (!filesRes.ok || !dirsRes.ok) throw new Error("Failed to fetch trash");

      const files = await filesRes.json();
      const dirs = await dirsRes.json();

      const combined = [
        ...files.map((f) => ({ ...f, type: "file" })),
        ...dirs.map((d) => ({ ...d, type: "directory" })),
      ];
      setItems(combined);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrashedItems();
  }, []);

  const handleRestore = async (item) => {
    try {
      const url =
        item.type === "file"
          ? `${BASE_URL}/file/restore/${item._id}`
          : `${BASE_URL}/directory/restore/${item._id}`;
      const res = await fetch(url, { method: "PATCH", credentials: "include" });
      if (!res.ok) throw new Error("Restore failed");
      fetchTrashedItems();
    } catch (err) {
      alert(err.message);
    }
  };

  const handlePermanentDelete = async (item) => {
    try {
      const url =
        item.type === "file"
          ? `${BASE_URL}/file/permanent/${item._id}`
          : `${BASE_URL}/directory/permanent/${item._id}`;
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Deletion failed");
      fetchTrashedItems();
    } catch (err) {
      alert(err.message);
    }
    setShowConfirm(null);
  };

  const confirmAction = (item, action) => {
    setShowConfirm({ item, action });
  };

  // Loading Skeleton
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 w-64 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mt-2"></div>
          </div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="flex-1">
                    <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded mt-2"></div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-4 shadow-xl">
          <div className="w-16 h-16 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Something went wrong</h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <button
            onClick={fetchTrashedItems}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with gradient accent */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent flex items-center gap-2">
              <Trash2 className="w-8 h-8 text-red-500" />
              Trash
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Items deleted in the last 30 days. Restore them or permanently delete.
            </p>
          </div>
          {items.length > 0 && (
            <div className="text-sm text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
              {items.length} item{items.length !== 1 && 's'} in trash
            </div>
          )}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative">
              <div className="w-32 h-32 mb-6 text-gray-300 dark:text-gray-700">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-transparent to-gray-100 dark:to-gray-800 opacity-50 blur-xl"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Trash is empty</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1 max-w-sm">
              Deleted files and folders will appear here. They stay for 30 days before permanent deletion.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
            >
              Go to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={item._id}
                className="group bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 overflow-hidden animate-fadeInUp"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {item.type === "directory" ? (
                        <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                          <Folder className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <File className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-medium text-gray-900 dark:text-white truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-400"></span>
                        Deleted: {new Date(item.deletedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <button
                      onClick={() => confirmAction(item, "restore")}
                      className="p-2 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition transform hover:scale-105"
                      title="Restore"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => confirmAction(item, "delete")}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition transform hover:scale-105"
                      title="Permanently Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modern Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-scaleIn">
            <div className={`p-6 ${showConfirm.action === "restore" ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20" : "bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20"}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {showConfirm.action === "restore" ? "Restore Item" : "Permanently Delete"}
                </h3>
                <button
                  onClick={() => setShowConfirm(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {showConfirm.action === "restore"
                  ? `Are you sure you want to restore "${showConfirm.item.name}"? It will reappear in your dashboard.`
                  : `Are you sure you want to permanently delete "${showConfirm.item.name}"? This action cannot be undone.`}
              </p>
            </div>
            <div className="flex justify-end gap-3 p-6 bg-gray-50 dark:bg-gray-900/50">
              <button
                onClick={() => setShowConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  showConfirm.action === "restore"
                    ? handleRestore(showConfirm.item)
                    : handlePermanentDelete(showConfirm.item)
                }
                className={`px-4 py-2 text-sm font-medium rounded-lg transition shadow-sm hover:shadow ${
                  showConfirm.action === "restore"
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-red-600 text-white hover:bg-red-700"
                }`}
              >
                {showConfirm.action === "restore" ? "Restore" : "Delete Permanently"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}