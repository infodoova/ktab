import React, { useState } from "react";
import { Upload } from "lucide-react";

export default function PdfInputCard({ onGenerate, loading }) {
  const [title, setTitle] = useState("");
  const [pdf, setPdf] = useState(null);

  const pickPDF = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== "application/pdf")
      return onGenerate(null, null, "الملف غير صالح", "يجب أن يكون PDF");

    if (file.size > 10 * 1024 * 1024)
      return onGenerate(null, null, "الملف كبير جداً", "الحد الأقصى 10MB");

    setPdf(file);
  };

  const handlePress = () => {
    if (!title.trim())
      return onGenerate(null, null, "العنوان فارغ", "أدخل عنوان الكتاب");

    if (!pdf)
      return onGenerate(null, null, "لا يوجد ملف", "قم برفع ملف PDF");

    onGenerate(title, pdf);
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

      {/* TITLE INPUT */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-[var(--earth-brown)] text-sm">
          عنوان الكتاب
        </label>

        <input
          maxLength={255}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="أدخل عنوان الكتاب"
          className="
            w-full h-12 px-4 rounded-xl
            bg-[var(--earth-cream)]
            border border-[var(--earth-sand)]/40
            focus:border-[var(--earth-olive)]
            outline-none transition
          "
        />
      </div>

      {/* PDF UPLOAD */}
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
          w-full h-12 rounded-xl text-white font-semibold
          transition-all
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
