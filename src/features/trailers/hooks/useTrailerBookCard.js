import { useCallback, useState } from "react";
const EMPTY_COLLECTION = {
  items: [], quota: { used: 0, remaining: 3, isExact: false }, loading: true,
  error: "", operation: null, hasActive: false, canCreate: false,
};

export function useTrailerBookCard(book, isAdmin, snapshot, onRequestCreate, mode) {
  const collection = snapshot || EMPTY_COLLECTION;
  const [showHistory, setShowHistory] = useState(false);
  const [failedCover, setFailedCover] = useState(null);
  const coverFailed = failedCover === book.coverImageUrl;
  const handleCoverError = useCallback(() => setFailedCover(book.coverImageUrl), [book.coverImageUrl]);
  const { items, runAction } = collection;
  const toggleHistory = useCallback(() => setShowHistory((value) => !value), []);
  const handleCreate = useCallback((event) => onRequestCreate(book, event.currentTarget), [onRequestCreate, book]);
  const handleJobAction = useCallback((event) => {
    const { action, id } = event.currentTarget.dataset;
    const trailer = items.find((item) => String(item.id) === id);
    if (trailer) runAction(action, trailer);
  }, [items, runAction]);
  const pendingItems = items.filter((item) => item.status !== "CANCELLED" && (mode === "queue" ? item.active : item.status !== "READY"));
  const ordered = [...pendingItems.filter((item) => item.active), ...pendingItems.filter((item) => !item.active)];
  const historyCount = pendingItems.length;
  const completedCount = items.filter((item) => item.status === "READY").length;
  const visibleItems = showHistory ? ordered : ordered.slice(0, 2);
  const createLabel = collection.operation?.action === "create" ? "جاري بدء الإعلان..."
    : collection.hasActive ? "إعلان قيد الإنتاج"
    : !isAdmin && collection.quota.isExact && collection.quota.remaining === 0 ? "اكتملت حصة هذا الكتاب" : "إنشاء إعلان جديد";
  const quotaLabel = isAdmin ? "حصة غير محدودة للمشرف"
    : collection.loading || !collection.quota.isExact ? "حتى ٣ إعلانات لكل كتاب خلال ٣٠ يوماً"
    : `${collection.quota.used} من ٣ إعلانات خلال آخر ٣٠ يوماً`;
  return { ...collection, historyCount, completedCount, quotaLabel, visibleItems, showHistory, coverFailed, createLabel, handleCreate, handleJobAction, handleCoverError, toggleHistory };
}
