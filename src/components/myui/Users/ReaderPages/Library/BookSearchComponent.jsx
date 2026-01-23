import React, { useRef, useState, useEffect } from "react";
import { Search, X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { getHelper } from "../../../../../../apis/apiHelpers";
import { AlertToast } from "../../../AlertToast";
export default function BookSearchModal({ isOpen, onClose, onApply }) {
  // Local state for the form
  const [query, setQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedAge, setSelectedAge] = useState("");
  const [genres, setGenres] = useState([]);
  const [selectedMainGenres, setSelectedMainGenres] = useState([]);
  const [selectedSubGenres, setSelectedSubGenres] = useState([]);
  const [expandedGenre, setExpandedGenre] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchGenres = async () => {
      try {
        const res = await getHelper({
          url: `${import.meta.env.VITE_API_URL}/genres/getAllGenres`,
        });

        if (Array.isArray(res?.content) && res.content.length > 0) {
          setGenres(res.content);
        } else if (res.messageStatus !== "SUCCESS") {
          AlertToast(res.message, res.messageStatus);
        }
      } catch (error) {
        console.error("Failed to load genres", error);
      }
    };

    fetchGenres();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleMainGenre = (genreId) => {
    setSelectedMainGenres((prevSelected) => {
      const isCurrentlySelected = prevSelected.includes(genreId);
      const newSelected = isCurrentlySelected
        ? prevSelected.filter((id) => id !== genreId)
        : [...prevSelected, genreId];

      // If we deselect a main genre, we should remove its sub-genres too
      if (isCurrentlySelected) {
        setSelectedSubGenres((prevSub) =>
          prevSub.filter((subId) => {
            const parent = genres.find((g) =>
              g.subGenres?.some((s) => s.id === subId)
            );
            return !(parent && parent.id === genreId);
          })
        );
      }

      setExpandedGenre((prevExpanded) => {
        if (isCurrentlySelected) {
          return prevExpanded === genreId ? null : prevExpanded;
        }
        return genreId;
      });

      return newSelected;
    });
  };

  const toggleExpandGenre = (genreId) => {
    setExpandedGenre((prev) => (prev === genreId ? null : genreId));
  };

  const toggleSubGenre = (subId, parentGenreId) => {
    setSelectedSubGenres((prev) => {
      const isSelected = prev.includes(subId);
      
      // If adding a subgenre, ensure its parent is also selected
      if (!isSelected && parentGenreId) {
        setSelectedMainGenres(prevMain => 
          prevMain.includes(parentGenreId) ? prevMain : [...prevMain, parentGenreId]
        );
      }
      
      return isSelected
        ? prev.filter((id) => id !== subId)
        : [...prev, subId];
    });
  };

  const handleApply = () => {
    onApply({
      title: query || null,
      mainGenreIds: selectedMainGenres,
      subGenreIds: selectedSubGenres,
      age: selectedAge ? Number(selectedAge) : null,
      minAverageRating: selectedRating,
      page: 0,
      size: 8,
    });

    onClose();
  };

  const handleClear = () => {
    setQuery("");
    setSelectedMainGenres([]);
    setSelectedSubGenres([]);
    setSelectedRating(0);
    setSelectedAge("");
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-6 bg-black/95 md:bg-black/60 backdrop-blur-xl md:backdrop-blur-md animate-in fade-in duration-300">
      <div
        className="
          bg-white/95 md:bg-white/90 backdrop-blur-[50px]
          w-full h-full 
          md:w-[700px] md:h-auto md:max-h-[90vh] md:rounded-[3rem] 
          shadow-[0_50px_100px_rgba(0,0,0,0.3)]
          flex flex-col overflow-hidden
          border-t md:border border-white/20
          relative
        "
        dir="rtl"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 md:px-8 py-4 md:py-6 border-b border-black/5 bg-white/40 shrink-0">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2.5 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-[#5de3ba] to-[#76debf] shadow-sm">
              <Filter size={20} className="text-white md:w-6 md:h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-black tracking-tight">اكتشف الكتب</h2>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-black/40">ابحث وخصص نتائجك</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 md:p-3 bg-black/5 hover:bg-black/10 rounded-xl md:rounded-2xl transition-all duration-300 active:scale-90"
          >
            <X size={18} className="text-black md:w-5 md:h-5" />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 md:py-8 space-y-8 md:space-y-10 custom-scrollbar">
          {/* 1. SEARCH BAR */}
          <div className="space-y-3 md:space-y-4">
            <label className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-black/50 mr-2">بحث ذكي</label>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-[#5de3ba]/20 to-[#76debf]/10 rounded-3xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-center bg-white/60 border border-black/5 rounded-[1.25rem] md:rounded-[1.5rem] px-5 md:px-6 py-4 md:py-5 focus-within:ring-2 focus-within:ring-[var(--primary-button)]/30 focus-within:border-[var(--primary-button)]/50 focus-within:bg-white transition-all duration-300 shadow-sm">
                <Search
                  size={20}
                  strokeWidth={2.5}
                  className="text-[var(--primary-button)] ml-4 md:ml-6 md:w-6 md:h-6 transition-transform duration-300 group-focus-within:scale-110"
                />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="ابحث عن عنوان، مؤلف..."
                  className="bg-transparent w-full outline-none text-black text-base md:text-lg font-bold tracking-tight placeholder:text-black/20"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleApply()}
                />
              </div>
            </div>
          </div>

          {/* 2. GENRES */}
          <div className="space-y-4 md:space-y-6">
            <label className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-black/50 px-1">التصنيفات</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
              {genres.map((g) => {
                const active = selectedMainGenres.includes(g.id);
                const isExpanded = expandedGenre === g.id;
                const hasSubGenres = g.subGenres && g.subGenres.length > 0;

                return (
                  <div key={g.id} className="flex flex-col gap-2">
                    <button
                      onClick={() => toggleMainGenre(g.id)}
                      className={`
                        w-full text-[11px] md:text-sm px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl border transition-all duration-300 flex items-center justify-between font-bold tracking-tight
                        ${active
                          ? "bg-gradient-to-r from-[#5de3ba] to-[#76debf] text-white border-transparent shadow-md"
                          : "bg-white/60 text-black/60 border-black/5 hover:border-[var(--primary-button)]/30"}
                      `}
                    >
                      <span className="truncate">{g.nameAr}</span>
                      {hasSubGenres && (
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpandGenre(g.id);
                          }}
                          className={`p-1 rounded-lg transition-colors ${active ? "hover:bg-white/20" : "hover:bg-black/5"}`}
                        >
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </div>
                      )}
                    </button>

                    {/* SUB-GENRES (inline expand) */}
                    {isExpanded && hasSubGenres && (
                      <div className="grid grid-cols-1 gap-1.5 mt-1 pr-2 animate-in slide-in-from-top-2 duration-300">
                        {g.subGenres.map((sub) => {
                          const subActive = selectedSubGenres.includes(sub.id);
                          return (
                            <button
                              key={sub.id}
                              onClick={() => toggleSubGenre(sub.id, g.id)}
                              className={`
                                text-[10px] md:text-[11px] text-right px-4 py-2.5 rounded-xl border transition-all font-bold
                                ${subActive
                                  ? "bg-[#5de3ba]/10 text-[#2db38a] border-[#5de3ba]/30 shadow-sm"
                                  : "bg-black/5 text-black/40 border-transparent hover:bg-black/10"}
                              `}
                            >
                              • {sub.nameAr}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. RATING & AGE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
            {/* Rating */}
            <div className="space-y-4">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-black/50">التقييم الأدنى</label>
                <span className="text-xs font-bold text-[var(--primary-button)]">{selectedRating} ★</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={selectedRating}
                onChange={(e) => setSelectedRating(Number(e.target.value))}
                className="w-full h-1.5 md:h-2.5 rounded-full cursor-pointer appearance-none bg-black/5 accent-[var(--primary-button)]"
              />
            </div>

            {/* Age */}
            <div className="space-y-4">
              <label className="text-[10px] md:text-sm font-bold uppercase tracking-widest text-black/50 px-1">العمر المفضل</label>
              <div className="flex items-center bg-white/60 border border-black/5 rounded-xl md:rounded-[1.5rem] px-4 md:px-5 py-3 md:py-4 focus-within:ring-2 focus-within:ring-[var(--primary-button)]/30 transition-all duration-300">
                <input
                  type="number"
                  placeholder="مثال: 15"
                  className="bg-transparent w-full outline-none text-black font-bold text-sm md:text-base"
                  value={selectedAge || ""}
                  onChange={(e) => setSelectedAge(e.target.value)}
                />
                <span className="text-[10px] font-bold text-black/30 mr-2">سنة</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 md:p-8 border-t border-black/5 bg-white shrink-0 flex items-center gap-4 md:gap-6">
          <button
            onClick={handleClear}
            className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-black/40 hover:text-red-500 px-4 md:px-6 py-4 transition-all"
          >
            اعادة التعيين 
          </button>
          <button
            onClick={handleApply}
            className="flex-1 btn-premium h-14 md:h-16 rounded-xl md:rounded-[1.75rem] flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <Search size={18} strokeWidth={2.5} />
            تطبيق الفلاتر
          </button>
        </div>
      </div>
    </div>
  );
}
