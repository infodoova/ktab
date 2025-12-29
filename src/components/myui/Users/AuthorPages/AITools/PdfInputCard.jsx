import React, { useState } from "react";
import { Upload } from "lucide-react";

export default function PdfInputCard({ onGenerate, loading }) {
  const [pdf, setPdf] = useState(null);
  const [type, setType] = useState("ملخص شامل");
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

    onGenerate({ type, wordCount, audience, file: pdf });
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
          {/* ملخص شامل */}
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

          {/* النقاط الرئيسية */}
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

          {/* رؤى تعليمية */}
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

          {/* الاستنتاجات الرئيسية */}
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

      {/* 🔵 عدد الكلمات */}
      <div>
        <label className="font-semibold text-[var(--earth-brown)] text-sm mb-2 block">
          طول الخلاصة — {wordCount} كلمة
        </label>

        <input
          type="range"
          min="500"
          max="2000"
          value={wordCount}
          onChange={(e) => setWordCount(Number(e.target.value))}
          className="w-full accent-[var(--earth-olive)]"
        />

        <div className="flex justify-between text-xs opacity-60 mt-1">
          <span>(500) مختصر</span>
          <span>(1000) متوسط</span>
          <span>(2000) مفصل</span>
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
          <option value="KIDS_8_10_ADVENTURE">أطفال (8–10)</option>
          <option value="MIDDLE_GRADE_10_13_MYSTERY">ناشئة (10–13)</option>
          <option value="TEENS_13_16_DYSTOPIAN">مراهقون (13–16)</option>
          <option value="OLDER_TEENS_16_18_DRAMA_ROMANCE">شباب (16–18)</option>
          <option value="ADULTS_18_25_LITERARY">بالغون (18–25)</option>
          <option value="ADULTS_25_40_UPMARKET">بالغون (25–40)</option>
          <option value="ADULTS_40_PLUS_HISTORICAL">بالغون (40+)</option>
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
          ${
            loading
              ? "bg-[var(--earth-olive)]/50 cursor-not-allowed"
              : "bg-[var(--earth-olive)] hover:bg-[var(--earth-olive-dark)]"
          }
        `}
      >
        {loading ? "جاري التوليد..." : "توليد الخلاصة"}
      </button>
    </div>
  );
}
