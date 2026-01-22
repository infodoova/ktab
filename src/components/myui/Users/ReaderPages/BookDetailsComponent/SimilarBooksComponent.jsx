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
    <div className="border-t border-black/10 pt-16 pb-20">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#5de3ba]/20 to-[#76debf]/10">
          <BookPlus className="w-6 h-6 text-[var(--primary-button)]" />
        </div>
        <h2 className="text-3xl font-black text-[var(--primary-text)] tracking-tight">قد يعجبك أيضاً</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
        {books.map((simBook) => (
          <div
            key={simBook.id}
            onClick={() =>
              navigate(
                `/reader/BookDetails/${simBook.id}`,
                { state: { book: simBook } }
              )
            }
            className="group cursor-pointer flex flex-col gap-4"
          >
            {/* Image */}
            <div className="aspect-[3/4] rounded-[2rem] overflow-hidden bg-gray-50 relative border border-black/10 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500">
              <img
                src={simBook.coverImageUrl}
                alt={simBook.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Text */}
            <div className="px-2">
              <h3 className="text-sm font-black text-[var(--primary-text)] tracking-tight line-clamp-1 group-hover:opacity-70 transition-opacity">
                {simBook.title}
              </h3>

              <div className="flex items-center gap-2 mt-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#5de3ba]">
                  {simBook.mainGenreName || "موصى به"}
                </span>
                <span className="w-1 h-1 rounded-full bg-black/10" />
                <span className="text-[10px] font-black uppercase tracking-widest text-black/20">
                  {simBook.subGenreName || "ترشيح ذكي"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
