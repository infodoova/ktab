import { useRef, useState, useCallback, useMemo } from "react";

/**
 * Custom hook encapsulating PDF/Word document uploader DOM interactions and events.
 *
 * @param {Object} params
 * @param {File|null} params.pdfFile
 * @param {string|null} params.existingPdfName
 * @param {(file: File|null) => void} params.onFileChange
 * @param {() => void} params.onRemoveFile
 */
export function usePdfUploadZone({
  pdfFile,
  existingPdfName,
  onFileChange,
  onRemoveFile,
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const displayName = pdfFile?.name || existingPdfName || "";

  const isWordDoc = useMemo(() => {
    const lower = displayName.toLowerCase();
    return lower.endsWith(".docx") || lower.endsWith(".doc");
  }, [displayName]);

  const fileSizeMB = useMemo(() => {
    return pdfFile?.size ? (pdfFile.size / (1024 * 1024)).toFixed(1) : null;
  }, [pdfFile?.size]);

  const handleSelect = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (file) {
        onFileChange(file);
      }
      e.target.value = "";
    },
    [onFileChange]
  );

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
        onFileChange(files[0]);
      }
    },
    [onFileChange]
  );

  const handleRemove = useCallback(
    (e) => {
      e.stopPropagation();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      onRemoveFile?.();
    },
    [onRemoveFile]
  );

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return {
    fileInputRef,
    isDragOver,
    displayName,
    isWordDoc,
    fileSizeMB,
    handleSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemove,
    handleClick,
    handleKeyDown,
  };
}

export default usePdfUploadZone;
