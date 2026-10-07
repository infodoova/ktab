import { BookTrailerSection } from "@/features/trailers/components/BookTrailerSection/BookTrailerSection";
import React from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  BookHero,
  BookMetadataStrip,
  BookDescription,
  BookReviews,
  BookReviewModal,
  SimilarBooks,
  FullUserRatesModal,
  BookDetailsSkeleton,
  BookDetailsFooter,
  TalkToBook,
} from "../components";
import { useBookDetails } from "../hooks/useBookDetails";
import "./BookDetailsView.css";

/**
 * Editorial Apple Books-inspired Book Details & Customer Reviews View.
 * Pure declarative JSX with zero inline functions or calculations.
 */
export function BookDetailsView() {
  const { id } = useParams();
  const bookId = id;

  const {
    bookData,
    loadingBook,
    isRatingModalOpen,
    isFullRatesOpen,
    userRating,
    setUserRating,
    userReview,
    setUserReview,
    isReviewed,
    isReviewLoading,
    isAssigned,
    isAssignLoading,
    isDescriptionExpanded,
    reviews,
    loadingReviews,
    similarBooks,
    loadingSimilar,
    handleSubmitReview,
    handleDeleteReview,
    handleToggleAssign,
    handleShareBook,
    handleOpenReviewModal,
    handleCloseReviewModal,
    handleOpenFullRatesModal,
    handleCloseFullRatesModal,
    handleToggleDescription,
    handleStartReading,
    handleNavigateBack,
    handleNavigateToReader,
    handleScrollToTop,
    currentYear,
  } = useBookDetails(bookId);

  // Missing Book ID State
  if (!bookId) {
    return (
      <div className="apple-book-details-view" dir="rtl">
        <div className="apple-book-details-empty">
          <h2 className="apple-book-details-empty-title">معرف الكتاب غير صالح</h2>
          <p className="apple-book-details-empty-desc">
            لم يتم العثور على الكتاب المطلوب، يرجى العودة إلى المكتبة وتحديد كتاب آخر.
          </p>
          <button
            type="button"
            onClick={handleNavigateToReader}
            className="apple-book-details-back-btn"
          >
            <ArrowRight size={16} />
            <span>العودة للمكتبة</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="apple-book-details-view" dir="rtl">
      {/* 1. Sticky Navigation & Breadcrumbs Bar */}
      <header className="apple-book-details-header">
        <div className="apple-book-details-nav-inner">
          {bookData?.title ? (
            <span className="apple-book-details-nav-title" title={bookData.title}>
              {bookData.title}
            </span>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={handleNavigateBack}
            className="apple-book-details-back-btn"
            aria-label="الرجوع إلى الصفحة السابقة"
          >
            <span>المكتبة</span>
            <ArrowLeft size={16} />
          </button>
        </div>
      </header>

      {/* 2. Main Details Content Container */}
      <main className="apple-book-details-container">
        {loadingBook ? (
          <BookDetailsSkeleton />
        ) : bookData ? (
          <>
            {/* Apple Books Hero Section (Artwork, Title, Author, Rating Summary & CTAs) */}
            <BookHero
              book={bookData}
              isAssigned={isAssigned}
              isAssignLoading={isAssignLoading}
              isReviewed={isReviewed}
              isReviewLoading={isReviewLoading}
              onToggleAssign={handleToggleAssign}
              onOpenReviewModal={handleOpenReviewModal}
              onStartReading={handleStartReading}
              onShare={handleShareBook}
            />

            {/* Publisher / Author Description with Clamped Toggle */}
            <BookDescription
              description={bookData.description}
              isExpanded={isDescriptionExpanded}
              onToggleExpand={handleToggleDescription}
            />

            {/* Apple Books Metadata Strip (Genre, Author, Language, Pages, Age, Released, Publisher) */}
            <BookMetadataStrip book={bookData} />

            <BookTrailerSection bookId={bookId} book={bookData} title={bookData.title} poster={bookData.coverImageUrl} readerMode />

            {/* Customer Reviews Section */}
            <BookReviews
              reviews={reviews}
              loading={loadingReviews}
              isReviewed={isReviewed}
              onOpenReviewModal={handleOpenReviewModal}
              onOpenFullModal={handleOpenFullRatesModal}
            />

            {/* Similar Books Recommendation Grid */}
            <SimilarBooks
              books={similarBooks}
              loading={loadingSimilar}
              onSelectBook={handleStartReading}
            />
          </>
        ) : (
          <div className="apple-book-details-empty">
            <h2 className="apple-book-details-empty-title">لم يتم العثور على تفاصيل الكتاب</h2>
            <p className="apple-book-details-empty-desc">
              قد يكون الكتاب غير متاح حالياً أو تم حذفه من قبل الناشر.
            </p>
            <button
              type="button"
              onClick={handleNavigateToReader}
              className="apple-book-details-back-btn"
            >
              <ArrowRight size={16} />
              <span>العودة للمكتبة</span>
            </button>
          </div>
        )}
      </main>

      {/* 3. Modal Dialogs */}
      <BookReviewModal
        isOpen={isRatingModalOpen}
        onClose={handleCloseReviewModal}
        isReviewed={isReviewed}
        userRating={userRating}
        setUserRating={setUserRating}
        userReview={userReview}
        setUserReview={setUserReview}
        onSubmitReview={handleSubmitReview}
        onDeleteReview={handleDeleteReview}
      />

      <FullUserRatesModal
        isOpen={isFullRatesOpen}
        onClose={handleCloseFullRatesModal}
        reviews={reviews}
        loading={loadingReviews}
      />

      {/* 4. Minimalist Single-Line Footer */}
      <BookDetailsFooter
        onScrollToTop={handleScrollToTop}
        currentYear={currentYear}
      />

      {/* 5. Talk-to-Book Floating Action Ball & Conversational Modal */}
      {bookData && (
        <TalkToBook
          key={`talk-to-book-${bookId}`}
          bookId={bookId}
          bookTitle={bookData?.title || ""}
          authorName={bookData?.authorName || ""}
          genre={bookData?.genre || bookData?.mainGenreName || ""}
          description={bookData?.description || ""}
        />
      )}
    </div>
  );
}

export default BookDetailsView;
