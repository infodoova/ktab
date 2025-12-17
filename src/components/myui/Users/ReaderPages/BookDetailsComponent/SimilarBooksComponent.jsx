import React from "react";
import { PlayCircle } from "lucide-react";
import { getHelper } from "../../../../../../apis/apiHelpers";

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

        setBooks(res?.data?.content || []);
      } catch (error) {
        console.error("Failed to fetch similar books", error);
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
    <div className="border-t border-[#D7CCC8] pt-12 pb-12">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-1.5 h-8 bg-[#3E2723] rounded-full"></div>
        <h2 className="text-2xl font-bold text-[#3E2723]">قد يعجبك أيضاً</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {books.map((simBook) => (
          <div
            key={simBook.id}
            onClick={() =>
              navigate(
                `/Screens/dashboard/ReaderPages/BookDetails/${simBook.id}`,
                { state: { book: simBook } }
              )
            }
            className="group cursor-pointer relative"
          >
            {/* Image */}
            <div className="aspect-[2/3] rounded-xl overflow-hidden bg-[#D7CCC8] relative shadow-md group-hover:shadow-xl transition-all duration-300">
              <img
                src={simBook.coverImageUrl}
                alt={simBook.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <PlayCircle className="w-12 h-12 text-[#FEFCF8] fill-[#FEFCF8]/20" />
              </div>
            </div>

            {/* Text */}
            <div className="mt-3">
              <h3 className="text-sm font-bold text-[#3E2723] line-clamp-1 group-hover:text-[#606C38] transition-colors">
                {simBook.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-[#5D4037] mt-1 font-medium">
                <span className="border border-[#D7CCC8] px-1 rounded text-[10px]">
                  {simBook.mainGenreName || "موصى به"}
                </span>
                <span className="text-[#606C38]">
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
