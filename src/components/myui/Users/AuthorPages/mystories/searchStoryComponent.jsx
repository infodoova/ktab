import React from "react";
import { Search } from "lucide-react";

export default function SearchStoryComponent({ value, onChange, placeholder = "ابحث عن قصة..." }) {
  return (
    <div className="relative w-full max-w-md group">
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-black/30 group-focus-within:text-[#5de3ba] transition-colors" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-14 pr-12 pl-4 bg-white border border-black/5 rounded-2xl text-black font-bold placeholder:text-black/20 focus:outline-none focus:ring-4 focus:ring-[#5de3ba]/5 focus:border-[#5de3ba]/30 transition-all text-right"
        dir="rtl"
        placeholder={placeholder}
      />
    </div>
  );
}