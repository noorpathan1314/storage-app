// src/components/FolderTreeModal.jsx
import { useState, useEffect } from "react";
import { Folder, ChevronRight, ChevronDown, X } from "lucide-react";

const BASE_URL = "http://localhost:4000";

function FolderTreeModal({ onClose, onConfirm, excludeId, currentDirId }) {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFolderId, setSelectedFolderId] = useState(null);
  const [expandedFolders, setExpandedFolders] = useState({});

  // Fetch all folders for the user
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await fetch(`${BASE_URL}/directory/all`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch folders");
        const data = await response.json();
        // Build tree structure
        const foldersMap = new Map();
        const rootFolders = [];
        data.forEach((folder) => {
          foldersMap.set(folder._id, { ...folder, children: [] });
        });
        data.forEach((folder) => {
          if (folder.parentDirId === null) {
            rootFolders.push(foldersMap.get(folder._id));
          } else {
            const parent = foldersMap.get(folder.parentDirId);
            if (parent) parent.children.push(foldersMap.get(folder._id));
          }
        });
        setFolders(rootFolders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, []);

  const toggleExpand = (folderId) => {
    setExpandedFolders((prev) => ({ ...prev, [folderId]: !prev[folderId] }));
  };

  const renderFolderTree = (folderList, level = 0) => {
    return folderList.map((folder) => {
      const isExpanded = expandedFolders[folder._id];
      const isDisabled = folder._id === excludeId || folder._id === currentDirId; // cannot copy/move to itself or current folder
      return (
        <div key={folder._id} style={{ marginLeft: level * 20 }}>
          <div
            className={`flex items-center py-1 px-2 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
              selectedFolderId === folder._id ? "bg-indigo-50 dark:bg-indigo-900/30" : ""
            } ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !isDisabled && setSelectedFolderId(folder._id)}
          >
            {folder.children.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(folder._id);
                }}
                className="mr-1"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            )}
            {folder.children.length === 0 && <div className="w-5" />}
            <Folder className="w-4 h-4 mr-2 text-yellow-500" />
            <span className="text-sm">{folder.name}</span>
          </div>
          {isExpanded && folder.children.length > 0 && (
            <div>{renderFolderTree(folder.children, level + 1)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold">Select Destination Folder</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 max-h-96 overflow-auto">
          {loading ? (
            <p className="text-center">Loading folders...</p>
          ) : folders.length === 0 ? (
            <p className="text-center text-gray-500">No folders found</p>
          ) : (
            renderFolderTree(folders)
          )}
        </div>
        <div className="flex justify-end gap-3 p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedFolderId && onConfirm(selectedFolderId)}
            disabled={!selectedFolderId}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition ${
              selectedFolderId
                ? "bg-indigo-600 hover:bg-indigo-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default FolderTreeModal;