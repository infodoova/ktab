import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Hook managing image lifecycle and interaction for Library Book Cards.
 *
 * @param {Object} params
 * @param {Object} params.book
 * @param {Function} [params.onClick]
 */
export function useLibraryBookCard({ book, onClick } = {}) {
  const navigate = useNavigate();
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [hasCoverError, setHasCoverError] = useState(false);

  const coverUrl = book?.coverImageUrl || book?.cover || null;
  const bookTitle = book?.title || "بدون عنوان";
  const authorName =
    book?.customAuthorName ||
    book?.authorName ||
    book?.author ||
    "مؤلف غير محدد";
  const genre = book?.mainGenreName || book?.genre || null;
  const hasAudio = Boolean(book?.hasAudio);
  const rating = Number(book?.averageRating) || 0;
  const totalReviews = Number(book?.totalReviews) || 0;
  const pageCount = book?.pageCount || null;

  const handleCoverLoad = useCallback(() => {
    setCoverLoaded(true);
    setHasCoverError(false);
  }, []);

  const handleCoverError = useCallback(() => {
    setCoverLoaded(false);
    setHasCoverError(true);
  }, []);

  const handleClick = useCallback(() => {
    if (typeof onClick === "function") {
      onClick(book);
      return;
    }

    const targetId = book?.id || book?.bookId;
    if (!targetId) return;

    navigate(`/reader/BookDetails/${targetId}`, {
      state: { book },
    });
  }, [book, navigate, onClick]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick]
  );

  return {
    coverUrl,
    bookTitle,
    authorName,
    genre,
    hasAudio,
    rating,
    totalReviews,
    pageCount,
    coverLoaded,
    hasCoverError,
    handleCoverLoad,
    handleCoverError,
    handleClick,
    handleKeyDown,
  };
}

export default useLibraryBookCard;
