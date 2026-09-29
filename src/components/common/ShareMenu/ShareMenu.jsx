import React, { cloneElement, isValidElement } from "react";
import { Check, Share } from "lucide-react";
import { useShareMenu } from "./useShareMenu";
import "./ShareMenu.css";

/**
 * Editorial Share Component:
 * - On mobile: Invokes device native share sheet (the default system dialog).
 * - On PC: Directly copies the short link / image link with instant checkmark feedback.
 */
export function ShareMenu({
  children,
  url,
  bookId,
  page,
  title = "",
  text = "",
  authorName = "",
  className = "",
}) {
  const { copied, handleAction } = useShareMenu({
    url,
    bookId,
    page,
    title,
    text,
    authorName,
  });

  if (isValidElement(children)) {
    return cloneElement(children, {
      onClick: (e) => {
        if (children.props.onClick) children.props.onClick(e);
        handleAction(e);
      },
      className: `${children.props.className || ""} ${copied ? "ktab-share-btn--copied" : ""}`.trim(),
      title: copied ? "تم النسخ!" : (children.props.title || "نسخ الرابط"),
      children: copied ? (
        <Check size={17} strokeWidth={2.4} className="ktab-share-btn__check" />
      ) : (
        children.props.children
      ),
    });
  }

  return (
    <button
      type="button"
      className={`apple-book-hero__icon-btn ${copied ? "ktab-share-btn--copied" : ""} ${className}`}
      onClick={handleAction}
      aria-label={copied ? "تم النسخ" : "نسخ الرابط"}
      title={copied ? "تم النسخ!" : "نسخ الرابط"}
    >
      {copied ? <Check size={17} strokeWidth={2.4} className="ktab-share-btn__check" /> : <Share size={17} />}
    </button>
  );
}

export default ShareMenu;
