import { useEffect, useState } from "react";
import { useAuthStore } from "@/core/store/authStore";
import { normalizeRole } from "@/core/constants/roles";
import { useBookTrailers } from "./useBookTrailers";
import { TRAILER_MANAGER_ROLES } from "../utils/trailerUtils";
import { trailerService } from "../services/trailerService";

export function useBookTrailerSection({ bookId, enabled, readerMode }) {
  const rawRole = useAuthStore((state) => state.user?.role);
  const role = normalizeRole(rawRole);
  const managesBook = !readerMode && TRAILER_MANAGER_ROLES.includes(role);
  const collection = useBookTrailers({ bookId, enabled: enabled && managesBook, isAdmin: role === "ADMIN" });
  const ready = collection.items.find((trailer) => trailer.status === "READY");
  const [readerAvailability, setReaderAvailability] = useState(null);

  useEffect(() => {
    let current = true;
    if (!enabled || !readerMode || bookId == null) return () => { current = false; };

    trailerService.readerTrailer(bookId)
      .then((links) => { if (current) setReaderAvailability({ bookId, available: Boolean(links.video) }); })
      .catch(() => { if (current) setReaderAvailability({ bookId, available: false }); });

    return () => { current = false; };
  }, [bookId, enabled, readerMode]);

  return {
    visible: enabled && (managesBook ? Boolean(ready) : readerMode && readerAvailability?.bookId === bookId && readerAvailability.available),
    trailerId: managesBook ? ready?.id : null,
    directUrl: null,
    readerBookId: managesBook || !readerMode ? null : bookId,
  };
}
