import React from "react";
import { PlayCircle } from "lucide-react";
import { getHelper } from "../../../../../../apis/apiHelpers";
import { AlertToast } from "../../../AlertToast";
import { BookPlus } from "lucide-react";
export default function SimilarBooksComponent({ bookId, navigate }) {
  const [books, setBooks] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!bookId) return;

    const fetchSimilarBooks = async () => {
      setLoading(true);
      try {
        const res = await getHelper({
          url: `${import.meta.env.VITE_API_URL}/reader/similar/${bookId}`,
          pagination: true,
          page: 0,
          size: 4,
        });
        if (res?.messageStatus !== "SUCCESS") {
          AlertToast(res?.message, res?.messageStatus);
          return;
        }
        setBooks(res?.data?.content || []);
      } catch (res) {
        AlertToast(
          res.message || " فشل تحميل الكتب المتشابهة",
          res.messageStatus || "error"
        );
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarBooks();
  }, [bookId]);

  if (loading) {
    return (
      <div className="border-t border-[#D7CCC8] pt-12 pb-12">
        <h2 className="text-xl font-bold text-[#3E2723]">
          جاري تحميل الترشيحات...
        </h2>
      </div>
    );
  }

  if (!books.length) return null;

  return (
    <div className="border-t border-white/5 pt-16 pb-20">
      <div className="flex items-center gap-6 mb-12">
        <div className="p-4 rounded-[1.5rem] bg-gradient-to-br from-[#5de3ba] to-[#76debf] shadow-[0_10px_30px_rgba(93,227,186,0.3)]">
          <BookPlus className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight">قد يعجبك أيضاً</h2>
        
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
        {books.map((simBook) => (
          <div
            key={simBook.id}
            onClick={() =>
              navigate(
                `/reader/BookDetails/${simBook.id}`,
                { state: { book: simBook } }
              )
            }
            className="group cursor-pointer flex flex-col gap-4 transform transition-all duration-500 hover:-translate-y-2"
          >
            {/* Poster Image */}
            <div className="aspect-[3/4.5] rounded-[1.5rem] overflow-hidden bg-white/5 relative border border-white/5 group-hover:border-[var(--primary-button)]/30 shadow-2xl transition-all duration-500">
              <img
                src={simBook.coverImageUrl}
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
              <h3 className="text-sm md:text-[15px] font-bold text-white tracking-tight line-clamp-1 group-hover:text-[var(--primary-button)] transition-colors">
                {simBook.title}
              </h3>

              <div className="flex items-center gap-2 mt-1 md:mt-2">
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-[var(--primary-button)]/80">
                  {simBook.mainGenreName || "دراما"}
                </span>
                <span className="w-1 h-1 rounded-full bg-white/10" />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-white/20">
                   +16
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
