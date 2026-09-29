import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  getReaderImages,
  getReaderImagesGrouped,
  deleteReaderImage,
  getImageDetails,
} from "../services/imageLibraryService";
import {
  downloadImageToDevice,
  shareImage,
} from "../utils/imageLibraryUtils";
import { AlertToast } from "@/components/myui/AlertToast";
import logger from "@/lib/logger";

const PAGE_SIZE = 24;

/**
 * Custom hook managing authentic server data for the Reader Book Image Library.
 * Computes accurate valid image counts on the frontend, omitting books with 0 valid
 * illustrations to prevent empty states and inaccurate DB row numbers without extra roundtrips.
 */
export function useBookImageLibrary() {
  const [booksList, setBooksList] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [imageToDelete, setImageToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isMountedRef = useRef(true);

  /**
   * Helper that extracts valid renderable images (excluding failed or missing URLs).
   */
  const filterValidImages = useCallback((rawList = []) => {
    if (!Array.isArray(rawList)) return [];
    return rawList.filter(
      (img) =>
        img &&
        typeof img.imageUrl === "string" &&
        img.imageUrl.trim().length > 0 &&
        img.status !== "FAILED"
    );
  }, []);

  /**
   * Loads all grouped reader images in a single call to avoid N+1 queries.
   * Derives actual valid image counts on frontend and excludes books with 0 valid images.
   */
  const loadLibraryData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getReaderImagesGrouped();

      if (res && (res.success || res.status === 200) && Array.isArray(res.data)) {
        const groups = res.data;
        const validBooks = [];
        const combinedImages = [];

        groups.forEach((group) => {
          const groupValidImages = filterValidImages(group.images);

          // Strictly discard books with 0 valid illustrations
          if (groupValidImages.length > 0) {
            validBooks.push({
              bookId: group.bookId,
              bookTitle: group.bookTitle,
              validCount: groupValidImages.length,
              imageCount: groupValidImages.length,
            });
            combinedImages.push(...groupValidImages);
          }
        });

        // Sort descending by completion/creation timestamp
        combinedImages.sort((a, b) => {
          const tA = new Date(a.completedAt || a.createdAt || 0).getTime();
          const tB = new Date(b.completedAt || b.createdAt || 0).getTime();
          return tB - tA;
        });

        if (isMountedRef.current) {
          setBooksList(validBooks);
          setAllImages(combinedImages);
        }
        return;
      }

      // Resilient fallback if grouped endpoint returns alternative envelope
      await loadFallbackData();
    } catch (err) {
      logger.warn("Grouped reader images retrieval failed, falling back to flat list:", err);
      await loadFallbackData();
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [filterValidImages]);

  /**
   * Resilient fallback fetching reader images via flat query.
   */
  const loadFallbackData = async () => {
    try {
      const res = await getReaderImages({ size: 100 });
      if (res && (res.success || res.status === 200)) {
        const rawContent = Array.isArray(res.data?.content)
          ? res.data.content
          : Array.isArray(res.data)
          ? res.data
          : [];

        const valid = filterValidImages(rawContent);
        const bookMap = new Map();

        valid.forEach((img) => {
          if (!bookMap.has(img.bookId)) {
            bookMap.set(img.bookId, {
              bookId: img.bookId,
              bookTitle: img.bookTitle || "كتاب",
              validCount: 0,
              imageCount: 0,
            });
          }
          const item = bookMap.get(img.bookId);
          item.validCount += 1;
          item.imageCount += 1;
        });

        const validBooks = Array.from(bookMap.values()).filter((b) => b.validCount > 0);

        if (isMountedRef.current) {
          setBooksList(validBooks);
          setAllImages(valid);
        }
      }
    } catch (fallbackErr) {
      logger.error("Failed to load reader images fallback:", fallbackErr);
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    loadLibraryData();
    return () => {
      isMountedRef.current = false;
    };
  }, [loadLibraryData]);

  // If active filter no longer exists in valid books (e.g. 0 count), reset to all books
  useEffect(() => {
    if (selectedBookId !== null && booksList.length > 0) {
      const exists = booksList.some((b) => b.bookId === selectedBookId);
      if (!exists) {
        setSelectedBookId(null);
      }
    }
  }, [booksList, selectedBookId]);

  /**
   * Selects book filter or resets to all books.
   */
  const handleSelectBook = useCallback((bookId) => {
    setSelectedBookId((prev) => (prev === bookId ? null : bookId));
    setVisibleCount(PAGE_SIZE);
  }, []);

  /**
   * Search input handler.
   */
  const handleSearchChange = useCallback((query) => {
    setSearchQuery(query);
    setVisibleCount(PAGE_SIZE);
  }, []);

  /**
   * Opens the left details drawer and loads complete metadata.
   */
  const handleOpenDetails = useCallback(async (image) => {
    setActiveImage(image);

    if (image?.bookId && image?.imageId) {
      try {
        const detailsRes = await getImageDetails(image.bookId, image.imageId);
        if (detailsRes && (detailsRes.success || detailsRes.status === 200) && detailsRes.data) {
          setActiveImage((prev) => ({
            ...prev,
            ...detailsRes.data,
          }));
        }
      } catch (err) {
        logger.warn("Could not fetch detailed image metadata:", err);
      }
    }
  }, []);

  /**
   * Closes the details drawer.
   */
  const handleCloseDetails = useCallback(() => {
    setActiveImage(null);
  }, []);

  /**
   * Direct download helper.
   */
  const handleDownloadImage = useCallback(async (image) => {
    if (!image?.imageUrl) {
      AlertToast("رابط الصورة غير متاح للتنزيل", "ERROR");
      return;
    }

    const filename = `${image.bookTitle ? image.bookTitle.replace(/\s+/g, "_") : "ktab"}_${image.imageId?.slice?.(0, 8) || "img"}.webp`;
    AlertToast("جاري تنزيل الصورة...", "INFO");

    const success = await downloadImageToDevice(image.imageUrl, filename);
    if (success) {
      AlertToast("تم تنزيل الصورة بنجاح على جهازك", "SUCCESS");
    } else {
      AlertToast("تعذر التنزيل المباشر، تم فتح الصورة في نافذة جديدة", "WARNING");
    }
  }, []);

  /**
   * Direct programmatic share helper.
   */
  const handleShareImage = useCallback(async (image) => {
    if (!image?.imageUrl) {
      AlertToast("رابط الصورة غير متاح للمشاركة", "ERROR");
      return;
    }

    const shareTitle = image.bookTitle ? `صورة من: ${image.bookTitle}` : "صورة من تطبيق كِتَاب";
    const shareText = image.context || "مشهد مصور من تطبيق كِتَاب";

    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: image.imageUrl,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          navigator.clipboard?.writeText(image.imageUrl);
        }
      }
    } else {
      navigator.clipboard?.writeText(image.imageUrl);
    }
  }, []);

  /**
   * Deletion modal controls.
   */
  const handleRequestDelete = useCallback((image) => {
    setImageToDelete(image);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setImageToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!imageToDelete) return;
    setIsDeleting(true);

    try {
      const res = await deleteReaderImage(imageToDelete.bookId, imageToDelete.imageId);

      const isSuccess =
        res?.success === true ||
        res?.status === 204 ||
        res?.status === 200 ||
        res?.statusCode === 204;

      if (isSuccess) {
        AlertToast("تم حذف الصورة بنجاح", "SUCCESS");

        setAllImages((prev) =>
          prev.filter((item) => item.imageId !== imageToDelete.imageId)
        );

        setBooksList((prevList) => {
          return prevList
            .map((b) =>
              b.bookId === imageToDelete.bookId
                ? {
                    ...b,
                    validCount: Math.max(0, (b.validCount || 1) - 1),
                    imageCount: Math.max(0, (b.imageCount || 1) - 1),
                  }
                : b
            )
            .filter((b) => (b.validCount ?? b.imageCount ?? 0) > 0);
        });

        if (activeImage?.imageId === imageToDelete.imageId) {
          setActiveImage(null);
        }
        setImageToDelete(null);
      } else {
        AlertToast(res?.message || "تعذر حذف الصورة، يرجى المحاولة لاحقاً", "ERROR");
      }
    } catch (err) {
      logger.error("Error deleting image:", err);
      AlertToast("حدث خطأ أثناء الاتصال بالخادم لحذف الصورة", "ERROR");
    } finally {
      setIsDeleting(false);
    }
  }, [imageToDelete, activeImage]);

  /**
   * Book-filtered images.
   */
  const bookFilteredImages = useMemo(() => {
    if (selectedBookId === null) return allImages;
    return allImages.filter((img) => img.bookId === selectedBookId);
  }, [allImages, selectedBookId]);

  /**
   * Search filtering across book title and context.
   */
  const filteredImages = useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return bookFilteredImages;
    const q = searchQuery.trim().toLowerCase();

    return bookFilteredImages.filter((item) => {
      const titleMatch = item.bookTitle?.toLowerCase?.()?.includes(q);
      const contextMatch = item.context?.toLowerCase?.()?.includes(q);
      return titleMatch || contextMatch;
    });
  }, [bookFilteredImages, searchQuery]);

  /**
   * Fluid client-side pagination slicing to avoid unnecessary network roundtrips.
   */
  const paginatedImages = useMemo(() => {
    return filteredImages.slice(0, visibleCount);
  }, [filteredImages, visibleCount]);

  const totalPages = Math.ceil(filteredImages.length / PAGE_SIZE) || 1;
  const page = Math.max(0, Math.floor((Math.min(visibleCount, filteredImages.length) - 1) / PAGE_SIZE));
  const totalElements = filteredImages.length;
  const totalValidCount = useMemo(() => {
    return booksList.reduce((sum, b) => sum + (b.validCount || 0), 0);
  }, [booksList]);

  /**
   * Increment visible items smoothly.
   */
  const handleLoadMore = useCallback(() => {
    if (visibleCount >= filteredImages.length || loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + PAGE_SIZE);
      setLoadingMore(false);
    }, 120);
  }, [visibleCount, filteredImages.length, loadingMore]);

  return {
    booksList,
    selectedBookId,
    images: paginatedImages,
    searchQuery,
    page,
    totalPages,
    totalElements,
    totalValidCount,
    loading,
    loadingMore,
    activeImage,
    imageToDelete,
    isDeleting,
    handleSelectBook,
    handleSearchChange,
    handleLoadMore,
    handleOpenDetails,
    handleCloseDetails,
    handleDownloadImage,
    handleShareImage,
    handleRequestDelete,
    handleCancelDelete,
    handleConfirmDelete,
  };
}
