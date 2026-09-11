import React, { useRef, useState, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";

/**
 * Pure presentation modal for filtering and searching interactive stories.
 */
export function StorySearchModal({
  isOpen,
  onClose,
  onApply,
}) {
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
    onApply?.({
      query: query.trim(),
      genre: selectedGenre,
    });
    onClose?.();
  };

  const handleClear = () => {
    setQuery("");
    setSelectedGenre("ALL");
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-[#0a0a0a]/95 backdrop-blur-[32px] w-full h-full md:w-[600px] md:h-auto md:max-h-[85vh] md:rounded-[2.5rem] shadow-[0_40px_80px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden border border-white/10"
        dir="rtl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-black text-white flex items-center gap-3 tracking-tight">
            <Filter size={24} strokeWidth={2.5} className="text-[var(--primary-button)]" />
            البحث والتصنيف
          </h2>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white/5 rounded-xl transition-all duration-300 active:scale-95 group"
            aria-label="إغلاق"
          >
            <X size={24} className="text-white/40 group-hover:text-white group-hover:rotate-90 transition-all" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Query input */}
          <div className="relative">
            <label className="text-sm font-black text-white/60 mb-3 block uppercase tracking-widest">
              عنوان القصة أو الكلمة المفتاحية
            </label>
            <div className="relative flex items-center">
              <Search className="absolute right-4 text-white/40" size={20} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
                placeholder="ابحث عن قصة تفاعلية..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl pr-12 pl-4 py-4 text-white outline-none focus:border-[#5de3ba] transition-colors font-bold"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 flex items-center gap-4">
          <button
            onClick={handleClear}
            className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-red-400 px-4 py-3 transition-colors"
          >
            إعادة تعيين
          </button>
          <button
            onClick={handleApply}
            className="flex-1 btn-premium h-14 rounded-2xl text-white font-black uppercase text-xs tracking-widest active:scale-95 transition-all shadow-xl"
          >
            تطبيق الفلاتر
          </button>
        </div>
      </div>
    </div>
  );
}

export default StorySearchModal;
