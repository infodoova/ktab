import React from "react";
import { Play, BookOpen } from "lucide-react";
import { useBooksMasonry } from "../../hooks/useBooksMasonry";
import VoiceSampleModal from "../VoiceSampleModal";
import SectionHeader from "@/components/common/SectionHeader";
import "./BooksMasonry.css";

/**
 * Apple-style Audiobooks Showcase Component (Rebranded Light Mode).
 * Displays two infinite horizontal marquee rows of book album cards.
 * On mouse hover over a row, the scrolling animation smoothly decelerates.
 * Pure declarative JSX; all state, physics, and audio controls reside in useBooksMasonry.
 */
export default function BooksMasonry() {
  const {
    row1,
    row2,
    row1Ref,
    row2Ref,
    handleRow1MouseEnter,
    handleRow1MouseLeave,
    handleRow2MouseEnter,
    handleRow2MouseLeave,
    selectedBook,
    isVoiceModalOpen,
    isPlaying,
    currentTime,
    duration,
    progress,
    handlePlayBook,
    handleTogglePlay,
    handleSkip,
    handleSeek,
    handleCloseModal,
  } = useBooksMasonry();

  return (
    <section id="library" className="er-masonry-section" dir="rtl">
      {/* Editorial Header (Global Component) */}
      <div className="er-masonry-header-wrapper">
        <SectionHeader
          icon={BookOpen}
          eyebrow="كتب صوتية ورقمية مختارة"
          title="انغمس في روعة القصة"
          align="start"
        />
      </div>

      {/* Marquee Showcase Stage */}
      <div className="er-masonry-stage">
        {/* Row 1: Scrolling Track */}
        <div
          className="er-masonry-row-wrapper"
          onMouseEnter={handleRow1MouseEnter}
          onMouseLeave={handleRow1MouseLeave}
        >
          <div ref={row1Ref} className="er-masonry-track">
            {row1.map((book, idx) => (
              <div
                key={`r1-${book.id}-${idx}`}
                className="er-album-card"
                onClick={(e) => handlePlayBook(book, e)}
                role="button"
                tabIndex={0}
                aria-label={book.title}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handlePlayBook(book, e);
                  }
                }}
              >
                {/* Album Cover Art (2:3 Standard Book Ratio) */}
                <div className="er-album-cover-wrapper">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="er-album-cover-img"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Apple-style Hover Action Pill */}
                  <div className="er-album-hover-action">
                    <span className="er-album-listen-pill">
                      <span>استمع الآن</span>
                      <Play className="er-album-play-icon" size={14} fill="currentColor" />
                    </span>
                  </div>
                </div>

                {/* Single Clean Title Line (Eleven Reader Style) */}
                <div className="er-album-meta">
                  <h4 className="er-album-title" title={book.title}>
                    {book.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: Scrolling Track (Offset Phase) */}
        <div
          className="er-masonry-row-wrapper"
          onMouseEnter={handleRow2MouseEnter}
          onMouseLeave={handleRow2MouseLeave}
        >
          <div ref={row2Ref} className="er-masonry-track">
            {row2.map((book, idx) => (
              <div
                key={`r2-${book.id}-${idx}`}
                className="er-album-card"
                onClick={(e) => handlePlayBook(book, e)}
                role="button"
                tabIndex={0}
                aria-label={book.title}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handlePlayBook(book, e);
                  }
                }}
              >
                {/* Album Cover Art */}
                <div className="er-album-cover-wrapper">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="er-album-cover-img"
                    loading="lazy"
                    decoding="async"
                  />
                  {/* Apple-style Hover Action Pill */}
                  <div className="er-album-hover-action">
                    <span className="er-album-listen-pill">
                      <span>استمع الآن</span>
                      <Play className="er-album-play-icon" size={14} fill="currentColor" />
                    </span>
                  </div>
                </div>

                {/* Single Clean Title Line (Eleven Reader Style) */}
                <div className="er-album-meta">
                  <h4 className="er-album-title" title={book.title}>
                    {book.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Apple-Grade Voice Sample Modal */}
      {selectedBook && (
        <VoiceSampleModal
          isOpen={isVoiceModalOpen}
          onClose={handleCloseModal}
          book={selectedBook}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          progress={progress}
          onTogglePlay={handleTogglePlay}
          onSkip={handleSkip}
          onSeek={handleSeek}
        />
      )}
    </section>
  );
}