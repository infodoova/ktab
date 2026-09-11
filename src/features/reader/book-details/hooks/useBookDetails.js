import { useState, useEffect, useCallback } from "react";
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
  const user = useAuthStore((state) => state.user);
  const [bookData, setBookData] = useState(null);
  const [loadingBook, setLoadingBook] = useState(true);

  // Review State
  const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState("");
  const [isReviewed, setIsReviewed] = useState(false);
  const [reviewId, setReviewId] = useState(null);

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
        genre: b.mainGenreName ?? null,
        subgenre: b.subGenreName ?? null,
        language: b.language ?? null,
        pageCount: b.pageCount ?? null,
        ageRangeMin: b.ageRangeMin ?? null,
        ageRangeMax: b.ageRangeMax ?? null,
        hasAudio: b.hasAudio ?? false,
        averageRating: b.averageRating ?? 0,
        totalReviews: b.totalReviews ?? 0,
        coverImageUrl: b.coverImageUrl ?? "",
        pdfDownloadUrl: b.pdfDownloadUrl ?? null,
        authorName: b.authorName ?? null,
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

  // 2. Fetch Review State
  const fetchReviewState = useCallback(async () => {
    if (!user?.userId || !bookId) return;

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
      const revs = await fetchBookReviews(bookId);
      setReviews(revs);
    } catch (err) {
      console.error("Failed to load reviews:", err);
      setReviews([]);
    } finally {
      setLoadingReviews(false);
    }
  }, [bookId]);

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
      AlertToast("يرجى تحديد التقييم بالنجوم.", "ERROR");
      return;
    }

    try {
      if (isReviewed && reviewId) {
        const res = await updateBookReview(reviewId, { rate: userRating, comment: userReview });
        if (res?.messageStatus && res.messageStatus !== "SUCCESS") {
          AlertToast(res?.message, res?.messageStatus);
          return;
        }
        AlertToast("تم تحديث التقييم بنجاح.", "SUCCESS");
      } else {
        const res = await submitBookReview(bookId, { rate: userRating, comment: userReview });
        if (res?.messageStatus && res.messageStatus !== "SUCCESS") {
          AlertToast(res?.message, res?.messageStatus);
          return;
        }
        AlertToast("تمت إضافة تقييمك بنجاح.", "SUCCESS");
        setIsReviewed(true);
        if (res?.data?.reviewId) setReviewId(res.data.reviewId);
      }

      setIsRatingModalOpen(false);
      fetchBookDetails();
      loadReviews();
    } catch {
      AlertToast("حدث خطأ أثناء حفظ التقييم.", "ERROR");
    }
  };

  // Handle Review Deletion
  const handleDeleteReview = async () => {
    if (!reviewId) return;

    try {
      const res = await deleteBookReview(reviewId);
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

  // Toggle Library Assignment
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


  return {
    bookData,
    loadingBook,
    isRatingModalOpen,
    setIsRatingModalOpen,
    userRating,
    setUserRating,
    userReview,
    setUserReview,
    isReviewed,
    isAssigned,
    isAssignLoading,
    isDescriptionExpanded,
    setIsDescriptionExpanded,
    reviews,
    loadingReviews,
    similarBooks,
    loadingSimilar,
    handleSubmitReview,
    handleDeleteReview,
    handleToggleAssign,
  };
}

export default useBookDetails;
