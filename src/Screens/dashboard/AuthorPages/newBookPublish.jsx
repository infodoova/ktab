import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Upload, ChevronDown, Info } from "lucide-react";

// Components
import Navbar from "../../../components/myui/Users/AuthorPages/navbar";
import PageHeader from "../../../components/myui/Users/AuthorPages/sideHeader";
import { AlertToast } from "../../../components/myui/AlertToast";
import UploadModal from "../../../components/myui/Users/AuthorPages/createnewbook/UploadModal";

// API Helpers
import {
  postFormDataHelper,
  getHelper,
  patchHelper,
} from "../../../../apis/apiHelpers";

// PDF.js
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

const AGE_GROUPS = [
  "أطفال (3-8 سنوات)",
  "ناشئة (9-15 سنة)",
  "شباب (16-24 سنة)",
  "كبار (25+)",
];

const LANG_OPTIONS = [
  { id: "arabic", label: "العربية" },
  { id: "english", label: "English" },
];

// --- HELPER FUNCTIONS ---

const getAgeRangeValues = (ageString) => {
  if (!ageString) return { min: 0, max: 0 };
  if (ageString.includes("3-8")) return { min: 3, max: 8 };
  if (ageString.includes("9-15")) return { min: 9, max: 15 };
  if (ageString.includes("16-24")) return { min: 16, max: 24 };
  if (ageString.includes("25+")) return { min: 25, max: 100 };
  return { min: 0, max: 0 };
};

const mapValuesToAgeLabel = (min, max) => {
  if (min === 3 && max === 8) return AGE_GROUPS[0];
  if (min === 9 && max === 15) return AGE_GROUPS[1];
  if (min === 16 && max === 24) return AGE_GROUPS[2];
  if (min >= 25) return AGE_GROUPS[3];
  return "";
};

const getPdfPageCount = async (file) => {
  if (!file) return 0;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    return pdf.numPages;
  } catch (e) {
    console.error("PDF Read Error", e);
    return 0;
  }
};

const validateImageDimensions = (file) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const ratio = img.height / img.width;
      const isValid = ratio >= 1.5 && ratio <= 1.7;
      URL.revokeObjectURL(img.src);
      resolve({ isValid, ratio });
    };
    img.onerror = () => resolve({ isValid: false, ratio: 0 });
  });
};

// --- COMPONENT ---

