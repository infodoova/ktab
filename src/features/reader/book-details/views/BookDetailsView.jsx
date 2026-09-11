import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { BookData } from "../components/BookData";
import { UserRates } from "../components/UserRates";
import { SimilarBooks } from "../components/SimilarBooks";
import { FullUserRatesModal } from "../components/FullUserRatesModal";
import { Footer } from "@/components/myui/layout";
import { useBookDetails } from "../hooks/useBookDetails";

/**
 * Pure presentation view for the Book Details & Reviews page.
 */
export function BookDetailsView() {
  const navigate = useNavigate();
  const { id } = useParams();
  const bookId = id;
  const [isFullRatesOpen, setIsFullRatesOpen] = useState(false);

  const {
    bookData,
    loadingBook,
    isRatingModalOpen,
    setIsRatingModalOpen,
    userRating,
    setUserRating,
    userReview,
    setUserReview,
    isReviewed,
    reviewId,
    isAssigned,
    isAssignLoading,
    isDescriptionExpanded,
    setIsDescriptionExpanded,
    reviews,
    loadingReviews,
    similarBooks,
    loadingSimilar,
    handleSubmitReview,
    handleDeleteReview,
    handleToggleAssign,
  } = useBookDetails(bookId);

  // Sync background color with dark presentation mode
  useEffect(() => {
    const originalBodyBg = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#000000";
    return () => {
      document.body.style.backgroundColor = originalBodyBg;
    };
  }, []);

  if (!bookId) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white font-bold">
        لا توجد بيانات للكتاب
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="relative min-h-screen bg-black text-white overflow-x-hidden selection:bg-[#5de3ba] selection:text-black"
    >
      <div className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-16 pb-16">
        {/* Top Back Navigation Button */}
        <div className="pt-12 mb-10 relative z-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-4 text-white hover:text-black hover:bg-[#5de3ba] transition-all group font-bold uppercase text-sm tracking-[0.2em] bg-black/40 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-lg"
          >
            <ArrowRight
              className="w-5 h-5 group-hover:-translate-x-2 transition-transform"
              strokeWidth={3}
            />
            <span>العودة للمكتبة</span>
          </button>
        </div>

        {/* Content Modules */}
        <div className="space-y-24">
          <BookData
            bookData={bookData}
            loadingBook={loadingBook}
            isRatingModalOpen={isRatingModalOpen}
            setIsRatingModalOpen={setIsRatingModalOpen}
            userRating={userRating}
            setUserRating={setUserRating}
            userReview={userReview}
            setUserReview={setUserReview}
            isReviewed={isReviewed}
            reviewId={reviewId}
            isAssigned={isAssigned}
            isAssignLoading={isAssignLoading}
            isDescriptionExpanded={isDescriptionExpanded}
            setIsDescriptionExpanded={setIsDescriptionExpanded}
            onSubmitReview={handleSubmitReview}
            onDeleteReview={handleDeleteReview}
            onToggleAssign={handleToggleAssign}
            navigate={navigate}
          />

          <UserRates
            reviews={reviews}
            loading={loadingReviews}
            onOpenFullModal={() => setIsFullRatesOpen(true)}
          />

          <SimilarBooks
            books={similarBooks}
            loading={loadingSimilar}
            navigate={navigate}
          />
        </div>
      </div>

      {/* Full Reviews Modal */}
      <FullUserRatesModal
        isOpen={isFullRatesOpen}
        onClose={() => setIsFullRatesOpen(false)}
        reviews={reviews}
        loading={loadingReviews}
      />

      <div className="bg-black relative border-t border-white/10">
        <Footer />
      </div>
    </div>
  );
}

export default BookDetailsView;
