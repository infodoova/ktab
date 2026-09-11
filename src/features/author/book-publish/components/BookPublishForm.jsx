import React, { memo } from "react";
import { CoverImageUploader } from "./CoverImageUploader";
import { PdfUploadZone } from "./PdfUploadZone";
import { AGE_GROUPS, LANG_OPTIONS } from "../hooks/useBookPublish";
import { Save, Send } from "lucide-react";

export const BookPublishForm = memo(function BookPublishForm({
  formData,
  existingData,
  genres = [],
  subGenres = [],
  isEditingDraft = false,
  loading = false,
  onInputChange,
  onGenreChange,
  onPdfChange,
  onSaveDraft,
  onPublish,
}) {
  const handlePdfFileSelect = onPdfChange || ((file) => onInputChange("pdfFile", file));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onPublish();
      }}
      className="space-y-8 max-w-4xl mx-auto"
      dir="rtl"
    >
      <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-black/5 shadow-sm space-y-8">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          {isEditingDraft ? "تعديل مسودة الكتاب" : "بيانات الكتاب الأساسية"}
        </h2>

        {/* Title */}
        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
            عنوان الكتاب <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => onInputChange("title", e.target.value)}
            placeholder="أدخل عنوان الكتاب..."
            className="w-full bg-slate-50 border border-black/5 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#5de3ba] transition-colors"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
            نبذة عن الكتاب <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => onInputChange("description", e.target.value)}
            placeholder="اكتب نبذة مختصرة ومشوقة عن الكتاب..."
            className="w-full bg-slate-50 border border-black/5 rounded-2xl p-5 text-sm font-bold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#5de3ba] transition-colors resize-none"
          />
        </div>

        {/* Category & SubCategory */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
              التصنيف الرئيسي <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.category}
              onChange={(e) => onGenreChange(e.target.value)}
              className="w-full bg-slate-50 border border-black/5 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:border-[#5de3ba] transition-colors"
            >
              <option value="">اختر التصنيف الرئيسي</option>
              {genres.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name || g.arabicName || g.nameAr}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
              التصنيف الفرعي
            </label>
            <select
              value={formData.subCategory}
              onChange={(e) => onInputChange("subCategory", e.target.value)}
              disabled={subGenres.length === 0}
              className="w-full bg-slate-50 border border-black/5 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:border-[#5de3ba] transition-colors disabled:opacity-40"
            >
              <option value="">اختر التصنيف الفرعي (اختياري)</option>
              {subGenres.map((sg) => (
                <option key={sg.id} value={sg.id}>
                  {sg.name || sg.arabicName || sg.nameAr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Age Group & Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
              الفئة العمرية المستهدفة <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.ageGroup}
              onChange={(e) => onInputChange("ageGroup", e.target.value)}
              className="w-full bg-slate-50 border border-black/5 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:border-[#5de3ba] transition-colors"
            >
              <option value="">اختر الفئة العمرية</option>
              {AGE_GROUPS.map((ag) => (
                <option key={ag} value={ag}>
                  {ag}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
              لغة الكتاب <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.language}
              onChange={(e) => onInputChange("language", e.target.value)}
              className="w-full bg-slate-50 border border-black/5 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:border-[#5de3ba] transition-colors"
            >
              {LANG_OPTIONS.map((lang) => (
                <option key={lang.id} value={lang.id}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* File Uploads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-black/5">
          {/* Cover */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
              غلاف الكتاب <span className="text-red-500">*</span>
            </label>
            <CoverImageUploader
              coverFile={formData.coverFile}
              coverUrl={existingData.coverUrl}
              onFileChange={(file) => onInputChange("coverFile", file)}
              onRemoveFile={() => onInputChange("coverFile", null)}
            />
          </div>

          {/* PDF */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
              ملف الكتاب (PDF) <span className="text-red-500">*</span>
            </label>
            <PdfUploadZone
              pdfFile={formData.pdfFile}
              existingPdfName={existingData.pdfName}
              pageCount={existingData.pageCount}
              onFileChange={handlePdfFileSelect}
              onRemoveFile={() => handlePdfFileSelect(null)}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={loading}
          className="w-full sm:w-auto px-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Save size={18} />
          <span>حفظ كمسودة</span>
        </button>

        <button
          type="submit"
          disabled={loading}
          className="btn-premium w-full sm:w-auto px-10 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
        >
          <Send size={18} />
          <span>{isEditingDraft ? "تحديث ونشر الكتاب" : "نشر الكتاب الآن"}</span>
        </button>
      </div>
    </form>
  );
});

export default BookPublishForm;

