import React from "react";
import {
  ArrowRight,
  UserRound,
  Music4,
  VolumeX,
  Volume1,
  Volume2,
  Waves,
  CloudRain,
  Wind,
  MoreVertical,
  TreePalm,
  Check,
  X,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function ReaderHeader({
  onBack,
  onGoToPage,
  effect,
  setEffect,
  volume = 0.8,
  voice,
  onSelectVoice,
  isMuted = false,
  onCycleVolume,
  isLoading = false,
  readOnly = false,
}) {
  const [pageInput, setPageInput] = React.useState("");

  const [isHamOpen, setIsHamOpen] = React.useState(false);
  const [modalType, setModalType] = React.useState(null);

  React.useEffect(() => {
    if (!isHamOpen) return;

    const handler = (e) => {
      if (
        !e.target.closest?.(".ham-menu-button") &&
        !e.target.closest?.(".ham-menu-panel")
      ) {
        setIsHamOpen(false);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [isHamOpen]);

  const handleGoToPage = () => {
    const num = Number(pageInput);
    if (!num || num < 1) return alert("رقم الصفحة غير صالح");

    onGoToPage?.(num);
  };

  const isDisabled = isLoading || readOnly;

  return (
    <>
      <header
        className="
        fixed left-1/2 -translate-x-1/2 z-50
        w-[95%] top-4 rounded-2xl border border-black/[0.05] shadow-[0_20px_50px_rgba(0,0,0,0.1)]
        sm:top-0 sm:left-0 sm:translate-x-0 sm:w-full sm:rounded-none sm:border-b sm:border-x-0 sm:border-t-0 sm:shadow-sm
        h-16 sm:h-20 bg-white/90 backdrop-blur-xl
        flex items-center justify-between px-4 sm:px-8
      "
      >
        {/* --- LEFT SECTION: SETTINGS --- */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* MORE OPTIONS */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                disabled={isDisabled}
                className={`p-2 sm:p-3 rounded-full transition-all border border-black/[0.03] shrink-0 ${
                  isDisabled
                    ? "text-black/10 cursor-not-allowed pointer-events-none"
                    : "text-black/40 hover:text-black hover:bg-black/5 active:scale-90"
                }`}
              >
                <MoreVertical size={20} strokeWidth={2.5} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              dir="rtl"
              className="w-64 rounded-[2rem] border border-black/10 bg-white/95 backdrop-blur-xl p-4 shadow-2xl z-[1000]"
            >
              <DropdownMenuLabel className="text-black/30 font-black uppercase text-[10px] px-2 mb-2">
                إعدادات القراءة
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-black/5" />
              <div className="space-y-1 mt-2">
                <DropdownMenuItem
                  className="flex items-center gap-3 cursor-pointer rounded-2xl py-3 px-4 hover:bg-black/5"
                  onClick={() => setModalType("goto")}
                >
                  <MoreVertical size={16} className="rotate-90 opacity-40" />
                  <span className="text-xs font-bold">الذهاب إلى صفحة...</span>
                </DropdownMenuItem>

                {/* Note: Redundant 'Close Book' removed as requested */}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* --- CENTER SECTION: CORE TOOLS --- */}
        <div className="flex items-center gap-1 sm:gap-4 bg-black/[0.03] p-1.5 rounded-full border border-black/[0.05]">
          {/* VOICE */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                disabled={isDisabled}
                className={`p-2 sm:p-3 rounded-full transition-all ${
                  isDisabled
                    ? "text-black/10 cursor-not-allowed pointer-events-none"
                    : "text-black/40 hover:text-black hover:bg-white/50 active:scale-90"
                }`}
              >
                <UserRound
                  size={20}
                  className={voice === "none" ? "text-red-500" : ""}
                  strokeWidth={2.5}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              dir="rtl"
              className="w-72 sm:w-80 rounded-[2rem] border border-black/10 bg-white/95 backdrop-blur-xl p-4 shadow-2xl z-[1000]"
            >
              <DropdownMenuLabel className="text-black/30 font-black uppercase text-[10px] px-2 mb-2">
                اختر قارئك
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-black/5" />
              <div className="max-h-[350px] overflow-y-auto space-y-1 mt-2 custom-scrollbar">
                {[
                  {
                    id: "IES4nrmZdUBHByLBde0P",
                    label: "هيثم",
                    desc: "صوت رجل عربي متوسط العمر، دافئ ونشيط، مثالي للمحادثات القصيرة، التمثيل الصوتي، وسرد القصص.",
                  },
                  {
                    id: "aCChyB4P5WEomwRsOKRh",
                    label: "سلمى",
                    desc: "صوت تعبيري شاب، متمكن من اللغة العربية، مثالي للمحادثات والمشاريع الصوتية التعبيرية.",
                  },
                  {
                    id: "rFDdsCQRZCUL8cPOWtnP",
                    label: "غيداء",
                    desc: "صوت أنثوي سوري دافئ، مثالي للسرد القصصي، الوثائقيات، والمشاريع الثقافية.",
                  },
                  {
                    id: "u0TsaWvt0v8migutHM3M",
                    label: "غزلان",
                    desc: "صوت أنثوي هادئ ومتوازن، مثالي للبودكاست، الأخبار، والمحتوى التعليمي.",
                  },
                  {
                    id: "mRdG9GYEjJmIzqbYTidv",
                    label: "سنا",
                    desc: "صوت امرأة في منتصف العمر، ذو نغمة مرحة ومباشرة، مثالي للأخبار، الإعلانات الصوتية، والكتب الصوتية.",
                  },
                  {
                    id: "R6nda3uM038xEEKi7GFl",
                    label: "أنس",
                    desc: "صوت رجل هادئ ومهني، مثالي للأعمال الصوتية، الوثائقيات، والإعلانات.",
                  },
                  {
                    id: "ocqVw6LVSdCxCra4XhMH",
                    label: "عبدالله",
                    desc: "صوت مصري مهني دافئ، مثالي للكتب الصوتية، البودكاست، والإعلانات.",
                  },
                  {
                    id: "s83SAGdFTflAwJcAV81K",
                    label: "أديب",
                    desc: "صوت سردي متقن، مثالي للسرد القصصي، البودكاست، والمحتوى التعليمي.",
                  },
                  {
                    id: "5Spsi3mCH9e7futpnGE5",
                    label: "فارس",
                    desc: "صوت خليجي متوازن ودافئ، مثالي للإعلانات وأنظمة الرد الآلي.",
                  },
                ].map((v) => (
                  <DropdownMenuItem
                    key={v.id}
                    onClick={() => onSelectVoice?.(v.id)}
                    className="flex items-center justify-between cursor-pointer rounded-2xl py-3 px-4 transition-all hover:bg-black/5"
                  >
                    <div className="flex flex-col text-right">
                      <span className="text-sm sm:text-base font-bold">
                        {v.label}
                      </span>
                      <span className="text-[11px] sm:text-[13px] opacity-40 font-medium text-black">
                        {v.desc}
                      </span>
                    </div>
                    {voice === v.id && (
                      <Check
                        size={16}
                        className="text-[var(--primary-text)]"
                        strokeWidth={3}
                      />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-6 bg-black/10" />

          {/* AMBIENT EFFECTS */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 sm:p-3 text-black/40 hover:text-black hover:bg-white/50 rounded-full transition-all active:scale-90">
                <Music4
                  size={20}
                  className={
                    effect === "none" ? "" : "text-[var(--primary-text)]"
                  }
                  strokeWidth={2.5}
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              dir="rtl"
              className="w-56 rounded-[2rem] border border-black/10 bg-white/95 backdrop-blur-xl p-4 shadow-2xl z-[1000]"
            >
              <DropdownMenuLabel className="text-black/30 font-black uppercase text-[10px] px-2 mb-2">
                الأجواء الصوتية
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-black/5" />
              <div className="space-y-1 mt-2">
                {[
                  { id: "none", label: "بدون مؤثرات", icon: <X size={14} /> },
                  {
                    id: "rain",
                    label: "صوت المطر",
                    icon: <CloudRain size={16} />,
                  },
                  { id: "wind", label: "صوت الرياح", icon: <Wind size={16} /> },
                  {
                    id: "nature",
                    label: "صوت الطبيعة",
                    icon: <TreePalm size={16} />,
                  },
                ].map((eff) => (
                  <DropdownMenuItem
                    key={eff.id}
                    onClick={() => setEffect(eff.id)}
                    className="flex items-center justify-between cursor-pointer rounded-2xl py-3 px-4 transition-all hover:bg-black/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-black/20">{eff.icon}</span>
                      <span className="text-xs font-bold">{eff.label}</span>
                    </div>
                    {effect === eff.id && (
                      <Check
                        size={16}
                        className="text-[var(--primary-text)]"
                        strokeWidth={3}
                      />
                    )}
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="w-px h-6 bg-black/10" />

          {/* VOLUME */}
          <button
            onClick={() => onCycleVolume && onCycleVolume()}
            className="p-2 sm:p-3 text-black/40 hover:text-black hover:bg-white/50 rounded-full transition-all active:scale-90"
          >
            {isMuted || volume === 0 ? (
              <VolumeX size={20} className="text-red-500" strokeWidth={2.5} />
            ) : volume < 0.4 ? (
              <Volume1 size={20} strokeWidth={2.5} />
            ) : (
              <Volume2 size={20} strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* --- RIGHT SECTION: NAVIGATION --- */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-black text-white rounded-xl sm:rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg group shrink-0"
          >
            <ArrowRight
              size={18}
              className="transition-transform group-hover:translate-x-1"
              strokeWidth={2.5}
            />
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest hidden sm:block">
              العودة
            </span>
          </button>
        </div>
      </header>

      {/* MODALS BELOW */}
      {modalType === "back" && (
        <Modal title="تأكيد الرجوع" onClose={() => setModalType(null)}>
          <p className="mb-4">هل تريد الرجوع فعلاً؟</p>
          <div className="flex gap-2 justify-end">
            <button
              className="px-6 py-2 rounded-xl bg-gray-100 text-[10px] font-black uppercase tracking-widest"
              onClick={() => setModalType(null)}
            >
              إلغاء
            </button>
            <button
              className="px-6 py-2 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-red-500/20"
              onClick={() => {
                setModalType(null);
                onBack?.();
              }}
            >
              تأكيد الخروج
            </button>
          </div>
        </Modal>
      )}

      {modalType === "goto" && (
        <Modal title="اذهب للصفحة" onClose={() => setModalType(null)}>
          <div className="flex gap-4 items-center justify-center">
            <input
              type="number"
              min="1"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="w-28 h-12 text-center border border-black/10 rounded-2xl text-lg font-black bg-white/50 focus:ring-4 focus:ring-[#5de3ba]/10 focus:border-[#5de3ba] outline-none transition-all"
              placeholder="00"
              dir="rtl"
            />
            <button
              className="px-8 py-3 rounded-2xl btn-premium text-white text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all"
              onClick={() => {
                handleGoToPage();
                setModalType(null);
              }}
            >
              انطلاق
            </button>
          </div>
        </Modal>
      )}

      {modalType === "effects" && (
        <Modal title="المؤثرات" onClose={() => setModalType(null)}>
          <div className="flex flex-col gap-3">
            {[
              { id: "running", label: "صوت الركض" },
              { id: "rain", label: "صوت المطر" },
              { id: "wind", label: "صوت الرياح" },
              { id: "none", label: "بدون مؤثرات" },
            ].map((e) => (
              <button
                key={e.id}
                className={`
                  w-full py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all
                  ${
                    effect === e.id
                      ? "bg-black text-white shadow-lg"
                      : "bg-white text-black/40 border border-black/5 hover:bg-black/5 hover:text-black"
                  }
                `}
                onClick={() => {
                  setEffect(e.id);
                  setModalType(null);
                }}
              >
                {e.label}
              </button>
            ))}
          </div>
        </Modal>
      )}
    </>
  );
}

/* --- MODAL COMPONENT --- */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative bg-white/95 backdrop-blur-[40px] rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] w-full max-w-md p-10 z-10 border border-black/10 text-center">
        <div className="flex justify-center items-center mb-8">
          <h3 className="text-2xl font-black text-[var(--primary-text)] tracking-tight">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="absolute top-8 left-8 text-black/20 hover:text-red-500 transition-colors"
          >
            <X className="w-6 h-6" strokeWidth={3} />
          </button>
        </div>

        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
