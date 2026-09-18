import { useMemo, useRef, useEffect } from "react";

/**
 * Hook calculating pagination conditions and running a high-performance IntersectionObserver
 * for seamless infinite scrolling without main-thread scroll listener jank.
 *
 * @param {Object} params
 * @param {number} [params.page=0]
 * @param {number} [params.totalPages=1]
 * @param {boolean} [params.loading=false]
 * @param {boolean} [params.loadingMore=false]
 * @param {Function} [params.onLoadMore]
 */
export function useLibraryBooksGrid({
  page = 0,
  totalPages = 1,
  loading = false,
  loadingMore = false,
  onLoadMore,
} = {}) {
  const sentinelRef = useRef(null);

  const canLoadMore = useMemo(
    () => !loading && !loadingMore && page + 1 < totalPages,
    [loading, loadingMore, page, totalPages]
  );

  useEffect(() => {
    const sentinelEl = sentinelRef.current;
    if (!sentinelEl || !canLoadMore || typeof onLoadMore !== "function") return;

    // IntersectionObserver runs off the main thread on compositor for optimal frame rates
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: null,
        rootMargin: "350px 0px", // Proactively fetch before user hits the bottom
        threshold: 0,
      }
    );

    observer.observe(sentinelEl);

    return () => {
      observer.disconnect();
    };
  }, [canLoadMore, onLoadMore]);

  return {
    sentinelRef,
    canLoadMore,
  };
}

export default useLibraryBooksGrid;
