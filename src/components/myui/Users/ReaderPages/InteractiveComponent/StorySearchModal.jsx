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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="
          bg-white/95 backdrop-blur-xl
          w-full h-full 
          md:w-[600px] md:h-auto md:max-h-[85vh] md:rounded-3xl 
          shadow-2xl flex flex-col overflow-hidden border border-gray-200/50
        "
        dir="rtl"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200/50 bg-gradient-to-b from-[var(--earth-cream)]/40 to-transparent">
          <h2 className="text-lg font-bold text-[var(--earth-brown)] flex items-center gap-2.5">
            <Filter size={22} strokeWidth={2.5} />
            البحث والتصنيف
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100/80 rounded-full transition-all duration-200 active:scale-95"
          >
            <X size={22} className="text-gray-500" />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* SEARCH BAR */}
          <div className="relative">
            <label className="text-sm font-semibold text-[var(--earth-brown)] mb-3 block">
              بحث عن قصة
            </label>
            <div className="flex items-center bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-2xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[var(--earth-brown)]/20 focus-within:border-[var(--earth-brown)]/40 transition-all shadow-sm">
              <Search size={20} className="text-gray-400 ml-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="ابحث عن قصة تفاعلية..."
                className="bg-transparent w-full outline-none text-[15px] text-gray-900 placeholder:text-gray-400"
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
            <h3 className="text-sm font-semibold text-[var(--earth-brown)] mb-3">
              التصنيف
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedGenre("ALL")}
                className={`
                  text-sm px-4 py-3 rounded-2xl border-2 transition-all duration-200 font-medium
                  ${
                    selectedGenre === "ALL"
                      ? "bg-[var(--earth-brown)] text-white border-[var(--earth-brown)] shadow-md shadow-[var(--earth-brown)]/20"
                      : "bg-white/80 text-gray-700 border-gray-200/60 hover:border-[var(--earth-brown)]/40 hover:bg-white"
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
                    text-sm px-4 py-3 rounded-2xl border-2 transition-all duration-200 font-medium
                    ${
                      selectedGenre === genre
                        ? "bg-[var(--earth-brown)] text-white border-[var(--earth-brown)] shadow-md shadow-[var(--earth-brown)]/20"
                        : "bg-white/80 text-gray-700 border-gray-200/60 hover:border-[var(--earth-brown)]/40 hover:bg-white"
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
        <div className="p-5 border-t border-gray-200/50 bg-gradient-to-t from-gray-50/50 to-transparent flex items-center justify-between gap-4">
          <button
            onClick={handleClear}
            className="text-sm text-gray-600 hover:text-red-500 font-semibold px-4 py-2 rounded-xl hover:bg-gray-100/50 transition-all duration-200"
          >
            إعادة تعيين
          </button>
          <button
            onClick={handleApply}
            className="
              flex-1 bg-[var(--earth-brown)] text-white h-12 rounded-2xl 
              font-bold hover:bg-[var(--earth-brown)]/90 transition-all duration-200
              flex items-center justify-center gap-2.5 shadow-lg shadow-[var(--earth-brown)]/25
              active:scale-[0.98]
            "
          >
            <Search size={18} />
            عرض النتائج
          </button>
        </div>
      </div>
    </div>
  );
}
