import React, { useState, useEffect, useMemo } from "react";
import { DetailsDrawer } from "@/components/common/DetailsDrawer";
import { fetchBookNavigator } from "../../services/bookReaderService";
import { PreservedGuillemets } from "../PreservedGuillemets";
import "./BookNavigator.css";

/**
 * Editorial Liquid Glass Book Navigator.
 * Uses the app's standard DetailsDrawer:
 * - Desktop: Opens as an authentic left-side drawer.
 * - Mobile: Translates into an elegant bottom sheet.
 * - Zero clutter, responsive floating trigger (small icon on mobile/iPads with no shadow).
 */
export function BookNavigator({
  bookId,
  bookTitle,
  currentPage = 1,
  totalPages = 1,
  wordsPerPage = 80,
  onGoToPage,
  onSelectSection,
  theme = "light",
  isOpen: controlledIsOpen,
  onOpenChange,
  isLocked = false,
  isControlsVisible = true,
}) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const handleToggle = () => {
    if (isLocked) return;
    const next = !isOpen;
    if (onOpenChange) onOpenChange(next);
    else setInternalIsOpen(next);
  };

  const handleClose = () => {
    if (onOpenChange) onOpenChange(false);
    else setInternalIsOpen(false);
  };

  useEffect(() => {
    if (isLocked && isOpen) {
      handleClose();
    }
  }, [isLocked]);
  const [navigatorData, setNavigatorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch navigator hierarchy (title + readerPage)
  useEffect(() => {
    if (!bookId) return;
    let cancelled = false;
    setLoading(true);

    fetchBookNavigator(bookId, wordsPerPage)
      .then((res) => {
        if (!cancelled) {
          const data = res?.data || res;
          setNavigatorData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to load book navigator:", err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [bookId, wordsPerPage]);

  const sections = navigatorData?.sections || [];

  // Filter sections by search query
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return sections;
    const query = searchQuery.trim().toLowerCase();

    function matchNode(node) {
      const titleMatch = node.title?.toLowerCase().includes(query);
      const matchedChildren = (node.children || []).map(matchNode).filter(Boolean);
      if (titleMatch || matchedChildren.length > 0) {
        return {
          ...node,
          children: matchedChildren,
        };
      }
      return null;
    }

    return sections.map(matchNode).filter(Boolean);
  }, [sections, searchQuery]);

  // Calculate single active section corresponding to the reader's current page
  const activeSectionId = useMemo(() => {
    if (!currentPage) return null;
    const flattened = [];
    const traverse = (list) => {
      for (const s of list) {
        if (!s.isAppendix && typeof s.readerPage === "number" && s.readerPage > 0) {
          flattened.push(s);
        }
        if (s.children && s.children.length > 0) {
          traverse(s.children);
        }
      }
    };
    traverse(sections);

    const eligible = flattened
      .filter((s) => s.readerPage <= currentPage)
      .sort((a, b) => b.readerPage - a.readerPage);

    return eligible[0]?.id ?? null;
  }, [sections, currentPage]);

  const handleSectionClick = (sec) => {
    // For appendixes or non-reader sections, do not rely on 80-word page numbers!
    if (sec.isAppendix || !sec.readerPage) {
      if (onSelectSection) {
        onSelectSection(sec);
      }
      setIsOpen(false);
      return;
    }

    if (sec.readerPage && onGoToPage) {
      onGoToPage(sec.readerPage);
      setIsOpen(false);
    }
  };

  const renderSectionItem = (sec, depth = 0) => {
    const isCurrent = sec.id === activeSectionId;

    return (
      <div key={sec.id} className="ktab-nav-item-wrap">
        <button
          type="button"
          onClick={() => handleSectionClick(sec)}
          className={`ktab-nav-item ktab-nav-item--depth-${depth} ${
            isCurrent ? "ktab-nav-item--active" : ""
          } ${sec.isAppendix ? "ktab-nav-item--appendix" : ""}`}
          title={sec.title}
        >
          <span className="ktab-nav-item__title"><PreservedGuillemets text={sec.title} /></span>

          {/* Do NOT show page number on appendixes! */}
          {!sec.isAppendix && sec.readerPage && (
            <span className="ktab-nav-item__page-number">
              ص {sec.readerPage}
            </span>
          )}
        </button>

        {sec.children && sec.children.length > 0 && (
          <div className="ktab-nav-item__children">
            {sec.children.map((child) => renderSectionItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Floating Trigger Button (Always solid black, no shadow, desktop only) */}
      {!isLocked && (
        <button
          type="button"
          className={`ktab-nav-trigger ${isOpen ? "ktab-nav-trigger--open" : ""} ktab-nav-trigger--${theme} ${
            !isControlsVisible ? "ktab-nav-trigger--hidden" : ""
          }`}
          onClick={handleToggle}
          aria-label={isOpen ? "إغلاق فهرس الكتاب" : "فتح فهرس الكتاب"}
          title="فهرس الكتاب"
        >
          <span className="ktab-nav-trigger__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
          </span>
          <span className="ktab-nav-trigger__text">فهرس الكتاب</span>
        </button>
      )}

      {/* DetailsDrawer (Standard left-side modal on PC, bottom sheet on mobile) */}
      <DetailsDrawer
        isOpen={isOpen && !isLocked}
        onClose={handleClose}
        title="دليل الكتاب"
        subtitle={bookTitle || "فصول ومحتويات الكتاب"}
        width="440px"
        className={`ktab-navigator-drawer ktab-navigator-drawer--${theme}`}
      >
        <div className="ktab-nav-drawer-body" dir="rtl">
          {/* Section title pill */}
          <div className="ktab-nav-section-bar">
            <span className="ktab-nav-section-bar__pill">فصول ومحتويات الكتاب</span>
          </div>

          {/* Search input */}
          <div className="ktab-nav-search-wrap">
            <svg className="ktab-nav-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              className="ktab-nav-search-input"
              placeholder="بحث في الفصول..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="ktab-nav-search-clear"
                onClick={() => setSearchQuery("")}
              >
                ×
              </button>
            )}
          </div>

          {/* Content List */}
          <div className="ktab-nav-content-scroll">
            {loading ? (
              <div className="ktab-nav-loading">
                <div className="ktab-nav-loading-bar" style={{ width: "65%" }} />
                <div className="ktab-nav-loading-bar" style={{ width: "85%" }} />
                <div className="ktab-nav-loading-bar" style={{ width: "75%" }} />
                <div className="ktab-nav-loading-bar" style={{ width: "90%" }} />
              </div>
            ) : (
              <div className="ktab-nav-sections-list">
                {filteredSections.length === 0 ? (
                  <div className="ktab-nav-empty">
                    <span>لا توجد فصول تطابق البحث</span>
                  </div>
                ) : (
                  filteredSections.map((sec) => renderSectionItem(sec, 0))
                )}
              </div>
            )}
          </div>
        </div>
      </DetailsDrawer>
    </>
  );
}

export default BookNavigator;
