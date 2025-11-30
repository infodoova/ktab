import React from "react";
import { ChevronLeft, ChevronRight, BookOpen, ZoomIn } from "lucide-react";

export default function ReaderFooter({ onNext, onPrev }) {
  return (
    <footer
      className="
        fixed bottom-0 left-0 w-full z-50
        h-14
        bg-[#fcfbf7]/80 backdrop-blur-md
        border-t border-[#e5e0d8]
        flex items-center justify-center
        shadow-[0_-2px_10px_rgba(0,0,0,0.02)]
      "
    >
      <div className="flex items-center gap-10">
        <FooterIcon 
          icon={<ChevronRight size={24} />} 
          label="الصفحة التالية" 
          onClick={onNext} 
        />
        <FooterIcon 
          icon={<BookOpen size={20} />} 
          label="الفهرس" 
        />
        <FooterIcon 
          icon={<ZoomIn size={20} />} 
          label="تكبير" 
        />
        <FooterIcon 
          icon={<ChevronLeft size={24} />} 
          label="الصفحة السابقة" 
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