import { useEffect, useRef, useState } from "react";

function RenameModal({
  renameType,
  initialName,
  onClose,
  onRenameSubmit,
}) {
  const [newName, setNewName] = useState(initialName);
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      if (renameType === "file") {
        const dotIndex = newName.lastIndexOf(".");
        if (dotIndex > 0) {
          inputRef.current.setSelectionRange(0, dotIndex);
        } else {
          inputRef.current.select();
        }
      } else {
        inputRef.current.select();
      }
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [renameType, newName, onClose]); // ✅ No initialName dependency

  const handleSubmit = (e) => {
    e.preventDefault();
    onRenameSubmit(newName);
  };

  const handleChange = (e) => {
    setNewName(e.target.value);
  };

  const handleContentClick = (e) => e.stopPropagation();
  const handleOverlayClick = () => onClose();

  const title = renameType === "file" ? "Rename File" : "Rename Folder";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        onClick={handleContentClick}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {title}
          </h2>
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white transition"
              placeholder="Enter new name"
              value={newName}
              onChange={handleChange}
              autoComplete="off"
            />
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition shadow-sm"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RenameModal;