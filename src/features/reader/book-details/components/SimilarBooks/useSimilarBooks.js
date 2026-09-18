import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Custom Hook managing similar books card click navigation.
 * Encapsulates programmatic routing and scroll reset without inline JSX functions.
 */
export function useSimilarBooks() {
  const navigate = useNavigate();

  const handleBookClick = useCallback((e) => {
    const card = e.currentTarget;
    const id = card.dataset.bookId;
    if (id) {
      navigate(`/reader/BookDetails/${id}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [navigate]);

  return {
    handleBookClick,
  };
}

export default useSimilarBooks;
