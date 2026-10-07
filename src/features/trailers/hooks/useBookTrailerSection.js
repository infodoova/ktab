import { useEffect, useState } from "react";
import { trailerService } from "../services/trailerService";

export function useBookTrailerSection({ bookId, enabled = true }) {
  const [trailerData, setTrailerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let current = true;
    if (!enabled || bookId == null) {
      setTrailerData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    trailerService
      .readerTrailer(bookId)
      .then((res) => {
        if (current) {
          setTrailerData(res?.video ? res : null);
        }
      })
      .catch(() => {
        if (current) {
          setTrailerData(null);
        }
      })
      .finally(() => {
        if (current) {
          setLoading(false);
        }
      });

    return () => {
      current = false;
    };
  }, [bookId, enabled]);

  return {
    visible: Boolean(trailerData?.video),
    trailerId: trailerData?.id ?? null,
    directUrl: trailerData?.video ?? null,
    readerBookId: bookId,
    loading,
  };
}
