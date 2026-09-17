import React from "react";
import { motion } from "framer-motion";
import { Search, X, PanelLeft } from "lucide-react";
import { useSideHeader } from "./useSideHeader";
import "./SideHeader.css";

/**
 * Editorial Apple-inspired Fixed Top Header Bar.
 * Pure declarative presentational layer backed by useSideHeader hook.
 */
export function SideHeader({
  mainTitle = "لوحة التحكم",
  onSearchClick,
  showSearch = true,
  searchPlaceholder = "ابحث عن كتاب، مؤلف، أو موضوع...",
  searchQuery,
  onSearchChange,
  children,
  isDark = false,
  collapsed = false,
  onToggleCollapse,
}) {
  const {
    query,
    isExpanded,
    inputRef,
    handleOpenSearch,
    handleCloseSearch,
    handleQueryChange,
  } = useSideHeader({
    onSearchClick,
    searchQuery,
    onSearchChange,
  });

  const collapseClass = collapsed ? "ktab-topbar--collapsed" : "ktab-topbar--expanded";
  const themeClass = isDark ? "ktab-topbar--dark" : "ktab-topbar--light";
  const searchStateClass = isExpanded
    ? "ktab-topbar__search--expanded"
    : "ktab-topbar__search--collapsed";

  return (
    <header className={`ktab-topbar ${collapseClass} ${themeClass}`} dir="rtl">
      {/* Right Side: Sidebar Toggle + Page Title */}
      <div className="ktab-topbar__title-area">
        {onToggleCollapse && (
          <button
            type="button"
            onClick={onToggleCollapse}
            className="ktab-topbar__toggle-btn"
            aria-label={collapsed ? "توسيع القائمة الجانبية" : "طي القائمة الجانبية"}
            title={collapsed ? "توسيع" : "طي"}
          >
            <PanelLeft size={19} strokeWidth={1.8} />
          </button>
        )}
        <h1 className="ktab-topbar__title">{mainTitle}</h1>
      </div>

      {/* Left Side: Actions + Minimalist Expandable Search */}
      <div className="ktab-topbar__actions" dir="ltr">
        {showSearch && (
          <motion.div
            initial={false}
            animate={{ width: isExpanded ? 300 : 38 }}
            transition={{ type: "spring", stiffness: 450, damping: 35 }}
            onClick={() => {
              if (!isExpanded) handleOpenSearch();
            }}
            className={`ktab-topbar__search ${searchStateClass}`}
          >
            <button
              type="button"
              onClick={() => {
                if (!isExpanded) handleOpenSearch();
              }}
              className="ktab-topbar__search-btn"
              aria-label="البحث"
            >
              <Search size={18} strokeWidth={2} />
            </button>

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="ktab-topbar__search-inner"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="ktab-topbar__search-input"
                  dir="rtl"
                />
                <button
                  type="button"
                  onClick={handleCloseSearch}
                  className="ktab-topbar__search-close"
                  aria-label="إغلاق البحث"
                >
                  <X size={15} strokeWidth={2.2} />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Custom Actions (filters, buttons, etc.) */}
        {children && <div className="ktab-topbar__custom-actions">{children}</div>}
      </div>
    </header>
  );
}

export default SideHeader;
