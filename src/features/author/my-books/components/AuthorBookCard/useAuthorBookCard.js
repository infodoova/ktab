import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Custom hook encapsulating AuthorBookCard state, menu management, and image loading lifecycle.
 */
export function useAuthorBookCard({
  book,
  openMenuId,
  setOpenMenuId,
  isMenuOpen,
  onClick,
  onDelete,
  onSubmit,
}) {
  const navigate = useNavigate();
  const coverUrl = book?.coverImageUrl || book?.cover;
  const statusStr = String(book?.status || "").toUpperCase();
  const isDraft = statusStr === "DRAFT" || Boolean(book?.isDraft);
  const isPendingApproval =
    statusStr === "PENDING_APPROVAL" ||
    statusStr === "UNDER_REVIEW" ||
    statusStr === "PENDING" ||
    statusStr === "SUBMITTED" ||
    statusStr === "IN_REVIEW";
  const isOpen = isMenuOpen !== undefined ? isMenuOpen : openMenuId === book?.id;

  const [prevCover, setPrevCover] = useState(coverUrl);
  const [coverLoaded, setCoverLoaded] = useState(false);
  const [hasCoverError, setHasCoverError] = useState(false);

  if (prevCover !== coverUrl) {
    setPrevCover(coverUrl);
    setCoverLoaded(false);
    setHasCoverError(false);
  }

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
      if (typeof setOpenMenuId === "function") {
        setOpenMenuId(isOpen ? null : book?.id);
      }
    },
    [isOpen, book, setOpenMenuId]
  );

  const handleDetailsClick = useCallback(() => {
    if (typeof setOpenMenuId === "function") {
      setOpenMenuId(null);
    }
    onClick?.(book);
  }, [book, onClick, setOpenMenuId]);

  const handleEditClick = useCallback(() => {
    if (isPendingApproval) return;
    setOpenMenuId(null);
    navigate(`/author/new-book/${book?.id}`, {
      state: {
        from: {
          parentLabel: "المكتبة",
          parentPath: "/author/my-books",
        },
      },
    });
  }, [book, isPendingApproval, navigate, setOpenMenuId]);

  const handleSubmitClick = useCallback(() => {
    if (isPendingApproval) return;
    setOpenMenuId(null);
    onSubmit?.(book);
  }, [book, isPendingApproval, onSubmit, setOpenMenuId]);

  const handleDeleteClick = useCallback(() => {
    if (isPendingApproval) return;
    setOpenMenuId(null);
    onDelete?.(book);
  }, [book, isPendingApproval, onDelete, setOpenMenuId]);

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
  const pageCount = book?.pageCount || null;
  const langCode = (book?.language || "ar").toLowerCase();
  const languageLabel = langCode === "ar" ? "عربي" : langCode === "en" ? "EN" : langCode.toUpperCase();
  const genreLabel =
    book?.mainGenreName && book?.subGenreName && book.mainGenreName.trim() !== book.subGenreName.trim()
      ? `${book.mainGenreName.trim()} / ${book.subGenreName.trim()}`
      : (book?.mainGenreName && book.mainGenreName.trim()) ||
        (book?.genreName && book.genreName.trim()) ||
        (book?.mainGenre?.name && book.mainGenre.name.trim()) ||
        "عام";
  const authorDisplayName =
    (book?.customAuthorName && book.customAuthorName.trim()) ||
    (book?.authorName && book.authorName.trim()) ||
    "مؤلف غير محدد";

  return {
    coverUrl,
    isDraft,
    isPendingApproval,
    isOpen,
    coverLoaded,
    hasCoverError,
    ratingText,
    hasAudio,
    pageCount,
    languageLabel,
    genreLabel,
    authorDisplayName,
    handleCoverLoad,
    handleCoverError,
    toggleMenu,
    handleDetailsClick,
    handleEditClick,
    handleSubmitClick,
    handleDeleteClick,
    handleKeyDown,
  };
}

export default useAuthorBookCard;
