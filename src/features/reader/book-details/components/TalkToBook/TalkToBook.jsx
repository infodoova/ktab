import React from "react";
import { useTalkToBook } from "../../hooks/useTalkToBook";
import { TalkToBookFloatingButton } from "./TalkToBookFloatingButton";
import { TalkToBookModal } from "./TalkToBookModal";
import "./TalkToBook.css";

/**
 * Master Talk-to-Book interactive experience component.
 * Mounts a floating action ball on the bottom right and handles responsive
 * bottom-right card, mobile bottom sheet, and iPad bottom-centered modal presentations.
 *
 * @param {Object} props
 * @param {string|number} props.bookId - ID of currently active book.
 * @param {string} [props.bookTitle] - Title of the book for customized conversation context.
 */
export function TalkToBook({
  bookId,
  bookTitle = "",
  authorName = "",
  genre = "",
  description = "",
}) {
  const {
    isOpen,
    handleClose,
    handleToggle,
    question,
    currentPlaceholder,
    charCount,
    maxChars,
    isQuestionValid,
    handleApplyPrediction,
    handleQuestionChange,
    handleComposerKeyDown,
    handleSubmit,
    handleClearChat,
    handleCitationClick,
    handlePageClick,
    messages,
    isLoading,
    copiedMessageId,
    handleCopyMessage,
    messagesEndRef,
    textareaRef,
  } = useTalkToBook({
    bookId,
    bookTitle,
    authorName,
    genre,
    description,
  });

  return (
    <>
      {/* 1. Fixed Action Ball Button (Bottom Right) */}
      <TalkToBookFloatingButton isOpen={isOpen} onClick={handleToggle} />

      {/* 2. Responsive Conversation Dialog & Overlay */}
      <TalkToBookModal
        isOpen={isOpen}
        onClose={handleClose}
        onClearChat={handleClearChat}
        bookTitle={bookTitle}
        messages={messages}
        isLoading={isLoading}
        question={question}
        currentPlaceholder={currentPlaceholder}
        charCount={charCount}
        maxChars={maxChars}
        isQuestionValid={isQuestionValid}
        onApplyPrediction={handleApplyPrediction}
        onQuestionChange={handleQuestionChange}
        onComposerKeyDown={handleComposerKeyDown}
        onSubmit={handleSubmit}
        onCitationClick={handleCitationClick}
        onPageClick={handlePageClick}
        onCopyMessage={handleCopyMessage}
        copiedMessageId={copiedMessageId}
        messagesEndRef={messagesEndRef}
        textareaRef={textareaRef}
      />
    </>
  );
}

export default TalkToBook;
