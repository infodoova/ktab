import { useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/core/store";
import { useReaderVoices } from "./useReaderVoices";
import { useReaderTTS } from "./useReaderTTS";
import { useReaderContent } from "./useReaderContent";
import { useReaderAmbientSound } from "./useReaderAmbientSound";
import { useReaderUIState } from "./useReaderUIState";
import { useReaderNavigation } from "./useReaderNavigation";

/**
 * Master coordinator hook for the book reading experience, delegating
 * content fetching, ambient sound, navigation, UI states, and TTS narration
 * to focused, single-responsibility sub-hooks.
 *
 * @returns {Object} Complete reading view controller contract
 */
export function useBookReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const { voice, setVoice, voiceOptions } = useReaderVoices();

  const bookRef = useRef(null);

  // 1. Content & metadata fetching
  const {
    bookTitle,
    bookAuthor,
    bookText,
    loadingText,
    totalPages: contentEstimatedPages,
    wordsPerPage,
    setWordsPerPage,
    currentPageData,
    initialNavigation,
    loadPage,
    pagesCacheRef,
  } = useReaderContent(id);

  // 2. Ambient background audio
  const {
    effect,
    setEffect,
    isMuted,
    volume,
    cycleVolume,
  } = useReaderAmbientSound();

  // Forward declaration for TTS stream synchronization on page change
  const ttsActionsRef = useRef({});

  const onPageChangeNotification = useCallback((newPage, pages) => {
    if (ttsActionsRef.current.isPlaying) {
      const info = pages[newPage - 1];
      if (info) {
        if (info.isEndPage) {
          ttsActionsRef.current.cancelStream?.();
          ttsActionsRef.current.togglePlay?.();
          return;
        }
        const pageContent =
          pagesCacheRef?.current?.[newPage]?.content ||
          (currentPageData?.page === newPage ? currentPageData.content : "");
        ttsActionsRef.current.startPageStream?.(
          {
            bookId: id,
            voiceId: voice,
            page: newPage,
            text: pageContent,
            wordsPerPage: wordsPerPage || 80,
            startWord: info.startWord,
            endWord: info.endWord,
            isLastPage: newPage === pages.length - 1,
          },
          info.startChar
        );
      }
    }
  }, [id, voice, pagesCacheRef, currentPageData, wordsPerPage]);

  // 3. Navigation & citation deep links
  const {
    currentPage,
    citationLoading,
    totalPages: navTotalPages,
    generatedPagesRef,
    currentPageText,
    handleNextPage,
    handlePrevPage,
    handleGoToPage,
    handlePageChange,
    onPagesGenerated,
  } = useReaderNavigation({
    bookId: id,
    bookRef,
    bookText,
    loadingText,
    token,
    wordsPerPage,
    initialNavigation,
    onPageChangeNotification,
    loadPage,
  });

  const effectiveTotalPages = contentEstimatedPages > 0 ? contentEstimatedPages : 1;

  // 4. UI controls, modals, popovers, lock & fullscreen
  const {
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
  } = useReaderUIState({
    bookRef,
    currentPage,
    totalPages: effectiveTotalPages,
  });

  // 5. TTS narration integration
  const {
    isPlaying,
    isStreaming,
    isLoading: isTTSLoading,
    togglePlay,
    startPageStream,
    cancelStream,
    stopReader,
  } = useReaderTTS({
    // Cookie sessions authenticate without exposing an access token to JS.
    enabled: isAuthenticated,
    onPageEnded: handleNextPage,
    onPrefetchNextPage: () => {
      const nextPage = currentPage + 1;
      const pages = generatedPagesRef.current;
      if (nextPage <= pages.length) {
        const nextInfo = pages[nextPage - 1];
        if (nextInfo && !nextInfo.isEndPage) {
          const nextContent = pagesCacheRef?.current?.[nextPage]?.content || "";
          startPageStream(
            {
              bookId: id,
              voiceId: voice,
              page: nextPage,
              text: nextContent,
              wordsPerPage: wordsPerPage || 80,
              startWord: nextInfo.startWord,
              endWord: nextInfo.endWord,
              isLastPage: nextPage === pages.length - 1,
            },
            nextInfo.startChar,
            { prefetch: true }
          );
        }
      }
    },
  });

  const handleReaderBack = useCallback(() => {
    stopReader();
    handleBack();
  }, [stopReader, handleBack]);

  // Keep actions ref updated for navigation callback
  ttsActionsRef.current = {
    isPlaying,
    cancelStream,
    togglePlay,
    startPageStream,
  };

  const handleTogglePlay = useCallback(async () => {
    if (!isPlaying) {
      const pages = generatedPagesRef.current;
      const info = pages[currentPage - 1];
      if (info && !info.isEndPage) {
        const pageContent = pagesCacheRef?.current?.[currentPage]?.content || currentPageData?.content || bookText || "";
        await togglePlay();
        startPageStream(
          {
            bookId: id,
            voiceId: voice,
            page: currentPage,
            text: pageContent,
            wordsPerPage: wordsPerPage || 80,
            startWord: info.startWord,
            endWord: info.endWord,
            isLastPage: currentPage === pages.length - 1,
          },
          info.startChar
        );
      }
    } else {
      togglePlay();
      cancelStream();
    }
  }, [isPlaying, currentPage, id, voice, togglePlay, startPageStream, cancelStream, generatedPagesRef, pagesCacheRef, currentPageData, bookText, wordsPerPage]);

  // Mobile Lock Screen & OS MediaSession integration
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;

    if (isPlaying) {
      try {
        navigator.mediaSession.playbackState = "playing";
        if (typeof MediaMetadata !== "undefined") {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: bookTitle || "كتاب",
            artist: bookAuthor || "القارئ الصوتي",
            album: "Doova Ktab",
          });
        }

        navigator.mediaSession.setActionHandler("play", () => {
          handleTogglePlay();
        });
        navigator.mediaSession.setActionHandler("pause", () => {
          handleTogglePlay();
        });
        navigator.mediaSession.setActionHandler("nexttrack", () => {
          handleNextPage();
        });
        navigator.mediaSession.setActionHandler("previoustrack", () => {
          handlePrevPage();
        });
      } catch (e) {
        console.warn("MediaSession setup warning:", e);
      }
    } else {
      try {
        navigator.mediaSession.playbackState = "paused";
      } catch (_) {}
    }
  }, [isPlaying, bookTitle, bookAuthor, handleTogglePlay, handleNextPage, handlePrevPage]);

  return {
    id,
    navigate,
    handleBack: handleReaderBack,
    handleRootClick,
    bookRef,
    bookTitle,
    bookAuthor,
    bookText,
    loadingText: loadingText || citationLoading,
    wordsPerPage,
    setWordsPerPage,
    currentPageData,
    loadPage,
    pagesCacheRef,
    voice,
    setVoice,
    voiceOptions,
    effect,
    setEffect,
    isMuted,
    volume,
    cycleVolume,
    fontSize,
    handleFontSizeChange,
    theme,
    handleSelectTheme,
    handleCycleTheme,
    transitionMode,
    handleSelectTransitionMode: setTransitionMode,
    isLocked,
    handleToggleLock,
    isFullscreen,
    handleToggleFullscreen,
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
    currentPageText,
    bookId: id,
    currentPage,
    totalPages: effectiveTotalPages,
    isPlaying,
    isStreaming,
    isTTSLoading,
    handleNextPage,
    handlePrevPage,
    handleGoToPage,
    handlePageChange,
    handleTogglePlay,
    onPagesGenerated,
    handleCanvasClick,
  };
}

export default useBookReader;
