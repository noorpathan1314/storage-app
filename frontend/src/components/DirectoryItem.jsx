import { Folder, File, FileText, FileImage, FileVideo, Archive, Code, MoreVertical } from "lucide-react";
import ContextMenu from "./ContextMenu";

function DirectoryItem({
  item,
  handleRowClick,
  activeContextMenu,
  contextMenuPos,
  handleContextMenu,
  getFileIcon,
  isUploading,
  uploadProgress,
  handleCancelUpload,
  handleDeleteFile,
  handleDeleteDirectory,
  openRenameModal,
  BASE_URL,
  onCopy,    // new
  onMove,    // new
}) {
  // Convert file icon type to Lucide component
  function renderFileIcon(iconType) {
    switch (iconType) {
      case "pdf": return <FileText className="w-5 h-5 text-red-500" />;
      case "image": return <FileImage className="w-5 h-5 text-green-500" />;
      case "video": return <FileVideo className="w-5 h-5 text-purple-500" />;
      case "archive": return <Archive className="w-5 h-5 text-yellow-600" />;
      case "code": return <Code className="w-5 h-5 text-blue-500" />;
      default: return <File className="w-5 h-5 text-gray-500" />;
    }
  }

  const isUploadingItem = item.id?.startsWith("temp-");

  return (
    <div
      className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
      onClick={() =>
        !(activeContextMenu || isUploading)
          ? handleRowClick(item.isDirectory ? "directory" : "file", item.id)
          : null
      }
      onContextMenu={(e) => handleContextMenu(e, item.id)}
    >
      <div className="p-3 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          {/* Icon */}
          <div className="flex-shrink-0">
            {item.isDirectory ? (
              <Folder className="w-6 h-6 text-yellow-500" />
            ) : (
              renderFileIcon(getFileIcon(item.name))
            )}
          </div>

          {/* Name */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {item.name}
            </p>
            {isUploadingItem && uploadProgress !== undefined && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {Math.floor(uploadProgress)}% uploaded
              </p>
            )}
          </div>

          {/* Three-dots context menu trigger */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleContextMenu(e, item.id);
            }}
            className="p-1 rounded-md opacity-0 group-hover:opacity-100 transition focus:opacity-100 hover:bg-gray-100 dark:hover:bg-gray-700"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Progress bar for uploading items */}
      {isUploadingItem && uploadProgress !== undefined && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
          <div
            className="h-full transition-all duration-200"
            style={{
              width: `${uploadProgress}%`,
              backgroundColor: uploadProgress === 100 ? "#10b981" : "#3b82f6",
            }}
          />
        </div>
      )}

      {/* Context Menu */}
      {activeContextMenu === item.id && (
        <ContextMenu
          item={item}
          contextMenuPos={contextMenuPos}
          isUploadingItem={isUploadingItem}
          handleCancelUpload={handleCancelUpload}
          handleDeleteFile={handleDeleteFile}
          handleDeleteDirectory={handleDeleteDirectory}
          openRenameModal={openRenameModal}
          BASE_URL={BASE_URL}
          onCopy={onCopy}
          onMove={onMove}
        />
      )}
    </div>
  );
}

export default DirectoryItem;