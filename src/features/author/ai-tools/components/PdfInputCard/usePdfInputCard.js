import { useState, useRef, useCallback } from "react";
import { AlertToast } from "@/components/myui/AlertToast";
import {
  AUDIENCE_OPTIONS,
  WORD_COUNT_CONFIG,
  MAX_PDF_SIZE_BYTES,
} from "../../constants/aiToolsConstants";

/**
 * Custom hook encapsulating PDF upload, drag-and-drop validation,
 * word count slider, and audience selection state for the AI tools panel.
 */
export function usePdfInputCard({ onGenerate, loading = false }) {
  const [file, setFile] = useState(null);
  const [wordCount, setWordCount] = useState(WORD_COUNT_CONFIG.DEFAULT);
  const [audience, setAudience] = useState(AUDIENCE_OPTIONS[0].value);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef(null);

  const validateAndSetPdf = useCallback((selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf" && !selectedFile.name.toLowerCase().endsWith(".pdf")) {
      AlertToast("يرجى اختيار ملف بصيغة PDF فقط.", "ERROR");
      return;
    }

    if (selectedFile.size > MAX_PDF_SIZE_BYTES) {
      AlertToast("الحد الأقصى لحجم الملف هو 20MB.", "ERROR");
      return;
    }

    setFile(selectedFile);
  }, []);

  const handleFileChange = useCallback((e) => {
    const selected = e.target.files?.[0];
    validateAndSetPdf(selected);
  }, [validateAndSetPdf]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    validateAndSetPdf(droppedFile);
  }, [validateAndSetPdf]);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleTrigger = useCallback((e) => {
    e.preventDefault();
    if (!file) {
      AlertToast("يرجى رفع ملف PDF أولاً للتحليل.", "ERROR");
      return;
    }
    onGenerate?.({ file, wordCount, audience });
  }, [file, wordCount, audience, onGenerate]);

  const formattedFileSize = file
    ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    : "";

  return {
    file,
    fileInputRef,
    wordCount,
    setWordCount,
    audience,
    setAudience,
    audienceOptions: AUDIENCE_OPTIONS,
    wordCountConfig: WORD_COUNT_CONFIG,
    isDragging,
    formattedFileSize,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFile,
    handleTrigger,
  };
}
