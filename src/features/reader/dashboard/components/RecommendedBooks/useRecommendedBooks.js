import { useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Hook managing carousel scrolling and book details navigation for recommended shelf.
 *
 * @param {Object} params
 * @param {Array} [params.books=[]]
 */
export function useRecommendedBooks({ books = [] } = {}) {
  const trackRef = useRef(null);
  const navigate = useNavigate();

  const scrollByAmount = useCallback((amount) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  }, []);

  // In RTL containers, scrolling toward the next content is negative scrollLeft in standard Chrome/Firefox
  const handleScrollNext = useCallback(() => {
    scrollByAmount(-320);
  }, [scrollByAmount]);

  const handleScrollPrev = useCallback(() => {
    scrollByAmount(320);
  }, [scrollByAmount]);

  const handleSelectBook = useCallback(
    (book) => {
      if (!book) return;
      const targetId = book.id || book.bookId;
      if (!targetId) return;

      navigate(`/reader/BookDetails/${targetId}`, {
        state: { book },
      });
    },
    [navigate]
  );

  return {
    trackRef,
    books,
    handleScrollNext,
    handleScrollPrev,
    handleSelectBook,
  };
}

export default useRecommendedBooks;
