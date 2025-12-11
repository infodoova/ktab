import React, { useRef, useState, useEffect } from "react";
import { Search, X, Filter } from "lucide-react";

export default function BookSearchModal({ isOpen, onClose, onApply }) {
  // Local state for the form
  const [query, setQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedRating, setSelectedRating] = useState(3.5);
  const [selectedAge, setSelectedAge] = useState();

  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

const GENRES = [
  { key: "novels", label: "روايات" },
  { key: "short_stories", label: "قصص قصيرة" },
  { key: "self_development", label: "تطوير الذات" },
  { key: "science_tech", label: "علوم وتكنولوجيا" },
  { key: "history", label: "تاريخ" },
  { key: "poetry", label: "شعر" }
];


  const toggleGenre = (key) => {
    setSelectedGenres((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };


  const handleApply = () => {
    onApply({
      query,
      genres: selectedGenres,
      features: selectedFeatures,
      rating: selectedRating,
      age: selectedAge,
    });
    onClose();
  };

  const handleClear = () => {
    setQuery("");
    setSelectedGenres([]);
    setSelectedFeatures([]);
    setSelectedRating(1);
    setSelectedAge("");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div
        className="
          bg-white 
          w-full h-full 
          md:w-[650px] md:h-auto md:max-h-[85vh] md:rounded-2xl 
          shadow-2xl flex flex-col overflow-hidden
        "
        dir="rtl"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between p-4 border-b bg-[var(--earth-cream)]/30">
          <h2 className="text-lg font-bold text-[var(--earth-brown)] flex items-center gap-2">
            <Filter size={20} />
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
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* 1. SEARCH BAR */}
          <div className="relative">
            <label className="text-sm font-semibold text-[var(--earth-brown)] mb-2 block">
              بحث
            </label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl px-3 py-3 focus-within:ring-2 focus-within:ring-[var(--earth-olive)]/20 focus-within:border-[var(--earth-olive)] transition-all">
              <Search size={20} className="text-gray-400 ml-3" />
              <input
                ref={inputRef}
                type="text"
                placeholder="ابحث عن عنوان، مؤلف..."
                className="bg-transparent w-full outline-none text-[var(--earth-brown-dark)] placeholder:text-gray-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleApply()}
              />
              {query && (
                <button onClick={() => setQuery("")}>
                    <X size={16} className="text-gray-400 hover:text-red-500"/>
                </button>
              )}
            </div>
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* 2. GENRES & FEATURES GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Genres */}
            <div>
              <h3 className="text-sm font-semibold text-[var(--earth-brown)] mb-3">التصنيف</h3>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((g) => {
                  const active = selectedGenres.includes(g.key);
                  return (
                    <button
                      key={g.key}
                      onClick={() => toggleGenre(g.key)}
                      className={`
                        text-xs px-3 py-1.5 rounded-full border transition-all
                        ${active 
                          ? "bg-[var(--earth-olive)] text-white border-[var(--earth-olive)] shadow-sm" 
                          : "bg-white text-gray-600 border-gray-200 hover:border-[var(--earth-olive)]"}
                      `}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>

      
          </div>

          <div className="h-px bg-gray-100 w-full" />

          {/* 3. RATING & AGE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Rating */}
             <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-sm font-semibold text-[var(--earth-brown)]">التقييم (الحد الأدنى)</h3>
                    <span className="text-sm font-bold text-[var(--earth-olive)]">{selectedRating} / 5</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="5"
                    step="0.5"
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--earth-olive)]"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>1</span>
                      <span>5</span>
                  </div>
             </div>

             {/* Age Range */}
       <div>
  <h3 className="text-sm font-semibold text-[var(--earth-brown)] mb-3">
    الفئة العمرية
  </h3>

  <div
    className="
      flex items-center gap-3 
      bg-gray-100 
      rounded-xl 
      px-4 py-3 
      border border-gray-200 
      focus-within:ring-2 
      focus-within:ring-[var(--earth-olive)]/20 
      focus-within:border-[var(--earth-olive)] 
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
        text-[var(--earth-brown-dark)] 
        placeholder:text-gray-400 
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

        {/* FOOTER ACTIONS */}
        <div className="p-4 border-t bg-gray-50 flex items-center justify-between gap-4">
            <button
                onClick={handleClear}
                className="text-sm text-gray-500 hover:text-red-500 font-medium px-4"
            >
                إعادة تعيين
            </button>
            <button
                onClick={handleApply}
                className="
                    flex-1 bg-[var(--earth-brown)] text-white h-11 rounded-xl 
                    font-bold hover:bg-[var(--earth-brown)]/90 transition-colors
                    flex items-center justify-center gap-2
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