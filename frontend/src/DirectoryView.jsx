import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Menu, Upload } from "lucide-react";
import DirectoryHeader from "./components/DirectoryHeader";
import CreateDirectoryModal from "./components/CreateDirectoryModal";
import RenameModal from "./components/RenameModal";
import DirectoryList from "./components/DirectoryList";
import Sidebar from "./components/Sidebar";
import FolderTreeModal from "./components/FolderTreeModal";

function DirectoryView() {
  // ✅ Use environment variable for backend URL
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";
  const { dirId } = useParams();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [directoryName, setDirectoryName] = useState("My Drive");
  const [breadcrumb, setBreadcrumb] = useState([]);
  const [directoriesList, setDirectoriesList] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState({ directories: [], files: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showCreateDirModal, setShowCreateDirModal] = useState(false);
  const [showRenameModal, setShowRenameModal] = useState(false);
  const [renameType, setRenameType] = useState(null);
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [copyMoveItem, setCopyMoveItem] = useState(null);
  const [copyMoveAction, setCopyMoveAction] = useState(null);
  const fileInputRef = useRef(null);
  const [uploadQueue, setUploadQueue] = useState([]);
  const [uploadXhrMap, setUploadXhrMap] = useState({});
  const [progressMap, setProgressMap] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [activeContextMenu, setActiveContextMenu] = useState(null);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });

  const fetchBreadcrumb = useCallback(async () => {
    try {
      const url = dirId ? `/directory/breadcrumb/${dirId}` : "/directory/breadcrumb";
      const response = await fetch(`${BASE_URL}${url}`, { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch breadcrumb");
      const data = await response.json();
      setBreadcrumb(data);
    } catch (err) {
      console.error("Breadcrumb error:", err);
      setBreadcrumb([{ id: null, name: directoryName }]);
    }
  }, [dirId, directoryName, BASE_URL]);

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchTerm.trim().length > 0) {
        setIsSearching(true);
        try {
          const response = await fetch(`${BASE_URL}/api/search?q=${encodeURIComponent(searchTerm)}`, { credentials: "include" });
          if (response.status === 401) {
            navigate("/login");
            return;
          }
          if (!response.ok) throw new Error("Search failed");
          const data = await response.json();
          setSearchResults({ directories: data.directories || [], files: data.files || [] });
        } catch (err) {
          console.error(err);
          setErrorMessage("Search failed. Please try again.");
        }
      } else {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, navigate, BASE_URL]);

  async function handleFetchErrors(response) {
    if (!response.ok) {
      let errMsg = `Request failed with status ${response.status}`;
      try {
        const data = await response.json();
        if (data.error) errMsg = data.error;
      } catch (_) {}
      throw new Error(errMsg);
    }
    return response;
  }

  async function getDirectoryItems() {
    setErrorMessage("");
    try {
      const response = await fetch(`${BASE_URL}/directory/${dirId || ""}`, { credentials: "include" });
      if (response.status === 401) {
        navigate("/login");
        return;
      }
      await handleFetchErrors(response);
      const data = await response.json();
      setDirectoryName(dirId ? data.name : "My Drive");
      setDirectoriesList([...data.directories].reverse());
      setFilesList([...data.files].reverse());
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  useEffect(() => {
    if (!isSearching) {
      getDirectoryItems();
      fetchBreadcrumb();
      setActiveContextMenu(null);
    }
  }, [dirId, isSearching, fetchBreadcrumb]);

  function getFileIcon(filename) {
    const ext = filename.split(".").pop().toLowerCase();
    switch (ext) {
      case "pdf": return "pdf";
      case "png": case "jpg": case "jpeg": case "gif": return "image";
      case "mp4": case "mov": case "avi": return "video";
      case "zip": case "rar": case "tar": case "gz": return "archive";
      case "js": case "jsx": case "ts": case "tsx": case "html": case "css": case "py": case "java": return "code";
      default: return "alt";
    }
  }

  function handleRowClick(type, id) {
    if (type === "directory") {
      navigate(`/dashboard/directory/${id}`);
    } else {
      window.location.href = `${BASE_URL}/file/${id}`;
    }
  }

  // ✅ UPDATED: use FormData for file upload
  const addFilesToUploadQueue = (filesArray) => {
    if (filesArray.length === 0) return;

    const newItems = filesArray.map((file) => ({
      file,
      name: file.name,
      id: `temp-${Date.now()}-${Math.random()}`,
      isUploading: false,
    }));

    setFilesList((prev) => [...newItems, ...prev]);
    newItems.forEach((item) => {
      setProgressMap((prev) => ({ ...prev, [item.id]: 0 }));
    });
    setUploadQueue((prev) => [...prev, ...newItems]);

    if (!isUploading) {
      setIsUploading(true);
      processUploadQueue([...uploadQueue, ...newItems]);
    }
  };

  // ✅ UPDATED: use FormData with XHR for progress tracking
  function processUploadQueue(queue) {
    if (queue.length === 0) {
      setIsUploading(false);
      setUploadQueue([]);
      setTimeout(() => getDirectoryItems(), 1000);
      return;
    }

    const [currentItem, ...restQueue] = queue;

    setFilesList((prev) =>
      prev.map((f) => (f.id === currentItem.id ? { ...f, isUploading: true } : f))
    );

    const formData = new FormData();
    formData.append("file", currentItem.file); // field name must be "file"

    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${BASE_URL}/file/${dirId || ""}`, true);
    xhr.withCredentials = true;
    xhr.setRequestHeader("filename", currentItem.name); // custom header

    xhr.upload.addEventListener("progress", (evt) => {
      if (evt.lengthComputable) {
        const progress = (evt.loaded / evt.total) * 100;
        setProgressMap((prev) => ({ ...prev, [currentItem.id]: progress }));
      }
    });

    xhr.addEventListener("load", () => {
      processUploadQueue(restQueue);
    });

    xhr.addEventListener("error", () => {
      // Remove failed item from list
      setFilesList((prev) => prev.filter((f) => f.id !== currentItem.id));
      setProgressMap((prev) => {
        const { [currentItem.id]: _, ...rest } = prev;
        return rest;
      });
      processUploadQueue(restQueue);
    });

    setUploadXhrMap((prev) => ({ ...prev, [currentItem.id]: xhr }));
    xhr.send(formData);
  }

  function handleCancelUpload(tempId) {
    const xhr = uploadXhrMap[tempId];
    if (xhr) xhr.abort();
    setUploadQueue((prev) => prev.filter((item) => item.id !== tempId));
    setFilesList((prev) => prev.filter((f) => f.id !== tempId));
    setProgressMap((prev) => {
      const { [tempId]: _, ...rest } = prev;
      return rest;
    });
    setUploadXhrMap((prev) => {
      const copy = { ...prev };
      delete copy[tempId];
      return copy;
    });
  }

  async function handleDeleteFile(id) {
    setErrorMessage("");
    try {
      const response = await fetch(`${BASE_URL}/file/${id}`, { method: "DELETE", credentials: "include" });
      await handleFetchErrors(response);
      getDirectoryItems();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleDeleteDirectory(id) {
    setErrorMessage("");
    try {
      const response = await fetch(`${BASE_URL}/directory/${id}`, { method: "DELETE", credentials: "include" });
      await handleFetchErrors(response);
      getDirectoryItems();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  async function handleCreateDirectory(folderName) {
    setErrorMessage("");
    try {
      const response = await fetch(`${BASE_URL}/directory/${dirId || ""}`, {
        method: "POST",
        headers: { dirname: folderName },
        credentials: "include",
      });
      await handleFetchErrors(response);
      setShowCreateDirModal(false);
      getDirectoryItems();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  function openRenameModal(type, id, currentName) {
    setRenameType(type);
    setRenameId(id);
    setRenameValue(currentName);
    setShowRenameModal(true);
  }

  async function handleRenameSubmit(newName) {
    setErrorMessage("");
    try {
      const url = renameType === "file" ? `${BASE_URL}/file/${renameId}` : `${BASE_URL}/directory/${renameId}`;
      const response = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(renameType === "file" ? { newFilename: newName } : { newDirName: newName }),
        credentials: "include",
      });
      await handleFetchErrors(response);
      setShowRenameModal(false);
      setRenameValue("");
      setRenameType(null);
      setRenameId(null);
      getDirectoryItems();
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  function handleContextMenu(e, id) {
    e.stopPropagation();
    e.preventDefault();
    const clickX = e.clientX;
    const clickY = e.clientY;
    if (activeContextMenu === id) {
      setActiveContextMenu(null);
    } else {
      setActiveContextMenu(id);
      setContextMenuPos({ x: clickX - 110, y: clickY });
    }
  }

  useEffect(() => {
    function handleDocumentClick() {
      setActiveContextMenu(null);
    }
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    addFilesToUploadQueue(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  });

  const onCopy = (item) => {
    setCopyMoveItem(item);
    setCopyMoveAction("copy");
    setShowFolderModal(true);
  };

  const onMove = (item) => {
    setCopyMoveItem(item);
    setCopyMoveAction("move");
    setShowFolderModal(true);
  };

  const handleCopyMoveConfirm = async (destinationDirId) => {
    if (!copyMoveItem || !copyMoveAction) return;
    const url = copyMoveItem.isDirectory
      ? `${BASE_URL}/directory/${copyMoveAction}`
      : `${BASE_URL}/file/${copyMoveAction}`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: copyMoveItem.id, destinationDirId }),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Operation failed");
      }
      getDirectoryItems();
      setShowFolderModal(false);
      setCopyMoveItem(null);
      setCopyMoveAction(null);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message);
    }
  };

  const combinedItems = isSearching
    ? [
        ...searchResults.directories.map((d) => ({ ...d, isDirectory: true })),
        ...searchResults.files.map((f) => ({ ...f, isDirectory: false })),
      ]
    : [
        ...directoriesList.map((d) => ({ ...d, isDirectory: true })),
        ...filesList.map((f) => ({ ...f, isDirectory: false })),
      ];

  const isAccessError = errorMessage === "Directory not found or you do not have access to it!";

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DirectoryHeader
          directoryName={directoryName}
          onCreateFolderClick={() => setShowCreateDirModal(true)}
          onUploadFilesClick={() => fileInputRef.current.click()}
          fileInputRef={fileInputRef}
          handleFileSelect={(e) => {
            const selectedFiles = Array.from(e.target.files);
            if (selectedFiles.length === 0) return;
            addFilesToUploadQueue(selectedFiles);
            e.target.value = "";
          }}
          disabled={isAccessError}
          onMenuClick={() => setSidebarOpen(true)}
          onSearch={setSearchTerm}
          searchTerm={searchTerm}
          breadcrumb={breadcrumb}
        />

        <main
          {...getRootProps({
            className: `flex-1 overflow-auto p-4 relative ${
              isDragActive ? "bg-indigo-50/50 dark:bg-indigo-900/20" : ""
            }`,
          })}
        >
          <input {...getInputProps()} />
          {isDragActive && (
            <div className="absolute inset-0 flex items-center justify-center bg-indigo-500/10 backdrop-blur-sm z-10 pointer-events-none">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 text-center">
                <Upload className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
                <p className="text-lg font-semibold text-gray-800 dark:text-white">
                  Drop files here to upload
                </p>
              </div>
            </div>
          )}

          {errorMessage && !isAccessError && (
            <div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded shadow-sm">
              <p className="font-medium">Error</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
          )}

          {showCreateDirModal && (
            <CreateDirectoryModal
              onClose={() => setShowCreateDirModal(false)}
              onCreateDirectory={handleCreateDirectory}
            />
          )}

          {showRenameModal && (
            <RenameModal
              renameType={renameType}
              initialName={renameValue}
              onClose={() => setShowRenameModal(false)}
              onRenameSubmit={handleRenameSubmit}
            />
          )}

          {showFolderModal && (
            <FolderTreeModal
              onClose={() => setShowFolderModal(false)}
              onConfirm={handleCopyMoveConfirm}
              excludeId={copyMoveItem?.id}
              currentDirId={dirId}
            />
          )}

          {combinedItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 mb-4 text-gray-400 dark:text-gray-600">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                {isSearching
                  ? "No results found"
                  : isAccessError
                  ? "Access Denied"
                  : "This folder is empty"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {isSearching
                  ? `No items match "${searchTerm}"`
                  : isAccessError
                  ? "You don't have permission to view this folder."
                  : "Upload files or create a folder to see some data."}
              </p>
            </div>
          ) : (
            <DirectoryList
              items={combinedItems}
              handleRowClick={handleRowClick}
              activeContextMenu={activeContextMenu}
              contextMenuPos={contextMenuPos}
              handleContextMenu={handleContextMenu}
              getFileIcon={getFileIcon}
              isUploading={isUploading}
              progressMap={progressMap}
              handleCancelUpload={handleCancelUpload}
              handleDeleteFile={handleDeleteFile}
              handleDeleteDirectory={handleDeleteDirectory}
              openRenameModal={openRenameModal}
              BASE_URL={BASE_URL}
              onCopy={onCopy}
              onMove={onMove}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default DirectoryView;