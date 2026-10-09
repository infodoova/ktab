import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchPublicCoverImages } from "../services/publicCoverImagesService";

export function usePublicCoverImages(collection, count, placeholderCount, minimumCount = 0) {
  const [urls, setUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);
  const hasRefreshedImagesRef = useRef(false);

  useEffect(() => {
    let active = true;
    fetchPublicCoverImages(collection, count)
      .then((covers) => {
        if (active) {
          setUrls(covers);
          setError("");
        }
      })
      .catch((err) => {
        if (active) setError(err.status === 429
          ? "طلبات كثيرة، حاول مرة أخرى بعد قليل."
          : "تعذر تحميل الأغلفة، حاول مرة أخرى لاحقًا.");
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, [collection, count, minimumCount, requestVersion]);

  const reload = useCallback(() => {
    setError("");
    setIsLoading(true);
    setRequestVersion((version) => version + 1);
  }, []);

  const retry = useCallback(() => {
    hasRefreshedImagesRef.current = false;
    reload();
  }, [reload]);

  const refreshAfterImageError = useCallback(() => {
    // A failed signed URL may have expired. Refresh once for the whole section,
    // rather than issuing a request for every copy in the marquee.
    if (hasRefreshedImagesRef.current) return;
    hasRefreshedImagesRef.current = true;
    reload();
  }, [reload]);

  const books = useMemo(() => urls.length
    ? urls.map((cover, index) => ({ id: `${collection}-${index}`, cover }))
    : isLoading
      ? Array.from({ length: placeholderCount }, (_, index) => ({ id: `loading-${index}`, cover: null }))
      : [], [urls, collection, isLoading, placeholderCount]);

  return { books, isLoading, error, retry, refreshAfterImageError };
}
