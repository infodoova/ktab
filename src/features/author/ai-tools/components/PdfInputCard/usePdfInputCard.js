import { useState, useRef, useCallback } from "react";
import { AlertToast } from "@/components/myui/AlertToast";
import {
  AUDIENCE_OPTIONS,
  WORD_COUNT_CONFIG,
  MAX_PDF_SIZE_BYTES,
} from "../../constants/aiToolsConstants";

/**
 * Custom hook encapsulating PDF upload, drag-and-drop validation,
 * word count slider, audience selection, and field-level error state.
 */
export function usePdfInputCard({ onGenerate, loading = false }) {
  const [file, setFile] = useState(null);
  const [wordCount, setWordCount] = useState(WORD_COUNT_CONFIG.DEFAULT);
  const [audience, setAudience] = useState(AUDIENCE_OPTIONS[0].value);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});

  const fileInputRef = useRef(null);

  const validateAndSetPdf = useCallback((selectedFile) => {
    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      const msg = "يرجى اختيار ملف بصيغة PDF فقط.";
      setErrors((prev) => ({ ...prev, file: msg }));
      AlertToast(msg, "ERROR");
      return;
    }

    if (selectedFile.size > MAX_PDF_SIZE_BYTES) {
      const msg = "الحد الأقصى لحجم الملف هو 20 ميغابايت.";
      setErrors((prev) => ({ ...prev, file: msg }));
      AlertToast(msg, "ERROR");
      return;
    }

    // Clear previous file errors upon valid upload
    setErrors((prev) => {
      const next = { ...prev };
      delete next.file;
      return next;
    });
    setFile(selectedFile);
  }, []);

  const handleFileChange = useCallback(
    (e) => {
      const selected = e.target.files?.[0];
      validateAndSetPdf(selected);
    },
    [validateAndSetPdf]
  );

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

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      const droppedFile = e.dataTransfer.files?.[0];
      validateAndSetPdf(droppedFile);
    },
    [validateAndSetPdf]
  );

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.file;
      return next;
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleAudienceChange = useCallback((val) => {
    setAudience(val);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.audience;
      return next;
    });
  }, []);

  const handleTrigger = useCallback(
    (e) => {
      e.preventDefault();

      const newErrors = {};
      if (!file) {
        newErrors.file = "يرجى رفع مسودة الكتاب (PDF) أولاً للمتابعة.";
      }
      if (!audience) {
        newErrors.audience = "يرجى تحديد الفئة والأسلوب المستهدف.";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        AlertToast(newErrors.file || newErrors.audience, "ERROR");
        return;
      }

      setErrors({});
      onGenerate?.({ file, wordCount, audience });

      // Clear all fields upon generating
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setWordCount(WORD_COUNT_CONFIG.DEFAULT);
      setAudience(AUDIENCE_OPTIONS[0].value);
    },
    [file, wordCount, audience, onGenerate]
  );

  const formattedFileSize = file
    ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
    : "";

  return {
    file,
    fileInputRef,
    wordCount,
    setWordCount,
    audience,
    setAudience: handleAudienceChange,
    audienceOptions: AUDIENCE_OPTIONS,
    wordCountConfig: WORD_COUNT_CONFIG,
    isDragging,
    formattedFileSize,
    errors,
    handleFileChange,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleRemoveFile,
    handleTrigger,
  };
}
