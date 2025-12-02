import React, { useState } from "react";
import { Share2, BookOpen, Star, MessageSquare, NotebookPen, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function BookDataComponent({ book, navigate }) {
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);

  const renderStars = (rating) => (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-300 text-gray-300"
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="w-full p-8" dir="rtl">
      <div className="max-w-7xl mx-auto rounded-2xl shadow-xl overflow-hidden
        bg-gradient-to-br from-[#f4efe6] to-[#ebe6dd] border border-[#d3c8b8]">

        <div className="flex flex-col lg:flex-row">
          
          {/* LEFT – Book Cover */}
          <div className="w-full lg:w-80 p-8 flex flex-col items-center gap-6
            bg-gradient-to-br from-[#faf7f1] to-[#f0ebe3] border-l border-[#d3c8b8]">

            <div className="w-full max-w-[240px] aspect-[2/3] rounded-xl overflow-hidden
              shadow-xl ring-1 ring-black/10">
              <img
                src={book.coverImageUrl}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>

            <Button
              onClick={() => navigate("/Screens/dashboard/ReaderPages/BookDisplayPage/g")}
              className="w-full h-12 text-base font-bold rounded-xl
              bg-[#645c45] hover:bg-[#4e4735] text-white shadow-lg transition-all hover:shadow-xl"
            >
              <BookOpen className="w-5 h-5 ml-2" />
              قراءة الآن
            </Button>

            {/* Action Buttons */}
            <div className="w-full grid grid-cols-2 gap-3">
              
              {/* Rate Button */}
              <button
                onClick={() => setIsRatingModalOpen(true)}
                className="p-3 rounded-lg bg-white border border-[#d3c8b8]
                hover:bg-[#fdf8ea] transition-all group shadow-sm"
                aria-label="تقييم"
              >
                <Star className="w-6 h-6 mx-auto text-[#aaa08d] group-hover:text-amber-500 transition-colors" />
              </button>

              {/* Share */}
              <button
                onClick={() => navigator.clipboard.writeText(window.location.href)}
                className="p-3 rounded-lg bg-white border border-[#d3c8b8]
                hover:bg-[#e7f3ff] transition-all group shadow-sm"
                aria-label="مشاركة"
              >
                <Share2 className="w-6 h-6 mx-auto text-[#aaa08d] group-hover:text-blue-500 transition-colors" />
              </button>

            </div>

          </div>

          {/* RIGHT – Book Details */}
          <div className="flex-1 p-8 lg:p-10 space-y-6">

            {/* Title & Author */}
            <div className="space-y-3 border-b border-[#d3c8b8] pb-6">
              <h1 className="text-4xl font-bold text-[#2a2d28] leading-tight">
                {book.title}
              </h1>

              {book?.author && (
                <p className="text-xl text-[#645c45] font-medium">
                  بقلم: <span className="text-[#3d4a43] font-semibold">{book.author}</span>
                </p>
              )}
            </div>

            {/* Ratings */}
            <div className="flex flex-wrap items-center gap-6 py-4 text-[#3d4a43]">
              <div className="flex items-center gap-3">
                {renderStars(book.averageRating)}
                <span className="text-2xl font-bold">{book.averageRating}</span>
                <span className="text-[#645c45]">({book.totalReviews} تقييم)</span>
              </div>

              <div className="h-6 w-px bg-[#c7bbaa]"></div>

              <div className="flex items-center gap-2 text-[#3d4a43]">
                <BookOpen className="w-5 h-5" />
                <span className="font-semibold">{book.pageCount} صفحة</span>
              </div>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 py-4">
              {book.genre && (
                <Badge className="px-4 py-2 text-sm font-semibold rounded-full
                  bg-[#6e8b50] text-white">
                  {book.genre}
                </Badge>
              )}
              {book.language && (
                <Badge className="px-4 py-2 text-sm font-semibold rounded-full
                  bg-[#5f6748] text-white">
                  {book.language}
                </Badge>
              )}
              {(book.ageRangeMin || book.ageRangeMax) && (
                <Badge className="px-4 py-2 text-sm font-semibold rounded-full
                  bg-[#c79a3b] text-white">
                  {book.ageRangeMin}–{book.ageRangeMax} سنة
                </Badge>
              )}
            </div>

            {/* Description */}
            {book?.description && (
              <div className="space-y-3 pt-4">
                <h3 className="text-lg font-bold text-[#2a2d28] flex items-center gap-2">
                  <NotebookPen className="w-5 h-5 text-[#6e8b50]" />
                  نبذة عن الكتاب
                </h3>

                <p className="text-[#3f4a2f] leading-relaxed text-base">
                  {book.description}
                </p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ========================== */}
      {/* ⭐ Rating Modal */}
      {/* ========================== */}
      {isRatingModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">

            {/* Close Button */}
            <button
              onClick={() => setIsRatingModalOpen(false)}
              className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold text-center text-[#2a2d28] mb-6">
              قيّم هذا الكتاب
            </h2>

            <div className="flex justify-center gap-3 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  className="w-8 h-8 cursor-pointer text-gray-300 hover:text-amber-400 hover:scale-110 transition-all"
                />
              ))}
            </div>

            <Button
              onClick={() => setIsRatingModalOpen(false)}
              className="w-full h-12 rounded-xl bg-[#6e8b50] hover:bg-[#5f6748] text-white font-bold"
            >
              حفظ التقييم
            </Button>
          </div>
        </div>
      )}

    </div>
  );
}
