import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Hook to manage continue reading books presentation and action navigation.
 *
 * @param {Object} params
 * @param {Array} [params.books=[]]
 */
export function useContinueReading({ books = [] } = {}) {
  const navigate = useNavigate();

  const handleResumeReading = useCallback(
    (book) => {
      if (!book) return;
      const targetId = book.id || book.bookId;
      if (!targetId) return;

      navigate(`/reader/display/${targetId}`, {
        state: {
          book,
          initialPage: book.progress || book.lastReadPage || 1,
        },
      });
    },
    [navigate]
  );

  const handleOpenDetails = useCallback(
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

  // Compute calculated metrics per book item
  const formattedBooks = books.map((book) => {
    const current = Number(book.progress || book.lastReadPage || 0);
    const total = Number(book.total || book.totalPages || book.pagesCount || 100);
    const safeTotal = total > 0 ? total : 100;
    const percent = Math.min(100, Math.max(0, Math.round((current / safeTotal) * 100)));

    return {
      ...book,
      currentProgress: current,
      totalCount: total > 0 ? total : 0,
      percent,
    };
  });

  return {
    books: formattedBooks,
    handleResumeReading,
    handleOpenDetails,
  };
}

export default useContinueReading;
