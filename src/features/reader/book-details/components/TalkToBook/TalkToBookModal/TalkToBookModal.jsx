import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Trash2,
  ArrowUp,
  BookOpen,
  Zap,
  ExternalLink,
  Sparkles,
  Copy,
  Check,
  AlertCircle,
} from "lucide-react";
import { TalkToBookIcon } from "../TalkToBookIcon";
import { TalkToBookMessageContent } from "../TalkToBookMessageContent";

/**
 * Conversational book assistant dialog.
 * Fixed anchor to bottom-right viewport on desktop with spring scale transform,
 * bottom-sheet on mobile devices, and centered dialog on tablet screens.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {() => void} props.onClearChat
 * @param {string} [props.bookTitle]
 * @param {Array} props.messages
 * @param {boolean} props.isLoading
 * @param {string} props.question
 * @param {string} props.currentPlaceholder
 * @param {number} props.charCount
 * @param {number} props.maxChars
 * @param {boolean} props.isQuestionValid
 * @param {() => void} props.onApplyPrediction
 * @param {(e: any) => void} props.onQuestionChange
 * @param {(e: any) => void} props.onComposerKeyDown
 * @param {(e?: any) => void} props.onSubmit
 * @param {(page: number) => void} props.onPageClick
 * @param {(msgId: string, text: string) => void} props.onCopyMessage
 * @param {string|null} props.copiedMessageId
 * @param {React.RefObject} props.messagesEndRef
 * @param {React.RefObject} props.textareaRef
 */
const macWindowVariants = {
  hidden: {
    opacity: 0,
    scale: 0.12,
    y: 12,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 24,
      stiffness: 280,
      mass: 0.85,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.12,
    y: 12,
    transition: {
      type: "spring",
      damping: 26,
      stiffness: 320,
      mass: 0.7,
    },
  },
};

