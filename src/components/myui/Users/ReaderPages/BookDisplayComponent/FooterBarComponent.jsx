import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  PauseCircle,
} from "lucide-react";

export default function ReaderFooter({
  onNext,
  onPrev,
  isPlaying,
  onTogglePlay,
  fontSize,
  onFontSizeChange,
}) {
  const togglePlay = () => {
    if (onTogglePlay) onTogglePlay();
  };

  return (
    <footer
      className="
        fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] max-w-4xl z-50
        h-16 sm:h-20
        bg-white/90 backdrop-blur-xl
        border border-black/[0.05]
        rounded-2xl sm:rounded-[2.5rem]
        flex items-center justify-between px-3 sm:px-8
        shadow-[0_20px_50px_rgba(0,0,0,0.1)]
      "
    >
      {/* FONT SMALLER */}
      <div className="flex items-center">
        <button
          onClick={() => onFontSizeChange(Math.max(12, fontSize - 2))}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-black/40 hover:text-black hover:bg-black/5 transition-all active:scale-90 group"
          title="تصغير الخط"
        >
          <span className="text-xs sm:text-sm font-black tracking-tighter transition-transform group-hover:scale-90">A-</span>
          <span className="hidden sm:block text-[8px] font-black uppercase tracking-widest mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">تصغير</span>
        </button>
      </div>

      {/* CENTER CONTROLS */}
      <div className="flex items-center gap-4 sm:gap-12 bg-black/[0.03] px-4 sm:px-10 py-1.5 sm:py-2 rounded-full border border-black/[0.05]">
        {/* PREVIOUS PAGE (RTL) */}
        <FooterIcon
          icon={<ChevronRight size={22} className="sm:w-6 sm:h-6" strokeWidth={2.5} />}
          label="الصفحة التالية"
          onClick={onNext}
          disabled={isPlaying}
        />

        {/* PLAY / PAUSE */}
        <button
          onClick={togglePlay}
          className="relative group w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black flex items-center justify-center text-white shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 ring-2 sm:ring-4 ring-black/10 overflow-visible"
        >
          {isPlaying ? (
            <PauseCircle size={24} className="sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
          ) : (
            <PlayCircle size={24} className="sm:w-7 sm:h-7 text-white ml-0.5 sm:ml-1" strokeWidth={2.5} />
          )}

          <span
            className="
              hidden sm:block
              absolute -top-16 left-1/2 -translate-x-1/2
              bg-black/95 backdrop-blur-xl text-white text-[10px] font-black uppercase tracking-widest px-5 py-2.5 rounded-2xl
              opacity-0 group-hover:opacity-100 transition-all duration-400 pointer-events-none whitespace-nowrap shadow-2xl border border-white/10
            "
          >
            {isPlaying ? "إيقاف القراءة" : "استمع للكتاب"}
          </span>
        </button>

        {/* NEXT PAGE (RTL) */}
        <FooterIcon
          icon={<ChevronLeft size={22} className="sm:w-6 sm:h-6" strokeWidth={2.5} />}
          label="الصفحة السابقة"
          onClick={onPrev}
          disabled={isPlaying}
        />
      </div>

      {/* FONT BIGGER */}
      <div className="flex items-center">
        <button
          onClick={() => {
            const width = window.innerWidth;
            const maxFont = width >= 768 ? 20 : 18; // 111% for PC, 100% for mobile
            
            onFontSizeChange(Math.min(maxFont, fontSize + 2));
          }}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center text-black/40 hover:text-black hover:bg-black/5 transition-all active:scale-90 group"
          title="تكبير الخط"
        >
          <span className="text-lg sm:text-xl font-black tracking-tighter transition-transform group-hover:scale-110">A+</span>
          <span className="hidden sm:block text-[8px] font-black uppercase tracking-widest mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">تكبير</span>
        </button>
      </div>
    </footer>
  );
}

function FooterIcon({ icon, label, onClick, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`relative group p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all active:scale-95 duration-200 ${
        disabled
          ? "text-black/10 cursor-not-allowed"
          : "text-black/40 hover:text-black hover:bg-black/5"
      }`}
    >
      {icon}
      {!disabled && (
        <span
          className="
            hidden sm:block
            absolute -top-14 left-1/2 -translate-x-1/2
            bg-black/95 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl
            opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl
          "
        >
          {label}
        </span>
      )}
    </button>
  );
}
