import React, { useRef, useState, useEffect } from "react";
import { Search, X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { getHelper } from "../../../../../../apis/apiHelpers";
import { AlertToast } from "../../../AlertToast";
export default function BookSearchModal({ isOpen, onClose, onApply }) {
  // Local state for the form
  const [query, setQuery] = useState("");
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedAge, setSelectedAge] = useState();
  const [genres, setGenres] = useState([]);
  const [loadingGenres, setLoadingGenres] = useState(false);

  const [selectedMainGenres, setSelectedMainGenres] = useState([]);
  const [selectedSubGenres, setSelectedSubGenres] = useState([]);
  const [expandedGenre, setExpandedGenre] = useState(null);

  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchGenres = async () => {
      setLoadingGenres(true);
      try {
        const res = await getHelper({
          url: `${import.meta.env.VITE_API_URL}/genres/getAllGenres`,
        });

        if (Array.isArray(res?.content) && res.content.length > 0) {
          setGenres(res.content);
        } else {
          if (res.messageStatus !== "SUCCESS") {
            AlertToast(res.message, res.messageStatus);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to load genres, using fallback", error);
      } finally {
        setLoadingGenres(false);
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

      setExpandedGenre((prevExpanded) => {
        if (isCurrentlySelected) {
          return prevExpanded === genreId ? null : prevExpanded;
        }
        return genreId;
      });

      // Keep only subgenres that belong to still-selected main genres
      setSelectedSubGenres((prevSub) =>
        prevSub.filter((subId) => {
          const parent = genres.find((g) =>
            g.subGenres?.some((s) => s.id === subId),
          );
          return parent && newSelected.includes(parent.id);
        }),
      );

      return newSelected;
    });
  };

  const toggleExpandGenre = (genreId) => {
    setExpandedGenre((prev) => (prev === genreId ? null : genreId));
  };

  const toggleSubGenre = (subId) => {
    setSelectedSubGenres((prev) =>
      prev.includes(subId)
        ? prev.filter((id) => id !== subId)
        : [...prev, subId],
    );
  };

  const handleApply = () => {
    onApply({
      title: query || null,
      mainGenreIds: selectedMainGenres,
      subGenreIds: selectedSubGenres,
      age: selectedAge ? Number(selectedAge) : null,
      minAverageRating: selectedRating,
      page: 0,
      size: 10,
    });

    onClose();
  };

  const handleClear = () => {
    setQuery("");
    setSelectedMainGenres([]);
    setSelectedSubGenres([]);
    setSelectedRating(1);
    setSelectedAge("");
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-0 md:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="
          bg-white/95 backdrop-blur-[40px]
          w-full h-full 
          md:w-[650px] md:h-auto md:max-h-[85vh] md:rounded-[2.5rem] 
          shadow-[0_40px_100px_rgba(0,0,0,0.2)]
          flex flex-col overflow-hidden
          border border-black/10
          fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:relative md:left-auto md:top-auto md:translate-x-0 md:translate-y-0
        "
        dir="rtl"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-black/10 bg-white/50">
          <h2 className="text-xl font-black text-[var(--primary-text)] flex items-center gap-3 tracking-tight">
            <Filter size={22} className="text-[var(--primary-button)]" />
            البحث والتصنيف
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* SCROLLABLE BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* 1. SEARCH BAR */}
          <div className="relative">
            <label className="text-[18px] font-black uppercase tracking-widest text-[var(--primary-text)] mb-3 block">
              بحث
            </label>
            <div className="flex items-center bg-gray-50/50 border border-black/10 rounded-[1.25rem] px-5 py-4 focus-within:ring-4 focus-within:ring-[var(--primary-button)]/10 focus-within:border-[var(--primary-button)] transition-all">
              <Search
                size={22}
                strokeWidth={3}
                className="text-[var(--primary-text)]/20 ml-4"
              />
              <input
                ref={inputRef}
                type="text"
                placeholder="ابحث عن عنوان، مؤلف..."
                className="bg-transparent w-full outline-none text-[var(--primary-text)] font-black tracking-tight placeholder:text-gray-300"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
              />
              {query && (
                <button onClick={() => setQuery("")}>
                  <X size={16} className="text-gray-400 hover:text-red-500" />
                </button>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* 2. GENRES & FEATURES GRID */}
          <div className="flex flex-col gap-2">
            {/* Genres */}
            <div>
              <h3 className="text-[18px] font-black uppercase tracking-widest text-[var(--primary-text)] mb-4">
                التصنيف الرئيسي
              </h3>

              {loadingGenres ? (
                <p className="text-sm text-gray-400">جاري التحميل...</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {genres.map((g) => {
                    const active = selectedMainGenres.includes(g.id);
                    return (
                      <div key={g.id} className="flex items-center gap-2">
                        <button
                          onClick={() => toggleMainGenre(g.id)}
                          className={`
                text-xs px-4 py-2.5 rounded-2xl border transition-all flex-1 text-center font-black tracking-tight
                ${
                  active
                    ? "bg-gradient-to-r from-[#5de3ba] to-[#76debf] text-white border-0 shadow-md"
                    : "bg-white text-[var(--primary-text)]/40 border-black/10 hover:border-[var(--primary-button)] hover:text-[var(--primary-text)]"
                }
              `}
                        >
                          {g.nameAr}
                        </button>

                        <div className="w-8 flex items-center justify-center">
                          {active && (
                            <button
                              onClick={() => toggleExpandGenre(g.id)}
                              className="p-1 rounded-md hover:bg-gray-100 transition flex items-center justify-center"
                              aria-label="Toggle subgenres"
                            >
                              {expandedGenre === g.id ? (
                                <ChevronUp size={14} />
                              ) : (
                                <ChevronDown size={14} />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          {/* Shared subgenre panel: shown for a single expanded main genre */}
          {expandedGenre != null &&
            (() => {
              const parent = genres.find((g) => g.id === expandedGenre);
              if (!parent) return null;
              return (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black uppercase tracking-widest text-[var(--primary-text)]">
                        التصنيفات الفرعية
                      </span>
                      <span className="text-[10px] px-3 py-1 font-black uppercase tracking-widest bg-[var(--primary-button)] text-white rounded-lg shadow-sm">
                        {parent.nameAr}
                      </span>
                    </div>
                    <button
                      onClick={() => setExpandedGenre(null)}
                      className="text-xs font-black text-[var(--primary-text)] hover:text-red-500 uppercase tracking-widest"
                    >
                      إغلاق
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {parent.subGenres?.map((sub) => {
                      const active = selectedSubGenres.includes(sub.id);
                      return (
                        <button
                          key={sub.id}
                          onClick={() => toggleSubGenre(sub.id)}
                          className={`
                  text-xs px-4 py-2 rounded-2xl border transition-all font-black tracking-tight
                  ${
                    active
                      ? "bg-black text-white border-black"
                      : "bg-white text-[var(--primary-text)] border-black/10 hover:border-black/20"
                  }
                `}
                        >
                          {sub.nameAr}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

          <div className="h-px bg-gray-100 w-full" />

          {/* 3. RATING & AGE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Rating */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[18px] font-black uppercase tracking-widest text-[var(--primary-text)]">
                  التقييم (الحد الأدنى)
                </h3>
                <span className="text-sm font-black text-[var(--primary-button)]">
                  {selectedRating} / 5
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={selectedRating}
                onChange={(e) => setSelectedRating(Number(e.target.value))}
                className="w-full h-2  rounded-lg  cursor-pointer accent-[var(--primary-button)]"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0</span>
                <span>5</span>
              </div>
            </div>

            {/* Age Range */}
            <div>
              <h3 className="text-[18px] font-black uppercase tracking-widest text-[var(--primary-text)] mb-4">
                الفئة العمرية
              </h3>

              <div
                className="
      flex items-center gap-3 
      bg-gray-50/50
      rounded-[1.25rem] 
      px-5 py-4
      border border-black/10
      focus-within:ring-4
      focus-within:ring-[var(--primary-button)]/10
      focus-within:border-[var(--primary-button)] 
      transition-all
    "
              >
                <input
                  type="number"
                  min="1"
                  max="80"
                  step="1"
                  placeholder="أدخل العمر (حتى ٨٠)"
                  className="
        bg-transparent 
        w-full 
        outline-none 
        text-[var(--primary-text)] 
        font-black tracking-tight
        placeholder:text-gray-300 
        text-sm
      "
                  value={selectedAge}
                  onChange={(e) => setSelectedAge(e.target.value)}
                />

                {selectedAge && (
                  <button
                    onClick={() => setSelectedAge("")}
                    className="text-gray-400 hover:text-red-500 transition"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-black/10 bg-white/50 flex items-center justify-between gap-6">
          <button
            onClick={handleClear}
            className="text-xs font-black uppercase tracking-widest text-[var(--primary-text)] hover:text-red-500 px-4 transition-colors"
          >
            إعادة تعيين
          </button>
          <button
            onClick={handleApply}
            className="
                    flex-1 btn-premium text-white h-14 rounded-2xl 
                    font-black uppercase tracking-tight 
                    active:scale-95 transition-all
                    flex items-center justify-center gap-3
                "
          >
            <Search size={20} strokeWidth={3} />
            عرض النتائج
          </button>
        </div>
      </div>
    </div>
  );
}
