import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchBookDraft,
  publishNewBook,
  saveBookDraft,
  updateBookDraft,
} from "../services/bookPublishService";
import { useGenreStore } from "@/core/store";
import { AlertToast } from "@/components/myui/AlertToast";
import { sanitizeText, sanitizeId, validateFile } from "@/lib/sanitize";
import logger from "@/lib/logger";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export const AGE_GROUPS = [
  "أطفال (3-8 سنوات)",
  "ناشئة (9-15 سنة)",
  "شباب (16-24 سنة)",
  "كبار (25+)",
];

export const LANG_OPTIONS = [
  { id: "arabic", label: "العربية" },
  { id: "english", label: "English" },
];

export const getAgeRangeValues = (ageString) => {
  if (!ageString) return { min: 0, max: 0 };
  if (ageString.includes("3-8")) return { min: 3, max: 8 };
  if (ageString.includes("9-15")) return { min: 9, max: 15 };
  if (ageString.includes("16-24")) return { min: 16, max: 24 };
  if (ageString.includes("25+")) return { min: 25, max: 100 };
  return { min: 0, max: 0 };
};

export const mapValuesToAgeLabel = (min, max) => {
  if (min === 3 && max === 8) return AGE_GROUPS[0];
  if (min === 9 && max === 15) return AGE_GROUPS[1];
  if (min === 16 && max === 24) return AGE_GROUPS[2];
  if (min >= 25) return AGE_GROUPS[3];
  return "";
};

const LOCAL_DRAFT_KEY = "ktab_book_publish_draft";

/**
 * Reads PDF page count with timeout and graceful error recovery.
 */
export const getPdfPageCount = async (file) => {
  if (!file) return 0;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const countPromise = (async () => {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      return pdf.numPages || 0;
    })();

    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(0), 8000));
    return await Promise.race([countPromise, timeoutPromise]);
  } catch (e) {
    logger.error("PDF Read Error", e);
    return 0;
  }
};

/**
 * Validates cover image aspect ratio safely with cleanup.
 */
export const validateImageDimensions = (file) => {
  return new Promise((resolve) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    let settled = false;

    const cleanup = () => {
      if (!settled) {
        settled = true;
        URL.revokeObjectURL(objectUrl);
      }
    };

    // Safety timeout in case image loading stalls
    const timer = setTimeout(() => {
      cleanup();
      resolve({ isValid: true, ratio: 1.6 });
    }, 4000);

    img.onload = () => {
      clearTimeout(timer);
      const ratio = img.height / img.width;
      const isValid = ratio >= 1.4 && ratio <= 1.8;
      cleanup();
      resolve({ isValid, ratio });
    };

    img.onerror = () => {
      clearTimeout(timer);
      cleanup();
      resolve({ isValid: false, ratio: 0 });
    };

    img.src = objectUrl;
  });
};

/**
 * Helper to retrieve locally cached form state.
 */
