import React from "react";
import { useNavigate } from "react-router-dom";
import { useVoiceSampleStore } from "../../hooks/useVoiceSampleStore";
import VoiceSampleModal from "./VoiceSampleModal";

/**
 * Unified Voice Sample Modal Container.
 * Renders the single globally coordinated VoiceSampleModal on the landing page.
 * Strictly guarantees that at most ONE audio and ONE modal can ever be active.
 */
export function VoiceSampleModalContainer() {
  const navigate = useNavigate();

  const {
    isOpen,
    activeBook,
    isPlaying,
    currentTimeFormatted,
    durationFormatted,
    progress,
    closeSample,
    togglePlay,
    skipTime,
    seek,
  } = useVoiceSampleStore();

  if (!activeBook) return null;

  return (
    <VoiceSampleModal
      isOpen={isOpen}
      onClose={closeSample}
      book={activeBook}
      isPlaying={isPlaying}
      currentTime={currentTimeFormatted}
      duration={durationFormatted}
      progress={progress}
      onTogglePlay={togglePlay}
      onSkip={skipTime}
      onSeek={seek}
      onStartNow={() => navigate("/login")}
    />
  );
}

export default VoiceSampleModalContainer;
