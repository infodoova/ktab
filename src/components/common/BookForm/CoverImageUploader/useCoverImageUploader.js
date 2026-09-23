import { useRef, useState, useMemo, useEffect, useCallback } from "react";

/**
 * Custom hook encapsulating cover image uploader state, object URL lifecycle, and drag events.
 *
 * @param {Object} params
 * @param {File|null} params.coverFile
 * @param {string|null} params.coverUrl
 * @param {(file: File|null) => void} params.onFileChange
 * @param {() => void} params.onRemoveFile
 */
export function useCoverImageUploader({
  coverFile,
  coverUrl,
  onFileChange,
  onRemoveFile,
}) {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Generate preview URL safely
  const previewSrc = useMemo(() => {
    if (coverFile) {
      return URL.createObjectURL(coverFile);
    }
    return coverUrl || null;
  }, [coverFile, coverUrl]);

  // Clean up object URL when changed or unmounted to prevent browser memory leaks
  useEffect(() => {
    return () => {
      if (previewSrc && previewSrc.startsWith("blob:")) {
        URL.revokeObjectURL(previewSrc);
      }
    };
  }, [previewSrc]);

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
    previewSrc,
    handleSelect,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemove,
    handleClick,
    handleKeyDown,
  };
}

export default useCoverImageUploader;