export default function NewBooks({ pageName = "رفع كتاب جديد" }) {
  const { draftId } = useParams();
  const [draft, setDraft] = useState(null);

  // Normalize incoming language values to our LANG_OPTIONS ids
  const normalizeLanguage = (val) => {
    if (!val) return "arabic";
    const s = String(val).toLowerCase();
    if (s.includes("arab") || s === "ar" || s.includes("عرب")) return "arabic";
    if (s.includes("eng") || s === "en" || s.includes("انج")) return "english";
    return "arabic";
  };

  // Derived State
  // Accept either `id` or `bookId` from API responses
  const isEditingDraft = Boolean(draft?.id ?? draft?.bookId);

  // UI State
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // Form State
  const [genres, setGenres] = useState([]);
  const [subGenres, setSubGenres] = useState([]);
  const [genresLoading, setGenresLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "", // sub-genre ID (optional)
    language: "arabic",
    ageGroup: "",
    coverFile: null,
    pdfFile: null,
  });

  // Existing Data State (for visual feedback)
  const [existingData, setExistingData] = useState({
    coverUrl: null,
    pdfName: null,
    pageCount: 0,
  });

  // --- INITIALIZATION ---

  useEffect(() => {
    if (!draft) return;

    setFormData((prev) => ({
      ...prev,
      title: draft.title || "",
      description: draft.description || "",
      ageGroup: mapValuesToAgeLabel(draft.ageRangeMin, draft.ageRangeMax),
      // category/subCategory handled in the genres effect below
      language: draft.language || prev.language || "arabic",
      coverFile: null,
      pdfFile: null,
    }));

    setExistingData({
      coverUrl: draft.coverImageUrl || null,
      pdfName: draft.pdfFileName || "ملف PDF محفوظ مسبقاً",
      pageCount: draft.pageCount || 0,
    });
  }, [draft]);

  // When genres are available, map draft mainGenre/mainGenreId to category/subCategory
  useEffect(() => {
    if (!draft || !genres.length) return;

    let genreId = draft.mainGenreId ? String(draft.mainGenreId) : "";
    let subGenreId = draft.subGenreId ? String(draft.subGenreId) : "";

    if (!genreId && draft.mainGenre) {
      const found = genres.find(
        (g) =>
          String(g.id) === String(draft.mainGenreId) ||
          g.nameAr === draft.mainGenre ||
          g.nameEn === draft.mainGenre ||
          g.name === draft.mainGenre
      );
      if (found) genreId = String(found.id);
    }

    const selectedGenre = genres.find((g) => String(g.id) === genreId);

    setFormData((prev) => ({
      ...prev,
      category: genreId,
      subCategory: subGenreId,
    }));

    setSubGenres(selectedGenre?.subGenres || []);
  }, [draft, genres]);

  useEffect(() => {
    if (!draftId) return;
    (async () => {
      try {
        const res = await getHelper({
          url: `${import.meta.env.VITE_API_URL}/authors/book/${draftId}`,
        });

        const responseBody = res?.data || {};
        if (responseBody.messageStatus != "SUCCESS") {
          AlertToast(responseBody?.message, responseBody?.messageStatus);
          return;
        }

        const internalData = responseBody.data || responseBody;

        // 3. Check if the book is inside a 'content' array (Pagination wrapper)
        let bookPayload = internalData;
        if (
          Array.isArray(internalData.content) &&
          internalData.content.length > 0
        ) {
          bookPayload = internalData.content[0];
        }

        // 4. Normalize the data
        const normalized = {
          ...bookPayload,
          id: bookPayload.id ?? bookPayload.bookId ?? null,
          bookId: bookPayload.bookId ?? bookPayload.id ?? null,
          language: normalizeLanguage(bookPayload.language),
        };

        setDraft(normalized);
      } catch (err) {
        console.error("Fetch draft error:", err);
      }
    })();
  }, [draftId]);

  useEffect(() => {
    const fetchGenres = async () => {
      setGenresLoading(true);

      try {
        const data = await getHelper({
          url: `${import.meta.env.VITE_API_URL}/genres/getAllGenres`,
        });

        setGenres(data?.content || []);
        if (data.messageStatus != "SUCCESS") {
          AlertToast(data?.message, data?.messageStatus);
          return;
        }
      } catch {
        //
      } finally {
        setGenresLoading(false);
      }
    };

    fetchGenres();
  }, []);

  // --- HANDLERS ---

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenreChange = (genreId) => {
    handleInputChange("category", genreId);
    handleInputChange("subCategory", "");

    const selectedGenre = genres.find((g) => g.id === Number(genreId));

    setSubGenres(selectedGenre?.subGenres || []);
  };

  // --- VALIDATION LOGIC ---

  const validateDraft = () => {
    if (!formData.title.trim()) {
      AlertToast("يرجى إدخال عنوان للكتاب لحفظ المسودة.", "ERROR");
      return false;
    }
    return true;
  };

  const validatePublish = async () => {
    const {
      title,
      description,
      category,
      ageGroup,
      coverFile,
      pdfFile,
      language,
    } = formData;

    // 1. Basic Fields
    if (!title || !description || !category || !ageGroup || !language) {
      AlertToast("يرجى تعبئة جميع الحقول النصية.", "ERROR");
      return false;
    }
    if (title.length > 255) {
      AlertToast("الحد الأقصى للعنوان 255 حرف.", "ERROR");
      return false;
    }

    // 2. Files (Require new file OR existing file)
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

    // 3. New File Specific Validation
    if (pdfFile) {
      if (pdfFile.type !== "application/pdf") {
        AlertToast("يجب أن يكون ملف الكتاب بصيغة PDF.", "ERROR");
        return false;
      }
      if (pdfFile.size > 50 * 1024 * 1024) {
        AlertToast("الحد الأقصى لملف PDF هو 50MB.", "ERROR");
        return false;
      }
    }

    if (coverFile) {
      if (!["image/jpeg", "image/png", "image/jpg"].includes(coverFile.type)) {
        AlertToast("يرجى استخدام للصورة JPG أو PNG.", "ERROR");
        return false;
      }
      if (coverFile.size > 5 * 1024 * 1024) {
        AlertToast("الحد الأقصى للصورة هو 5MB.", "ERROR");
        return false;
      }

      const { isValid } = await validateImageDimensions(coverFile);
      if (!isValid) {
        AlertToast("يجب أن تكون نسبة الصورة 1.6:1 تقريباً.", "ERROR");
        return false;
      }
    }

    return true;
  };

  // --- SUBMIT LOGIC: DRAFT ---
  const handleSaveDraft = async () => {
    if (!validateDraft()) return;
    setLoading(true);

    try {
      let finalPageCount = existingData.pageCount || 0;

      if (formData.pdfFile) {
        const count = await getPdfPageCount(formData.pdfFile);
        if (count > 0) {
          finalPageCount = count;
        }
      }

      const { min, max } = getAgeRangeValues(formData.ageGroup);

      const apiFormData = new FormData();

      // Optional files (only if user selected new ones)
      if (formData.coverFile) {
        apiFormData.append("coverImage", formData.coverFile);
      }

      if (formData.pdfFile) {
        apiFormData.append("pdfFile", formData.pdfFile);
      }

      const bookDto = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        mainGenreId: Number(formData.category),
        subGenreId: formData.subCategory ? Number(formData.subCategory) : null,
        language: formData.language || "arabic",
        ageRangeMin: min,
        ageRangeMax: max,
        pageCount: finalPageCount,
        hasAudio: false,
        status: "DRAFT",
      };

      apiFormData.append(
        "bookDto",
        new Blob([JSON.stringify(bookDto)], { type: "application/json" })
      );

      let res;

      if (isEditingDraft) {
        res = await patchHelper({
          url: `${import.meta.env.VITE_API_URL}/authors/updateBook/${
            draft.id ?? draft.bookId
          }`,
          body: apiFormData,
        });

        if (res?.messageStatus !== "SUCCESS") {
          AlertToast(res?.message, res?.messageStatus);
          return;
        }
      } else {
        res = await postFormDataHelper({
          url: `${import.meta.env.VITE_API_URL}/authors/createBook`,
          formData: apiFormData,
        });

        if (res?.messageStatus !== "SUCCESS") {
          AlertToast(res?.message, res?.messageStatus);
          return;
        }
      }

      AlertToast(res?.message, res?.messageStatus);
    } catch (err) {
      console.error(err);
      AlertToast(err?.message || "فشل حفظ المسودة.", "ERROR");
    } finally {
      setLoading(false);
    }
  };

  // --- SUBMIT LOGIC: PUBLISH ---
  const handlePublishBook = async () => {
    // 1. Validation
    const isValid = await validatePublish();
    if (!isValid) return;

    setLoading(true);

    try {
      // 2. Calculate Pages
      let pageCount = existingData.pageCount;
      // If a NEW pdf is uploaded, calculate the count
      if (formData.pdfFile) {
        const count = await getPdfPageCount(formData.pdfFile);
        if (count === 0) throw new Error("تعذر قراءة عدد صفحات PDF.");
        pageCount = count;
      }

      const { min, max } = getAgeRangeValues(formData.ageGroup);

      // 3. Construct Payload
      const apiFormData = new FormData();

      // Only append files if they are new (or mandatory for update)
      if (formData.coverFile)
        apiFormData.append("coverImage", formData.coverFile);
      if (formData.pdfFile) apiFormData.append("pdfFile", formData.pdfFile);

      const bookDto = {
        title: formData.title.trim(), // Use trim for consistency
        description: formData.description.trim(),
        mainGenreId: Number(formData.category),
        subGenreId: formData.subCategory ? Number(formData.subCategory) : null,
        language: formData.language || "arabic",
        ageRangeMin: min,
        ageRangeMax: max,
        pageCount: pageCount,
        hasAudio: false,
        status: "PUBLISHED",
      };

      apiFormData.append(
        "bookDto",
        new Blob([JSON.stringify(bookDto)], { type: "application/json" })
      );

      // 4. Send Request (Differentiating between Create and Update)
      let res;
      if (isEditingDraft) {
        // Use patchHelper for UPDATE. We pass 'body: apiFormData'
       res =   await patchHelper({
          url: `${import.meta.env.VITE_API_URL}/authors/updateBook/${
            draft.id ?? draft.bookId
          }`,
          body: apiFormData
          
        });
        
        if (res?.messageStatus !== "SUCCESS") {
          AlertToast(res?.message, res?.messageStatus);
          return;
        }
      } else {
        // Use postFormDataHelper for CREATE. We pass 'formData: apiFormData'
     res =    await postFormDataHelper({
          url: `${import.meta.env.VITE_API_URL}/authors/createBook`,
          formData: apiFormData,
          // Assuming your postFormDataHelper doesn't support onProgress based on the function provided
        });
      }
      
        if (res?.messageStatus !== "SUCCESS") {
          AlertToast(res?.message, res?.messageStatus);
          return;
        }

          AlertToast(res?.message, res?.messageStatus);

      // 5. Reset Form (Only if creating new)
      if (!isEditingDraft) {
        setFormData({
          title: "",
          description: "",
          category: "",

          ageGroup: "",
          coverFile: null,
          pdfFile: null,
        });
        setExistingData({ coverUrl: null, pdfName: null, pageCount: 0 });
      }
    } catch (err) {
      console.error("Publish Error:", err);
      AlertToast(err?.message || "حدث خطأ غير متوقع.", "ERROR");
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };
  // --- RENDER HELPERS ---

  const WarningBox = ({ children }) => (
    <div className="mt-2 text-[var(--earth-brown)]/60 text-xs flex items-start gap-2 leading-tight">
      <Info className="w-4 h-4 text-[var(--earth-olive)] mt-0.5 flex-shrink-0" />
      <div>{children}</div>
    </div>
  );

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[var(--earth-cream)] font-[family-name:var(--font-arabic)]"
    >
      <div dir="ltr">
        <Navbar
          pageName={pageName}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      </div>

      <div
        className={`flex flex-col min-h-screen transition-all duration-300 ${
          collapsed ? "md:mr-20" : "md:mr-64"
        }`}
      >
        <main className="flex-1 flex flex-col" dir="rtl">
          <PageHeader mainTitle={pageName} />

          <div className="flex-1 px-4 sm:px-6 md:px-12 py-10">
            <div className="w-full max-w-6xl mx-auto bg-[var(--earth-paper)] rounded-3xl shadow-md border p-8 md:p-14">
              {/* Header Text */}
              <div className="mb-10 text-right">
                <h2 className="text-3xl font-bold text-[var(--earth-brown-dark)]">
                  {isEditingDraft ? "تعديل المسودة ونشرها" : "رفع كتاب جديد"}
                </h2>
                <p className="text-[var(--earth-brown)]/70 mt-2">
                  {isEditingDraft
                    ? "يمكنك تعديل بيانات المسودة أدناه ثم حفظها أو نشرها مباشرة."
                    : "املأ المعلومات التالية لنشر كتابك على المنصة."}
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* LEFT SIDE: Inputs */}
                <div className="lg:col-span-7 space-y-8">
                  {/* Title */}
                  <div>
                    <label className="font-semibold text-[var(--earth-brown-dark)]">
                      عنوان الكتاب *
                    </label>
                    <input
                      type="text"
                      className="w-full h-14 px-5 rounded-xl bg-white border text-lg focus:outline-none focus:ring-2 focus:ring-[var(--earth-olive)]"
                      placeholder="أدخل عنوان الكتاب"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                    />
                    <WarningBox>
                      الحد الأقصى للعنوان هو{" "}
                      <span className="font-semibold">255 حرف</span>.
                    </WarningBox>
                  </div>
                  {/* Language */}
                  <div>
                    <label className="font-semibold text-[var(--earth-brown-dark)]">
                      اللغة *
                    </label>

                    <div className="relative">
                      <select
                        className="w-full h-14 px-5 rounded-xl bg-white border text-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--earth-olive)]"
                        value={formData.language}
                        onChange={(e) =>
                          handleInputChange("language", e.target.value)
                        }
                      >
                        {LANG_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.label}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="font-semibold text-[var(--earth-brown-dark)]">
                      التصنيف الرئيسي *
                    </label>

                    <div className="relative">
                      <select
                        className="w-full h-14 px-5 rounded-xl bg-white border text-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--earth-olive)]"
                        value={formData.category}
                        onChange={(e) => handleGenreChange(e.target.value)}
                        disabled={genresLoading}
                      >
                        <option value="">
                          {genresLoading ? "جاري التحميل..." : "اختر التصنيف"}
                        </option>

                        {genres.map((genre) => (
                          <option key={genre.id} value={genre.id}>
                            {genre.nameAr}
                          </option>
                        ))}
                      </select>

                      <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {formData.category && subGenres.length > 0 && (
                    <div>
                      <label className="font-semibold text-[var(--earth-brown-dark)]">
                        التصنيف الفرعي (اختياري)
                      </label>

                      <div className="relative">
                        <select
                          className="w-full h-14 px-5 rounded-xl bg-white border text-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--earth-olive)]"
                          value={formData.subCategory}
                          onChange={(e) =>
                            handleInputChange("subCategory", e.target.value)
                          }
                        >
                          <option value="">بدون تصنيف فرعي</option>

                          {subGenres.map((sub) => (
                            <option key={sub.id} value={sub.id}>
                              {sub.nameAr}
                            </option>
                          ))}
                        </select>

                        <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  )}

                  {/* Age Group */}
                  <div>
                    <label className="font-semibold text-[var(--earth-brown-dark)]">
                      الفئة العمرية *
                    </label>
                    <div className="relative">
                      <select
                        className="w-full h-14 px-5 rounded-xl bg-white border text-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--earth-olive)]"
                        value={formData.ageGroup}
                        onChange={(e) =>
                          handleInputChange("ageGroup", e.target.value)
                        }
                      >
                        <option value="">اختر الفئة العمرية</option>
                        {AGE_GROUPS.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="font-semibold text-[var(--earth-brown-dark)]">
                      وصف الكتاب *
                    </label>
                    <textarea
                      className="w-full p-5 rounded-xl bg-white border text-lg h-40 focus:outline-none focus:ring-2 focus:ring-[var(--earth-olive)]"
                      placeholder="اكتب وصفاً للكتاب"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                    />
                    <WarningBox>
                      حاول كتابة وصف مختصر وواضح ليساعد القراء على فهم محتوى
                      الكتاب.
                    </WarningBox>
                  </div>
                </div>

                {/* RIGHT SIDE: Uploads */}
                <div className="lg:col-span-5 flex flex-col gap-8 mt-4">
                  {/* Cover Upload */}
                  <div>
                    <input
                      id="coverInput"
                      type="file"
                      accept="image/jpeg, image/png, image/jpg"
                      className="hidden"
                      onChange={(e) =>
                        handleInputChange("coverFile", e.target.files[0])
                      }
                    />
                    <label htmlFor="coverInput">
                      <div
                        className={`border-2 border-dashed rounded-2xl w-full flex flex-col items-center justify-center text-center cursor-pointer shadow-sm p-6 overflow-hidden transition-colors ${
                          formData.coverFile || existingData.coverUrl
                            ? "border-[var(--earth-olive)] bg-[var(--earth-olive)]/5"
                            : "bg-white border-gray-300"
                        }`}
                        style={{ aspectRatio: "1 / 1.6" }}
                      >
                        {formData.coverFile ? (
                          <img
                            src={URL.createObjectURL(formData.coverFile)}
                            alt="Preview"
                            className="w-full h-full rounded-2xl object-cover"
                          />
                        ) : existingData.coverUrl ? (
                          <img
                            src={existingData.coverUrl}
                            alt="Existing Cover"
                            className="w-full h-full rounded-2xl object-cover"
                          />
                        ) : (
                          <>
                            <Upload className="w-8 h-8 mb-3 text-gray-600" />
                            <p className="text-lg text-gray-700">
                              اضغط لرفع صورة الغلاف
                            </p>
                          </>
                        )}
                      </div>
                    </label>
                    <WarningBox>
                      النسبة المطلوبة:{" "}
                      <span className="font-semibold">1.6:1</span> (1.5 - 1.7).
                      <br />
                      الحد الأقصى: <span className="font-semibold">
                        5MB
                      </span>{" "}
                      (JPG/PNG).
                    </WarningBox>
                  </div>

                  {/* PDF Upload */}
                  <div>
                    <input
                      id="pdfInput"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) =>
                        handleInputChange("pdfFile", e.target.files[0])
                      }
                    />
                    <label htmlFor="pdfInput">
                      <div
                        className={`border-2 border-dashed rounded-2xl h-[180px] w-full flex flex-col items-center justify-center text-center cursor-pointer shadow-sm p-6 transition-colors ${
                          formData.pdfFile || existingData.pdfName
                            ? "border-[var(--earth-olive)] bg-[var(--earth-olive)]/5"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        <Upload
                          className={`w-8 h-8 mb-3 ${
                            formData.pdfFile || existingData.pdfName
                              ? "text-[var(--earth-olive)]"
                              : "text-gray-600"
                          }`}
                        />
                        <p className="text-lg text-gray-700 font-medium px-4 truncate w-full">
                          {formData.pdfFile
                            ? formData.pdfFile.name
                            : existingData.pdfName
                            ? existingData.pdfName
                            : "اضغط لرفع ملف الكتاب (PDF)"}
                        </p>
                        {(formData.pdfFile || existingData.pdfName) && (
                          <span className="text-xs text-[var(--earth-olive)] mt-2 font-bold">
                            تم تحديد الملف
                          </span>
                        )}
                      </div>
                    </label>
                    <WarningBox>
                      صيغة PDF فقط. الحجم الأقصى 50MB.
                      <br />
                      سيتم حساب الصفحات تلقائياً.
                    </WarningBox>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 pt-10 border-t mt-10">
                <button
                  onClick={handleSaveDraft}
                  disabled={loading}
                  className="px-8 py-4 bg-[var(--earth-sand)] text-[var(--earth-brown)] rounded-xl font-semibold hover:bg-[#e8dec8] transition-colors disabled:opacity-50"
                >
                  {isEditingDraft ? "تحديث المسودة" : "حفظ كمسودة"}
                </button>

                <button
                  onClick={handlePublishBook}
                  disabled={loading}
                  className="px-12 py-4 bg-[var(--earth-olive)] text-white rounded-xl font-semibold hover:bg-[#6b7c4a] transition-colors disabled:opacity-50 flex-1 sm:flex-none"
                >
                  {loading ? "جاري النشر..." : "نشر الكتاب"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <UploadModal open={loading} progress={progress} />
    </div>
  );
}
