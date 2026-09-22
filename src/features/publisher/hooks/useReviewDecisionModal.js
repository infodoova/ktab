import { useState, useCallback, useEffect } from "react";
import { publisherEditorialService } from "../services/publisherEditorialService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Normalizes text for comparison by trimming, collapsing spaces, and lowercasing.
 */
function normalizeText(str) {
  return (str || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

/**
 * Hook managing editorial decision submission (approve or reject with note)
 * and strict title verification validation.
 *
 * @param {Object} params
 * @param {Object} params.book - Book being reviewed
 * @param {"APPROVE"|"REJECT"} params.actionType
 * @param {Function} params.onClose
 * @param {Function} params.onSuccess
 */
export function useReviewDecisionModal({
  book,
  actionType,
  onClose,
  onSuccess,
}) {
  const [note, setNote] = useState("");
  const [confirmTitle, setConfirmTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isApprove = actionType === "APPROVE";
  const expectedTitle = (book?.title || "").trim();

  // Reset inputs on modal open or book change
  useEffect(() => {
    setNote("");
    setConfirmTitle("");
  }, [book?.id, actionType]);

  const isTitleMatched =
    !expectedTitle || normalizeText(confirmTitle) === normalizeText(expectedTitle);

  const isSubmitDisabled =
    submitting ||
    !isTitleMatched ||
    confirmTitle.trim().length === 0 ||
    (!isApprove && !note.trim());

  const handleSubmit = useCallback(
    async (e) => {
      e?.preventDefault?.();
      if (!book?.id) return;

      if (!isTitleMatched || confirmTitle.trim().length === 0) {
        AlertToast("يرجى كتابة اسم الكتاب بشكل مطابق تماماً لتأكيد القرار التحريري.", "WARNING");
        return;
      }

      const trimmedNote = note.trim();
      if (!isApprove && !trimmedNote) {
        AlertToast("يرجى توضيح سبب الرفض أو التعديلات المطلوبة للمؤلف.", "WARNING");
        return;
      }

      try {
        setSubmitting(true);
        if (isApprove) {
          const res = await publisherEditorialService.approveBook(book.id, trimmedNote);
          if (
            res?.success === false ||
            res?.messageStatus === "ERROR" ||
            (res?.statusCode && res.statusCode >= 400)
          ) {
            const errorMsg =
              res?.message ||
              (res?.errors && Object.values(res.errors)[0]) ||
              "تعذر اعتماد وقبول الكتاب.";
            AlertToast(errorMsg, "ERROR");
            return;
          }
          AlertToast(`تم اعتماد وقبول كتاب «${book.title || ""}» للنشر العام.`, "SUCCESS");
        } else {
          const res = await publisherEditorialService.rejectBook(book.id, trimmedNote);
          if (
            res?.success === false ||
            res?.messageStatus === "ERROR" ||
            (res?.statusCode && res.statusCode >= 400)
          ) {
            const errorMsg =
              res?.message ||
              (res?.errors && Object.values(res.errors)[0]) ||
              "تعذر إعادة الكتاب كمسودة.";
            AlertToast(errorMsg, "ERROR");
            return;
          }
          AlertToast(`تمت إعادة كتاب «${book.title || ""}» كمسودة مع إرسال الملاحظات التحريرية.`, "INFO");
        }

        onSuccess?.();
        onClose?.();
      } catch (err) {
        AlertToast(
          err?.message ||
            "تعذر تنفيذ القرار التحريري، يرجى التحقق من الاتصال وإعادة المحاولة.",
          "ERROR"
        );
      } finally {
        setSubmitting(false);
      }
    },
    [book, isApprove, isTitleMatched, confirmTitle, note, onClose, onSuccess]
  );

  return {
    note,
    setNote,
    confirmTitle,
    setConfirmTitle,
    isTitleMatched,
    expectedTitle,
    isSubmitDisabled,
    submitting,
    isApprove,
    handleSubmit,
  };
}

export default useReviewDecisionModal;
