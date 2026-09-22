import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { librarianService } from "../../services/librarianService";
import { useGenreStore, useEnumStore } from "@/core/store";
import { AlertToast } from "@/components/myui/AlertToast";
import {
  sanitizeText,
  sanitizeId,
  validateFile,
  validateSecureBookDocument,
} from "@/lib/sanitize";
import * as pdfjsLib from "pdfjs-dist";

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

/**
 * Extracts scalar value from either a primitive or a DOM synthetic event.
 */
function extractValue(val) {
  if (val && typeof val === "object" && "target" in val) {
    return val.target?.value ?? "";
  }
  return val;
}

/**
 * Reads PDF page count with timeout and graceful recovery.
 */
async function extractPdfPageCount(file) {
  if (!file) return 0;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const countPromise = (async () => {
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      return pdf.numPages || 0;
    })();
    const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve(0), 6000));
    return await Promise.race([countPromise, timeoutPromise]);
  } catch (err) {
    console.warn("Could not read PDF page count automatically:", err);
    return 0;
  }
}

/**
 * Validates cover image aspect ratio safely with cleanup.
 * Target: 1:1.6 (height/width ratio between minRatio=1.35 and maxRatio=1.85).
 */
export function validateImageDimensions(file, minRatio = 1.35, maxRatio = 1.85) {
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
      const { naturalWidth, naturalHeight } = img;
      const ratio = naturalHeight / naturalWidth;
      const isValid = ratio >= minRatio && ratio <= maxRatio;
      cleanup();
      resolve({ isValid, ratio, width: naturalWidth, height: naturalHeight });
    };

    img.onerror = () => {
      clearTimeout(timer);
      cleanup();
      resolve({ isValid: false, ratio: 0, width: 0, height: 0 });
    };

    img.src = objectUrl;
  });
}


/**
 * Master Hook for Librarian Book Create / Edit Page.
 * Supports authorName / customAuthorName provisioning for library organizations.
 */
