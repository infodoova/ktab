import { useState, useRef, useEffect, useCallback, useMemo } from "react";

/**
 * Normalizes title string by trimming, removing excessive whitespace,
 * and normalizing Arabic letter variants for forgiving, smooth comparison.
 */
function normalizeTitle(str = "") {
  if (typeof str !== "string") return "";
  return str
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[أإآ]/g, "ا")
    .replace(/[ى]/g, "ي")
    .replace(/[ة]/g, "ه")
    .toLowerCase();
}

/**
 * Hook managing book publish confirmation with strict title verification.
 */
export function usePublishConfirmModal({
  isOpen,
  expectedTitle = "",
  onConfirm,
  onClose,
}) {
  const [confirmTitle, setConfirmTitle] = useState("");
  const inputRef = useRef(null);

  // Reset input and focus whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setConfirmTitle("");
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Clean title match comparison
  const isTitleMatched = useMemo(() => {
    const normExpected = normalizeTitle(expectedTitle);
    const normEntered = normalizeTitle(confirmTitle);
    return Boolean(normExpected && normEntered && normExpected === normEntered);
  }, [expectedTitle, confirmTitle]);

  const handleSubmit = useCallback(
    (e) => {
      e?.preventDefault();
      if (!isTitleMatched) return;
      onConfirm?.();
    },
    [isTitleMatched, onConfirm]
  );

  const isSubmitDisabled = !isTitleMatched;

  return {
    confirmTitle,
    setConfirmTitle,
    isTitleMatched,
    inputRef,
    handleSubmit,
    isSubmitDisabled,
  };
}

export default usePublishConfirmModal;
