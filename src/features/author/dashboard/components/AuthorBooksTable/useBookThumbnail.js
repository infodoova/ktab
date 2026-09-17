import { useState, useEffect, useCallback } from "react";

/**
 * Hook for managing BookThumbnail loading state in AuthorBooksTable.
 */
export function useBookThumbnail(coverUrl) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setLoaded(false);
    setHasError(false);
  }, [coverUrl]);

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
