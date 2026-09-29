import React from "react";
import { X, Copy, Check, Share2, Send, Mail } from "lucide-react";
import { useShareModal } from "./useShareModal";
import "./ShareModal.css";

/**
 * Editorial Apple-inspired Share Modal.
 * Opens native OS share sheet or displays a clean app selector
 * (WhatsApp, Telegram, X, Facebook, Mail) with short link generation.
 */
export function ShareModal({
  isOpen,
  onClose,
  modalTitle,
  url,
  bookId,
  bookTitle = "",
  authorName = "",
  page = null,
  customText = "",
}) {
  const {
    shortUrl,
    copied,
    canNativeShare,
    handleCopy,
    handleShareWhatsApp,
    handleShareTelegram,
    handleShareTwitter,
    handleShareFacebook,
    handleShareEmail,
    handleNativeShare,
  } = useShareModal({
    isOpen,
    onClose,
    url,
    bookId,
    bookTitle,
    authorName,
    page,
    customText,
  });

  if (!isOpen) return null;

  const displayTitle = modalTitle || (bookId ? "مشاركة الكتاب" : "مشاركة الصورة");

  return (
    <div className="ktab-share-modal-backdrop" onClick={onClose} dir="rtl">
      <div
        className="ktab-share-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="ktab-share-modal-title"
      >
        {/* Header */}
        <div className="ktab-share-modal-header">
          <div className="ktab-share-modal-header__info">
            <h3 id="ktab-share-modal-title" className="ktab-share-modal-title">
              {displayTitle}
            </h3>
            {bookTitle && (
              <span className="ktab-share-modal-subtitle" title={bookTitle}>
                {bookTitle} {authorName ? `• ${authorName}` : ""}
              </span>
            )}
          </div>
          <button
            type="button"
            className="ktab-share-modal-close-btn"
            onClick={onClose}
            aria-label="إغلاق"
            title="إغلاق"
          >
            <X size={18} strokeWidth={2.4} />
          </button>
        </div>

        {/* Short Link Box */}
        <div className="ktab-share-modal-link-section">
          <label className="ktab-share-modal-label">الرابط المختصر</label>
          <div className="ktab-share-modal-input-wrap">
            <input
              type="text"
              readOnly
              value={shortUrl}
              className="ktab-share-modal-input"
              dir="ltr"
              onClick={(e) => e.target.select()}
            />
            <button
              type="button"
              className={`ktab-share-modal-copy-btn ${copied ? "ktab-share-modal-copy-btn--copied" : ""}`}
              onClick={handleCopy}
              aria-label={copied ? "تم النسخ" : "نسخ الرابط"}
              title="نسخ الرابط المختصر"
            >
              {copied ? (
                <>
                  <Check size={15} strokeWidth={2.6} />
                  <span>تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy size={15} strokeWidth={2.2} />
                  <span>نسخ</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Apps Grid */}
        <div className="ktab-share-modal-apps-section">
          <label className="ktab-share-modal-label">المشاركة عبر التطبيقات</label>
          <div className="ktab-share-modal-apps-grid">
            {/* WhatsApp */}
            <button
              type="button"
              className="ktab-share-app-btn ktab-share-app-btn--whatsapp"
              onClick={handleShareWhatsApp}
              title="إرسال عبر واتساب"
            >
              <div className="ktab-share-app-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.634.088-1.925-.449-1.57-.655-2.578-2.257-2.657-2.362-.078-.106-.639-.851-.639-1.624 0-.773.406-1.155.55-1.311.144-.155.313-.194.418-.194.106 0 .211.002.302.006.1.004.234-.038.365.279.135.326.46 1.123.5 1.205.04.082.067.179.012.288-.054.108-.082.176-.162.272-.08.095-.168.212-.24.285-.08.08-.163.167-.07.327.094.159.418.69.897 1.117.617.551 1.137.722 1.297.802.16.08.254.07.348-.039.095-.108.406-.473.514-.635.109-.163.218-.136.368-.081.15.054.954.45 1.118.532.164.082.273.123.313.191.04.07.04.405-.104.81zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.66 1.436 5.176L2 22l4.981-1.306A9.957 9.957 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" />
                </svg>
              </div>
              <span className="ktab-share-app-label">واتساب</span>
            </button>

            {/* Telegram */}
            <button
              type="button"
              className="ktab-share-app-btn ktab-share-app-btn--telegram"
              onClick={handleShareTelegram}
              title="إرسال عبر تيليجرام"
            >
              <div className="ktab-share-app-icon-box">
                <Send size={20} strokeWidth={2.2} />
              </div>
              <span className="ktab-share-app-label">تيليجرام</span>
            </button>

            {/* X / Twitter */}
            <button
              type="button"
              className="ktab-share-app-btn ktab-share-app-btn--twitter"
              onClick={handleShareTwitter}
              title="نشر على X (تويتر)"
            >
              <div className="ktab-share-app-icon-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <span className="ktab-share-app-label">منصة X</span>
            </button>

            {/* Facebook */}
            <button
              type="button"
              className="ktab-share-app-btn ktab-share-app-btn--facebook"
              onClick={handleShareFacebook}
              title="مشاركة على فيسبوك"
            >
              <div className="ktab-share-app-icon-box">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <span className="ktab-share-app-label">فيسبوك</span>
            </button>

            {/* Email */}
            <button
              type="button"
              className="ktab-share-app-btn ktab-share-app-btn--email"
              onClick={handleShareEmail}
              title="إرسال عبر البريد الإلكتروني"
            >
              <div className="ktab-share-app-icon-box">
                <Mail size={20} strokeWidth={2.2} />
              </div>
              <span className="ktab-share-app-label">البريد</span>
            </button>

            {/* Native OS Share Sheet (Mobile & Supported Desktops) */}
            {canNativeShare && (
              <button
                type="button"
                className="ktab-share-app-btn ktab-share-app-btn--native"
                onClick={handleNativeShare}
                title="فتح قائمة تطبيقات الجهاز"
              >
                <div className="ktab-share-app-icon-box">
                  <Share2 size={20} strokeWidth={2.2} />
                </div>
                <span className="ktab-share-app-label">تطبيقات أخرى</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShareModal;
