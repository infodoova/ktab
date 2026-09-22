import { useRef, useState, useCallback } from "react";

/**
 * Encapsulates file input referencing, drag-and-drop state, and keyboard trigger logic.
 *
 * @param {Object} params
 * @param {(file: File | null) => void} params.onCoverSelect
 */
export function useStoryCoverUploader({ onCoverSelect }) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);
      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        onCoverSelect(files[0]);
      }
    },
    [onCoverSelect]
  );

  const handleFileChange = useCallback(
    (e) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onCoverSelect(files[0]);
      }
      // Reset input value so selecting the same file again triggers onChange
      if (e.target) {
        e.target.value = "";
      }
    },
    [onCoverSelect]
  );

  const handleRemoveCover = useCallback(
    (e) => {
      e.stopPropagation();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onCoverSelect(null);
    },
    [onCoverSelect]
  );

  const handleTriggerClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleTriggerClick();
      }
    },
    [handleTriggerClick]
  );

  return {
    fileInputRef,
    isDragOver,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    handleRemoveCover,
    handleTriggerClick,
    handleKeyDown,
  };
}

export default useStoryCoverUploader;
