import { useEffect, useMemo } from "react";
import { useBookTrailers } from "./useBookTrailers";

export function useTrailerBookController(bookId, isAdmin, onChange, role = null) {
  const { items, quota, loading, error, operation, hasActive, canCreate, refresh, runAction } = useBookTrailers({ bookId, isAdmin, role });
  const { used, remaining, isExact } = quota;
  const snapshot = useMemo(() => ({
    items, quota: { used, remaining, isExact }, loading, error, operation, hasActive, canCreate, refresh, runAction,
  }), [items, used, remaining, isExact, loading, error, operation, hasActive, canCreate, refresh, runAction]);
  useEffect(() => { onChange(bookId, snapshot); }, [bookId, snapshot, onChange]);
}
