import { useState, useRef, useEffect } from "react";

/**
 * Encapsulates publisher card interactive states (options menu, clicks, outside dismissal).
 */
export function usePublisherCard({ publisher, onEdit, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onEdit?.(publisher);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    onDelete?.(publisher);
  };

  return {
    isMenuOpen,
    menuRef,
    toggleMenu,
    handleEditClick,
    handleDeleteClick,
  };
}

export default usePublisherCard;
