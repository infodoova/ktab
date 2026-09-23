import { useState, useCallback } from "react";

/**
 * Hook for managing BookThumbnail loading state in AuthorBooksTable.
 */
export function useBookThumbnail(coverUrl) {
  const [prevCoverUrl, setPrevCoverUrl] = useState(coverUrl);
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  if (prevCoverUrl !== coverUrl) {
    setPrevCoverUrl(coverUrl);
    setLoaded(false);
    setHasError(false);
  }

  const handleLoad = useCallback(() => {
    setLoaded(true);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setLoaded(false);
  }, []);

  return {
    loaded,
    hasError,
    handleLoad,
    handleError,
  };
}

export default useBookThumbnail;
