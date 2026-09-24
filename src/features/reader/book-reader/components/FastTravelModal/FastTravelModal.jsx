import React from "react";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { useFastTravelModal } from "../../hooks/useFastTravelModal";
import "./FastTravelModal.css";

/**
 * 50-Page Chunked Pagination Nodes Modal / Bottom Sheet.
 * Allows instant direct navigation by pressing page nodes grouped in 50-page ranges.
 * Zero percentage calculations - pure tactile page node selection.
 */
export function FastTravelModal(props) {
  const { isOpen, onClose } = props;

  const {
    chunks,
    activePages,
    selectedChunk,
    currentPage,
    handleSelectChunk,
    handleNodeClick,
  } = useFastTravelModal(props);

  if (!isOpen) return null;

  return (
    <div
      className="ktab-reader-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="الانتقال المباشر بين الصفحات"
    >
      <div
        className="ktab-reader-modal-card ktab-fast-travel-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Drag Indicator Handle */}
        <div className="ktab-reader-modal__handle-bar" aria-hidden="true" />

        {/* Modal Header */}
        <div className="ktab-reader-modal__header">
          <div className="ktab-reader-modal__title-wrap">
            <h3 className="ktab-reader-modal__title">فهرس الصفحات</h3>
            <p className="ktab-reader-modal__subtitle">
              اختر نطاق الـ 50 صفحة ثم اضغط على رقم الصفحة للانتقال الفوري
            </p>
          </div>
          <button
            type="button"
            className="ktab-reader-modal__close-btn"
            onClick={onClose}
            aria-label="إغلاق النافذة"
          >
            <X size={16} />
          </button>
        </div>

        {/* 50-Page Range Chunks Tabs */}
        {chunks.length > 1 && (
          <div className="ktab-chunks-tabs-container">
            <button
              type="button"
              className="ktab-chunks-nav-arrow"
              onClick={() => handleSelectChunk(Math.max(0, selectedChunk - 1))}
              disabled={selectedChunk === 0}
              aria-label="المجموعة السابقة"
            >
              <ChevronRight size={16} />
            </button>

            <div className="ktab-chunks-tabs-scroll">
              {chunks.map((chunk) => (
                <button
                  key={chunk.index}
                  type="button"
                  className={`ktab-chunk-tab-btn ${
                    selectedChunk === chunk.index ? "ktab-chunk-tab-btn--active" : ""
                  }`}
                  onClick={() => handleSelectChunk(chunk.index)}
                >
                  {chunk.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="ktab-chunks-nav-arrow"
              onClick={() =>
                handleSelectChunk(Math.min(chunks.length - 1, selectedChunk + 1))
              }
              disabled={selectedChunk === chunks.length - 1}
              aria-label="المجموعة التالية"
            >
              <ChevronLeft size={16} />
            </button>
          </div>
        )}

        {/* Direct Page Nodes Grid */}
        <div className="ktab-reader-modal__body ktab-page-nodes-body">
          <div className="ktab-page-nodes-grid">
            {activePages.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                className={`ktab-page-node ${
                  pageNumber === currentPage ? "ktab-page-node--active" : ""
                }`}
                onClick={() => handleNodeClick(pageNumber)}
                aria-label={`الصفحة ${pageNumber}`}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FastTravelModal;
