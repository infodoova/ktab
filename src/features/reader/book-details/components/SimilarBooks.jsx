import React from "react";
import { PlayCircle, BookPlus } from "lucide-react";

/**
 * Pure presentation component for Similar Books recommendations.
 * Receives books and loading state via props.
 */
export function SimilarBooks({ books = [], loading = false, navigate }) {
  if (loading) {
    return (
      <div className="border-t border-white/5 pt-12 pb-12" dir="rtl">
        <h2 className="text-xl font-bold text-white">جاري تحميل الترشيحات...</h2>
      </div>
    );
  }

  if (!books || books.length === 0) return null;

  return (
    <div className="border-t border-white/5 pt-16 pb-20" dir="rtl">
      <div className="flex items-center gap-6 mb-12">
        <div className="p-4 rounded-[1.5rem] bg-gradient-to-br from-[#5de3ba] to-[#76debf] shadow-[0_10px_30px_rgba(93,227,186,0.3)]">
          <BookPlus className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
            قد يعجبك أيضاً
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
        {books.map((simBook) => (
          <div
            key={simBook.id}
            onClick={() =>
              navigate?.(`/reader/BookDetails/${simBook.id}`, { state: { book: simBook } })
            }
            className="group cursor-pointer flex flex-col gap-4 transform transition-all duration-500 hover:-translate-y-2"
          >
            {/* Poster Image */}
            <div className="aspect-[3/4.5] rounded-[1.5rem] overflow-hidden bg-white/5 relative border border-white/5 group-hover:border-[#5de3ba]/30 shadow-2xl transition-all duration-500">
              <img
                src={simBook.coverImageUrl || simBook.cover}
                alt={simBook.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Hover Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4 md:p-6">
                <button className="w-full h-10 md:h-12 bg-white text-black rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                  <PlayCircle size={16} className="md:w-[18px] md:h-[18px]" />
                  عرض
                </button>
              </div>
            </div>

            {/* Title & Info */}
            <div className="px-1 text-right">
              <h3 className="text-sm md:text-[15px] font-bold text-white tracking-tight line-clamp-1 group-hover:text-[#5de3ba] transition-colors">
                {simBook.title}
              </h3>

              <div className="flex items-center gap-2 mt-1 md:mt-2">
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[#5de3ba]">
                  {simBook.mainGenreName || simBook.genre || "عام"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimilarBooks;
