import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  PauseCircle,
} from "lucide-react";

export default function ReaderFooter({ onNext, onPrev, isPlaying, onTogglePlay }) {
  const togglePlay = () => {
    if (onTogglePlay) onTogglePlay();
  };

  return (
    <footer
      className="
        fixed bottom-0 left-0 w-full z-50
        h-16
        bg-[#fcfbf7]/80 backdrop-blur-md
        border-t border-[#e5e0d8]
        flex items-center justify-center
        shadow-[0_-2px_10px_rgba(0,0,0,0.04)]
      "
    >
      <div className="flex items-center gap-12">

        {/* NEXT PAGE */}
        <FooterIcon
          icon={<ChevronLeft size={28} />}
          label="الصفحة السابقة"
          onClick={onNext}
        />

        {/* PLAY / PAUSE */}
        <button
          onClick={togglePlay}
          className="relative group p-2 text-[#5c4d43] hover:text-black transition-transform active:scale-95 duration-200"
        >
          {isPlaying ? (
            <PauseCircle size={36} className="text-[var(--earth-olive)]" />
          ) : (
            <PlayCircle size={36} className="text-[var(--earth-olive)]" />
          )}

          <span
            className="
              absolute -top-10 left-1/2 -translate-x-1/2
              bg-black/80 text-white text-[10px] px-2 py-1 rounded
              opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap
            "
          >
            {isPlaying ? "إيقاف القراءة" : "استمع للكتاب"}
          </span>
        </button>

        {/* PREVIOUS PAGE */}
        <FooterIcon
          icon={<ChevronRight size={28} />}
          label="الصفحة التالية"
          onClick={onPrev}
        />

      </div>
    </footer>
  );
}

function FooterIcon({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="relative group p-2 text-[#5c4d43] hover:text-black transition-transform active:scale-95 duration-200"
    >
      {icon}
      <span
        className="
          absolute -top-10 left-1/2 -translate-x-1/2
          bg-black/80 text-white text-[10px] px-2 py-1 rounded
          opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap
        "
      >
        {label}
      </span>
    </button>
  );
}
