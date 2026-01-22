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

  return (
    <>
      <header
        className="
        fixed top-0 left-0 w-full z-50
        h-20 bg-white/80 backdrop-blur-md
        border-b border-black/10
        shadow-sm
        flex items-center justify-center
      "
      >
        <div className="flex items-center gap-4 sm:gap-12">
          {/* 1️⃣ VOICE MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div>
                <HeaderIcon
                  icon={
                    <UserRound
                      size={22}
                      className={
                        voice === "none"
                          ? "text-red-500"
                          : "text-black"
                      }
                    />
                  }
                  label="الأصوات"
                />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              dir="rtl"
              className="w-80 rounded-[1.5rem] border border-black/10 bg-white/95 backdrop-blur-xl p-3 shadow-2xl"
            >
              <DropdownMenuLabel className="text-[var(--primary-text)] text-right font-black uppercase tracking-widest text-[10px] opacity-40">
                اختر الصوت
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-black/5" />

              {[
                {
                  id: "IES4nrmZdUBHByLBde0P",
                  label: "هيثم - صوت عربي دافئ ونشيط للمحادثات والسرد",
                },
                {
                  id: "aCChyB4P5WEomwRsOKRh",
                  label: "سلمى - صوت تعبيري للمحادثات",
                },
                {
                  id: "rFDdsCQRZCUL8cPOWtnP",
                  label: "غيداء - صوت سوري دافئ وسردي",
                },
                {
                  id: "u0TsaWvt0v8migutHM3M",
                  label: "غزلان - صوت هادئ ومتوازن",
                },
                {
                  id: "mRdG9GYEjJmIzqbYTidv",
                  label: "سنا - امرأة في منتصف العمر بصوت ناعم وبلمسة حيوية",
                },
                {
                  id: "R6nda3uM038xEEKi7GFl",
                  label: "أنس - رجل عربي في منتصف العمر بصوت هادئ وودود",
                },
                {
                  id: "ocqVw6LVSdCxCra4XhMH",
                  label: "عبدالله - صوت مصري دافئ",
                },
                {
                  id: "s83SAGdFTflAwJcAV81K",
                  label: "أديب - صوت عربي معبر ومتناغم للسرد والبودكاست",
                },

                {
                  id: "QRq5hPRAKf5ZhSlTBH6r",
                  label: "ff",
                },
              ].map((v) => (
                <DropdownMenuItem
                  key={v.id}
                  onClick={() => onSelectVoice?.(v.id)}
                  className={`flex items-center justify-between cursor-pointer rounded-xl py-3 px-4 transition-colors ${
                    voice === v.id
                      ? "bg-black text-white"
                      : "text-[var(--primary-text)]/60 hover:bg-black/5 hover:text-[var(--primary-text)]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <UserRound size={18} className={voice === v.id ? "text-white/40" : "text-black/20"} />
                    <span className="text-xs font-black tracking-tight">{v.label}</span>
                  </div>
                  {voice === v.id && <Check size={16} className="text-white" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 2️⃣ EFFECTS MENU OUTSIDE DOTS */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div>
                <HeaderIcon
                  icon={
                    <Music4
                      size={22}
                      className={
                        effect === "none"
                          ? "text-red-500"
                          : "text-black"
                      }
                    />
                  }
                  label="المؤثرات"
                />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              dir="rtl"
              className="w-56 rounded-[1.5rem] border border-black/10 bg-white/95 backdrop-blur-xl p-3 shadow-2xl"
            >
              <DropdownMenuLabel className="text-[var(--primary-text)] text-right font-black uppercase tracking-widest text-[10px] opacity-40">
                المؤثرات الصوتية
              </DropdownMenuLabel>
 
              <DropdownMenuSeparator className="bg-black/5" />
              <DropdownMenuItem
                onClick={() => setEffect("none")}
                className={`flex items-center justify-between cursor-pointer rounded-xl py-3 px-4 transition-colors ${
                  effect === "none"
                    ? "bg-black text-white"
                    : "text-[var(--primary-text)]/60 hover:bg-black/5"
                }`}
              >
                <span className="text-xs font-black tracking-widest uppercase">بدون مؤثرات</span>
                {effect === "none" && <Check size={16} className="text-white" />}
              </DropdownMenuItem>
 
              {[
                {
                  id: "running",
                  label: "صوت الركض",
                  icon: <Waves size={18} />,
                },
                {
                  id: "rain",
                  label: "صوت المطر",
                  icon: <CloudRain size={18} />,
                },
                { id: "wind", label: "صوت الرياح", icon: <Wind size={18} /> },
              ].map((eff) => (
                <DropdownMenuItem
                  key={eff.id}
                  onClick={() => setEffect(eff.id)}
                  className={`flex items-center justify-between cursor-pointer rounded-xl py-3 px-4 transition-colors ${
                    effect === eff.id
                      ? "bg-black text-white"
                      : "text-[var(--primary-text)]/60 hover:bg-black/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={effect === eff.id ? "text-white/40" : "text-black/20"}>{eff.icon}</div>
                    <span className="text-xs font-black tracking-tight">{eff.label}</span>
                  </div>
                  {effect === eff.id && <Check size={16} className="text-white" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 3️⃣ VOLUME BUTTON */}
          <HeaderIcon
            icon={
              isMuted || volume === 0 ? (
                <VolumeX size={22} className="text-red-500" />
              ) : volume < 0.4 ? (
                <Volume1 size={22} className="text-black" />
              ) : (
                <Volume2 size={22} className="text-black" />
              )
            }
            label="الصوت"
            onClick={() => onCycleVolume && onCycleVolume()}
          />

          {/* 4️⃣ GO TO PAGE (desktop only) */}
          <div
            className={`hidden sm:flex items-center gap-2 ${
              readOnly ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <input
              type="number"
              min="1"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              disabled={readOnly}
              className="w-24 h-10 text-center border border-black/10 rounded-xl text-sm bg-white font-black focus:ring-4 focus:ring-[#5de3ba]/10 focus:border-[#5de3ba] outline-none transition-all"
              placeholder="00"
              dir="rtl"
            />
            <button
              onClick={handleGoToPage}
              disabled={readOnly}
              className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest btn-premium text-white active:scale-95 transition-all"
            >
              انطلاق
            </button>
          </div>

          {/* 5️⃣ BACK BUTTON — ALWAYS LAST ON DESKTOP */}
          <div className="hidden sm:block">
            <HeaderIcon
              icon={<ArrowRight size={22} />}
              label="رجوع"
              onClick={onBack}
            />
          </div>

          {/* 6️⃣ MOBILE 3-DOTS MENU */}
          <div className="sm:hidden relative">
            <button
              className="ham-menu-button p-2 text-black/40 hover:text-black transition"
              onClick={() => setIsHamOpen((s) => !s)}
            >
              <MoreVertical size={22} className="text-black" />
            </button>

            {isHamOpen && (
              <div className="ham-menu-panel absolute top-12 right-0 w-56 rounded-xl border border-black/10 bg-white p-2 shadow-xl z-50">
                <ul className="flex flex-col">
                  {/* GO TO PAGE */}
                  <li>
                    <button
                      className={`w-full text-right px-4 py-3 hover:bg-black/5 font-black uppercase tracking-widest text-[10px] ${
                        readOnly ? "opacity-50 pointer-events-none" : ""
                      }`}
                      onClick={() => {
                        if (readOnly) return;
                        setIsHamOpen(false);
                        setModalType("goto");
                      }}
                    >
                      اذهب للصفحة
                    </button>
                  </li>
 
                  <li>
                    <button
                      className="w-full text-right px-4 py-3 hover:bg-black/5 font-black uppercase tracking-widest text-[10px] text-red-500/60"
                      onClick={() => {
                        setIsHamOpen(false);
                        setModalType("back");
                      }}
                    >
                      رجوع للمكتبة
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
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
                  ${effect === e.id
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

/* --- ICON BUTTON COMPONENT --- */
function HeaderIcon({ icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative p-3 text-black/40 hover:text-black transition-all hover:bg-black/5 rounded-2xl"
    >
      {icon}
      <span
        className="
          absolute -bottom-10 left-1/2 -translate-x-1/2
          bg-black/95 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest
          px-3 py-1.5 rounded-lg shadow-xl
          opacity-0 group-hover:opacity-100
          transition-all duration-300 pointer-events-none whitespace-nowrap z-[100]
        "
      >
        {label}
      </span>
    </button>
  );
}

/* --- MODAL COMPONENT --- */
function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
 
      <div className="relative bg-white/95 backdrop-blur-[40px] rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] w-full max-w-md p-10 z-10 border border-black/10 text-center">
        <div className="flex justify-center items-center mb-8">
          <h3 className="text-2xl font-black text-[var(--primary-text)] tracking-tight">{title}</h3>
          <button onClick={onClose} className="absolute top-8 left-8 text-black/20 hover:text-red-500 transition-colors">
            <X className="w-6 h-6" strokeWidth={3} />
          </button>
        </div>
 
        <div className="relative">
           {children}
        </div>
      </div>
    </div>
  );
}
