import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { fetchTopReviewedBooks } from "../services/topReviewedBooksService";
import { useVoiceSampleStore } from "./useVoiceSampleStore";

export function useTopReviewedBooks(limit = 10, placeholderCount = 5) {
  const [cards, setCards] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestVersion, setRequestVersion] = useState(0);

  const hasRefreshedImagesRef = useRef(false);
  const hasRefreshedAudioRef = useRef(false);

  useEffect(() => {
    let active = true;

    fetchTopReviewedBooks(limit)
      .then((data) => {
        if (!active) return;
        setCards(data);
        setError("");
        hasRefreshedImagesRef.current = false;
        hasRefreshedAudioRef.current = false;

        // If an audio is currently selected in the global player, synchronize it with the fresh link
        const activeBook = useVoiceSampleStore.getState().activeBook;
        if (activeBook) {
          const fresh = data.find(
            (b) => b.bookId === activeBook.bookId || b.id === activeBook.id
          );
          if (fresh) {
            useVoiceSampleStore.setState({
              activeBook: { ...activeBook, ...fresh },
            });
          }
        }
      })
      .catch((err) => {
        if (!active) return;
        const isRateLimit = err?.status === 429 || err?.message === "rate-limit";
        setError(
          isRateLimit
            ? "طلبات كثيرة، حاول مرة أخرى بعد قليل."
            : "تعذر تحميل الكتب، حاول مرة أخرى لاحقًا."
        );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [limit, requestVersion]);

  const reload = useCallback(() => {
    setError("");
    setIsLoading(true);
    setRequestVersion((v) => v + 1);
  }, []);

  const retry = useCallback(() => {
    hasRefreshedImagesRef.current = false;
    hasRefreshedAudioRef.current = false;
    reload();
  }, [reload]);

  const refreshAfterImageError = useCallback(() => {
    // A failed signed URL may have expired. Refresh once for the whole hero section.
    if (hasRefreshedImagesRef.current) return;
    hasRefreshedImagesRef.current = true;
    reload();
  }, [reload]);

  const refreshAfterAudioError = useCallback(() => {
    // A failed signed audio URL may have expired. Refresh once for the whole hero section.
    if (hasRefreshedAudioRef.current) return;
    hasRefreshedAudioRef.current = true;
    reload();
  }, [reload]);

  const books = useMemo(() => {
    if (cards.length > 0) return cards;
    if (isLoading) {
      return Array.from({ length: placeholderCount }, (_, index) => ({
        id: `loading-${index}`,
        bookId: null,
        title: "",
        cover: null,
        audioSrc: null,
        audioDescription: "",
        audioDuration: null,
      }));
    }
    return [];
  }, [cards, isLoading, placeholderCount]);

  return {
    books,
    cards,
    isLoading,
    error,
    retry,
    refreshAfterImageError,
    refreshAfterAudioError,
  };
}

export default useTopReviewedBooks;
