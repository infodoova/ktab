import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchBookDraft,
  saveBookDraft,
  updateAuthorBook,
  submitBookForReview,
} from "../services/bookPublishService";
import { useGenreStore, useEnumStore } from "@/core/store";
import { AlertToast } from "@/components/myui/AlertToast";
import { sanitizeText, sanitizeId } from "@/lib/sanitize";
import {
  validateFile,
  validateSecureBookDocument,
  validateImageDimensions,
} from "@/utils/validation";
import {
  validateDraftData,
  validatePublishData,
} from "../validation/bookPublishValidation";
import logger from "@/lib/logger";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

export const AGE_GROUPS = [
  { value: "CHILDREN", min: 3, max: 8, label: "أطفال (3-8 سنوات)" },
  { value: "EARLY_TEENS", min: 9, max: 15, label: "ناشئة (9-15 سنة)" },
  { value: "YOUTH", min: 16, max: 24, label: "شباب (16-24 سنة)" },
  { value: "ADULTS", min: 25, max: 99, label: "كبار (+25)" },
];

export const LANG_OPTIONS = [
  { id: "ar", label: "العربية" },
  { id: "en", label: "English" },
  { id: "fr", label: "Français" },
];

export const resolveAgeGroupValue = (min, max, options = []) => {
  const minNum = Number(min);
  const maxNum = Number(max);

  if (options && options.length > 0) {
    const matched =
      options.find((opt) => {
        const optMin = Number(opt.min);
        const optMax = Number(opt.max);
        return (
          optMin === minNum &&
          (optMax === maxNum || (!opt.max && maxNum >= 25) || (optMax >= 90 && maxNum >= 25))
        );
      }) || options.find((opt) => Number(opt.min) === minNum);

    if (matched) return String(matched.value);
  }

  if (minNum === 3 && maxNum === 8) return "CHILDREN";
  if (minNum === 9 && maxNum === 15) return "EARLY_TEENS";
  if (minNum === 16 && maxNum === 24) return "YOUTH";
  if (minNum >= 25) return "ADULTS";

  return options[0]?.value ? String(options[0].value) : "CHILDREN";
};

export const getAgeRangeValues = (ageValue, options = []) => {
  if (!ageValue) return { min: 3, max: 8 };

  if (options && options.length > 0) {
    const found = options.find(
      (opt) =>
        opt.value === ageValue ||
        String(opt.value).toUpperCase() === String(ageValue).toUpperCase() ||
        opt.label === ageValue
    );
    if (found && typeof found.min === "number") {
      return { min: found.min, max: found.max || 99 };
    }
  }

  const str = String(ageValue).toUpperCase();
  if (str === "CHILDREN" || str.includes("3-8") || str.includes("أطفال")) return { min: 3, max: 8 };
  if (str === "EARLY_TEENS" || str.includes("9-15") || str.includes("ناشئة")) return { min: 9, max: 15 };
  if (str === "YOUTH" || str.includes("16-24") || str.includes("شباب")) return { min: 16, max: 24 };
  if (str === "ADULTS" || str.includes("25") || str.includes("كبار")) return { min: 25, max: 99 };

  return { min: 3, max: 8 };
};