function getCachedLocalDraft() {
  try {
    const cached = localStorage.getItem(LOCAL_DRAFT_KEY);
    if (!cached) return null;
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

/**
 * Master Hook managing book publishing, draft saving, and file validation.
 */
export function useBookPublish() {
  const { draftId } = useParams();
  const navigate = useNavigate();

  const [draft, setDraft] = useState(null);
  const isEditingDraft = Boolean(draftId || draft?.id || draft?.bookId);

  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { genres, isLoading: genresLoading, fetchGenres } = useGenreStore();
  const [subGenres, setSubGenres] = useState([]);

  const [formData, setFormData] = useState(() => {
    if (!draftId) {
      const local = getCachedLocalDraft();
      if (local) {
        return {
          title: local.title || "",
          description: local.description || "",
          category: local.category || "",
          subCategory: local.subCategory || "",
          language: local.language || LANG_OPTIONS[0].id,
          ageGroup: local.ageGroup || AGE_GROUPS[0],
          coverFile: null,
          pdfFile: null,
        };
      }
    }
    return {
      title: "",
      description: "",
      category: "",
      subCategory: "",
      language: LANG_OPTIONS[0].id,
      ageGroup: AGE_GROUPS[0],
      coverFile: null,
      pdfFile: null,
    };
  });

  const [existingData, setExistingData] = useState({
    coverUrl: null,
    pdfName: null,
    pageCount: 0,
  });

  // Debounced autosave to prevent main-thread UI freezing during typing
  useEffect(() => {
    if (isEditingDraft) return;

    const hasContent =
      Boolean(formData.title.trim()) ||
      Boolean(formData.description.trim()) ||
      Boolean(formData.category);

    if (!hasContent) return;

    const timer = setTimeout(() => {
      try {
        localStorage.setItem(
          LOCAL_DRAFT_KEY,
          JSON.stringify({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            subCategory: formData.subCategory,
            language: formData.language,
            ageGroup: formData.ageGroup,
          })
        );
      } catch (err) {
        logger.warn("Failed to autosave draft to localStorage:", err);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [formData, isEditingDraft]);

  // Protect against accidental tab close or page reload when dirty
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      const isDirty =
        formData.title.trim() ||
        formData.description.trim() ||
        formData.coverFile ||
        formData.pdfFile;
      if (isDirty && !loading) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formData, loading]);

  // Load genres once from global cache
  useEffect(() => {
    fetchGenres();
  }, [fetchGenres]);

  // Load existing draft if draftId provided (with race-condition guard)
  useEffect(() => {
    if (!draftId) return;
    let isMounted = true;

    async function loadDraft() {
      try {
        const res = await fetchBookDraft(draftId);
        if (!isMounted) return;

        const data = res?.data || res;
        const bookPayload =
          Array.isArray(data?.content) && data.content.length > 0
            ? data.content[0]
            : data;

        if (bookPayload) {
          setDraft({
            ...bookPayload,
            id: bookPayload.id ?? bookPayload.bookId ?? draftId,
          });
        }
      } catch (err) {
        logger.error("Fetch draft error:", err);
      }
    }

    loadDraft();

    return () => {
      isMounted = false;
    };
  }, [draftId]);

  // Atomically sync draft data and genres into form state
  useEffect(() => {
    if (!draft) return;

    let genreId = draft.mainGenreId ? String(draft.mainGenreId) : "";
    let subGenreId = draft.subGenreId ? String(draft.subGenreId) : "";

    if (!genreId && draft.mainGenre && genres.length > 0) {
      const found = genres.find(
        (g) => String(g.id) === String(draft.mainGenreId) || g.name === draft.mainGenre
      );
      if (found) genreId = String(found.id);
    }

    setFormData((prev) => ({
      ...prev,
      title: draft.title || "",
      description: draft.description || "",
      ageGroup: mapValuesToAgeLabel(draft.ageRangeMin, draft.ageRangeMax),
      language: draft.language || "arabic",
      category: genreId || prev.category,
      subCategory: subGenreId || prev.subCategory,
    }));

    setExistingData({
      coverUrl: draft.coverImageUrl || null,
      pdfName: draft.pdfFileName || (draft.title ? `${draft.title}.pdf` : "ملف PDF محفوظ"),
      pageCount: draft.pageCount || 0,
    });

    if (genreId && genres.length > 0) {
      const selectedGenre = genres.find((g) => String(g.id) === genreId);
      setSubGenres(selectedGenre?.subGenres || []);
    }
  }, [draft, genres]);

  // Auto-select index 0 for genre and subgenre when genres load and no category is selected
  useEffect(() => {
    if (isEditingDraft || !genres || genres.length === 0) return;

    setFormData((prev) => {
      if (prev.category) return prev;
      const firstGenre = genres[0];
      const firstGenreId = String(firstGenre.id);
      const subs = firstGenre.subGenres || [];
      const firstSubId = subs.length > 0 ? String(subs[0].id) : "";
      setSubGenres(subs);
      return {
        ...prev,
        category: firstGenreId,
        subCategory: firstSubId,
      };
    });
  }, [genres, isEditingDraft]);

  // Memoized input change handler
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Memoized genre selection handler with auto-selection of first subgenre
  const handleGenreChange = useCallback(
    (genreId) => {
      const selectedGenre = genres.find((g) => String(g.id) === String(genreId));
      const subs = selectedGenre?.subGenres || [];
      setSubGenres(subs);
      const firstSubId = subs.length > 0 ? String(subs[0].id) : "";

      setFormData((prev) => ({
        ...prev,
        category: String(genreId),
        subCategory: firstSubId,
      }));
    },
    [genres]
  );

  // Memoized PDF selection handler that reads page count asynchronously immediately
  const handlePdfChange = useCallback(
    async (file) => {
      if (!file) {
        handleInputChange("pdfFile", null);
        setExistingData((prev) => ({ ...prev, pdfName: null, pageCount: 0 }));
        return;
      }

      handleInputChange("pdfFile", file);
      setExistingData((prev) => ({ ...prev, pdfName: file.name }));

      // Parse page count in the background without blocking submit
      try {
        const count = await getPdfPageCount(file);
        if (count > 0) {
          setExistingData((prev) => ({ ...prev, pageCount: count }));
        }
      } catch (err) {
        logger.warn("Could not read PDF page count on select:", err);
      }
    },
    [handleInputChange]
  );

  const validateDraft = useCallback(() => {
    const cleanTitle = sanitizeText(formData.title);
    if (!cleanTitle) {
      AlertToast("يرجى إدخال عنوان للكتاب لحفظ المسودة.", "ERROR");
      return false;
    }
    if (cleanTitle.length > 200) {
      AlertToast("عنوان الكتاب طويل جداً (أقصى حد 200 حرف).", "ERROR");
      return false;
    }
    return true;
  }, [formData.title]);

  const validatePublish = useCallback(async () => {
    const { title, description, category, ageGroup, coverFile, pdfFile, language } = formData;

    const cleanTitle = sanitizeText(title);
    const cleanDesc = sanitizeText(description);

    if (!cleanTitle || !cleanDesc || !category || !ageGroup || !language) {
      AlertToast("يرجى تعبئة جميع الحقول النصية.", "ERROR");
      return false;
    }

    if (cleanTitle.length > 200) {
      AlertToast("عنوان الكتاب طويل جداً (أقصى حد 200 حرف).", "ERROR");
      return false;
    }

    if (cleanDesc.length > 5000) {
      AlertToast("وصف الكتاب طويل جداً (أقصى حد 5000 حرف).", "ERROR");
      return false;
    }

    const hasCover = coverFile || existingData.coverUrl;
    const hasPdf = pdfFile || existingData.pdfName;

    if (!hasCover) {
      AlertToast("يرجى رفع صورة غلاف للكتاب.", "ERROR");
      return false;
    }
    if (!hasPdf) {
      AlertToast("يرجى رفع ملف PDF للكتاب.", "ERROR");
      return false;
    }

    if (coverFile) {
      const coverValidation = validateFile(coverFile, {
        allowedTypes: ["image/jpeg", "image/png", "image/webp"],
        maxSizeBytes: 10 * 1024 * 1024, // 10 MB
      });
      if (!coverValidation.valid) {
        AlertToast(coverValidation.error || "ملف الغلاف غير صالح", "ERROR");
        return false;
      }

      const { isValid } = await validateImageDimensions(coverFile);
      if (!isValid) {
        AlertToast("يجب أن تكون أبعاد الغلاف مناسبة لكتاب (نسبة طول إلى عرض تقارب 1.6).", "ERROR");
        return false;
      }
    }

    if (pdfFile) {
      const pdfValidation = validateFile(pdfFile, {
        allowedTypes: ["application/pdf"],
        maxSizeBytes: 100 * 1024 * 1024, // 100 MB
      });
      if (!pdfValidation.valid) {
        AlertToast(pdfValidation.error || "ملف الكتاب غير صالح", "ERROR");
        return false;
      }
    }

    return true;
  }, [formData, existingData]);

  const handleSaveDraft = useCallback(async () => {
    if (!validateDraft()) return;
    setLoading(true);
    setProgress(10);

    try {
      let finalPageCount = existingData.pageCount || 0;
      if (formData.pdfFile && !finalPageCount) {
        const count = await getPdfPageCount(formData.pdfFile);
        if (count > 0) finalPageCount = count;
      }

      const { min, max } = getAgeRangeValues(formData.ageGroup);
      const apiFormData = new FormData();

      if (isEditingDraft) {
        apiFormData.append("bookId", sanitizeId(draftId || draft?.id));
      }
      apiFormData.append("title", sanitizeText(formData.title));
      apiFormData.append("description", sanitizeText(formData.description));
      if (formData.category) apiFormData.append("mainGenreId", sanitizeId(formData.category));
      if (formData.subCategory) apiFormData.append("subGenreId", sanitizeId(formData.subCategory));
      if (formData.language) apiFormData.append("language", sanitizeText(formData.language));
      if (min) apiFormData.append("ageRangeMin", min);
      if (max) apiFormData.append("ageRangeMax", max);
      if (finalPageCount) apiFormData.append("pageCount", finalPageCount);
      if (formData.coverFile) apiFormData.append("coverImage", formData.coverFile);
      if (formData.pdfFile) apiFormData.append("pdfFile", formData.pdfFile);

      const res = isEditingDraft
        ? await updateBookDraft(draftId || draft?.id, apiFormData, (p) => setProgress(p))
        : await saveBookDraft(apiFormData, (p) => setProgress(p));

      if (res?.messageStatus === "SUCCESS" || res?.status === 200) {
        try {
          localStorage.removeItem(LOCAL_DRAFT_KEY);
        } catch {
          // Ignored
        }
        AlertToast("تم حفظ المسودة بنجاح", "SUCCESS");
        navigate("/author/my-books");
      } else {
        AlertToast(res?.message || "فشل حفظ المسودة", "ERROR");
      }
    } catch (err) {
      logger.error("Save draft error:", err);
      AlertToast("حدث خطأ أثناء حفظ المسودة", "ERROR");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, [
    validateDraft,
    existingData.pageCount,
    formData,
    isEditingDraft,
    draftId,
    draft?.id,
    navigate,
  ]);

  const handlePublish = useCallback(async () => {
    const valid = await validatePublish();
    if (!valid) return;

    setLoading(true);
    setProgress(10);

    try {
      let finalPageCount = existingData.pageCount || 0;
      if (formData.pdfFile && !finalPageCount) {
        const count = await getPdfPageCount(formData.pdfFile);
        if (count > 0) finalPageCount = count;
      }

      const { min, max } = getAgeRangeValues(formData.ageGroup);
      const apiFormData = new FormData();

      if (isEditingDraft) {
        apiFormData.append("bookId", sanitizeId(draftId || draft?.id));
      }
      apiFormData.append("title", sanitizeText(formData.title));
      apiFormData.append("description", sanitizeText(formData.description));
      apiFormData.append("mainGenreId", sanitizeId(formData.category));
      if (formData.subCategory) apiFormData.append("subGenreId", sanitizeId(formData.subCategory));
      apiFormData.append("language", sanitizeText(formData.language));
      apiFormData.append("ageRangeMin", min);
      apiFormData.append("ageRangeMax", max);
      apiFormData.append("pageCount", finalPageCount);
      if (formData.coverFile) apiFormData.append("coverImage", formData.coverFile);
      if (formData.pdfFile) apiFormData.append("pdfFile", formData.pdfFile);

      const res = await publishNewBook(apiFormData, (p) => setProgress(p));

      if (res?.messageStatus === "SUCCESS" || res?.status === 200) {
        try {
          localStorage.removeItem(LOCAL_DRAFT_KEY);
        } catch {
          // Ignored
        }
        AlertToast("تم نشر الكتاب بنجاح!", "SUCCESS");
        navigate("/author/my-books");
      } else {
        AlertToast(res?.message || "فشل نشر الكتاب", "ERROR");
      }
    } catch (err) {
      logger.error("Publish book error:", err);
      AlertToast("حدث خطأ أثناء نشر الكتاب", "ERROR");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  }, [
    validatePublish,
    existingData.pageCount,
    formData,
    isEditingDraft,
    draftId,
    draft?.id,
    navigate,
  ]);

  return {
    formData,
    existingData,
    genres,
    subGenres,
    genresLoading,
    loading,
    progress,
    isEditingDraft,
    handleInputChange,
    handleGenreChange,
    handlePdfChange,
    handleSaveDraft,
    handlePublish,
  };
}

export default useBookPublish;

