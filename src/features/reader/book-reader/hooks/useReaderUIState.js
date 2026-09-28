import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useReaderPreferencesStore } from "@/core/store";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Manages reader presentation state, modals, popovers, lock toggle,
 * HTML5 fullscreen API, theme body synchronization, and image gen reading previews.
 *
 * @param {Object} params
 * @param {React.RefObject} params.bookRef
 * @param {number} params.currentPage
 * @param {number} params.totalPages
 * @returns {Object} UI state, handlers, and popover controls
 */
export function useReaderUIState({ bookRef, currentPage = 1, totalPages = 1 }) {
  const navigate = useNavigate();

  const {
    theme = "pure-white",
    setTheme,
    fontSize,
    setFontSize,
    transitionMode = "curl",
    setTransitionMode,
  } = useReaderPreferencesStore();

  const [isLocked, setIsLocked] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [activePopover, setActivePopover] = useState(null); // "theme" | "font" | "ambient" | "voices" | null
  const [activeModal, setActiveModal] = useState(null); // "fastTravel" | "imageGen" | null
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleFontSizeChange = useCallback(
    (newSize) => {
      setFontSize(newSize);
      const percent = Math.round((newSize / 18) * 100);
      AlertToast(`مستوى الخط: ${percent}%`, "INFO");
    },
    [setFontSize]
  );

  const handleToggleLock = useCallback(() => {
    setIsLocked((prev) => {
      const next = !prev;
      if (next) {
        setActiveModal(null);
      }
      return next;
    });
  }, []);

  const toggleControls = useCallback(() => {
    if (isLocked) return;
    setIsControlsVisible((prev) => !prev);
  }, [isLocked]);

  const handleTogglePopover = useCallback(
    (popoverName) => {
      if (isLocked) return;
      setActivePopover((prev) => (prev === popoverName ? null : popoverName));
    },
    [isLocked]
  );

  const handleClosePopover = useCallback(() => {
    setActivePopover(null);
  }, []);

  const handleOpenModal = useCallback(
    (modalName) => {
      if (isLocked) return;
      setActiveModal(modalName);
      setActivePopover(null);
    },
    [isLocked]
  );

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleSelectTheme = useCallback(
    (newTheme) => {
      setTheme(newTheme);
    },
    [setTheme]
  );

  const handleCycleTheme = useCallback(() => {
    const sequence = ["pure-white", "warm-cream", "paper-sepia", "charcoal-dark"];
    const currentIndex = sequence.indexOf(theme);
    const nextTheme = sequence[(currentIndex + 1) % sequence.length];
    setTheme(nextTheme);
    const names = {
      "pure-white": "أبيض نقي",
      "warm-cream": "كريمي دافئ",
      "paper-sepia": "ورق عتيق",
      "charcoal-dark": "ليلي داكن",
    };
    AlertToast(`السمة: ${names[nextTheme] || nextTheme}`, "INFO");
  }, [theme, setTheme]);

  const handleOpenFastTravel = useCallback(() => {
    if (isLocked) return;
    setActiveModal((prev) => (prev === "fastTravel" ? null : "fastTravel"));
  }, [isLocked]);

  const handleOpenImageGen = useCallback(() => {
    if (isLocked) return;
    setActiveModal((prev) => (prev === "imageGen" ? null : "imageGen"));
    setActivePopover(null);
  }, [isLocked]);

  const isImageGenActive = activeModal === "imageGen";

  /**
   * Retrieves text from pages [P-1, P, P+1] to display as a unified 3-page
   * continuous reading sheet beside the AI image generation modal.
   */
  const imageGenPages = useMemo(() => {
    if (!isImageGenActive || !bookRef?.current?.getPageText) return [];
    const minP = Math.max(1, currentPage - 1);
    const maxP = Math.min(totalPages, currentPage + 1);
    const list = [];
    for (let p = minP; p <= maxP; p++) {
      const pageText = bookRef.current.getPageText(p);
      if (pageText && pageText.trim()) {
        list.push({ pageNum: p, text: pageText.trim() });
      }
    }
    return list;
  }, [isImageGenActive, currentPage, totalPages, bookRef]);

  // Synchronize document body styles, theme backgrounds, and lock scroll leakage during reading
  useEffect(() => {
    const originalBodyBg = document.body.style.backgroundColor;
    const originalBodyOverflow = document.body.style.overflow;
    const originalDocOverflow = document.documentElement.style.overflow;
    const originalBodyTouch = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    const themeBgMap = {
      "pure-white": "#f8fafc",
      "warm-cream": "#f5eedc",
      "paper-sepia": "#ebe1c5",
      "charcoal-dark": "#0a0c10",
    };
    document.body.style.backgroundColor = themeBgMap[theme] || "#f8fafc";

    return () => {
      document.body.style.backgroundColor = originalBodyBg;
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalDocOverflow;
      document.body.style.touchAction = originalBodyTouch;
    };
  }, [theme]);

  const handleCanvasClick = useCallback(() => {
    if (activePopover) {
      handleClosePopover();
    }
  }, [activePopover, handleClosePopover]);

  const handleRootClick = useCallback(() => {
    if (activePopover) {
      handleClosePopover();
    }
  }, [activePopover, handleClosePopover]);

  const handleBack = useCallback(() => {
    const doc = document;
    if (
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.mozFullScreenElement ||
      doc.msFullscreenElement
    ) {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      }
    }
    navigate(-1);
  }, [navigate]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);

      const doc = document;
      if (
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      ) {
        if (doc.exitFullscreen) {
          doc.exitFullscreen().catch(() => {});
        } else if (doc.webkitExitFullscreen) {
          doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          doc.msExitFullscreen();
        }
      }
    };
  }, []);

  const handleToggleFullscreen = useCallback(async () => {
    try {
      const doc = document;
      const docEl = document.documentElement;

      const isFs = Boolean(
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.mozFullScreenElement ||
        doc.msFullscreenElement
      );

      if (!isFs) {
        if (docEl.requestFullscreen) {
          await docEl.requestFullscreen();
        } else if (docEl.webkitRequestFullscreen) {
          await docEl.webkitRequestFullscreen();
        } else if (docEl.mozRequestFullScreen) {
          await docEl.mozRequestFullScreen();
        } else if (docEl.msRequestFullscreen) {
          await docEl.msRequestFullscreen();
        }
      } else {
        if (doc.exitFullscreen) {
          await doc.exitFullscreen();
        } else if (doc.webkitExitFullscreen) {
          await doc.webkitExitFullscreen();
        } else if (doc.mozCancelFullScreen) {
          await doc.mozCancelFullScreen();
        } else if (doc.msExitFullscreen) {
          await doc.msExitFullscreen();
        }
      }
    } catch {
      // Ignored if user dismissed or permission denied
    }
  }, []);

  return {
    theme,
    fontSize,
    handleFontSizeChange,
    handleSelectTheme,
    handleCycleTheme,
    transitionMode,
    setTransitionMode,
    isLocked,
    handleToggleLock,
    isControlsVisible,
    toggleControls,
    activePopover,
    handleTogglePopover,
    handleClosePopover,
    activeModal,
    handleOpenModal,
    handleCloseModal,
    handleOpenFastTravel,
    handleOpenImageGen,
    isImageGenActive,
    imageGenPages,
    isFullscreen,
    handleToggleFullscreen,
    handleCanvasClick,
    handleRootClick,
    handleBack,
  };
}

export default useReaderUIState;
