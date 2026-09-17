import { useState, useEffect, useCallback } from "react";

/**
 * Hook managing progressive blur-up image loading lifecycle for story cards.
 */
export function useStoryCoverImage(coverUrl) {
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

export default useStoryCoverImage;
