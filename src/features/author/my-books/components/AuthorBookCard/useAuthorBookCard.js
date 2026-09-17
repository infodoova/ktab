import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook encapsulating AuthorBookCard state, menu management, and image loading lifecycle.
 */
export function useAuthorBookCard({
  book,
  openMenuId,
  setOpenMenuId,
  onClick,
  onDelete,
}) {
  const navigate = useNavigate();
  const coverUrl = book?.coverImageUrl || book?.cover;
  const isDraft = book?.status === "DRAFT" || book?.isDraft;
  const isOpen = openMenuId === book?.id;

  const [coverLoaded, setCoverLoaded] = useState(false);
  const [hasCoverError, setHasCoverError] = useState(false);

  useEffect(() => {
    setCoverLoaded(false);
    setHasCoverError(false);
  }, [coverUrl]);

  const handleCoverLoad = useCallback(() => {
    setCoverLoaded(true);
  }, []);

  const handleCoverError = useCallback(() => {
    setHasCoverError(true);
    setCoverLoaded(false);
  }, []);

  const toggleMenu = useCallback(
    (e) => {
      e.stopPropagation();
      setOpenMenuId(isOpen ? null : book.id);
    },
    [isOpen, book?.id, setOpenMenuId]
  );

  const handleDetailsClick = useCallback(() => {
    setOpenMenuId(null);
    onClick?.(book);
  }, [book, onClick, setOpenMenuId]);

  const handleEditClick = useCallback(() => {
    setOpenMenuId(null);
    navigate(`/author/new-book/${book.id}`);
  }, [book?.id, navigate, setOpenMenuId]);

  const handleDeleteClick = useCallback(() => {
    setOpenMenuId(null);
    onDelete?.(book);
  }, [book, onDelete, setOpenMenuId]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.(book);
      }
    },
    [book, onClick]
  );

  const ratingText = Number(book?.averageRating ?? 0).toFixed(1);
  const hasAudio = Boolean(book?.hasAudio);
  const langCode = (book?.language || "ar").toLowerCase();
  const languageLabel = langCode === "ar" ? "عربي" : langCode === "en" ? "EN" : langCode.toUpperCase();
  const genreLabel = book?.genreName || book?.mainGenreName || book?.mainGenre?.name || "عام";
  const authorDisplayName = book?.authorName || book?.customAuthorName || "أنت";

  return {
    coverUrl,
    isDraft,
    isOpen,
    coverLoaded,
    hasCoverError,
    ratingText,
    hasAudio,
    languageLabel,
    genreLabel,
    authorDisplayName,
    handleCoverLoad,
    handleCoverError,
    toggleMenu,
    handleDetailsClick,
    handleEditClick,
    handleDeleteClick,
    handleKeyDown,
  };
}

export default useAuthorBookCard;
