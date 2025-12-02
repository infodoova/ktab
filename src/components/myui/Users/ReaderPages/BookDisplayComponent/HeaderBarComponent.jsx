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
  Music,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function ReaderHeader({ onBack }) {
  const [voice, setVoice] = React.useState("default");
  const [volume, setVolume] = React.useState(0); 
  const [effect, setEffect] = React.useState("none");

  return (
    <header
      className="
        fixed top-0 left-0 w-full z-50
        h-16 bg-[#fcfbf7]
        border-b border-[#e5e0d8]
        shadow-sm
        flex items-center justify-center
      "
    >
      {/* ALL BUTTONS IN ONE ROW WITH EQUAL SPACING */}
      <div className="flex items-center gap-12">

        {/* 1️⃣ STATIC PERSON ICON → VOICE SETTINGS */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <HeaderIcon
                icon={<UserRound size={24} className="text-[var(--earth-olive)]" />}
                label="الأصوات"
              />
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-48 rounded-xl border border-black/10 bg-white p-2 shadow-xl">
            <DropdownMenuLabel className="text-[var(--earth-brown-dark)]">
              اختر الصوت
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => setVoice("default")}
              className={voice === "default" ? "bg-[var(--earth-cream)]" : ""}
            >
              <UserRound size={18} className="mr-2" /> صوت افتراضي
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setVoice("soft")}
              className={voice === "soft" ? "bg-[var(--earth-cream)]" : ""}
            >
              <UserRound size={18} className="mr-2" /> صوت هادئ
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => setVoice("deep")}
              className={voice === "deep" ? "bg-[var(--earth-cream)]" : ""}
            >
              <UserRound size={18} className="mr-2" /> صوت عميق
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

 {/* 2️⃣ SOUND EFFECTS ICON */}
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <div>
      <HeaderIcon
        icon={
          effect === "none" ? (
            <Music size={22} className="text-red-500" />  
          ) : (
            <Music4 size={22} className="text-[var(--earth-olive)]" />
          )
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
      onClick={() => setEffect("running")}
      className={effect === "running" ? "bg-[var(--earth-cream)]" : ""}
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

    <DropdownMenuItem
      onClick={() => setEffect("none")}
      className={effect === "none" ? "bg-[var(--earth-cream)]" : ""}
    >
      بدون مؤثرات
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>


        {/* 3️⃣ AUDIO MUTE BUTTON */}
        <HeaderIcon
          icon={
            volume === 0 ? (
              <VolumeX size={22} className="text-red-500" />
            ) : volume < 0.4 ? (
              <Volume1 size={22} className="text-[var(--earth-olive)]" />
            ) : (
              <Volume2 size={22} className="text-[var(--earth-olive)]" />
            )
          }
          label="الصوت"
          onClick={() => setVolume(volume === 0 ? 0.8 : 0)}
        />
     

        {/* 5️⃣ BACK BUTTON */}
        <HeaderIcon
          icon={<ArrowRight size={22} />}
          label="رجوع"
          onClick={onBack}
        />
      </div>
    </header>
  );
}

/* --- ICON COMPONENT --- */
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
