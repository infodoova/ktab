import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Hook managing the reader's assigned / favorite library shelf actions and menu state.
 *
 * @param {Object} params
 * @param {Array} [params.books=[]]
 * @param {Function} [params.onRemoveBook]
 */
export function useAssignedBooks({ books = [], onRemoveBook } = {}) {
  const trackRef = useRef(null);
  const navigate = useNavigate();
  const [openMenuId, setOpenMenuId] = useState(null);

  // Close menu popover when clicking anywhere outside
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (!e.target.closest(".ktab-assigned-card__menu-area")) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("click", handleDocumentClick);
    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  const scrollByAmount = useCallback((amount) => {
    if (!trackRef.current) return;
    trackRef.current.scrollBy({
      left: amount,
      behavior: "smooth",
    });
  }, []);

  const handleScrollNext = useCallback(() => {
    scrollByAmount(-320);
  }, [scrollByAmount]);

  const handleScrollPrev = useCallback(() => {
    scrollByAmount(320);
  }, [scrollByAmount]);

  const toggleMenu = useCallback((bookId, e) => {
    e.stopPropagation();
    setOpenMenuId((prev) => (prev === bookId ? null : bookId));
  }, []);

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

  const handleReadBook = useCallback(
    (book) => {
      if (!book) return;
      const targetId = book.id || book.bookId;
      if (!targetId) return;

      setOpenMenuId(null);
      navigate(`/reader/display/${targetId}`, {
        state: {
          book,
          initialPage: book.progress || book.lastReadPage || 1,
        },
      });
    },
    [navigate]
  );

  const handleRemove = useCallback(
    (bookId, e) => {
      e.stopPropagation();
      setOpenMenuId(null);
      if (typeof onRemoveBook === "function") {
        onRemoveBook(bookId);
      }
    },
    [onRemoveBook]
  );

  const handleBrowseLibrary = useCallback(() => {
    navigate("/reader/library");
  }, [navigate]);

  return {
    trackRef,
    openMenuId,
    toggleMenu,
    handleScrollNext,
    handleScrollPrev,
    handleSelectBook,
    handleReadBook,
    handleRemove,
    handleBrowseLibrary,
  };
}

export default useAssignedBooks;
