import { useState, useRef, useEffect } from "react";

/**
 * Custom hook encapsulating search expansion, input management, and query state for SideHeader.
 */
export function useSideHeader({
  onSearchClick,
  searchQuery,
  onSearchChange,
}) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const [internalQuery, setInternalQuery] = useState("");
  const inputRef = useRef(null);

  const query = searchQuery !== undefined ? searchQuery : internalQuery;
  const isExpanded = internalExpanded || Boolean(query);

  useEffect(() => {
    if (isExpanded) {
      const timer = setTimeout(() => inputRef.current?.focus(), 120);
      return () => clearTimeout(timer);
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

  return {
    query,
    isExpanded,
    inputRef,
    handleOpenSearch,
    handleCloseSearch,
    handleQueryChange,
  };
}

export default useSideHeader;
