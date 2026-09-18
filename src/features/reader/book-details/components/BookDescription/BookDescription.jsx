import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./BookDescription.css";

/**
 * Editorial Apple Books Publisher Description section.
 * Renders the author/publisher synopsis with smooth line clamping and inline expand toggle.
 */
export function BookDescription({
  description,
  isExpanded,
  onToggleExpand,
}) {
  if (!description) {
    return (
      <section className="apple-book-desc" dir="rtl">
        <h2 className="apple-book-desc__heading">نبذة عن الكتاب</h2>
        <p className="apple-book-desc__empty">لا توجد نبذة تعريفية مضافة لهذا العمل حالياً.</p>
      </section>
    );
  }

  // Split description by double newlines into distinct paragraphs if present
  const paragraphs = description.split(/\n\s*\n/).filter(Boolean);

  return (
    <section className="apple-book-desc" dir="rtl" aria-label="نبذة عن الكتاب">
      <h2 className="apple-book-desc__heading">نبذة عن الكتاب</h2>

      <div
        className={`apple-book-desc__content ${
          !isExpanded ? "apple-book-desc__content--clamped" : ""
        }`}
      >
        {paragraphs.map((para, index) => (
          <p key={index} className="apple-book-desc__paragraph">
            {para}
          </p>
        ))}
      </div>

      {description.length > 220 && (
        <button
          type="button"
          onClick={onToggleExpand}
          className="apple-book-desc__toggle-btn"
          aria-expanded={isExpanded}
        >
          <span>{isExpanded ? "عرض أقل" : "المزيد"}</span>
          {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
      )}
    </section>
  );
}

export default BookDescription;
