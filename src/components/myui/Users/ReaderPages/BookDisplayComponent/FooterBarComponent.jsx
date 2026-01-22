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
}) {
  const togglePlay = () => {
    if (onTogglePlay) onTogglePlay();
  };

  return (
    <footer
      className="
        fixed bottom-0 left-0 w-full z-50
        h-20
        bg-white/80 backdrop-blur-md
        border-t border-black/10
        flex items-center justify-center
        shadow-[0_-10px_30px_rgba(0,0,0,0.03)]
      "
    >
      <div className="flex items-center gap-16">
        {/* PREVIOUS PAGE (RTL) */}
        <FooterIcon
          icon={<ChevronRight size={28} strokeWidth={2.5} />}
          label="الصفحة التالية"
          onClick={onNext}
          disabled={isPlaying}
        />

        {/* PLAY / PAUSE */}
        <button
          onClick={togglePlay}
          className="relative group w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
        >
          {isPlaying ? (
            <PauseCircle size={32} className="text-white" strokeWidth={2.5} />
          ) : (
            <PlayCircle size={32} className="text-white" strokeWidth={2.5} />
          )}

          <span
            className="
              absolute -top-14 left-1/2 -translate-x-1/2
              bg-black/95 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl
              opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-xl
            "
          >
            {isPlaying ? "إيقاف القراءة" : "استمع للكتاب"}
          </span>
        </button>

        {/* NEXT PAGE (RTL) */}
        <FooterIcon
          icon={<ChevronLeft size={28} strokeWidth={2.5} />}
          label="الصفحة السابقة"
          onClick={onPrev}
          disabled={isPlaying}
        />
      </div>
    </footer>
  );
}

function FooterIcon({ icon, label, onClick, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`relative group p-3 rounded-2xl transition-all active:scale-95 duration-200 ${
        disabled
          ? "text-black/10 cursor-not-allowed"
          : "text-black/40 hover:text-black hover:bg-black/5"
      }`}
    >
      {icon}
      {!disabled && (
        <span
          className="
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
