import { useCallback } from "react";
import { storyBooksService } from "../services/storyBooksService";
import { AlertToast } from "@/components/myui/AlertToast";

export function useStoryPageRegeneration({
  storyId,
  status,
  regenerationsLeft,
  actionInProgress,
  setActionInProgress,
  fetchDetail,
  onStatusUpdated,
}) {
  // Illustration changes are locked once the pipeline advances beyond step 3.
  const canRegeneratePages = status === "ILLUSTRATING" && (regenerationsLeft ?? 1) > 0;

  const handleRegeneratePage = useCallback(async (pageIndex) => {
    if (!storyId || !canRegeneratePages || actionInProgress) return;
    setActionInProgress(true);
    try {
      const res = await storyBooksService.regeneratePage(storyId, pageIndex);
      AlertToast(
        res?.message || (pageIndex === 0 ? "جاري إعادة رسم غلاف القصة." : `جاري إعادة رسم مشهد الصفحة ${pageIndex}.`),
        "SUCCESS"
      );
      await fetchDetail();
      onStatusUpdated?.();
    } catch (err) {
      AlertToast(err?.message || "تعذر طلب إعادة رسم هذه الصفحة حالياً", "ERROR");
    } finally {
      setActionInProgress(false);
    }
  }, [storyId, canRegeneratePages, actionInProgress, setActionInProgress, fetchDetail, onStatusUpdated]);

  return { canRegeneratePages, handleRegeneratePage };
}
