import React, { useRef, useState, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";

export default function StorySearchModal({ isOpen, onClose, onApply, genres = [] }) {
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("ALL");
  
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    onApply({
      query: query.trim(),
      genre: selectedGenre,
    });
    onClose();
  };

  const handleClear = () => {
    setQuery("");
    setSelectedGenre("ALL");
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="
          bg-white/95 backdrop-blur-[32px]
          w-full h-full 
          md:w-[600px] md:h-auto md:max-h-[85vh] md:rounded-[2.5rem] 
          shadow-[0_40px_80px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-[var(--primary-border)]/10
        "
        dir="rtl"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--primary-border)]/10">
          <h2 className="text-xl font-black text-[var(--primary-text)] flex items-center gap-3 tracking-tight">
            <Filter size={24} strokeWidth={2.5} className="text-[var(--primary-button)]" />
            البحث والتصنيف
          </h2>
          <button
            onClick={onClose}
            className="p-3 hover:bg-[var(--primary-button)]/10 rounded-xl transition-all duration-300 active:scale-95 group"
          >
            <X size={24} className="text-[var(--primary-text)]/40 group-hover:text-[var(--primary-text)] group-hover:rotate-90 transition-all" />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SEARCH BAR */}
          <div className="relative">
            <label className="text-sm font-black text-[var(--primary-text)]/60 mb-3 block uppercase tracking-widest">
              بحث عن قصة
            </label>
            <div className="flex items-center bg-white border border-[var(--primary-border)]/20 rounded-2xl px-5 py-4 focus-within:ring-4 focus-within:ring-[var(--primary-button)]/10 focus-within:border-[var(--primary-button)] transition-all shadow-sm">
              <Search size={20} className="text-gray-400 ml-3" />
               <input
                ref={inputRef}
                type="text"
                placeholder="ابحث عن قصة تفاعلية..."
                className="bg-transparent w-full outline-none text-[16px] text-[var(--primary-text)] font-bold placeholder:text-[var(--primary-text)]/20 placeholder:font-bold"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
              />
              {query && (
                <button 
                  onClick={() => setQuery("")}
                  className="transition-colors hover:bg-gray-100 rounded-full p-1"
                >
                  <X size={16} className="text-gray-400 hover:text-red-500" />
                </button>
              )}
            </div>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          {/* GENRES */}
          <div>
            <h3 className="text-sm font-black text-[var(--primary-text)]/60 mb-4 uppercase tracking-widest">
              التصنيف
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedGenre("ALL")}
                className={`
                  text-sm px-4 py-4 rounded-2xl border transition-all duration-300 font-black uppercase tracking-tight
                  ${
                    selectedGenre === "ALL"
                      ? "btn-premium text-white border-0"
                      : "bg-white text-[var(--primary-text)]/40 border-black/10 hover:border-[var(--primary-button)] hover:text-[var(--primary-text)]"
                  }
                `}
              >
                الكل
              </button>
              
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`
                    text-sm px-4 py-4 rounded-2xl border transition-all duration-300 font-black uppercase tracking-tight
                    ${
                      selectedGenre === genre
                        ? "btn-premium text-white border-0"
                        : "bg-white text-[var(--primary-text)]/40 border-black/10 hover:border-[var(--primary-button)] hover:text-[var(--primary-text)]"
                    }
                  `}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS */}
        <div className="p-6 border-t border-[var(--primary-border)]/10 bg-white/50 backdrop-blur-xl flex items-center justify-between gap-6">
          <button
            onClick={handleClear}
            className="text-sm text-[var(--primary-text)]/40 hover:text-red-500 font-black uppercase tracking-widest px-6 py-2 rounded-xl transition-all duration-300"
          >
            إعادة تعيين
          </button>
          <button
            onClick={handleApply}
            className="
              flex-1 btn-premium text-white h-14 rounded-2xl 
              font-black text-lg uppercase tracking-tight transition-all duration-300
              flex items-center justify-center gap-3
              active:scale-[0.98]
            "
          >
            <Search size={22} strokeWidth={3} />
            عرض النتائج
          </button>
        </div>
      </div>
    </div>
  );
}
