import React, { useRef } from "react";
import { AppLayout } from "@/components/myui/layout";
import {
  useStoryEditor,
  GENRE_PRESETS,
  LENS_OPTIONS,
  ART_STYLES,
} from "../hooks/useStoryEditor";
import {
  Upload,
  Sparkles,
  Layers,
  Send,
  Loader2,
  Image as ImageIcon,
  X,
} from "lucide-react";

/**
 * Pure presentation view for creating new interactive stories.
 */
export function NewInteractiveStoryView({ pageName = "قصة تفاعلية جديدة" }) {
  const {
    formData,
    coverPreview,
    isSubmitting,
    handleInputChange,
    handleCoverSelect,
    handleSubmit,
  } = useStoryEditor();

  const fileInputRef = useRef(null);

  return (
    <AppLayout pageName={pageName} showSearch={false}>
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto" dir="rtl">
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-black/5 shadow-sm space-y-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            إعداد عالم القصة التفاعلية
          </h2>

          {/* Title */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
              عنوان القصة <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="مثال: سر الكهف المفقود..."
              className="w-full bg-slate-50 border border-black/5 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#5de3ba] transition-colors"
            />
          </div>

          {/* Genre Selection Grid */}
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
              نوع القصة والتصنيف <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {GENRE_PRESETS.map((g) => {
                const active = formData.genre === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => handleInputChange("genre", g.id)}
                    className={`p-4 rounded-2xl border text-right transition-all duration-200 ${
                      active
                        ? "bg-[#5de3ba]/15 border-[#5de3ba] shadow-sm text-slate-900"
                        : "bg-slate-50 border-black/5 hover:border-black/10 text-slate-700"
                    }`}
                  >
                    <span className="font-black text-xs block mb-1">{g.name}</span>
                    <span className="text-[10px] text-slate-400 font-bold block">{g.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Narrative Lens & Art Style */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Lens */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
                منظور السرد <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.lens}
                onChange={(e) => handleInputChange("lens", e.target.value)}
                className="w-full bg-slate-50 border border-black/5 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:border-[#5de3ba] transition-colors"
              >
                {LENS_OPTIONS.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.label} - {l.desc}
                  </option>
                ))}
              </select>
            </div>

            {/* Art Style */}
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
                النمط البصري لتوليد المشاهد <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.artStyle}
                onChange={(e) => handleInputChange("artStyle", e.target.value)}
                className="w-full bg-slate-50 border border-black/5 rounded-2xl px-5 py-4 text-sm font-bold text-slate-800 outline-none focus:border-[#5de3ba] transition-colors"
              >
                {ART_STYLES.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Max Scenes Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
                أقصى عدد لمشاهد المسار الواحد
              </label>
              <span className="text-xs font-black px-3 py-1 bg-[#5de3ba]/20 text-black rounded-full">
                {formData.sceneCount} مشاهد
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              step="1"
              value={formData.sceneCount}
              onChange={(e) => handleInputChange("sceneCount", Number(e.target.value))}
              className="w-full accent-[#5de3ba] cursor-pointer"
            />
          </div>

          {/* Constitution / Premise */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
              تمهيد القصة وقوانين العالم <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={5}
              value={formData.constitution}
              onChange={(e) => handleInputChange("constitution", e.target.value)}
              placeholder="اكتب تمهيد القصة، الشخصيات الرئيسية، والأحداث التأسيسية التي يبدأ منها القارئ رحلته..."
              className="w-full bg-slate-50 border border-black/5 rounded-2xl p-5 text-sm font-bold text-slate-800 placeholder:text-slate-400 outline-none focus:border-[#5de3ba] transition-colors resize-none leading-relaxed"
            />
          </div>

          {/* Cover Image Upload */}
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
              صورة غلاف القصة <span className="text-red-500">*</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) => handleCoverSelect(e.target.files?.[0])}
              className="hidden"
            />

            {coverPreview ? (
              <div className="relative w-44 h-60 rounded-2xl overflow-hidden shadow-lg border border-black/10 mx-auto">
                <img src={coverPreview} alt="غلاف القصة" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleCoverSelect(null)}
                  className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition-all"
                  title="حذف الغلاف"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center text-center cursor-pointer py-10 px-6 bg-slate-50 border-2 border-dashed border-black/10 rounded-[2.5rem] hover:border-[#5de3ba] transition-all group"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#5de3ba]/10 text-[#5de3ba] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Upload size={28} />
                </div>
                <span className="text-sm font-black text-slate-800 mb-1">رفع صورة الغلاف</span>
                <span className="text-xs font-bold text-slate-400">JPG أو PNG (حتى 5MB)</span>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-premium px-12 py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl flex items-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>جاري بناء القصة...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>إنشاء ونشر القصة التفاعلية</span>
              </>
            )}
          </button>
        </div>
      </form>
    </AppLayout>
  );
}

export default NewInteractiveStoryView;
