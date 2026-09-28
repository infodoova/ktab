import React from "react";
import { TalkToBookIcon } from "../TalkToBookIcon";
import "./TalkToBookFloatingButton.css";

/**
 * Editorial Apple-style fixed floating ball button situated at the bottom-right corner.
 * Opens the conversation dialog in the bottom right corner.
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Current open status of the conversation modal.
 * @param {() => void} props.onClick - Toggle modal handler.
 */
export function TalkToBookFloatingButton({ isOpen, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`talk-to-book-floating-btn ${isOpen ? "talk-to-book-floating-btn--active" : ""}`}
      aria-label="تحدث مع الكتاب"
      aria-expanded={isOpen}
      title="تحدث مع الكتاب"
    >
      <span className="talk-to-book-floating-btn__core">
        <TalkToBookIcon size={26} className="talk-to-book-floating-btn__icon" />
      </span>

      {/* Hover Tooltip Label (Desktop) */}
      <span className="talk-to-book-floating-btn__tooltip">
        تحدث مع الكتاب
      </span>
    </button>
  );
}

export default TalkToBookFloatingButton;
