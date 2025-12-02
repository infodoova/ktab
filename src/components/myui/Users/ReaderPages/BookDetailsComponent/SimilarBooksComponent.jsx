import React from "react";
import { Star } from "lucide-react";

export default function SimilarBooksComponent({ books, navigate }) {
  return (
    <section
      className="
        rounded-3xl shadow-xl p-6 md:p-10 border border-[#d3c8b8]
        bg-gradient-to-br from-[#faf7f1] to-[#f0ebe3]
      "
      dir="rtl"
    >
      <h2 className="text-3xl font-extrabold text-[#2a2d28] mb-6">كتب مشابهة</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((simBook) => (
          <div
            key={simBook.id}
            onClick={() =>
              navigate(`/Screens/dashboard/ReaderPages/BookDetails/${simBook.id}`, {
                state: { book: simBook },
              })
            }
            className="
              cursor-pointer group p-4 rounded-xl transition
              bg-white border border-[#d3c8b8]
              hover:bg-[#f5f2eb] hover:shadow-lg
            "
          >
            <div
              style={{ aspectRatio: "1/1.6" }}
              className="
                w-full max-w-[130px] mx-auto rounded-lg overflow-hidden
                shadow-md border border-[#c7bbaa]
                group-hover:scale-[1.04] transition
              "
            >
              <img
                src={simBook.coverImageUrl}
                className="w-full h-full object-cover"
              />
            </div>

            <h3
              className="
                mt-3 text-sm font-semibold text-[#2a2d28] text-center
                group-hover:text-[#6e8b50] line-clamp-2
              "
            >
              {simBook.title}
            </h3>

            <div className="flex justify-center mt-1 gap-1 text-sm text-gray-500">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{simBook.averageRating}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
