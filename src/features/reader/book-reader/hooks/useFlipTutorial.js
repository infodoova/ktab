import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/**
 * Configuration map defining directional gesture semantics and descriptive Arabic labels
 * for each available reader page transition engine.
 */
const TUTORIAL_MODES_CONFIG = {
  flip3d: {
    id: "flip3d",
    title: "التصفح الرأسي ثلاثي الأبعاد",
    badge: "حركة رأسية",
    type: "vertical",
    nextLabel: "اسحب للأعلى",
    nextSub: "للانتقال للصفحة التالية",
    prevLabel: "اسحب للأسفل",
    prevSub: "للرجوع للصفحة السابقة",
    tapHint: "أو اضغط أسفل / أعلى الشاشة للتنقل السريع",
  },
  slide: {
    id: "slide",
    title: "انزلاق كيندل الأفقي",
    badge: "حركة أفقية",
    type: "horizontal",
    nextLabel: "اسحب لليسار",
    nextSub: "للانتقال للصفحة التالية",
    prevLabel: "اسحب لليمين",
    prevSub: "للرجوع للصفحة السابقة",
    tapHint: "أو انقر يمين ويسار الصفحة للتنقل",
  },
  curl: {
    id: "curl",
    title: "ثني الصفحات الواقعي",
    badge: "ثني باللمس",
    type: "curl",
    nextLabel: "انقر على طرف الصفحة",
    nextSub: "أو اسحب الزاوية للثني الواقعي",
    prevLabel: "انقر على الطرف المعاكس",
    prevSub: "للرجوع الفوري للخلف",
    tapHint: "المس طرف الورقة لقلب الصفحة بنعومة",
  },
};

/**
 * Custom hook managing the lifecycle, auto-dismiss timers, and mode-change detection
 * for the reader transition style tutorial overlay.
 *
 * @param {Object} params
 * @param {string} params.transitionMode - Active reader transition engine ('curl' | 'flip3d' | 'slide')
 * @param {number} [params.autoDismissMs=3800] - Duration in ms before the tutorial automatically dismisses
 */
export function useFlipTutorial({ transitionMode, autoDismissMs = 3800 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const prevModeRef = useRef(null);
  const isFirstMountRef = useRef(true);
  const timerRef = useRef(null);
  const exitTimerRef = useRef(null);

  const dismiss = useCallback(() => {
    setIsExiting(true);
    clearTimeout(exitTimerRef.current);
    exitTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      setIsExiting(false);
    }, 280);
  }, []);

  // Trigger tutorial overlay ONLY on explicit transitionMode change (not on initial mount/entry)
  useEffect(() => {
    if (!transitionMode) return;

    // Suppress tutorial on initial app load / book entry
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      prevModeRef.current = transitionMode;
      return;
    }

    // Detect if this is an explicit mode change
    if (prevModeRef.current !== transitionMode) {
      prevModeRef.current = transitionMode;

      clearTimeout(timerRef.current);
      clearTimeout(exitTimerRef.current);

      setIsExiting(false);
      setIsVisible(true);

      // Auto dismiss after specified reading interval
      timerRef.current = setTimeout(() => {
        dismiss();
      }, autoDismissMs);
    }

    return () => {
      clearTimeout(timerRef.current);
      clearTimeout(exitTimerRef.current);
    };
  }, [transitionMode, autoDismissMs, dismiss]);

  const config = useMemo(() => {
    return TUTORIAL_MODES_CONFIG[transitionMode] || TUTORIAL_MODES_CONFIG.curl;
  }, [transitionMode]);

  return {
    isVisible,
    isExiting,
    dismiss,
    config,
    durationMs: autoDismissMs,
  };
}

export default useFlipTutorial;