export function useLibrarianBookForm(props = {}) {
  const { id: paramId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const initialBook = props.book || location.state?.book || null;
  const bookId = paramId || initialBook?.id;
  const isEdit = Boolean(bookId);

  // Dynamic Stores: Genres & Backend Enums
  const { genres, fetchGenres, isLoading: genresLoading } = useGenreStore();
  const { ages, languages, uploadSpecs, fetchBookEnums } = useEnumStore();

  const [book, setBook] = useState(initialBook);
  const [loadingInitial, setLoadingInitial] = useState(Boolean(bookId && !initialBook));

  const [formData, setFormData] = useState({
    title: "",
    customAuthorName: "",
    description: "",
    category: "",
    subCategory: "",
    language: "ar",
    ageGroup: "YOUTH",
    ageRangeMin: 16,
    ageRangeMax: 24,
    pageCount: 1,
    coverFile: null,
    pdfFile: null,
  });


  const [existingData, setExistingData] = useState({
    coverUrl: null,
    pdfName: null,
    pageCount: 1,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Fetch genres and enums on mount
  useEffect(() => {
    fetchGenres();
    fetchBookEnums();
  }, [fetchGenres, fetchBookEnums]);

  // Dynamic age group options from backend enums
  const ageGroupOptions = useMemo(() => {
    if (ages && ages.length > 0) {
      return ages.map((a) => ({
        value: String(a.key),
        label: a.labelAr || a.labelEn || a.label || a.key,
        min: typeof a.minAge === "number" ? a.minAge : 0,
        max: typeof a.maxAge === "number" ? a.maxAge : 99,
      }));
    }
    return [
      { value: "CHILDREN", min: 3, max: 8, label: "أطفال (3-8 سنوات)" },
      { value: "EARLY_TEENS", min: 9, max: 15, label: "ناشئة (9-15 سنة)" },
      { value: "YOUTH", min: 16, max: 24, label: "شباب (16-24 سنة)" },
      { value: "ADULTS", min: 25, max: 99, label: "كبار (+25)" },
    ];
  }, [ages]);

  // Dynamic language options from backend enums
  const languageOptions = useMemo(() => {
    if (languages && languages.length > 0) {
      return languages.map((lang) => ({
        value: String(lang.code || lang.value),
        label: lang.labelAr || lang.labelEn || lang.label || lang.name || lang.code,
      }));
    }
    return [
      { value: "ar", label: "العربية" },
      { value: "en", label: "English" },
      { value: "fr", label: "Français" },
    ];
  }, [languages]);

  // Categories list
  const categoryOptions = useMemo(() => {
    return genres.map((g) => ({
      value: String(g.id),
      label: g.name || g.arabicName || g.nameAr || String(g.id),
    }));
  }, [genres]);

  // Subcategories list matching selected category
  const subCategoryOptions = useMemo(() => {
    if (!formData.category) return [];
    const selected = genres.find((g) => String(g.id) === String(formData.category));
    const items = selected?.subGenres || selected?.children || [];
    return items.map((sg) => ({
      value: String(sg.id),
      label: sg.name || sg.arabicName || sg.nameAr || String(sg.id),
    }));
  }, [genres, formData.category]);

  // Load book from API when editing without passed state
  useEffect(() => {
    if (bookId && !initialBook) {
      setLoadingInitial(true);
      librarianService
        .getBookById(bookId)
        .then((res) => {
          const item = res?.data || res;
          if (item) setBook(item);
        })
        .catch((err) => {
          console.error("Failed to fetch book for editing:", err);
          AlertToast("تعذر جلب بيانات الكتاب للتعديل", "error");
        })
        .finally(() => setLoadingInitial(false));
    }
  }, [bookId, initialBook]);

  // Populate data when book exists
  useEffect(() => {
    if (book) {
      const min = book.ageRangeMin ?? 16;
      const max = book.ageRangeMax ?? 24;

      const matchedAge =
        ageGroupOptions.find(
          (opt) =>
            opt.min === min &&
            (opt.max === max || (!opt.max && max >= 25) || (opt.max >= 90 && max >= 25))
        ) ||
        ageGroupOptions.find((opt) => opt.min === min) ||
        ageGroupOptions[0];

      const bookLangRaw = String(book.language || "ar").toLowerCase();
      const matchedLang =
        languageOptions.find(
          (l) =>
            String(l.value).toLowerCase() === bookLangRaw ||
            (l.value === "ar" && (bookLangRaw === "arabic" || bookLangRaw === "ar")) ||
            (l.value === "en" && (bookLangRaw === "english" || bookLangRaw === "en")) ||
            (l.value === "fr" && (bookLangRaw === "french" || bookLangRaw === "fr"))
        ) || languageOptions[0];

      setFormData({
        title: book.title || "",
        customAuthorName: book.customAuthorName || book.authorName || "",
        description: book.description || "",
        category: book.mainGenreId ? String(book.mainGenreId) : "",
        subCategory: book.subGenreId ? String(book.subGenreId) : "",
        language: matchedLang ? String(matchedLang.value) : "ar",
        ageGroup: matchedAge ? String(matchedAge.value) : "YOUTH",
        ageRangeMin: matchedAge?.min ?? min,
        ageRangeMax: matchedAge?.max ?? max,
        pageCount: book.pageCount || 1,
        coverFile: null,
        pdfFile: null,
      });

      setExistingData({
        coverUrl: book.coverImageUrl || null,
        pdfName: book.pdfFileName || null,
        pageCount: book.pageCount || 1,
      });

      setErrors({});
    }
  }, [book, ageGroupOptions, languageOptions]);

  // Event handlers with guaranteed scalar value extraction
  const handleTitleChange = useCallback((e) => {
    const val = extractValue(e);
    setFormData((prev) => ({ ...prev, title: String(val ?? "") }));
    setErrors((prev) => {
      if (prev.title) {
        const next = { ...prev };
        delete next.title;
        return next;
      }
      return prev;
    });
  }, []);

  const handleCustomAuthorNameChange = useCallback((e) => {
    const val = extractValue(e);
    setFormData((prev) => ({ ...prev, customAuthorName: String(val ?? "") }));
    setErrors((prev) => {
      if (prev.customAuthorName) {
        const next = { ...prev };
        delete next.customAuthorName;
        return next;
      }
      return prev;
    });
  }, []);

  const handleDescriptionChange = useCallback((e) => {
    const val = extractValue(e);
    setFormData((prev) => ({ ...prev, description: String(val ?? "") }));
    setErrors((prev) => {
      if (prev.description) {
        const next = { ...prev };
        delete next.description;
        return next;
      }
      return prev;
    });
  }, []);

  const handleCategoryChange = useCallback((e) => {
    const val = extractValue(e);
    const strVal = String(val ?? "");
    setFormData((prev) => ({
      ...prev,
      category: strVal,
      subCategory: "", // Reset subcategory when main category changes
    }));
    setErrors((prev) => {
      if (prev.category) {
        const next = { ...prev };
        delete next.category;
        return next;
      }
      return prev;
    });
  }, []);

  const handleSubCategoryChange = useCallback((e) => {
    const val = extractValue(e);
    setFormData((prev) => ({
      ...prev,
      subCategory: String(val ?? ""),
    }));
  }, []);

  const handleAgeGroupChange = useCallback(
    (e) => {
      const val = extractValue(e);
      const strVal = String(val ?? "");
      const matched = ageGroupOptions.find((opt) => String(opt.value) === strVal);
      setFormData((prev) => ({
        ...prev,
        ageGroup: strVal,
        ageRangeMin: matched?.min ?? 16,
        ageRangeMax: matched?.max ?? 24,
      }));
      setErrors((prev) => {
        if (prev.ageGroup) {
          const next = { ...prev };
          delete next.ageGroup;
          return next;
        }
        return prev;
      });
    },
    [ageGroupOptions]
  );

  const handleLanguageChange = useCallback((e) => {
    const val = extractValue(e);
    const strVal = String(val ?? "");
    setFormData((prev) => ({
      ...prev,
      language: strVal,
    }));
    setErrors((prev) => {
      if (prev.language) {
        const next = { ...prev };
        delete next.language;
        return next;
      }
      return prev;
    });
  }, []);

  // Cover image selection & removal
  const handleCoverChange = useCallback(
    async (file) => {
      if (!file) {
        setFormData((prev) => ({ ...prev, coverFile: null }));
        return;
      }

      // 1. Validate file format and size
      const coverSpec = uploadSpecs?.bookCover || {};
      const maxSizeBytes = coverSpec.maxSizeBytes || 10 * 1024 * 1024;
      const maxSizeMb = coverSpec.maxSizeMb || 10;

      const coverValidation = validateFile(file, {
        allowedTypes: ["image/jpeg", "image/png", "image/webp"],
        maxSizeBytes,
      });

      if (!coverValidation.valid) {
        AlertToast(
          coverValidation.error || `ملف الغلاف غير صالح (الحد الأقصى ${maxSizeMb} ميغابايت)`,
          "error"
        );
        return;
      }

      // 2. Validate aspect ratio (1:1.6, bounded between 1.35 and 1.85)
      const targetRatio = typeof coverSpec.targetRatio === "number" ? coverSpec.targetRatio : 1.6;
      const tolerance = typeof coverSpec.tolerance === "number" ? coverSpec.tolerance : 0.25;
      const minRatio = targetRatio - tolerance; // 1.35
      const maxRatio = targetRatio + tolerance; // 1.85
      const aspectRatioLabel = coverSpec.aspectRatio || "1:1.6";

      const { isValid, ratio, width, height } = await validateImageDimensions(
        file,
        minRatio,
        maxRatio
      );

      if (!isValid) {
        AlertToast(
          `يجب أن تكون نسبة غلاف الكتاب ${aspectRatioLabel} تقريباً (المسموح بين ${minRatio.toFixed(2)} و ${maxRatio.toFixed(2)}). أبعاد صورتك: ${width}×${height} (النسبة الحالية: ${ratio ? ratio.toFixed(2) : "غير صالحة"}).`,
          "error"
        );
        return;
      }

      setFormData((prev) => ({ ...prev, coverFile: file }));
      setErrors((prev) => {
        if (prev.cover) {
          const next = { ...prev };
          delete next.cover;
          return next;
        }
        return prev;
      });
    },
    [uploadSpecs]
  );

  const handleRemoveCover = useCallback(() => {
    setFormData((prev) => ({ ...prev, coverFile: null }));
    setExistingData((prev) => ({ ...prev, coverUrl: null }));
  }, []);


  // PDF Document selection & removal
  const handleDocumentChange = useCallback(
    async (file) => {
      if (!file) {
        setFormData((prev) => ({ ...prev, pdfFile: null }));
        return;
      }

      const pdfSpec = uploadSpecs?.bookPdf || {};
      const maxSizeBytes = pdfSpec.maxSizeBytes || 100 * 1024 * 1024;

      const docValidation = await validateSecureBookDocument(file, {
        maxSizeBytes,
      });

      if (!docValidation.valid) {
        AlertToast(docValidation.error || "ملف الكتاب غير صالح أمنياً", "error");
        return;
      }

      setFormData((prev) => ({ ...prev, pdfFile: file }));
      setErrors((prev) => {
        if (prev.pdf) {
          const next = { ...prev };
          delete next.pdf;
          return next;
        }
        return prev;
      });

      // Auto extract page count
      try {
        const count = await extractPdfPageCount(file);
        if (count > 0) {
          setFormData((prev) => ({ ...prev, pageCount: count }));
        }
      } catch (err) {
        console.warn("Could not extract PDF page count:", err);
      }
    },
    [uploadSpecs]
  );

  const handleRemoveDocument = useCallback(() => {
    setFormData((prev) => ({ ...prev, pdfFile: null }));
    setExistingData((prev) => ({ ...prev, pdfName: null, pageCount: 0 }));
  }, []);

  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.title.trim() || formData.title.trim().length < 2) {
      newErrors.title = "يرجى إدخال عنوان الكتاب (حرفان على الأقل)";
    }

    if (!formData.customAuthorName.trim() || formData.customAuthorName.trim().length < 2) {
      newErrors.customAuthorName = "يرجى إدخال اسم مؤلف الكتاب (حرفان على الأقل)";
    }

    if (!formData.description.trim() || formData.description.trim().length < 5) {
      newErrors.description = "يرجى كتابة نبذة عن الكتاب (5 أحرف على الأقل)";
    }

    if (!formData.category) {
      newErrors.category = "يرجى اختيار التصنيف الأساسي للكتاب";
    }

    if (!formData.language) {
      newErrors.language = "يرجى اختيار لغة الكتاب";
    }

    if (!formData.ageGroup) {
      newErrors.ageGroup = "يرجى اختيار الفئة العمرية المستهدفة";
    }

    const hasCover = formData.coverFile || existingData.coverUrl;
    if (!hasCover) {
      newErrors.cover = "غلاف الكتاب إلزامي";
    }

    const hasPdf = formData.pdfFile || existingData.pdfName;
    if (!hasPdf) {
      newErrors.pdf = "ملف الكتاب بصيغة PDF إلزامي";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, existingData]);

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleConfirmedSubmit = useCallback(async () => {
    setIsConfirmModalOpen(false);
    setSubmitting(true);
    try {
      const bookDto = {
        title: sanitizeText(formData.title),
        customAuthorName: sanitizeText(formData.customAuthorName),
        description: sanitizeText(formData.description),
        mainGenreId: Number(sanitizeId(formData.category)),
        subGenreId: Number(sanitizeId(formData.subCategory)) || 0,
        language: sanitizeText(formData.language) || "ar",
        ageRangeMin: formData.ageRangeMin,
        ageRangeMax: formData.ageRangeMax,
        pageCount: Math.max(1, Number(formData.pageCount) || 1),
        hasAudio: false,
        status: "PUBLISHED",
      };

      if (isEdit) {
        bookDto.id = Number(sanitizeId(bookId));
      }

      const apiFormData = new FormData();
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
      if (isEdit) {
        res = await librarianService.updateBook(bookId, apiFormData);
      } else {
        res = await librarianService.createBook(apiFormData);
      }

      if (
        res &&
        (res.success || res.status === "OK" || res.data || res.messageStatus === "SUCCESS")
      ) {
        AlertToast(
          isEdit ? "تم تحديث بيانات الكتاب بنجاح" : "تمت إضافة الكتاب إلى المكتبة بنجاح",
          "success"
        );
        if (props.onSuccess) props.onSuccess();
        navigate("/librarian/books");
      } else {
        const errorMsg =
          res?.error === "IMAGE_INVALID_RATIO_COVER"
            ? `نسبة غلاف الكتاب غير مطابقة لمتطلبات النظام (المطلوب 1:1.6 بين 1.35 و 1.85، نسبتك الحالية: ${res.actualRatio || ""})`
            : res?.message || res?.error || "تعذر حفظ بيانات الكتاب، يرجى المحاولة مرة أخرى";
        AlertToast(errorMsg, "error");
      }
    } catch (err) {
      console.error("Book form submission error:", err);
      AlertToast("حدث خطأ أثناء الاتصال بالخادم لحفظ الكتاب", "error");
    } finally {
      setSubmitting(false);
    }
  }, [formData, isEdit, bookId, props, navigate]);

  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault();
      if (!validate()) {
        AlertToast("يرجى استكمال البيانات المطلوبة بشكل صحيح", "error");
        return;
      }
      setIsConfirmModalOpen(true);
    },
    [validate]
  );

  const closeConfirmModal = useCallback(() => {
    setIsConfirmModalOpen(false);
  }, []);

  return {
    book,
    formData,
    existingData,
    categoryOptions,
    subCategoryOptions,
    ageGroupOptions,
    languageOptions,
    genresLoading,
    loadingInitial,
    uploadSpecs,
    errors,
    submitting,
    isEdit,
    navigate,
    handleTitleChange,
    handleCustomAuthorNameChange,
    handleAuthorNameChange: handleCustomAuthorNameChange,
    handleDescriptionChange,

    handleCategoryChange,
    handleSubCategoryChange,
    handleAgeGroupChange,
    handleLanguageChange,
    handleCoverChange,
    handleRemoveCover,
    handleDocumentChange,
    handleRemoveDocument,
    handleSubmit,
    isConfirmModalOpen,
    closeConfirmModal,
    handleConfirmedSubmit,
  };
}

export default useLibrarianBookForm;
