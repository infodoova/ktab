import React, { useEffect } from "react";
import {
  X,
  Star,
  Download,
  Share2,
  BookOpen,
  Headphones,
  Globe,
  Smile,
} from "lucide-react";

export default function BookDetailsModal({ book, onClose }) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (book) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [book]);

  if (!book) return null;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: book.title,
        text: `اقرأ كتاب: ${book.title}`,
        url: book.pdfDownloadUrl,
      });
    } else {
      navigator.clipboard.writeText(book.pdfDownloadUrl);
      alert("تم نسخ رابط الكتاب");
    }
  };

  const displayLanguage =
    book.language?.toUpperCase() === "AR" ||
    book.language?.toLowerCase() === "arabic"
      ? "العربية"
      : book.language?.toUpperCase() || "AR";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      dir="rtl"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[var(--earth-brown)]/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="
          relative 
          bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col md:flex-row 
          animate-in fade-in zoom-in-95 duration-300
mt-8 sm:mt-0
          
          w-[90%] h-[80%]
          
          /* --- DESKTOP SPECIFIC (Reverting to original design) --- */
          md:w-full md:max-w-5xl md:h-auto md:max-h-[650px]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Always fixed relative to card */}
        <button
          onClick={onClose}
          className="
            absolute top-4 left-4 z-20 p-2 rounded-full 
            bg-white/80 backdrop-blur text-[var(--earth-brown)] 
            hover:bg-[var(--earth-sand)]/30 transition shadow-sm
          "
        >
          <X size={20} />
        </button>

        {/* --- LEFT SIDE: Image (FIXED - Does not scroll) --- */}
        <div
          className="
            w-full md:w-[40%] bg-[var(--earth-sand)]/20 relative 
            flex items-center justify-center 
            shrink-0 /* Prevents image area from shrinking when text is long */
            p-4 md:p-8 /* Less padding on mobile to save vertical space */
          "
        >
          <div className="relative shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] rounded-2xl overflow-hidden w-28 md:w-56 aspect-[2/3] transform transition md:hover:scale-105 duration-500 z-10">
            {book.coverImageUrl ? (
              <img
                src={book.coverImageUrl}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-[var(--earth-sand)] flex items-center justify-center text-white">
                <BookOpen size={48} />
              </div>
            )}

            {/* Audio Badge Overlay */}
            {book.hasAudio && (
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white p-1.5 rounded-full">
                <Headphones size={14} />
              </div>
            )}
          </div>

          {/* Decorative Blur behind image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--earth-cream)]/50 to-transparent pointer-events-none" />
        </div>

        {/* --- RIGHT SIDE: Content (SCROLLABLE AREA) --- */}
        <div className="flex-1 flex flex-col p-6 md:p-10 overflow-y-auto custom-scrollbar bg-white">
          {/* 1. Header & Rating */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-[var(--earth-olive)]/10 text-[var(--earth-olive)] text-xs font-bold border border-[var(--earth-olive)]/20">
                {book.mainGenreName || "تصنيف عام"}
              </span>
              <span className="px-3 py-1 rounded-full bg-[var(--earth-olive)]/10 text-[var(--earth-olive)] text-xs font-bold border border-[var(--earth-olive)]/20">
                {book.subGenreName || "تصنيف عام"}
              </span>
              {/* Rating Pill */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--earth-sand)]/20 text-[var(--earth-brown)] text-xs font-medium">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span>{book.averageRating?.toFixed(1) || "0.0"}</span>
                <span className="text-[var(--earth-brown)]/40">
                  ({book.totalReviews || 0} تقييم)
                </span>
              </div>
            </div>

            <h2 className="text-2xl md:text-4xl font-extrabold text-[var(--earth-brown)] leading-tight mb-2">
              {book.title}
            </h2>
          </div>

          {/* 2. Feature Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {/* Age Range */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[var(--earth-cream)]/50 border border-[var(--earth-sand)]/20 text-center">
              <Smile size={18} className="text-[var(--earth-olive)] mb-1" />
              <span className="text-xs text-[var(--earth-brown)]/60">
                العمر
              </span>
              <span className="font-bold text-[var(--earth-brown)] text-sm">
                {book.ageRangeMin}-{book.ageRangeMax} سنة
              </span>
            </div>

            {/* Language */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[var(--earth-cream)]/50 border border-[var(--earth-sand)]/20 text-center">
              <Globe size={18} className="text-[var(--earth-olive)] mb-1" />
              <span className="text-xs text-[var(--earth-brown)]/60">
                اللغة
              </span>
              <span className="font-bold text-[var(--earth-brown)] text-sm uppercase">
                {displayLanguage}
              </span>
            </div>

            {/* Pages */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[var(--earth-cream)]/50 border border-[var(--earth-sand)]/20 text-center">
              <BookOpen size={18} className="text-[var(--earth-olive)] mb-1" />
              <span className="text-xs text-[var(--earth-brown)]/60">
                الصفحات
              </span>
              <span className="font-bold text-[var(--earth-brown)] text-sm">
                {book.pageCount || "--"}
              </span>
            </div>

            {/* Audio Available */}
            <div
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center ${
                book.hasAudio
                  ? "bg-[var(--earth-olive)]/10 border-[var(--earth-olive)]/30"
                  : "bg-[var(--earth-cream)]/50 border-[var(--earth-sand)]/20"
              }`}
            >
              <Headphones
                size={18}
                className={`mb-1 ${
                  book.hasAudio
                    ? "text-[var(--earth-olive)]"
                    : "text-[var(--earth-brown)]/40"
                }`}
              />
              <span className="text-xs text-[var(--earth-brown)]/60">صوتي</span>
              <span
                className={`font-bold text-sm ${
                  book.hasAudio
                    ? "text-[var(--earth-olive)]"
                    : "text-[var(--earth-brown)]/40"
                }`}
              >
                {book.hasAudio ? "متوفر" : "غير متوفر"}
              </span>
            </div>
          </div>

          {/* 3. Description */}
          <div className="flex-1 mb-8">
            <h3 className="text-sm font-bold text-[var(--earth-brown)] mb-2 flex items-center gap-2">
              نبذة عن الكتاب
            </h3>
            <p className="text-[var(--earth-brown)]/80 leading-relaxed text-sm md:text-base text-justify whitespace-pre-line">
              {book.description || "لا يتوفر وصف لهذا الكتاب حالياً."}
            </p>
          </div>

          {/* 4. Action Buttons Footer */}
          <div className="mt-auto flex flex-col gap-3">
            {/* Main Actions */}
            <div className="flex gap-3">
              <a
                href={book.pdfDownloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-[2] flex items-center justify-center gap-2 bg-[var(--earth-brown)] hover:bg-[var(--earth-olive)] text-white py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-[var(--earth-brown)]/10 hover:shadow-xl hover:-translate-y-0.5"
              >
                <Download size={20} />
                <span>تحميل / قراءة</span>
              </a>

              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border-2 border-[var(--earth-sand)]/50 text-[var(--earth-brown)] hover:bg-[var(--earth-cream)] transition-colors font-semibold"
              >
                <Share2 size={18} />
                <span className="hidden sm:inline">مشاركة</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
