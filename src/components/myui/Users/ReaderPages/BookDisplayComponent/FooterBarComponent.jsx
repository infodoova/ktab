import {
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  PauseCircle,
  Loader2,
} from "lucide-react";

export default function ReaderFooter({
  onNext,
  onPrev,
  isPlaying,
  isLoading,
  onTogglePlay,
  fontSize,
  onFontSizeChange,
}) {
  const togglePlay = () => {
    if (onTogglePlay) onTogglePlay();
  };

  const isControlsDisabled = isLoading;

  return (
    <footer
      className="
        fixed bottom-0 left-0 w-full z-50
        h-20 sm:h-24
        bg-white/95 backdrop-blur-2xl
        border-t border-black/[0.05]
        flex items-center justify-center px-4 sm:px-8
        shadow-[0_-5px_30px_rgba(0,0,0,0.05)]
      "
    >
      <div className="w-full max-w-5xl flex items-center justify-between pb-4 sm:pb-6">
      {/* FONT SMALLER */}
      <div className="flex items-center">
        <button
          onClick={() => onFontSizeChange(Math.max(12, fontSize - 2))}
          disabled={isControlsDisabled}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all active:scale-90 group ${
            isControlsDisabled
              ? "text-black/10 cursor-not-allowed"
              : "text-black/40 hover:text-black hover:bg-black/5"
          }`}
          title="تصغير الخط"
        >
          <span className="text-xs sm:text-sm font-black tracking-tighter transition-transform group-hover:scale-90">
            A-
          </span>
          <span className="hidden sm:block text-[8px] font-black uppercase tracking-widest mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            تصغير
          </span>
        </button>
      </div>

      {/* CENTER CONTROLS */}
      <div className="flex items-center gap-4 sm:gap-12 bg-black/[0.03] px-4 sm:px-10 py-1.5 sm:py-2 rounded-full border border-black/[0.05]">
        {/* PREVIOUS PAGE (RTL) */}
        <FooterIcon
          icon={
            <ChevronRight size={22} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
          }
          label="الصفحة التالية"
          onClick={onNext}
          disabled={isPlaying || isControlsDisabled}
        />

        {/* PLAY / PAUSE */}
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className={`
            relative group w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black flex items-center justify-center text-white shadow-2xl transition-all duration-300 ring-2 sm:ring-4 ring-black/10 overflow-visible
            ${isLoading ? "cursor-wait opacity-80" : "hover:scale-110 active:scale-95"}
          `}
        >
          {isLoading ? (
            <Loader2
              size={24}
              className="sm:w-7 sm:h-7 text-white animate-spin"
              strokeWidth={2.5}
            />
          ) : isPlaying ? (
            <PauseCircle
              size={24}
              className="sm:w-7 sm:h-7 text-white"
              strokeWidth={2.5}
            />
          ) : (
            <PlayCircle
              size={24}
              className="sm:w-7 sm:h-7 text-white ml-0.5 sm:ml-1"
              strokeWidth={2.5}
            />
          )}

          {!isLoading && (
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
          )}
        </button>

        {/* NEXT PAGE (RTL) */}
        <FooterIcon
          icon={
            <ChevronLeft size={22} className="sm:w-6 sm:h-6" strokeWidth={2.5} />
          }
          label="الصفحة السابقة"
          onClick={onPrev}
          disabled={isPlaying || isControlsDisabled}
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
          disabled={isControlsDisabled}
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex flex-col items-center justify-center transition-all active:scale-90 group ${
            isControlsDisabled
              ? "text-black/10 cursor-not-allowed"
              : "text-black/40 hover:text-black hover:bg-black/5"
          }`}
          title="تكبير الخط"
        >
          <span className="text-lg sm:text-xl font-black tracking-tighter transition-transform group-hover:scale-110">
            A+
          </span>
          <span className="hidden sm:block text-[8px] font-black uppercase tracking-widest mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            تكبير
          </span>
        </button>
      </div>
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
