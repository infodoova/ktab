import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, X } from "lucide-react";
import "./SideHeader.css";

/**
 * Global App Header Component (Fixed Top Header)
 * Features a seamless expandable animated glass search bar on the far left.
 */
export function SideHeader({
  mainTitle = "لوحة التحكم",
  onSearchClick,
  showSearch = true,
  searchPlaceholder = "ابحث عن كتاب، مؤلف، أو موضوع...",
  searchQuery,
  onSearchChange,
  children,
  isDark = true,
  collapsed = false,
}) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [internalQuery, setInternalQuery] = useState("");
  const inputRef = useRef(null);

  const query = searchQuery !== undefined ? searchQuery : internalQuery;
  const isExpanded = internalExpanded || Boolean(query);

  useEffect(() => {
    if (isExpanded) {
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isExpanded]);

  const handleOpenSearch = () => {
    if (onSearchClick) {
      onSearchClick();
    } else {
      setInternalExpanded(true);
    }
  };

  const handleCloseSearch = (e) => {
    e?.stopPropagation?.();
    setInternalExpanded(false);
    setInternalQuery("");
    onSearchChange?.("");
  };

  const handleQueryChange = (val) => {
    setInternalQuery(val);
    onSearchChange?.(val);
  };

  const collapseClass = collapsed ? "ktab-side-header--collapsed" : "ktab-side-header--expanded";
  const themeClass = isDark ? "ktab-side-header--dark" : "ktab-side-header--light";
  const searchStateClass = isExpanded
    ? "ktab-side-header__search-box--expanded"
    : "ktab-side-header__search-box--collapsed";

  return (
    <header
      dir="rtl"
      className={`ktab-side-header ${collapseClass} ${themeClass}`}
    >
      {/* Right Side: Main Page Title */}
      <div>
        <h1 className="ktab-side-header__title">
          {mainTitle}
        </h1>
      </div>

      {/* Left Side: Children Actions + Seamless Expandable Search */}
      <div className="ktab-side-header__actions">
        {children}

        {showSearch && (
          <motion.div
            initial={false}
            animate={{ width: isExpanded ? 320 : 44 }}
            transition={{ type: "spring", stiffness: 450, damping: 35 }}
            onClick={() => {
              if (!isExpanded) handleOpenSearch();
            }}
            className={`ktab-side-header__search-box ${searchStateClass}`}
          >
            <button
              type="button"
              onClick={() => {
                if (!isExpanded) handleOpenSearch();
              }}
              className="ktab-side-header__search-btn"
              aria-label="البحث"
            >
              <Search size={18} />
            </button>

            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.15 }}
                className="ktab-side-header__search-content"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="ktab-side-header__search-input"
                />
                <button
                  type="button"
                  onClick={handleCloseSearch}
                  className="ktab-side-header__close-btn"
                  aria-label="إغلاق البحث"
                >
                  <X size={16} />
                </button>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </header>
  );
}

export default SideHeader;
