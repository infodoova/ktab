import { useState, useRef, useEffect, useCallback } from "react";

/**
 * Hook encapsulating click-outside dismiss logic and actions for a StaffCard.
 */
export function useStaffCard({ member, onDelete }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = useCallback((e) => {
    e.stopPropagation();
    setIsMenuOpen((prev) => !prev);
  }, []);

  const handleDeleteClick = useCallback(
    (e) => {
      e.stopPropagation();
      setIsMenuOpen(false);
      onDelete?.(member);
    },
    [member, onDelete]
  );

  useEffect(() => {
    if (!isMenuOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen]);

  return {
    isMenuOpen,
    menuRef,
    toggleMenu,
    handleDeleteClick,
  };
}

export default useStaffCard;