export function TalkToBookModal({
  isOpen,
  onClose,
  onClearChat,
  bookTitle = "",
  messages,
  isLoading,
  question,
  currentPlaceholder,
  charCount,
  maxChars,
  isQuestionValid,
  onApplyPrediction,
  onQuestionChange,
  onComposerKeyDown,
  onSubmit,
  onCitationClick,
  onPageClick,
  onCopyMessage,
  copiedMessageId,
  messagesEndRef,
  textareaRef,
}) {
  const canClear =
    (Array.isArray(messages) &&
      (messages.length > 1 || messages.some((m) => m.role === "user"))) ||
    Boolean(question && question.trim().length > 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="talk-to-book-backdrop"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: "easeInOut" }}
        >
          <motion.div
            variants={macWindowVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="talk-to-book-dialog"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="مساعد التحدث مع الكتاب"
            dir="rtl"
          >
            {/* Mobile Sheet Drag Indicator Pill */}
            <div className="talk-to-book-dialog__handle-wrap">
              <div className="talk-to-book-dialog__handle" />
            </div>

            {/* Header Section */}
            <header className="talk-to-book-dialog__header">
              <div className="talk-to-book-dialog__header-info">
                <div className="talk-to-book-dialog__header-row">
                  <div className="talk-to-book-dialog__header-icon-wrap" aria-hidden="true">
                    <TalkToBookIcon size={15} />
                  </div>
                  <div className="talk-to-book-dialog__header-titles">
                    <h3 className="talk-to-book-dialog__title">
                      تحدث مع الكتاب
                    </h3>
                    {bookTitle && (
                      <p className="talk-to-book-dialog__book-subtitle" title={bookTitle}>
                        {bookTitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="talk-to-book-dialog__header-actions">
                <button
                  type="button"
                  onClick={onClearChat}
                  disabled={isLoading || !canClear}
                  className="talk-to-book-dialog__action-btn talk-to-book-dialog__action-btn--delete"
                  title="حذف المحادثة"
                  aria-label="حذف المحادثة"
                >
                  <Trash2 size={15} strokeWidth={1.8} />
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="talk-to-book-dialog__action-btn talk-to-book-dialog__action-btn--close"
                  title="إغلاق"
                  aria-label="إغلاق"
                >
                  <X size={16} strokeWidth={2} />
                </button>
              </div>
            </header>

            {/* Conversation Messages Feed (Maximized Height) */}
            <div className="talk-to-book-dialog__feed">
              {messages.map((msg) => {
                const isUser = msg.role === "user";
                const isOffTopic = msg.source === "REJECTED_OFF_TOPIC";
                const isError = Boolean(msg.isError || msg.source === "ERROR");
                const hasSnippets = Array.isArray(msg.citations) && msg.citations.length > 0;
                const hasPageCitations = !hasSnippets && Array.isArray(msg.citedPages) && msg.citedPages.length > 0;
                const isCopied = copiedMessageId === msg.id;

                return (
                  <div
                    key={msg.id}
                    className={`talk-to-book-msg ${
                      isUser
                        ? "talk-to-book-msg--user"
                        : "talk-to-book-msg--assistant"
                    } ${isOffTopic ? "talk-to-book-msg--off-topic" : ""} ${
                      isError ? "talk-to-book-msg--error" : ""
                    }`}
                  >
                    {!isUser && (
                      <div className="talk-to-book-msg__avatar-wrap">
                        <div className="talk-to-book-msg__avatar" aria-hidden="true">
                          <TalkToBookIcon size={12} />
                        </div>
                      </div>
                    )}

                    <div
                      className="talk-to-book-msg__bubble"
                      onClick={() => {
                        const sel = window.getSelection()?.toString();
                        if (sel && sel.length > 0) return;
                        if (onCopyMessage) onCopyMessage(msg.id, msg.content);
                      }}
                    >
                      {/* Copy Action Control (Assistant only to prevent bubble layout distortion on user prompts) */}
                      {!isUser && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onCopyMessage) onCopyMessage(msg.id, msg.content);
                          }}
                          className={`talk-to-book-msg__copy-btn ${
                            isCopied ? "talk-to-book-msg__copy-btn--copied" : ""
                          }`}
                          title={isCopied ? "تم النسخ" : "نسخ النص"}
                          aria-label={isCopied ? "تم النسخ" : "نسخ النص"}
                        >
                          {isCopied ? (
                            <>
                              <Check size={12} strokeWidth={2.4} />
                              <span className="talk-to-book-msg__copy-label">تم النسخ</span>
                            </>
                          ) : (
                            <Copy size={12} strokeWidth={2} />
                          )}
                        </button>
                      )}

                      {/* Message Text Content: plain for user with automatic text direction, rich markdown for assistant */}
                      {isUser ? (
                        <p className="talk-to-book-msg__text" dir="auto">{msg.content}</p>
                      ) : (
                        <TalkToBookMessageContent
                          content={msg.content}
                          isUser={false}
                          citations={msg.citations || []}
                          onCitationClick={onCitationClick}
                          onPageClick={onPageClick}
                        />
                      )}

                      {/* Cited Sources & Verbatim Snippets Bar */}
                      {!isUser && (hasSnippets || hasPageCitations) && (
                        <div className="talk-to-book-msg__citations">
                          <div className="talk-to-book-msg__citations-label">
                            <BookOpen size={12} strokeWidth={2} />
                            <span>المراجع المعتمدة من صفحات الكتاب:</span>
                          </div>
                          <div className="talk-to-book-msg__citations-list">
                            {hasSnippets &&
                              msg.citations.map((c, i) => (
                                <button
                                  key={`snippet-${c.id || i}`}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onCitationClick) onCitationClick(c);
                                  }}
                                  className="talk-to-book-msg__snippet-pill"
                                  title={c.snippet ? `انقر للانتقال إلى: «${c.snippet}»` : "مرجع الكتاب"}
                                >
                                  <span className="talk-to-book-msg__snippet-badge">[{c.id || i + 1}]</span>
                                  {c.page && <span className="talk-to-book-msg__page-pill">ص {c.page}</span>}
                                  {c.snippet && <span className="talk-to-book-msg__snippet-text">{c.snippet}</span>}
                                  <ExternalLink size={10} strokeWidth={2} />
                                </button>
                              ))}
                            {hasPageCitations &&
                              msg.citedPages.map((page) => (
                                <button
                                  key={`page-${page}`}
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (onPageClick) onPageClick(page);
                                  }}
                                  className="talk-to-book-msg__page-pill"
                                  title={`انتقل إلى صفحة ${page}`}
                                >
                                  <BookOpen size={10} strokeWidth={2} />
                                  <span>صفحة {page}</span>
                                  <ExternalLink size={10} strokeWidth={2} />
                                </button>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Metadata Footer: Semantic Cache & Verification Badge */}
                      {!isUser && (
                        <div className="talk-to-book-msg__meta">
                          {msg.cached && (
                            <span className="talk-to-book-msg__cache-pill">
                              <Zap size={12} />
                              <span>إجابة فورية من الأرشيف {msg.hitCount > 1 ? `(سُئل ${msg.hitCount} مرات)` : ""}</span>
                            </span>
                          )}

                          {isError ? (
                            <span className="talk-to-book-msg__source-pill talk-to-book-msg__source-pill--error">
                              <AlertCircle size={12} />
                              تعذر توثيق الاقتباسات بدقة
                            </span>
                          ) : isOffTopic ? (
                            <span className="talk-to-book-msg__source-pill talk-to-book-msg__source-pill--off-topic">
                              <AlertCircle size={12} />
                              خارج نطاق الكتاب
                            </span>
                          ) : (
                            <span className="talk-to-book-msg__source-pill">
                              {msg.source === "INTERNAL_RAG" && "نصوص الكتاب المعتمدة"}
                              {msg.source === "WEB_AUGMENTED" && "نظرة عامة موثقة"}
                              {msg.source === "CACHED" && "سجل محفوظ"}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* In-Flight Typing / Loading Skeleton */}
              {isLoading && (
                <div className="talk-to-book-msg talk-to-book-msg--assistant">
                  <div className="talk-to-book-msg__avatar">
                    <TalkToBookIcon size={13} />
                  </div>
                  <div className="talk-to-book-msg__bubble talk-to-book-msg__bubble--loading">
                    <div className="talk-to-book-typing-indicator" aria-label="جاري كتابة الإجابة">
                      <span className="talk-to-book-typing-dot" />
                      <span className="talk-to-book-typing-dot" />
                      <span className="talk-to-book-typing-dot" />
                    </div>
                  </div>
                </div>
              )}

              {/* Anchor for Auto-Scrolling */}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Composer Form */}
            <form onSubmit={onSubmit} className="talk-to-book-dialog__composer">
              <div className="talk-to-book-dialog__input-container">
                <textarea
                  ref={textareaRef}
                  value={question}
                  onChange={onQuestionChange}
                  onKeyDown={onComposerKeyDown}
                  placeholder={currentPlaceholder || "اطرح سؤالاً عن الكتاب..."}
                  className="talk-to-book-dialog__textarea"
                  rows={2}
                  disabled={isLoading}
                  maxLength={maxChars}
                  dir="auto"
                />

                <div className="talk-to-book-dialog__composer-footer">
                  <div className="talk-to-book-dialog__composer-actions-left">
                    <button
                      type="button"
                      onClick={onApplyPrediction}
                      className="talk-to-book-dialog__prediction-icon-btn"
                      title="اقتراح سؤال ذكي (انقر للتبديل)"
                      aria-label="اقتراح سؤال ذكي"
                      disabled={isLoading}
                    >
                      <Sparkles size={14} strokeWidth={2} />
                    </button>

                    <span
                      className={`talk-to-book-dialog__char-count ${
                        charCount >= maxChars - 20
                          ? "talk-to-book-dialog__char-count--warn"
                          : ""
                      }`}
                    >
                      {charCount}/{maxChars}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={!isQuestionValid || isLoading}
                    className={`talk-to-book-dialog__send-btn ${
                      isQuestionValid && !isLoading
                        ? "talk-to-book-dialog__send-btn--active"
                        : ""
                    }`}
                    aria-label="إرسال السؤال"
                    title="إرسال السؤال (Enter)"
                  >
                    <ArrowUp size={15} strokeWidth={2.4} />
                  </button>
                </div>
              </div>
              <p className="talk-to-book-dialog__composer-hint">
                اضغط Enter للإرسال، Shift + Enter لسطر جديد
              </p>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TalkToBookModal;
