import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  Star,
  BookOpen,
  Headphones,
  Globe,
  Smile,
  ArrowLeft,
} from "lucide-react";

export default function BookDetailsModal({ book, onClose }) {
  const navigate = useNavigate();

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


  const displayLanguage =
    book.language?.toUpperCase() === "AR" ||
    book.language?.toLowerCase() === "arabic"
      ? "العربية"
      : book.language?.toUpperCase() || "AR";

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center"
      dir="rtl"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className="
          relative 
          bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row 
          animate-in fade-in zoom-in-95 duration-300
          
          w-[92%] h-[85%]
          max-w-[400px] md:max-w-5xl
          md:w-full md:h-auto md:max-h-[650px]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - Always fixed relative to card */}
        <button
          onClick={onClose}
          className="
            absolute top-4 left-4 z-20 p-2 rounded-full 
            bg-white/80 backdrop-blur text-black 
            hover:bg-black/5 transition shadow-sm
          "
        >
          <X size={20} />
        </button>

        {/* --- LEFT SIDE: Image Section --- */}
        <div
          className="
            w-full md:w-[40%] h-[250px] md:h-auto bg-black/5 relative 
            shrink-0 overflow-hidden
          "
        >
          {book.coverImageUrl ? (
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="w-full h-full object-cover transition-transform duration-700 md:hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-black/10 flex items-center justify-center text-black/10">
              <BookOpen size={48} />
            </div>
          )}

          {/* Audio Badge Overlay */}
          {book.hasAudio && (
            <div className="absolute top-4 right-4 bg-[#5de3ba] text-black p-2 rounded-full shadow-lg z-20">
              <Headphones size={16} />
            </div>
          )}
          
          {/* Subtle gradient overlay at bottom of image section (Mobile/Desktop) */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        </div>

        {/* --- RIGHT SIDE: Content (SCROLLABLE AREA) --- */}
        <div className="flex-1 flex flex-col p-6 md:p-10 overflow-y-auto custom-scrollbar bg-white">
          {/* 1. Header & Rating */}
          <div className="mb-6">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-[#5de3ba]/10 text-[#5de3ba] text-[10px] sm:text-xs font-black uppercase tracking-widest whitespace-nowrap">
                  {book.mainGenreName || "تصنيف عام"}
                </span>
                {book.subGenreName && (
                  <span className="px-3 py-1 rounded-full bg-[#5de3ba]/10 text-[#5de3ba] text-[10px] sm:text-xs font-black uppercase tracking-widest whitespace-nowrap">
                    {book.subGenreName}
                  </span>
                )}
              </div>
              {/* Rating Pill */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-black text-[10px] sm:text-xs font-black">
                <Star size={12} className="fill-yellow-400 text-yellow-500" />
                <span>{book.averageRating?.toFixed(1) || "0.0"}</span>
                <span className="text-black/30 hidden sm:inline">
                  ({book.totalReviews || 0} تقييم)
                </span>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-black leading-tight mb-2 tracking-tight">
              {book.title}
            </h2>
          </div>

          {/* 2. Feature Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            {/* Age Range */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#fafffe] border border-black/5 text-center shadow-sm">
              <Smile size={18} className="text-[#5de3ba] mb-1" />
              <span className="text-xs text-black/40 font-black uppercase tracking-widest">
                العمر
              </span>
              <span className="font-black text-black text-sm">
                {book.ageRangeMin}-{book.ageRangeMax} سنة
              </span>
            </div>

            {/* Language */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#fafffe] border border-black/5 text-center shadow-sm">
              <Globe size={18} className="text-[#5de3ba] mb-1" />
              <span className="text-xs text-black/40 font-black uppercase tracking-widest">
                اللغة
              </span>
              <span className="font-black text-black text-sm uppercase">
                {displayLanguage}
              </span>
            </div>

            {/* Pages */}
            <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#fafffe] border border-black/5 text-center shadow-sm">
              <BookOpen size={18} className="text-[#5de3ba] mb-1" />
              <span className="text-xs text-black/40 font-black uppercase tracking-widest">
                الصفحات
              </span>
              <span className="font-black text-black text-sm">
                {book.pageCount || "--"}
              </span>
            </div>

            {/* Audio Available */}
            <div
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center shadow-sm ${
                book.hasAudio
                  ? "bg-[#5de3ba]/10 border-[#5de3ba]/30"
                  : "bg-[#fafffe] border-black/5"
              }`}
            >
              <Headphones
                size={18}
                className={`mb-1 ${
                  book.hasAudio
                    ? "text-[#5de3ba]"
                    : "text-black/20"
                }`}
              />
              <span className="text-xs text-black/40 font-black uppercase tracking-widest">صوتي</span>
              <span
                className={`font-black text-sm ${
                  book.hasAudio
                    ? "text-[#5de3ba]"
                    : "text-black/20"
                }`}
              >
                {book.hasAudio ? "متوفر" : "غير متوفر"}
              </span>
            </div>
          </div>

          {/* 3. Description */}
          <div className="flex-1 mb-8">
            <h3 className="text-sm font-black text-black mb-2 flex items-center gap-2 uppercase tracking-widest">
              نبذة عن الكتاب
            </h3>
            <p className="text-black/60 leading-relaxed text-sm md:text-base text-justify whitespace-pre-line font-medium">
              {book.description || "لا يتوفر وصف لهذا الكتاب حالياً."}
            </p>
          </div>

          <div className="pt-8 border-t border-black/5 mt-auto">
            <button
              onClick={() => {
                if (book.pdfDownloadUrl) {
                  window.open(book.pdfDownloadUrl, "_blank", "noopener,noreferrer");
                } else {
                   // Fallback navigation or alert if needed
                   console.warn("No PDF download URL available for this book.");
                }
              }}
              className="
                w-full h-16 rounded-[2rem] 
                bg-[#0a0a0a] text-white
                flex items-center justify-center gap-4
                hover:bg-[#5de3ba] hover:text-black 
                hover:shadow-[0_20px_50px_rgba(93,227,186,0.25)]
                active:scale-[0.98] transition-all duration-500
                group relative overflow-hidden
              "
            >
              {/* Subtle Shimmer */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <BookOpen size={22} strokeWidth={2.5} className="transition-transform group-hover:-rotate-12" />
              <span className="text-sm font-black uppercase tracking-[0.25em]">عرض الكتاب</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
