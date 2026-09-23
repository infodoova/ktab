import { useState, useRef, useCallback, useEffect } from "react";
import { AlertToast } from "@/components/myui/AlertToast";
import { useEnumStore } from "@/core/store";
import { validateFile } from "@/utils/validation";
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
  // Load AI audience profiles and upload specifications from backend
  const { aiAudienceProfiles, uploadSpecs, fetchAiEnums } = useEnumStore();

  useEffect(() => {
    fetchAiEnums();
  }, [fetchAiEnums]);

  const audienceOptions = aiAudienceProfiles && aiAudienceProfiles.length > 0
    ? aiAudienceProfiles.map((p) => ({ value: p.name || p.key, label: p.labelAr }))
    : AUDIENCE_OPTIONS;

  const maxPdfBytes = uploadSpecs?.aiPdfDraft?.maxSizeBytes || MAX_PDF_SIZE_BYTES;
  const maxPdfMb = uploadSpecs?.aiPdfDraft?.maxSizeMb || 20;

  const [file, setFile] = useState(null);
  const [wordCount, setWordCount] = useState(WORD_COUNT_CONFIG.DEFAULT);
  const [audience, setAudience] = useState(audienceOptions[0]?.value ?? "");
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});

  // Synchronize audience selection when dynamic options load or update
  useEffect(() => {
    if (audienceOptions.length > 0 && !audienceOptions.some((opt) => opt.value === audience)) {
      setAudience(audienceOptions[0].value);
    }
  }, [audienceOptions, audience]);

  const fileInputRef = useRef(null);

  const validateAndSetPdf = useCallback((selectedFile) => {
    if (!selectedFile) return;

    const fileCheck = validateFile(selectedFile, {
      allowedTypes: ["application/pdf"],
      maxSizeBytes: maxPdfBytes,
    });

    if (!fileCheck.valid) {
      const msg = selectedFile.size > maxPdfBytes
        ? `الحد الأقصى لحجم الملف هو ${maxPdfMb} ميغابايت.`
        : "يرجى اختيار ملف بصيغة PDF فقط.";
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
    (input) => {
      const selected = input instanceof File ? input : input?.target?.files?.[0];
      if (selected) {
        validateAndSetPdf(selected);
      }
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
      setAudience(audienceOptions[0]?.value ?? "");
    },
    [file, wordCount, audience, onGenerate, audienceOptions]
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
    audienceOptions,
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
