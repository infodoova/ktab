import React from "react";

export default function Loader() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-16 h-16 animate-spin rounded-full border-4 border-black/5 border-t-[#5de3ba] shadow-[0_0_20px_rgba(93,227,186,0.15)]"></div>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/40 animate-pulse">
        جاري إنشاء عالمك...
      </p>
    </div>
  );
}