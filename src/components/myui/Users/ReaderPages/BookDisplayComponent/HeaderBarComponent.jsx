import React from "react";
import { Home, Library, Settings } from "lucide-react";

export default function ReaderHeader() {
  return (
    <header
      className="
        fixed top-0 left-0 w-full z-50
        h-14 
        bg-[#fcfbf7]/80 backdrop-blur-md
        border-b border-[#e5e0d8]
        flex items-center justify-center
        shadow-sm
      "
    >
      <div className="flex items-center gap-8">
        <HeaderIcon icon={<Home size={20} />} label="الرئيسية" />
        <HeaderIcon icon={<Library size={20} />} label="مكتبتي" />
        <HeaderIcon icon={<Settings size={20} />} label="الإعدادات" />
      </div>
    </header>
  );
}

function HeaderIcon({ icon, label }) {
  return (
    <button className="relative group p-2 text-[#5c4d43] hover:text-black transition-colors duration-300">
      {icon}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}