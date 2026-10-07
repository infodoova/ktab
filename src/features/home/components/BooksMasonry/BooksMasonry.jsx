import React from "react";
import { BookOpen } from "lucide-react";
import { useBooksMasonry } from "../../hooks/useBooksMasonry";
import SectionHeader from "@/components/common/SectionHeader";
import HomeCoverImage from "../HomeCoverImage/HomeCoverImage";
import "./BooksMasonry.css";

/**
 * Displays public covers in two marquee rows; hovering slows the tracks.
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
    isLoading,
    error,
    retry,
    refreshAfterImageError,
  } = useBooksMasonry();

  if (!isLoading && !error && row1.length === 0) return null;

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
      {error && <div className="home-covers-error" role="status">{error}<button className="home-covers-retry" type="button" onClick={retry}>إعادة المحاولة</button></div>}
      <div className="er-masonry-stage" aria-busy={isLoading}>
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
              >
                {/* Album Cover Art (2:3 Standard Book Ratio) */}
                <div className="er-album-cover-wrapper">
                  <HomeCoverImage src={book.cover} onImageError={refreshAfterImageError} />
                  {/* Audio preview temporarily disabled: onClick={(event) => handlePlayBook(book, event)} */}
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
              >
                {/* Album Cover Art */}
                <div className="er-album-cover-wrapper">
                  <HomeCoverImage src={book.cover} onImageError={refreshAfterImageError} />
                  {/* Audio preview temporarily disabled: onClick={(event) => handlePlayBook(book, event)} */}
                </div>

              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
