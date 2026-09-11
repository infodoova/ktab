import React, { useState, useRef } from "react";
import { Upload, FileText, Sparkles, X } from "lucide-react";
import { AlertToast } from "@/components/myui/AlertToast";

const AUDIENCE_OPTIONS = [
  { id: "KIDS_8_10_ADVENTURE", label: "أطفال (8-10 سنوات) - مغامرة وتشويق" },
  { id: "TEENS_13_16_MYSTERY", label: "يافعين (13-16 سنة) - غموض وإثارة" },
  { id: "YOUNG_ADULTS_FANTASY", label: "شباب (16-24 سنة) - خيال وفانتازيا" },
  { id: "GENERAL_ADULTS", label: "عام وكبار (25+ سنة) - دراما وأدب عام" },
];

export function PdfInputCard({ onGenerate, loading = false }) {
  const [file, setFile] = useState(null);
  const [wordCount, setWordCount] = useState(500);
  const [audience, setAudience] = useState("KIDS_8_10_ADVENTURE");

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== "application/pdf") {
      AlertToast("يرجى اختيار ملف بصيغة PDF فقط.", "ERROR");
      return;
    }

    if (selected.size > 20 * 1024 * 1024) {
      AlertToast("الحد الأقصى لحجم الملف هو 20MB.", "ERROR");
      return;
    }

    setFile(selected);
  };

  const handleTrigger = (e) => {
    e.preventDefault();
    if (!file) {
      AlertToast("يرجى رفع ملف PDF أولاً.", "ERROR");
      return;
    }
    onGenerate({ file, wordCount, audience });
  };

  return (
    <form
      onSubmit={handleTrigger}
      className="w-full lg:w-[450px] p-8 md:p-10 rounded-[2.5rem] bg-white border border-black/5 shadow-sm space-y-6 shrink-0"
      dir="rtl"
    >
      <h3 className="text-xl font-black text-slate-900 tracking-tight">إعدادات التحليل والتوليد</h3>

      {/* PDF Upload Zone */}
      <div className="space-y-2">
        <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
          ملف الكتاب (PDF) <span className="text-red-500">*</span>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        {file ? (
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-black/5">
            <div className="flex items-center gap-3 truncate">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <FileText size={20} />
              </div>
              <span className="text-xs font-bold text-slate-800 truncate">{file.name}</span>
            </div>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center text-center cursor-pointer py-8 px-4 bg-slate-50 border-2 border-dashed border-black/10 rounded-2xl hover:border-[#5de3ba] transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#5de3ba]/10 text-[#5de3ba] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload size={22} />
            </div>
            <span className="text-xs font-black text-slate-800 mb-1">اختر ملف PDF</span>
            <span className="text-[10px] font-bold text-slate-400">حتى 20MB</span>
          </div>
        )}
      </div>

      {/* Audience */}
      <div className="space-y-2">
        <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
          الفئة والأسلوب المستهدف
        </label>
        <select
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          className="w-full bg-slate-50 border border-black/5 rounded-2xl px-4 py-3 text-xs font-bold text-slate-800 outline-none focus:border-[#5de3ba] transition-colors"
        >
          {AUDIENCE_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Word Count */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-black uppercase tracking-widest text-slate-500">
            عدد الكلمات التقريبي
          </label>
          <span className="text-xs font-black px-2.5 py-0.5 bg-[#5de3ba]/20 text-black rounded-full">
            {wordCount} كلمة
          </span>
        </div>
        <input
          type="range"
          min="200"
          max="1500"
          step="50"
          value={wordCount}
          onChange={(e) => setWordCount(Number(e.target.value))}
          className="w-full accent-[#5de3ba] cursor-pointer"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-premium w-full py-4 text-white rounded-2xl font-black text-xs uppercase tracking-widest active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Sparkles size={18} />
        <span>{loading ? "جاري التحليل والتوليد..." : "توليد الخاتمة بالذكاء الاصطناعي"}</span>
      </button>
    </form>
  );
}

export default PdfInputCard;
