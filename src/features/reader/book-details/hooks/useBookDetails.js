import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useLibraryStore } from "@/core/store";

import {
  fetchBookDetailsById,
  checkBookReviewed,
  checkBookAssigned,
  fetchBookReviews,
  submitBookReview,
  updateBookReview,
  deleteBookReview,
  fetchSimilarBooks,
  assignBookToLibrary,
  removeBookFromLibrary,
} from "../services/bookDetailsService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Hook managing Book Details data, reviews state, similar books, and library assignment.
 */
export function useBookDetails(bookId) {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [bookData, setBookData] = useState(null);
  const [loadingBook, setLoadingBook] = useState(true);

  // Review State
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [isFullRatesOpen, setIsFullRatesOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [isReviewed, setIsReviewed] = useState(false);
  const [reviewId, setReviewId] = useState(null);
  const [isReviewLoading, setIsReviewLoading] = useState(false);

  // Reviews List & Similar Books State
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  // Library Assignment State
  const [isAssigned, setIsAssigned] = useState(false);
  const [isAssignLoading, setIsAssignLoading] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  // 1. Fetch Book Details
  const fetchBookDetails = useCallback(async () => {
    if (!bookId) return;

    setLoadingBook(true);
    try {
      const res = await fetchBookDetailsById(bookId);
      const b = res?.data ?? res;

      setBookData({
        id: b.id,
        title: b.title ?? "كتاب",
        description: b.description ?? "",
        genre: b.mainGenreName ?? b.genre ?? null,
        mainGenreName: b.mainGenreName ?? b.genre ?? null,
        subgenre: b.subGenreName ?? b.subgenre ?? null,
        subGenreName: b.subGenreName ?? b.subgenre ?? null,
        language: b.language ?? "ar",
        pageCount: b.pageCount ?? null,
        ageRangeMin: b.ageRangeMin ?? null,
        ageRangeMax: b.ageRangeMax ?? null,
        hasAudio: Boolean(b.hasAudio),
        averageRating: typeof b.averageRating === "number" ? b.averageRating : Number(b.averageRating || 0),
        totalReviews: typeof b.totalReviews === "number" ? b.totalReviews : Number(b.totalReviews || 0),
        coverImageUrl: b.coverImageUrl ?? "",
        pdfDownloadUrl: b.pdfDownloadUrl ?? null,
        authorName: b.customAuthorName || b.authorName || "مؤلف غير معروف",
        customAuthorName: b.customAuthorName || null,
        publishDate: b.publishDate ?? null,
        bookSource: b.bookSource ?? null,
        libraryOrganizationName: b.libraryOrganizationName ?? null,
      });

      if (res?.messageStatus && res.messageStatus !== "SUCCESS") {
        AlertToast(res?.message, res?.messageStatus);
      }
    } catch {
      AlertToast("تعذر تحميل بيانات الكتاب.", "ERROR");
    } finally {
      setLoadingBook(false);
    }
  }, [bookId]);

  // Share action: copies direct link to clipboard
  const handleShareBook = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(window.location.href);
        AlertToast("تم نسخ رابط الكتاب إلى الحافظة بنجاح.", "SUCCESS");
      } else {
        AlertToast("يرجى نسخ الرابط من شريط العنوان.", "INFO");
      }
    } catch {
      AlertToast("تعذر نسخ الرابط.", "ERROR");
    }
  }, []);

  // 2. Fetch Review State
  const fetchReviewState = useCallback(async () => {
    if (!user?.userId || !bookId) return;

    setIsReviewLoading(true);
    try {
      const res = await checkBookReviewed(bookId);
      const data = res?.data ?? res;

      if (res?.messageStatus && res.messageStatus !== "SUCCESS") {
        AlertToast(res?.message, res?.messageStatus);
        return;
      }

      if (data?.reviewed || data?.isReviewed) {
        setIsReviewed(true);
        setUserRating(Number(data.rating ?? data.rate ?? 0));
        setUserReview(data.comment ?? "");
        setReviewId(data.reviewId ?? data.id ?? null);
      } else {
        setIsReviewed(false);
        setUserRating(0);
        setUserReview("");
        setReviewId(null);
      }
    } catch {
      // Ignored non-blocking
    } finally {
      setIsReviewLoading(false);
    }
  }, [bookId, user?.userId]);

  // 3. Fetch Library Assignment State
  const fetchAssignmentState = useCallback(async () => {
    if (!user?.userId || !bookId) return;

    try {
      const res = await checkBookAssigned(bookId);
      const data = res?.data ?? res;

      if (res?.messageStatus && res.messageStatus !== "SUCCESS") {
        AlertToast(res?.message, res?.messageStatus);
        return;
      }

      setIsAssigned(Boolean(data === true || data?.assigned || data?.isAssigned));
    } catch {
      // Ignored non-blocking
    }
  }, [bookId, user?.userId]);

  // 4. Fetch Reviews List
  const loadReviews = useCallback(async () => {
    if (!bookId) return;
    setLoadingReviews(true);
    try {
      const res = await fetchBookReviews(bookId, { page: 0, size: 10 });
      const list = res?.content ?? (Array.isArray(res) ? res : []);
      setReviews(list);

      // Fallback: Check if current user has an entry in this book's reviews to resolve reviewId
      if (user?.userId) {
        const myReview = list.find((r) => String(r.userId) === String(user.userId));
        if (myReview && myReview.id) {
          setIsReviewed(true);
          setReviewId(myReview.id);
          if (myReview.rating) setUserRating(Number(myReview.rating));
          if (myReview.comment) setUserReview(myReview.comment);
        }
      }
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  }, [bookId, user?.userId]);

  // 5. Fetch Similar Books
  const loadSimilarBooks = useCallback(async () => {
    if (!bookId) return;
    setLoadingSimilar(true);
    try {
      const books = await fetchSimilarBooks(bookId);
      setSimilarBooks(books);
    } catch (err) {
      console.error("Failed to load similar books:", err);
      setSimilarBooks([]);
    } finally {
      setLoadingSimilar(false);
    }
  }, [bookId]);

  useEffect(() => {
    fetchBookDetails();
    fetchReviewState();
    fetchAssignmentState();
    loadReviews();
    loadSimilarBooks();
  }, [fetchBookDetails, fetchReviewState, fetchAssignmentState, loadReviews, loadSimilarBooks]);

  // Handle Review Submit / Edit
  const handleSubmitReview = async () => {
    if (!userRating) {
      AlertToast("يرجى اختيار تقييم بالنجوم أولاً.", "WARNING");
      return;
    }

    try {
      const payload = {
        rating: Math.max(1, Math.min(5, parseInt(userRating, 10) || 5)),
        comment: typeof userReview === "string" ? userReview.trim() : "",
      };

      if (isReviewed && reviewId) {
        const res = await updateBookReview(bookId, reviewId, payload);
        if (res?.messageStatus && res.messageStatus !== "SUCCESS") {
          AlertToast(res?.message, res?.messageStatus);
          return;
        }
        AlertToast("تم تحديث التقييم بنجاح.", "SUCCESS");
      } else {
        const res = await submitBookReview(bookId, payload);
        if (res?.messageStatus && res.messageStatus !== "SUCCESS") {
          AlertToast(res?.message, res?.messageStatus);
          return;
        }
        AlertToast("تمت إضافة تقييمك بنجاح.", "SUCCESS");
        setIsReviewed(true);
        if (res?.data?.reviewId || res?.data?.id) {
          setReviewId(res.data.reviewId || res.data.id);
        }
      }

      setIsRatingModalOpen(false);
      fetchBookDetails();
      loadReviews();
    } catch {
      AlertToast("حدث خطأ أثناء حفظ التقييم.", "ERROR");
    }
  };

  // Handle Review Deletion via DELETE /api/v1/reviews/books/{bookId}/reviews/{reviewId}
  const handleDeleteReview = async () => {
    if (!reviewId || !bookId) return;

    try {
      const res = await deleteBookReview(bookId, reviewId);
      if (res?.messageStatus && res.messageStatus !== "SUCCESS") {
        AlertToast(res?.message, res?.messageStatus);
        return;
      }

      AlertToast("تم حذف التقييم بنجاح.", "SUCCESS");
      setIsReviewed(false);
      setUserRating(0);
      setUserReview("");
      setReviewId(null);
      setIsRatingModalOpen(false);
      fetchBookDetails();
      loadReviews();
    } catch {
      AlertToast("حدث خطأ أثناء حذف التقييم.", "ERROR");
    }
  };

  // Toggle Library Assignment via POST /api/v1/library/assignBook
  const handleToggleAssign = async () => {
    if (isAssignLoading) return;
    setIsAssignLoading(true);

    try {
      if (isAssigned) {
        const res = await removeBookFromLibrary(bookId);
        if (res?.messageStatus && res.messageStatus !== "SUCCESS") {
          AlertToast(res?.message, res?.messageStatus);
          return;
        }
        setIsAssigned(false);
        useLibraryStore.getState().markBookUnassigned(bookId);
        AlertToast("تمت إزالة الكتاب من مكتبتك.", "SUCCESS");
      } else {
        const res = await assignBookToLibrary(bookId);
        if (res?.messageStatus && res.messageStatus !== "SUCCESS") {
          AlertToast(res?.message, res?.messageStatus);
          return;
        }
        setIsAssigned(true);
        useLibraryStore.getState().markBookAssigned(bookId);
        AlertToast("تمت إضافة الكتاب إلى مكتبتك بنجاح.", "SUCCESS");
      }
    } catch {
      AlertToast("تعذر تحديث حالة المكتبة.", "ERROR");
    } finally {
      setIsAssignLoading(false);
    }
  };

  // Declarative UI Event Handlers (Zero JS in JSX)
  const handleOpenReviewModal = useCallback(() => setIsRatingModalOpen(true), []);
  const handleCloseReviewModal = useCallback(() => setIsRatingModalOpen(false), []);
  const handleOpenFullRatesModal = useCallback(() => setIsFullRatesOpen(true), []);
  const handleCloseFullRatesModal = useCallback(() => setIsFullRatesOpen(false), []);
  const handleToggleDescription = useCallback(() => setIsDescriptionExpanded((p) => !p), []);
  const handleStartReading = useCallback(() => {
    if (bookId) navigate(`/reader/display/${bookId}`);
  }, [navigate, bookId]);
  const handleNavigateBack = useCallback(() => navigate(-1), [navigate]);
  const handleNavigateToReader = useCallback(() => navigate("/reader"), [navigate]);

  return {
    bookData,
    loadingBook,
    isRatingModalOpen,
    setIsRatingModalOpen,
    isFullRatesOpen,
    userRating,
    setUserRating,
    userReview,
    setUserReview,
    isReviewed,
    isReviewLoading,
    isAssigned,
    isAssignLoading,
    isDescriptionExpanded,
    reviews,
    loadingReviews,
    similarBooks,
    loadingSimilar,
    handleSubmitReview,
    handleDeleteReview,
    handleToggleAssign,
    handleShareBook,
    handleOpenReviewModal,
    handleCloseReviewModal,
    handleOpenFullRatesModal,
    handleCloseFullRatesModal,
    handleToggleDescription,
    handleStartReading,
    handleNavigateBack,
    handleNavigateToReader,
  };
}

export default useBookDetails;
