import React, { useState } from "react";
import { Upload } from "lucide-react";

export default function PdfInputCard({ onGenerate, loading }) {
  const [pdf, setPdf] = useState(null);

  const [type, setType] = useState("SUMMARY"); 
  const [wordCount, setWordCount] = useState(300);
  const [audience, setAudience] = useState("GENERAL");

  const pickPDF = (e) => {
    const file = e.target.files[0];
    if (!file) return;

   

    if (file.size > 10 * 1024 * 1024)
      return onGenerate(null, "الملف كبير جدًا", "الحد الأقصى 10MB");

    setPdf(file);
  };

  const handlePress = () => {
    if (!pdf)
      return onGenerate(null, "لا يوجد ملف", "قم برفع ملف PDF");

    onGenerate(
      { type, wordCount, audience, file: pdf }
    );
  };

  return (
    <div
      className="
        w-full max-w-xl
        p-8 rounded-2xl
        bg-[var(--earth-paper)]
        border border-[var(--earth-brown)]/15
        shadow-[0_4px_20px_rgba(0,0,0,0.04)]
        backdrop-blur-sm
        flex flex-col gap-6
        animate-fadeIn
      "
      dir="rtl"
    >

      {/* 🔵 نوع الخلاصة */}
      <div>
        <label className="font-semibold text-[var(--earth-brown)] text-sm mb-2 block">
          نوع الخلاصة
        </label>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setType("SUMMARY")}
            className={`
              px-4 py-3 rounded-xl border text-sm
              ${type === "SUMMARY"
                ? "bg-[var(--earth-olive)] text-white border-[var(--earth-olive)]"
                : "bg-[var(--earth-cream)]/70 border-[var(--earth-sand)]"}
            `}
          >
            ملخص شامل
          </button>

          <button
            onClick={() => setType("POINTS")}
            className={`
              px-4 py-3 rounded-xl border text-sm
              ${type === "POINTS"
                ? "bg-[var(--earth-olive)] text-white border-[var(--earth-olive)]"
                : "bg-[var(--earth-cream)]/70 border-[var(--earth-sand)]"}
            `}
          >
            النقاط الرئيسية
          </button>

          <button
            onClick={() => setType("EDU")}
            className={`
              px-4 py-3 rounded-xl border text-sm
              ${type === "EDU"
                ? "bg-[var(--earth-olive)] text-white border-[var(--earth-olive)]"
                : "bg-[var(--earth-cream)]/70 border-[var(--earth-sand)]"}
            `}
          >
            رؤى تعليمية
          </button>

          <button
            onClick={() => setType("TAKEAWAYS")}
            className={`
              px-4 py-3 rounded-xl border text-sm
              ${type === "TAKEAWAYS"
                ? "bg-[var(--earth-olive)] text-white border-[var(--earth-olive)]"
                : "bg-[var(--earth-cream)]/70 border-[var(--earth-sand)]"}
            `}
          >
            الاستنتاجات الرئيسية
          </button>
        </div>
      </div>

      {/* 🔵 عدد الكلمات */}
      <div>
        <label className="font-semibold text-[var(--earth-brown)] text-sm mb-2 block">
          طول الخلاصة — {wordCount} كلمة
        </label>

        <input
          type="range"
          min="50"
          max="500"
          value={wordCount}
          onChange={(e) => setWordCount(Number(e.target.value))}
          className="w-full accent-[var(--earth-olive)]"
        />

        <div className="flex justify-between text-xs opacity-60 mt-1">
          <span>(50) مختصر</span>
          <span>(250) متوسط</span>
          <span>(500) مفصل</span>
        </div>
      </div>

      {/* 🔵 الجمهور */}
      <div>
        <label className="font-semibold text-[var(--earth-brown)] text-sm mb-2 block">
          مستوى الجمهور
        </label>

        <select
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          className="
            w-full h-12 px-3 rounded-xl
            border border-[var(--earth-sand)]
            bg-[var(--earth-cream)]/80
            focus:outline-none
          "
        >
          <option value="GENERAL">الجمهور العام</option>
          <option value="BABYIES">الاطفال</option>
          <option value="TEENAGERS">المراهقون</option>
          <option value="PROFESSIONALS">الاكادميون و الباحثون</option>

        </select>
      </div>

      {/* 🔵 PDF UPLOAD */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-[var(--earth-brown)] text-sm">
          ملف PDF
        </label>

        <label
          className="
            w-full h-40 rounded-xl cursor-pointer
            border-2 border-dashed border-[var(--earth-olive)]/40
            bg-[var(--earth-cream)]/40
            flex flex-col items-center justify-center
            hover:border-[var(--earth-olive)]/60
            transition
          "
        >
          <Upload className="w-9 h-9 opacity-60" />
          <p className="text-sm opacity-70 mt-2">اضغط لاختيار ملف PDF</p>

          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={pickPDF}
          />
        </label>

        {pdf && (
          <p className="text-[var(--earth-olive)] font-semibold text-sm mt-1">
            ✔ {pdf.name}
          </p>
        )}
      </div>

      {/* BUTTON */}
      <button
        onClick={handlePress}
        disabled={loading}
        className={`
          w-full h-12 rounded-xl text-white font-semibold transition-all
          ${loading
            ? "bg-[var(--earth-olive)]/50 cursor-not-allowed"
            : "bg-[var(--earth-olive)] hover:bg-[var(--earth-olive-dark)]"}
        `}
      >
        {loading ? "جاري التوليد..." : "توليد الخلاصة"}
      </button>
    </div>
  );
}
