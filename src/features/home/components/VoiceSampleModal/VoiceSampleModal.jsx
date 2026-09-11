import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Pause, ChevronUp, ChevronDown, Headphones } from "lucide-react";
import { useVoiceSampleModal } from "../../hooks/useVoiceSampleModal";
import "./VoiceSampleModal.css";

/**
 * Pure presentational floating audio player widget styled after Apple and Eleven Reader.
 * All state, sentence chunking, auto-scrolling, and scrubber calculations reside in useVoiceSampleModal.
 */
export function VoiceSampleModal({
  isOpen,
  onClose,
  book,
  isPlaying,
  currentTime,
  duration,
  progress,
  onTogglePlay,
  onSkip,
  onSeek,
  onStartNow,
}) {
  const {
    isPillMode,
    setIsPillMode,
    sentences,
    activeSentenceIdx,
    activeSentenceRef,
    handleScrubberClick,
  } = useVoiceSampleModal({ book, progress, onSeek });

  if (!book) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="floating-voice-player"
          layout
          initial={{ opacity: 0, y: 35, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 25, scale: 0.94 }}
          transition={{
            layout: { type: "spring", stiffness: 340, damping: 32 },
            opacity: { duration: 0.2 },
          }}
          className={`er-floating-player-widget ${
            isPillMode ? "er-pill-bar-mode" : "er-card-modal-mode"
          }`}
          dir="rtl"
          role="region"
          aria-label="مشغل العينة الصوتية"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {isPillMode ? (
              /* ══════════════════════════════════════════════════════════════
                 SHAPE 2: HORIZONTAL COMPACT PILL BAR (Eleven Reader Inspired)
                 ══════════════════════════════════════════════════════════════ */
              <motion.div
                key="pill-mode-view"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="er-pill-bar-content"
              >
                {/* Left Meta: Book Thumbnail + Title + Author */}
                <div className="er-pill-bar-meta">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="er-pill-bar-thumb"
                  />
                  <div className="er-pill-bar-text">
                    <h4 className="er-pill-bar-title">{book.title}</h4>
                    <p className="er-pill-bar-author">{book.author}</p>
                  </div>
                </div>

                {/* Center Playback Controls: Right (-5s), Play/Pause, Left (+5s) in RTL */}
                <div className="er-pill-bar-controls" dir="rtl">
                  {/* Right: Rewind 5 seconds (-5s) */}
                  <button
                    type="button"
                    className="er-pill-skip-btn"
                    onClick={() => onSkip(-5)}
                    aria-label="إرجاع 5 ثوانٍ (-5)"
                    title="إرجاع 5 ثوانٍ (-5)"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19.4 17.2A9 9 0 1 0 3.8 8.2" />
                      <polyline points="3.5 3.5 3.5 8.5 8.5 8.5" />
                      <text x="12.2" y="14" fontSize="8.2" fontWeight="800" fill="currentColor" stroke="none" textAnchor="middle" dominantBaseline="middle" fontFamily="system-ui, -apple-system, sans-serif">-5</text>
                    </svg>
                  </button>

                  {/* Play Button with Circular White Progress on Black Surface */}
                  <div className="er-pill-play-circle-wrapper">
                    <button
                      type="button"
                      className="er-pill-play-btn"
                      onClick={onTogglePlay}
                      aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                    >
                      <svg className="er-pill-circular-svg" viewBox="0 0 44 44">
                        <circle
                          cx="22"
                          cy="22"
                          r="19.5"
                          className="er-pill-circular-bg"
                        />
                        <circle
                          cx="22"
                          cy="22"
                          r="19.5"
                          className="er-pill-circular-meter"
                          style={{
                            strokeDasharray: 122.52,
                            strokeDashoffset: 122.52 - (122.52 * Math.min(100, Math.max(0, progress))) / 100,
                          }}
                        />
                      </svg>
                      {isPlaying ? (
                        <Pause size={17} fill="currentColor" />
                      ) : (
                        <Play size={17} fill="currentColor" style={{ marginRight: "-2px" }} />
                      )}
                    </button>
                  </div>

                  {/* Left: Add 5 seconds (+5s) */}
                  <button
                    type="button"
                    className="er-pill-skip-btn"
                    onClick={() => onSkip(5)}
                    aria-label="تقديم 5 ثوانٍ (+5)"
                    title="تقديم 5 ثوانٍ (+5)"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4.6 17.2A9 9 0 1 1 20.2 8.2" />
                      <polyline points="20.5 3.5 20.5 8.5 15.5 8.5" />
                      <text x="11.8" y="14" fontSize="7.8" fontWeight="800" fill="currentColor" stroke="none" textAnchor="middle" dominantBaseline="middle" fontFamily="system-ui, -apple-system, sans-serif">+5</text>
                    </svg>
                  </button>
                </div>

                {/* Right Side Actions: "استمع في التطبيق" + Toggle Expand + Close */}
                <div className="er-pill-bar-actions">
                  <button
                    type="button"
                    className="er-pill-app-btn"
                    onClick={onStartNow}
                    title="استمع في التطبيق"
                  >
                    <span>استمع في التطبيق</span>
                    <Headphones size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPillMode(false)}
                    className="er-fp-action-icon-btn"
                    aria-label="عرض النص والكلمات"
                    title="عرض النص والكلمات"
                  >
                    <ChevronUp size={16} />
                  </button>

                  <button
                    onClick={onClose}
                    className="er-fp-action-icon-btn"
                    type="button"
                    aria-label="إغلاق المشغل"
                  >
                    <X size={14} />
                  </button>
                </div>
              </motion.div>
            ) : (
              /* ══════════════════════════════════════════════════════════════
                 SHAPE 1: EXPANDED TRANSLUCENT GLASS CARD WITH TRANSCRIPT
                 ══════════════════════════════════════════════════════════════ */
              <motion.div
                key="card-mode-view"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="er-card-modal-content"
              >
                {/* 1. Header: Thumbnail + Title + Live Waveform + Shape Toggle + Close */}
                <div className="er-fp-header">
                  <div className="er-fp-meta">
                    <img
                      src={book.cover}
                      alt={book.title}
                      className="er-fp-thumb"
                    />
                    <div className="er-fp-text-col">
                      <h4 className="er-fp-title">{book.title}</h4>
                      <p className="er-fp-author">{book.author}</p>
                    </div>
                  </div>

                  <div className="er-fp-header-right">
                    {/* Live 4-Bar Mini Waveform */}
                    <div className={`er-fp-mini-wave ${isPlaying ? "playing" : ""}`}>
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>

                    {/* Shape Toggle: Switch to Horizontal Pill Bar */}
                    <button
                      type="button"
                      onClick={() => setIsPillMode(true)}
                      className="er-fp-action-icon-btn"
                      aria-label="تصغير إلى شريط"
                      title="تصغير إلى شريط"
                    >
                      <ChevronDown size={16} />
                    </button>

                    <button
                      onClick={onClose}
                      className="er-fp-action-icon-btn"
                      type="button"
                      aria-label="إغلاق المشغل"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* 2. Sentence-by-Sentence Editorial Read-Along Highlighting */}
                <div className="er-fp-transcript-box">
                  <p className="er-fp-transcript-text">
                    {sentences.map((sentence, idx) => (
                      <span
                        key={idx}
                        ref={idx === activeSentenceIdx ? activeSentenceRef : null}
                        className={`er-fp-sentence ${
                          idx === activeSentenceIdx
                            ? "active-highlight"
                            : idx < activeSentenceIdx
                            ? "read-highlight"
                            : "pending-highlight"
                        }`}
                      >
                        {sentence}{" "}
                      </span>
                    ))}
                  </p>
                </div>

                {/* 3. Scrubber Bar & Times */}
                <div className="er-fp-scrubber-section" dir="rtl">
                  <div
                    className="er-fp-track"
                    dir="rtl"
                    onClick={handleScrubberClick}
                  >
                    <div
                      className="er-fp-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="er-fp-times-row" dir="rtl">
                    <span>{currentTime}</span>
                    <span>{duration}</span>
                  </div>
                </div>

                {/* 4. Centered Playback Controls: Right (-5s), Play/Pause, Left (+5s) in RTL */}
                <div className="er-fp-controls-row centered" dir="rtl">
                  <div className="er-fp-actions-group" dir="rtl">
                    {/* Right: Rewind 5 seconds (-5s) */}
                    <button
                      type="button"
                      className="er-fp-skip-btn"
                      onClick={() => onSkip(-5)}
                      aria-label="إرجاع 5 ثوانٍ (-5)"
                      title="إرجاع 5 ثوانٍ (-5)"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19.4 17.2A9 9 0 1 0 3.8 8.2" />
                        <polyline points="3.5 3.5 3.5 8.5 8.5 8.5" />
                        <text x="12.2" y="14" fontSize="8.2" fontWeight="800" fill="currentColor" stroke="none" textAnchor="middle" dominantBaseline="middle" fontFamily="system-ui, -apple-system, sans-serif">-5</text>
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="er-fp-play-btn"
                      onClick={onTogglePlay}
                      aria-label={isPlaying ? "إيقاف مؤقت" : "تشغيل"}
                    >
                      {isPlaying ? (
                        <Pause size={18} fill="#ffffff" />
                      ) : (
                        <Play size={18} fill="#ffffff" style={{ marginRight: "-2px" }} />
                      )}
                    </button>

                    {/* Left: Add 5 seconds (+5s) */}
                    <button
                      type="button"
                      className="er-fp-skip-btn"
                      onClick={() => onSkip(5)}
                      aria-label="تقديم 5 ثوانٍ (+5)"
                      title="تقديم 5 ثوانٍ (+5)"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4.6 17.2A9 9 0 1 1 20.2 8.2" />
                        <polyline points="20.5 3.5 20.5 8.5 15.5 8.5" />
                        <text x="11.8" y="14" fontSize="7.8" fontWeight="800" fill="currentColor" stroke="none" textAnchor="middle" dominantBaseline="middle" fontFamily="system-ui, -apple-system, sans-serif">+5</text>
                      </svg>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default VoiceSampleModal;
