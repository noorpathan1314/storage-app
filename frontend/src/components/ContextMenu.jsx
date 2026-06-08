function ContextMenu({
  item,
  contextMenuPos,
  isUploadingItem,
  handleCancelUpload,
  handleDeleteFile,
  handleDeleteDirectory,
  openRenameModal,
  BASE_URL,
  onCopy,      // new prop – function to call for copy
  onMove,      // new prop – function to call for move
}) {
  // Common copy/move buttons (used for both file and directory)
  const copyMoveButtons = (
    <>
      <button
        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        onClick={() => onCopy?.(item)}
      >
        Copy
      </button>
      <button
        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        onClick={() => onMove?.(item)}
      >
        Move
      </button>
    </>
  );

  // Directory context menu
  if (item.isDirectory) {
    return (
      <div
        className="fixed z-50 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[160px]"
        style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
      >
        {copyMoveButtons}
        <button
          className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          onClick={() => openRenameModal("directory", item.id, item.name)}
        >
          Rename
        </button>
        <button
          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          onClick={() => handleDeleteDirectory(item.id)}
        >
          Delete
        </button>
      </div>
    );
  } else {
    // File context menu
    if (isUploadingItem && item.isUploading) {
      // Only show "Cancel"
      return (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[160px]"
          style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
        >
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={() => handleCancelUpload(item.id)}
          >
            Cancel Upload
          </button>
        </div>
      );
    } else {
      // Normal file
      return (
        <div
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 py-1 min-w-[160px]"
          style={{ top: contextMenuPos.y, left: contextMenuPos.x }}
        >
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={() =>
              (window.location.href = `${BASE_URL}/file/${item.id}?action=download`)
            }
          >
            Download
          </button>
          {copyMoveButtons}
          <button
            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={() => openRenameModal("file", item.id, item.name)}
          >
            Rename
          </button>
          <button
            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            onClick={() => handleDeleteFile(item.id)}
          >
            Delete
          </button>
        </div>
      );
    }
  }
}

export default ContextMenu;