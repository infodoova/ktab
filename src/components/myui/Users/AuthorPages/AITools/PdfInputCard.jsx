import React, { useState } from "react";
import { Upload, ChevronDown } from "lucide-react";

export default function PdfInputCard({ onGenerate, loading }) {
  const [pdf, setPdf] = useState(null);
  // const [type, setType] = useState("ملخص شامل");
  const [wordCount, setWordCount] = useState(1000);
  const [audience, setAudience] = useState("KIDS_8_10_ADVENTURE");

  const pickPDF = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024)
      return onGenerate(null, "الملف كبير جدًا", "الحد الأقصى 10MB");

    setPdf(file);
  };

  const handlePress = () => {
    if (!pdf) return onGenerate(null, "لا يوجد ملف", "قم برفع ملف PDF");

    onGenerate({ /* type, */ wordCount, audience, file: pdf });
  };

  return (
    <div
      className="
        w-full max-w-xl
        p-8 md:p-10 rounded-[2.5rem]
        bg-white
        border border-black/5
        shadow-[0_20px_50px_rgba(0,0,0,0.05)]
        flex flex-col gap-8
        animate-fadeIn
      "
      dir="rtl"
    >
      {/* 🔵 نوع الخلاصة */}
      {/* 
      <div>
        <label className="font-semibold text-[var(--earth-brown)] text-sm mb-2 block">
          نوع الخلاصة
        </label>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setType("ملخص شامل")}
            className={`
        px-4 py-3 rounded-xl border text-sm
        ${
          type === "ملخص شامل"
            ? "bg-[var(--earth-olive)] text-white border-[var(--earth-olive)]"
            : "bg-[var(--earth-cream)]/70 border-[var(--earth-sand)]"
        }
      `}
          >
            ملخص شامل
          </button>

          <button
            onClick={() => setType("النقاط الرئيسية")}
            className={`
        px-4 py-3 rounded-xl border text-sm
        ${
          type === "النقاط الرئيسية"
            ? "bg-[var(--earth-olive)] text-white border-[var(--earth-olive)]"
            : "bg-[var(--earth-cream)]/70 border-[var(--earth-sand)]"
        }
      `}
          >
            النقاط الرئيسية
          </button>

          <button
            onClick={() => setType("رؤى تعليمية")}
            className={`
        px-4 py-3 rounded-xl border text-sm
        ${
          type === "رؤى تعليمية"
            ? "bg-[var(--earth-olive)] text-white border-[var(--earth-olive)]"
            : "bg-[var(--earth-cream)]/70 border-[var(--earth-sand)]"
        }
      `}
          >
            رؤى تعليمية
          </button>

          <button
            onClick={() => setType("الاستنتاجات الرئيسية")}
            className={`
        px-4 py-3 rounded-xl border text-sm
        ${
          type === "الاستنتاجات الرئيسية"
            ? "bg-[var(--earth-olive)] text-white border-[var(--earth-olive)]"
            : "bg-[var(--earth-cream)]/70 border-[var(--earth-sand)]"
        }
      `}
          >
            الاستنتاجات الرئيسية
          </button>
        </div>
      </div> 
      */}

      {/* 🔵 عدد الكلمات */}
      <div>
        <label className="block text-sm md:text-base font-black uppercase tracking-[0.2em] text-black/40 mb-6 mr-1">
          طول الخاتمة — {wordCount} كلمة
        </label>

        <input
          type="range"
          min="500"
          max="2000"
          value={wordCount}
          onChange={(e) => setWordCount(Number(e.target.value))}
          className="w-full accent-[#5de3ba]"
        />

        <div className="flex justify-between text-[10px] font-bold text-black/30 uppercase tracking-widest mt-2 px-1">
          <span>مختصر</span>
          <span>متوسط</span>
          <span>مفصل</span>
        </div>
      </div>

      {/* 🔵 الجمهور */}
      <div>
        <label className="block text-sm md:text-base font-black uppercase tracking-[0.2em] text-black/40 mb-4 mr-1">
          مستوى الجمهور
        </label>

        <div className="relative">
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full h-12 md:h-14 px-5 md:px-6 rounded-2xl border border-black/5 bg-black/[0.04] text-base md:text-lg font-bold text-black appearance-none transition-all outline-none focus:bg-white focus:border-[#5de3ba]/30 focus:ring-4 focus:ring-[#5de3ba]/5"
          >
            <option value="KIDS_8_10_ADVENTURE">أطفال (8–10)</option>
            <option value="MIDDLE_GRADE_10_13_MYSTERY">ناشئة (10–13)</option>
            <option value="TEENS_13_16_DYSTOPIAN">مراهقون (13–16)</option>
            <option value="OLDER_TEENS_16_18_DRAMA_ROMANCE">شباب (16–18)</option>
            <option value="ADULTS_18_25_LITERARY">بالغون (18–25)</option>
            <option value="ADULTS_25_40_UPMARKET">بالغون (25–40)</option>
            <option value="ADULTS_40_PLUS_HISTORICAL">بالغون (40+)</option>
          </select>
          <ChevronDown className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black/20 pointer-events-none" />
        </div>
      </div>

      {/* 🔵 PDF UPLOAD */}
      <div className="flex flex-col gap-2">
        <label className="block text-sm md:text-base font-black uppercase tracking-[0.2em] text-black/40 mb-4 mr-1">
          ملف PDF المصدر
        </label>

        <label
          className={`
            w-full h-44 rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden transition-all duration-300 shadow-sm
            ${pdf ? "border-[#5de3ba]/30 bg-white shadow-lg shadow-[#5de3ba]/5" : "bg-black/[0.04] border-black/5 hover:border-[#5de3ba]/30 hover:bg-white"}
          `}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all ${pdf ? "bg-[#5de3ba] text-white shadow-lg shadow-[#5de3ba]/20" : "bg-white border border-black/5 text-black/10"}`}>
             <Upload size={24} strokeWidth={3} />
          </div>
          <p className="text-base font-black text-black px-4 truncate w-full leading-tight">
            {pdf ? pdf.name : "اضغط لاختيار ملف PDF"}
          </p>
          <p className="text-[10px] font-bold text-black/20 uppercase tracking-widest mt-2">
            الحد الأقصى للحجم 10MB
          </p>

          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={pickPDF}
          />
        </label>
      </div>

      {/* BUTTON */}
      <button
        onClick={handlePress}
        disabled={loading}
        className="w-full h-14 md:h-16 rounded-[2rem] btn-premium text-white text-sm font-black uppercase tracking-[0.2em] transition-all disabled:opacity-50 shadow-xl shadow-[#5de3ba]/20 active:scale-[0.98]"
      >
        {loading ? "جاري التوليد..." : "توليد الخاتمة الذكية"}
      </button>
    </div>
  );
}
