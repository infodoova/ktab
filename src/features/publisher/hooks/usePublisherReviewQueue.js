import { useState, useEffect, useCallback, useRef } from "react";
import { publisherEditorialService } from "../services/publisherEditorialService";

/**
 * Custom hook managing the Publisher Editorial Review Queue, multi-facet search,
 * filtering, pagination, drawer inspection, and decision modals.
 */
export function usePublisherReviewQueue() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Active book for inspection drawer
  const [selectedBook, setSelectedBook] = useState(null);

  // Active book and type for decision modal
  const [decisionModalBook, setDecisionModalBook] = useState(null);
  const [decisionActionType, setDecisionActionType] = useState("APPROVE"); // "APPROVE" | "REJECT"

  const searchDebounceRef = useRef(null);

  const fetchQueue = useCallback(async () => {
    try {
      setLoading(true);
      let res;
      const trimmedSearch = searchQuery.trim();

      if (trimmedSearch) {
        // Multi-facet search across the queue
        res = await publisherEditorialService.searchReviewQueue({
          q: trimmedSearch,
          page,
          size: 20,
        });
      } else {
        // Default pending review queue endpoint
        res = await publisherEditorialService.getReviewQueue({
          page,
          size: 20,
        });
      }

      const content = res?.data?.content || [];
      setBooks(content);
      setTotalPages(res?.data?.totalPages || 1);
      setTotalElements(res?.data?.totalElements ?? content.length);
    } catch (err) {
      setBooks([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, page]);

  // Debounced search / filter trigger
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      fetchQueue();
    }, 300);

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [fetchQueue]);

  const handleOpenDetails = useCallback((book) => {
    setSelectedBook(book);
  }, []);

  const handleOpenApprove = useCallback((book) => {
    setDecisionModalBook(book);
    setDecisionActionType("APPROVE");
  }, []);

  const handleOpenReject = useCallback((book) => {
    setDecisionModalBook(book);
    setDecisionActionType("REJECT");
  }, []);

  const handleCloseDecisionModal = useCallback(() => {
    setDecisionModalBook(null);
  }, []);

  const handleDecisionSuccess = useCallback(() => {
    // If current inspected book was acted upon, refresh or close drawer
    setSelectedBook(null);
    fetchQueue();
  }, [fetchQueue]);

  return {
    books,
    loading,
    searchQuery,
    setSearchQuery,
    selectedStatus,
    setSelectedStatus,
    page,
    setPage,
    totalPages,
    totalElements,
    selectedBook,
    setSelectedBook,
    decisionModalBook,
    decisionActionType,
    handleOpenDetails,
    handleOpenApprove,
    handleOpenReject,
    handleCloseDecisionModal,
    handleDecisionSuccess,
    refreshQueue: fetchQueue,
  };
}

export default usePublisherReviewQueue;
