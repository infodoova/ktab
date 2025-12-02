import React, { useState } from "react";
import { X, ChevronDown, Info } from "lucide-react";
import { AlertToast } from "../../../AlertToast";
import { patchHelper } from "../../../../../../apis/apiHelpers";

const WarningBox = ({ children }) => (
  <div className="mt-1.5 text-[var(--earth-brown)]/60 text-xs flex items-start gap-2 leading-tight">
    <Info className="w-3.5 h-3.5 text-[var(--earth-olive)] mt-0.5 flex-shrink-0" />
    <div>{children}</div>
  </div>
);

const categories = [
  "روايات",
  "قصص قصيرة",
  "تطوير الذات",
  "علوم وتكنولوجيا",
  "تاريخ",
  "شعر",
];

const ageGroups = [
  { label: "أطفال (3-8 سنوات)", min: 3, max: 8 },
  { label: "ناشئة (9-15 سنة)", min: 9, max: 15 },
  { label: "شباب (16-24 سنة)", min: 16, max: 24 },
  { label: "كبار (25+)", min: 25, max: 100 },
];

export default function UpdateBookModal({ open, onClose, book, onUpdated }) {
  /* FORM STATE */
  const [form, setForm] = useState({
    title: "",
    description: "",
    genre: "",
    ageRangeMin: 3,
    ageRangeMax: 8,
  });

  
  const [activeBookId, setActiveBookId] = useState(null);

  if (open && book && book.id !== activeBookId) {
    setActiveBookId(book.id);
    setForm({
      title: book.title || "",
      description: book.description || "",
      genre: book.genre || "",
      ageRangeMin: book.ageRangeMin || 3,
      ageRangeMax: book.ageRangeMax || 8,
    });
  }

  if (!open && activeBookId !== null) {
    setActiveBookId(null);
  }

  /* TOAST SYSTEM */
  const [toast, setToast] = useState({
    open: false,
    variant: "info",
    title: "",
    description: "",
  });

  const showError = (t, d) =>
    setToast({ open: true, variant: "error", title: t, description: d });

  const showSuccess = (t, d) =>
    setToast({ open: true, variant: "success", title: t, description: d });


  const [isLoading, setIsLoading] = useState(false);

  const isFormChanged = () => {
    if (!book) return false;
    return (
      form.title !== (book.title || "") ||
      form.description !== (book.description || "") ||
      form.genre !== (book.genre || "") ||
      form.ageRangeMin !== (book.ageRangeMin || 3) ||
      form.ageRangeMax !== (book.ageRangeMax || 8)
    );
  };

  const isDirty = isFormChanged();
  const isValid = Boolean(form.title && form.genre && form.description);

const handleUpdate = async () => {
  if (!isValid) return showError("حقول ناقصة", "يرجى تعبئة جميع الحقول.");
  if (!isDirty) return showError("لم يتغير شيء", "لم تقم بتعديل أي بيانات.");

  setIsLoading(true);
  try {
    const formData = new FormData();

    const bookData = {
      title: form.title,
      description: form.description,
      genre: form.genre,
      language: "arabic",
      ageRangeMin: form.ageRangeMin,
      ageRangeMax: form.ageRangeMax,
    };

   
    const jsonBlob = new Blob([JSON.stringify(bookData)], {
      type: "application/json",
    });

    formData.append("bookDto", jsonBlob);

    const res = await patchHelper({
      url: `${import.meta.env.VITE_API_URL}/authors/updateBook/${book.id}`,
      body: formData,
    });

    showSuccess("تم التحديث", "تم تحديث بيانات الكتاب بنجاح");
    onUpdated(res);
    setIsLoading(false);
    onClose();
  } catch (err) {
    console.error("Update Error:", err);
    setIsLoading(false);
    showError("فشل التحديث", err?.message || "حدث خطأ أثناء تحديث الكتاب.");
  }
};




  if (!open || !book) return null;

  // Shared Input Styles
  const inputClasses =
    "w-full h-11 px-4 rounded-lg bg-white border border-gray-200 text-sm md:text-base focus:ring-2 focus:ring-[var(--earth-olive)] focus:border-transparent outline-none transition-all";
  const labelClasses =
    "block mb-1.5 text-sm font-semibold text-[var(--earth-brown-dark)]";

  return (
    <>
      {/* BACKDROP */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[999]"
        onClick={onClose}
      />

      {/* MODAL CONTAINER */}
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <div
          className="bg-[var(--earth-paper)] w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl md:rounded-3xl shadow-2xl animate-fade-in flex flex-col"
          dir="rtl"
        >
          <div className="p-6 md:p-10">
            {/* HEADER */}
            <div className="flex items-start justify-between mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[var(--earth-brown-dark)]">
                  تعديل بيانات الكتاب
                </h2>
                <p className="text-[var(--earth-brown)]/70 mt-1 text-xs md:text-sm">
                  يمكنك تعديل النصوص، أما الملفات (الصورة/PDF) فهي للمعاينة فقط.
                </p>
              </div>

              <button
                onClick={onClose}
                className="p-1 hover:bg-black/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-[var(--earth-brown)] hover:text-red-500" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* LEFT SIDE — Editable Inputs */}
              <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
                {/* Title */}
                <div>
                  <label className={labelClasses}>عنوان الكتاب *</label>
                  <input
                    className={inputClasses}
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    disabled={isLoading}
                  />
                  <WarningBox>الحد الأقصى 255 حرف.</WarningBox>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className={labelClasses}>التصنيف *</label>
                    <div className="relative">
                      <select
                        className={`${inputClasses} appearance-none`}
                        value={form.genre}
                        onChange={(e) =>
                          setForm({ ...form, genre: e.target.value })
                        }
                        disabled={isLoading}
                      >
                        <option value="">اختر التصنيف</option>
                        {categories.map((c) => (
                          <option key={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Age */}
                  <div>
                    <label className={labelClasses}>الفئة العمرية *</label>
                    <div className="relative">
                      <select
                        className={`${inputClasses} appearance-none`}
                        value={`${form.ageRangeMin}-${form.ageRangeMax}`}
                        onChange={(e) => {
                          const [min, max] = e.target.value
                            .split("-")
                            .map(Number);
                          setForm({
                            ...form,
                            ageRangeMin: min,
                            ageRangeMax: max,
                          });
                        }}
                        disabled={isLoading}
                      >
                        <option value="">اختر الفئة</option>
                        {ageGroups.map((g) => (
                          <option key={g.label} value={`${g.min}-${g.max}`}>
                            {g.label}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className={labelClasses}>وصف الكتاب *</label>
                  <textarea
                    className="w-full p-4 rounded-lg bg-white border border-gray-200 text-sm md:text-base focus:ring-2 focus:ring-[var(--earth-olive)] focus:border-transparent outline-none transition-all h-32 resize-none"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    disabled={isLoading}
                  />
                  <WarningBox>يرجى كتابة وصف مختصر وواضح.</WarningBox>
                </div>
              </div>

              {/* RIGHT SIDE — Preview Only */}
              <div className="lg:col-span-5 flex flex-col gap-5 order-1 lg:order-2">
                {/* Cover Preview */}
                <div className="w-full max-w-[180px] lg:max-w-full mx-auto">
                  <label
                    className={`${labelClasses} text-center lg:text-right w-full`}
                  >
                    معاينة الغلاف
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-xl w-full bg-white shadow-sm p-2 flex items-center justify-center relative overflow-hidden"
                    style={{ aspectRatio: "1 / 1.5" }}
                  >
                    <img
                      src={book.coverImageUrl}
                      alt="غلاف الكتاب"
                      className="w-full h-full rounded-lg object-cover"
                    />
                  </div>
                </div>

                {/* PDF Preview */}
                <div className="hidden sm:block">
                  <label className={labelClasses}>ملف الكتاب</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl h-[120px] w-full flex flex-col items-center justify-center bg-white shadow-sm p-4 text-center">
                    <p className="text-sm text-gray-600 mb-3 truncate max-w-full px-2">
                      {book.pdfFileName || "ملف PDF"}
                    </p>
                    <a
                      href={book.pdfDownloadUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-6 py-2 bg-[var(--earth-olive)]/10 text-[var(--earth-olive)] hover:bg-[var(--earth-olive)] hover:text-white transition-colors rounded-lg text-sm font-semibold"
                    >
                      فتح الملف
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="mt-8 md:mt-10 border-t pt-6 flex justify-end lg:justify-start">
              <button
                onClick={handleUpdate}
                disabled={!isDirty || !isValid || isLoading}
                className={`w-full md:w-auto px-10 py-3 bg-[var(--earth-olive)] hover:bg-[var(--earth-olive)]/90 text-white rounded-xl text-base font-semibold shadow-lg shadow-[var(--earth-olive)]/20 transition-all ${(!isDirty || !isValid || isLoading) ? "opacity-60 cursor-not-allowed pointer-events-none" : ""}`}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                    جارٍ الحفظ...
                  </span>
                ) : (
                  "حفظ التعديلات"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST */}
      <AlertToast
        open={toast.open}
        variant={toast.variant}
        title={toast.title}
        description={toast.description}
        onClose={() => setToast({ ...toast, open: false })}
      />
    </>
  );
}