export const mapValuesToAgeLabel = (min, max, options = []) => {
  return resolveAgeGroupValue(min, max, options);
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

export { validateImageDimensions };

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
          language: local.language || "ar",
          ageGroup: local.ageGroup || "CHILDREN",
          hasAudio: Boolean(local.hasAudio),
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
      language: "ar",
      ageGroup: "CHILDREN",
      hasAudio: false,
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
            hasAudio: Boolean(formData.hasAudio),
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

  const { ages, languages, uploadSpecs, fetchBookEnums } = useEnumStore();

  // Dynamic category options
  const categoryOptions = useMemo(() => {
    return genres.map((g) => ({
      value: String(g.id),
      label: g.name || g.arabicName || g.nameAr || String(g.id),
    }));
  }, [genres]);

  // Dynamic subcategory options
  const subCategoryOptions = useMemo(() => {
    return subGenres.map((sg) => ({
      value: String(sg.id),
      label: sg.name || sg.arabicName || sg.nameAr || String(sg.id),
    }));
  }, [subGenres]);

  // Dynamic age group options with explicit min and max
  const ageGroupOptions = useMemo(() => {
    if (ages && ages.length > 0) {
      return ages.map((a) => ({
        value: String(a.key),
        label: a.labelAr || a.labelEn || a.key,
        min: typeof a.minAge === "number" ? a.minAge : 0,
        max: typeof a.maxAge === "number" ? a.maxAge : 99,
      }));
    }
    return AGE_GROUPS.map((ag) => ({
      value: ag.value,
      label: ag.label,
      min: ag.min,
      max: ag.max,
    }));
  }, [ages]);

  // Dynamic language options
  const languageOptions = useMemo(() => {
    if (languages && languages.length > 0) {
      return languages.map((lang) => ({
        value: String(lang.code || lang.value),
        label: lang.labelAr || lang.labelEn || lang.label || lang.name || lang.code,
      }));
    }
    return LANG_OPTIONS.map((lang) => ({ value: lang.id, label: lang.label }));
  }, [languages]);

  // Load genres and enum metadata once from global cache
  useEffect(() => {
    fetchGenres();
    fetchBookEnums();
  }, [fetchGenres, fetchBookEnums]);

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
          const bookStatus = String(bookPayload.status || "").toUpperCase();
          if (
            bookStatus === "UNDER_REVIEW" ||
            bookStatus === "PENDING" ||
            bookStatus === "PENDING_APPROVAL" ||
            bookStatus === "SUBMITTED" ||
            bookStatus === "IN_REVIEW"
          ) {
            AlertToast("هذا الكتاب قيد المراجعة لدى دار النشر ولا يمكن تعديله", "WARNING");
            navigate("/author/my-books", { replace: true });
            return;
          }

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
  }, [draftId, navigate]);

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

    const matchedAgeValue = resolveAgeGroupValue(
      draft.ageRangeMin,
      draft.ageRangeMax,
      ageGroupOptions
    );

    const draftLang = String(draft.language || "ar").toLowerCase();
    const matchedLang =
      languageOptions.find(
        (l) =>
          String(l.value).toLowerCase() === draftLang ||
          (l.value === "ar" && (draftLang === "arabic" || draftLang === "ar")) ||
          (l.value === "en" && (draftLang === "english" || draftLang === "en")) ||
          (l.value === "fr" && (draftLang === "french" || draftLang === "fr"))
      )?.value || (draftLang === "arabic" ? "ar" : draftLang);

    setFormData((prev) => ({
      ...prev,
      title: draft.title || "",
      description: draft.description || "",
      ageGroup: matchedAgeValue,
      language: matchedLang,
      category: genreId || prev.category,
      subCategory: subGenreId || prev.subCategory,
      hasAudio: Boolean(draft.hasAudio),
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
  }, [draft, genres, ageGroupOptions, languageOptions]);

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
    (input) => {
      const genreId =
        typeof input === "object" && input !== null && "target" in input
          ? input.target.value
          : input;
      const cleanGenreId = String(genreId ?? "");
      const selectedGenre = genres.find((g) => String(g.id) === cleanGenreId);
      const subs = selectedGenre?.subGenres || [];
      setSubGenres(subs);
      const firstSubId = subs.length > 0 ? String(subs[0].id) : "";

      setFormData((prev) => ({
        ...prev,
        category: cleanGenreId,
        subCategory: firstSubId,
      }));
    },
    [genres]
  );

  // Memoized PDF selection handler with strict security and magic byte validation
  const handlePdfChange = useCallback(
    async (file) => {
      if (!file) {
        handleInputChange("pdfFile", null);
        setExistingData((prev) => ({ ...prev, pdfName: null, pageCount: 0 }));
        return;
      }

      // 1. Strict security validation (extension, double-extension, magic bytes, size)
      const docValidation = await validateSecureBookDocument(file, {
        maxSizeBytes: 100 * 1024 * 1024,
      });

      if (!docValidation.valid) {
        AlertToast(docValidation.error || "ملف الكتاب غير صالح أمنياً", "ERROR");
        return;
      }

      handleInputChange("pdfFile", file);
      setExistingData((prev) => ({ ...prev, pdfName: file.name }));

      // Parse page count in the background for PDF files
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
    const res = validateDraftData(formData);
    if (!res.valid) {
      AlertToast(res.error, "ERROR");
      return false;
    }
    return true;
  }, [formData]);

  const validatePublish = useCallback(async () => {
    const res = await validatePublishData(formData, existingData);
    if (!res.valid) {
      AlertToast(res.error, "ERROR");
      return false;
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
        const isPdf = formData.pdfFile.name.toLowerCase().endsWith(".pdf");
        if (isPdf) {
          const count = await getPdfPageCount(formData.pdfFile);
          if (count > 0) finalPageCount = count;
        }
      }

      const { min, max } = getAgeRangeValues(formData.ageGroup, ageGroupOptions);
      const apiFormData = new FormData();

      const langCode =
        formData.language === "arabic"
          ? "ar"
          : formData.language === "english"
          ? "en"
          : formData.language || "ar";

      // Standard BookRequestDto according to OpenAPI spec with status = 'DRAFT'
      const bookDto = {
        title: sanitizeText(formData.title),
        description: sanitizeText(formData.description) || "",
        mainGenreId: Number(sanitizeId(formData.category)) || 1,
        subGenreId: Number(sanitizeId(formData.subCategory)) || 0,
        language: langCode,
        ageRangeMin: min,
        ageRangeMax: max,
        pageCount: Math.max(1, finalPageCount || 1),
        hasAudio: Boolean(formData.hasAudio),
        status: "DRAFT",
      };

      // ID is sent as a URL path variable — do NOT include it in the DTO body.

      apiFormData.append(
        "bookDto",
        new Blob([JSON.stringify(bookDto)], { type: "application/json" })
      );

      if (formData.coverFile) {
        apiFormData.append("coverImage", formData.coverFile);
      }
      if (formData.pdfFile) {
        apiFormData.append("pdfFile", formData.pdfFile);
      }

      const res = isEditingDraft
        ? await updateAuthorBook(draftId || draft?.id, apiFormData)
        : await saveBookDraft(apiFormData, (p) => setProgress(p));

      if (res?.messageStatus === "SUCCESS" || res?.status === 200 || res?.statusCode === 200 || res?.success) {
        try {
          localStorage.removeItem(LOCAL_DRAFT_KEY);
        } catch {
          // Handled
        }
        AlertToast("تم حفظ المسودة بنجاح", "SUCCESS");
        navigate("/author/my-books");
      } else {
        const errorMsg =
          res?.error === "IMAGE_INVALID_RATIO_COVER"
            ? `نسبة غلاف الكتاب غير مطابقة لمتطلبات النظام (المطلوب 1:1.6 بين 1.35 و 1.85، نسبتك الحالية: ${res.actualRatio || ""})`
            : res?.message || res?.error || "فشل حفظ المسودة";
        AlertToast(errorMsg, "ERROR");
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
    ageGroupOptions,
  ]);

  const handlePublish = useCallback(async () => {
    const valid = await validatePublish();
    if (!valid) return;

    setLoading(true);
    setProgress(10);

    try {
      let finalPageCount = existingData.pageCount || 0;
      if (formData.pdfFile && !finalPageCount) {
        const isPdf = formData.pdfFile.name.toLowerCase().endsWith(".pdf");
        if (isPdf) {
          const count = await getPdfPageCount(formData.pdfFile);
          if (count > 0) finalPageCount = count;
        }
      }

      const { min, max } = getAgeRangeValues(formData.ageGroup, ageGroupOptions);
      const apiFormData = new FormData();

      const langCode =
        formData.language === "arabic"
          ? "ar"
          : formData.language === "english"
          ? "en"
          : formData.language || "ar";

      // Status in bookDto is DRAFT when updating.
      // Final transition to UNDER_REVIEW is performed by the backend submit API.
      const bookDto = {
        title: sanitizeText(formData.title),
        description: sanitizeText(formData.description),
        mainGenreId: Number(sanitizeId(formData.category)),
        subGenreId: Number(sanitizeId(formData.subCategory)) || 0,
        language: langCode,
        ageRangeMin: min,
        ageRangeMax: max,
        pageCount: Math.max(1, finalPageCount || 1),
        hasAudio: Boolean(formData.hasAudio),
        status: "DRAFT",
      };

      apiFormData.append(
        "bookDto",
        new Blob([JSON.stringify(bookDto)], { type: "application/json" })
      );

      if (formData.coverFile) {
        apiFormData.append("coverImage", formData.coverFile);
      }
      if (formData.pdfFile) {
        apiFormData.append("pdfFile", formData.pdfFile);
      }

      let res;
      if (isEditingDraft) {
        const activeDraftId = draftId || draft?.id;
        // 1. Update draft with any newly edited fields or files first using status DRAFT
        try {
          await updateAuthorBook(activeDraftId, apiFormData);
        } catch (updateErr) {
          logger.warn("Non-fatal draft update notice before submit:", updateErr);
        }
        // 2. Submit existing draft for publisher review via POST /authors/me/books/submit?id={id}
        res = await submitBookForReview({ id: activeDraftId });
      } else {
        // Mode 2: New book: submit multipart request directly via submit API
        res = await submitBookForReview({
          formData: apiFormData,
          onProgress: (p) => setProgress(p),
        });
      }

      if (
        res?.messageStatus === "SUCCESS" ||
        res?.status === 200 ||
        res?.statusCode === 200 ||
        res?.success
      ) {
        try {
          localStorage.removeItem(LOCAL_DRAFT_KEY);
        } catch {
          // Handled
        }
        AlertToast("تم إرسال الكتاب بنجاح وهو الآن قيد المراجعة", "SUCCESS");
        navigate("/author/my-books", {
          state: { initialStatus: "UNDER_REVIEW" },
        });
      } else {
        const errorMsg =
          res?.error === "IMAGE_INVALID_RATIO_COVER"
            ? `نسبة غلاف الكتاب غير مطابقة لمتطلبات النظام (المطلوب 1:1.6 بين 1.35 و 1.85، نسبتك الحالية: ${res.actualRatio || ""})`
            : res?.message || res?.error || "فشل إرسال الكتاب للمراجعة";
        AlertToast(errorMsg, "ERROR");
      }
    } catch (err) {
      logger.error("Publish book error:", err);
      AlertToast(err.message || "حدث خطأ أثناء نشر الكتاب", "ERROR");
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
    ageGroupOptions,
  ]);

  // Pre-bound declarative event handlers (zero inline functions in JSX)
  const handleTitleChange = useCallback(
    (e) => handleInputChange("title", e.target.value),
    [handleInputChange]
  );

  const handleDescriptionChange = useCallback(
    (e) => handleInputChange("description", e.target.value),
    [handleInputChange]
  );

  const handleCategoryChange = useCallback(
    (e) => {
      const val = typeof e === "object" && e !== null && "target" in e ? e.target.value : e;
      handleGenreChange(val);
    },
    [handleGenreChange]
  );

  const handleSubCategoryChange = useCallback(
    (e) => {
      const val = typeof e === "object" && e !== null && "target" in e ? e.target.value : e;
      handleInputChange("subCategory", String(val ?? ""));
    },
    [handleInputChange]
  );

  const handleAgeGroupChange = useCallback(
    (e) => {
      const val = typeof e === "object" && e !== null && "target" in e ? e.target.value : e;
      handleInputChange("ageGroup", String(val ?? ""));
    },
    [handleInputChange]
  );

  const handleLanguageChange = useCallback(
    (e) => {
      const val = typeof e === "object" && e !== null && "target" in e ? e.target.value : e;
      handleInputChange("language", String(val ?? ""));
    },
    [handleInputChange]
  );

  const handleHasAudioChange = useCallback(
    (checked) => {
      const boolVal = typeof checked === "boolean" ? checked : Boolean(checked?.target?.checked);
      handleInputChange("hasAudio", boolVal);
    },
    [handleInputChange]
  );

  const handleCoverChange = useCallback(
    async (file) => {
      if (!file) {
        handleInputChange("coverFile", null);
        return;
      }

      // Read allowed max size from uploadSpecs if available
      const coverSpec = uploadSpecs?.bookCover || {};
      const maxSizeBytes = coverSpec.maxSizeBytes || 10 * 1024 * 1024;
      const maxSizeMb = coverSpec.maxSizeMb || 10;

      const coverValidation = validateFile(file, {
        allowedTypes: ["image/jpeg", "image/png", "image/webp"],
        maxSizeBytes,
      });

      if (!coverValidation.valid) {
        AlertToast(coverValidation.error || `ملف الغلاف غير صالح (الحجم الأقصى ${maxSizeMb} ميغابايت)`, "ERROR");
        return;
      }

      // Derive ratio bounds from uploadSpecs; backend default is targetRatio=1.6, tolerance=0.25
      const targetRatio = typeof coverSpec.targetRatio === "number" ? coverSpec.targetRatio : 1.6;
      const tolerance = typeof coverSpec.tolerance === "number" ? coverSpec.tolerance : 0.25;
      const minRatio = targetRatio - tolerance;
      const maxRatio = targetRatio + tolerance;
      const aspectRatioLabel = coverSpec.aspectRatio || "1:1.6";

      const { isValid, ratio, width, height } = await validateImageDimensions(file, minRatio, maxRatio);
      if (!isValid) {
        AlertToast(
          `يجب أن تكون نسبة غلاف الكتاب ${aspectRatioLabel} تقريباً (المسموح بين ${minRatio.toFixed(2)} و ${maxRatio.toFixed(2)}). أبعاد صورتك: ${width}×${height} (النسبة: ${ratio ? ratio.toFixed(2) : "غير صالحة"}).`,
          "ERROR"
        );
        return;
      }

      handleInputChange("coverFile", file);
    },
    [handleInputChange, uploadSpecs]
  );

  const handleRemoveCover = useCallback(
    () => handleInputChange("coverFile", null),
    [handleInputChange]
  );

  const handleRemoveDocument = useCallback(
    () => handlePdfChange(null),
    [handlePdfChange]
  );

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const openPublishConfirmModal = useCallback(async () => {
    const valid = await validatePublish();
    if (!valid) return;
    setIsConfirmModalOpen(true);
  }, [validatePublish]);

  const closePublishConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false);
  }, []);

  const handleConfirmPublish = useCallback(async () => {
    setIsConfirmModalOpen(false);
    await handlePublish();
  }, [handlePublish]);

  const handleFormSubmit = useCallback(
    (e) => {
      if (e) e.preventDefault();
      openPublishConfirmModal();
    },
    [openPublishConfirmModal]
  );

  return {
    formData,
    existingData,
    genres,
    subGenres,
    genresLoading,
    loading,
    progress,
    isEditingDraft,
    categoryOptions,
    subCategoryOptions,
    ageGroupOptions,
    languageOptions,
    handleInputChange,
    handleGenreChange,
    handlePdfChange,
    handleDocumentChange: handlePdfChange,
    handleTitleChange,
    handleDescriptionChange,
    handleCategoryChange,
    handleSubCategoryChange,
    handleAgeGroupChange,
    handleLanguageChange,
    handleHasAudioChange,
    handleCoverChange,
    handleRemoveCover,
    handleRemoveDocument,
    handleFormSubmit,
    handleSaveDraft,
    handlePublish,
    isConfirmModalOpen,
    closePublishConfirmModal,
    handleConfirmPublish,
  };
}

export default useBookPublish;

