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
  setVoice,
  isMuted = false,
  onToggleMute,
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
        h-16 bg-[#fcfbf7]
        border-b border-[#e5e0d8]
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
                          : "text-[var(--earth-olive)]"
                      }
                    />
                  }
                  label="الأصوات"
                />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48 rounded-xl border border-black/10 bg-white p-2 shadow-xl">
              <DropdownMenuLabel className="text-[var(--earth-brown-dark)]">
                اختر الصوت
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {[
                { id: "none", label: "بدون صوت" },
                { id: "aCChyB4P5WEomwRsOKRh", label: "صوت افتراضي" },
                { id: "CwhRBWXzGAHq8TQ4Fs18", label: "صوت هادئ" },
                { id: "CwhRBWXzGAHq8TQ4Fs19", label: "صوت عميق" },
              ].map((v) => (
                <DropdownMenuItem
                  key={v.id}
                  onClick={() => setVoice(v.id)}
                  className={voice === v.id ? "bg-[var(--earth-cream)]" : ""}
                >
                  <UserRound size={18} className="mr-2" /> {v.label}
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
                          : "text-[var(--earth-olive)]"
                      }
                    />
                  }
                  label="المؤثرات"
                />
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-48 rounded-xl border border-black/10 bg-white p-2 shadow-xl">
              <DropdownMenuLabel className="text-[var(--earth-brown-dark)]">
                المؤثرات الصوتية
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setEffect("none")}
                className={effect === "none" ? "bg-[var(--earth-cream)]" : ""}
              >
                بدون مؤثرات
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setEffect("running")}
                className={
                  effect === "running" ? "bg-[var(--earth-cream)]" : ""
                }
              >
                <Waves size={18} className="mr-2" /> صوت الركض
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setEffect("rain")}
                className={effect === "rain" ? "bg-[var(--earth-cream)]" : ""}
              >
                <CloudRain size={18} className="mr-2" /> صوت المطر
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => setEffect("wind")}
                className={effect === "wind" ? "bg-[var(--earth-cream)]" : ""}
              >
                <Wind size={18} className="mr-2" /> صوت الرياح
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 3️⃣ VOLUME BUTTON */}
          <HeaderIcon
            icon={
              isMuted || volume === 0 ? (
                <VolumeX size={22} className="text-red-500" />
              ) : volume < 0.4 ? (
                <Volume1 size={22} className="text-[var(--earth-olive)]" />
              ) : (
                <Volume2 size={22} className="text-[var(--earth-olive)]" />
              )
            }
            label="الصوت"
            onClick={() => onToggleMute && onToggleMute()}
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
              className="w-20 h-8 text-center border rounded-lg text-sm bg-white"
              placeholder="الصفحة"
              dir="rtl"
            />
            <button
              onClick={handleGoToPage}
              disabled={readOnly}
              className="px-3 py-1 rounded-lg text-sm bg-[var(--earth-olive)] text-white"
            >
              اذهب
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
              className="ham-menu-button p-2 text-[#5c4d43] hover:text-black transition"
              onClick={() => setIsHamOpen((s) => !s)}
            >
              <MoreVertical size={22} className="text-[var(--earth-olive)]" />
            </button>

            {isHamOpen && (
              <div className="ham-menu-panel absolute top-12 right-0 w-56 rounded-xl border border-black/10 bg-white p-2 shadow-xl z-50">
                <ul className="flex flex-col">
                  {/* GO TO PAGE */}
                  <li>
                    <button
                      className={`w-full text-right px-3 py-2 hover:bg-gray-50 ${
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

                  {/* ALWAYS LAST — BACK BUTTON */}
                  <li>
                    <button
                      className="w-full text-right px-3 py-2 hover:bg-gray-50"
                      onClick={() => {
                        setIsHamOpen(false);
                        setModalType("back");
                      }}
                    >
                      رجوع
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
              className="px-3 py-1 rounded-lg bg-gray-200"
              onClick={() => setModalType(null)}
            >
              إلغاء
            </button>
            <button
              className="px-3 py-1 rounded-lg bg-[var(--earth-olive)] text-white"
              onClick={() => {
                setModalType(null);
                onBack?.();
              }}
            >
              رجوع
            </button>
          </div>
        </Modal>
      )}

      {modalType === "goto" && (
        <Modal title="اذهب للصفحة" onClose={() => setModalType(null)}>
          <div className="flex gap-2 items-center">
            <input
              type="number"
              min="1"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="w-28 h-10 text-center border rounded-lg text-sm bg-white"
              placeholder="الصفحة"
              dir="rtl"
            />
            <button
              className="px-3 py-2 rounded-lg bg-[var(--earth-olive)] text-white"
              onClick={() => {
                handleGoToPage();
                setModalType(null);
              }}
            >
              اذهب
            </button>
          </div>
        </Modal>
      )}

      {modalType === "effects" && (
        <Modal title="المؤثرات" onClose={() => setModalType(null)}>
          <div className="flex flex-col gap-2">
            {[
              { id: "running", label: "صوت الركض" },
              { id: "rain", label: "صوت المطر" },
              { id: "wind", label: "صوت الرياح" },
              { id: "none", label: "بدون مؤثرات" },
            ].map((e) => (
              <button
                key={e.id}
                className={
                  effect === e.id
                    ? "bg-[var(--earth-cream)] px-3 py-2 rounded"
                    : "px-3 py-2 rounded hover:bg-gray-50"
                }
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
      className="group relative p-2 text-[#5c4d43] hover:text-black transition"
    >
      {icon}
      <span
        className="
          absolute -bottom-8 left-1/2 -translate-x-1/2
          bg-black/80 text-white text-[10px]
          px-2 py-1 rounded
          opacity-0 group-hover:opacity-100
          transition pointer-events-none whitespace-nowrap
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
    <div className="fixed inset-0 z-60 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-white rounded-lg shadow-xl w-[90%] max-w-md p-4 z-10">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="text-gray-500">
            اغلاق
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
