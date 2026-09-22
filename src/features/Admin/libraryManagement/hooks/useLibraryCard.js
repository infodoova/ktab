import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Custom hook encapsulating state and click-outside handling for LibraryCard options dropdown.
 */
export function useLibraryCard({ library, onEdit, onDelete } = {}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Status mapping: '1' or 'ACTIVE' is active, '0' or 'INACTIVE' is inactive
  const statusStr = String(library?.status ?? "1").toUpperCase();
  const isActive = statusStr === "1" || statusStr === "ACTIVE";

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  const toggleMenu = useCallback((e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleEditClick = useCallback(
    (e) => {
      e.stopPropagation();
      setIsMenuOpen(false);
      onEdit?.(library);
    },
    [library, onEdit]
  );

  const handleDeleteClick = useCallback(
    (e) => {
      e.stopPropagation();
      setIsMenuOpen(false);
      onDelete?.(library);
    },
    [library, onDelete]
  );

  return {
    isMenuOpen,
    menuRef,
    isActive,
    toggleMenu,
    handleEditClick,
    handleDeleteClick,
  };
}

export default useLibraryCard;
