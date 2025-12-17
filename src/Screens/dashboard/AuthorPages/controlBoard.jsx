import React, { useEffect, useState, useCallback } from "react";
import Navbar from "../../../components/myui/Users/AuthorPages/navbar";
import PageHeader from "../../../components/myui/Users/AuthorPages/sideHeader";
import SkeletonLoader from "../../../components/myui/Users/AuthorPages/ControlBoard/skeletonLoader";
import { AlertToast } from "../../../components/myui/AlertToast";
import CardStates from "../../../components/myui/Users/AuthorPages/ControlBoard/CardStates";
import BooksList from "../../../components/myui/Users/AuthorPages/ControlBoard/BooksList";
import { useNavigate } from "react-router-dom";
import { getHelper } from "../../../../apis/apiHelpers";
import { getUserData } from "../../../../store/authToken";

export default function ControlBoard({ pageName = "لوحة التحكم" }) {
  const navigate = useNavigate();
  const userData = getUserData();
  const [collapsed, setCollapsed] = useState(false);

  // DATA
  const [stats, setStats] = useState(null);
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // UI STATE
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    variant: "info",
    title: "",
    description: "",
  });

  const closeToast = () => setToast((prev) => ({ ...prev, open: false }));

  /* -----------------------------------------
       FETCH BOOKS
  -------------------------------------------- */
  const fetchBooks = useCallback(
    async (pageNum = 0) => {
      if (!userData?.userId) return { content: [], totalPages: 1 };

      const res = await getHelper({
        url: `${import.meta.env.VITE_API_URL}/books/author`,
        pagination: true,
        page: pageNum,
        size: 5,
      });

      const data = res?.data || {};
      return {
        content: data.content || [],
        totalPages: data.totalPages || 1,
      };
    },
    [userData?.userId]
  );

  /* -----------------------------------------
       CALCULATE STATS
  -------------------------------------------- */
  const calculateStats = useCallback((list) => {
    const totalBooks = list.length;
    const totalReviews = list.reduce(
      (sum, b) => sum + (b.totalReviews || 0),
      0
    );
    const avgRating =
      list.length > 0
        ? (
            list.reduce((sum, b) => sum + (b.averageRating || 0), 0) /
            list.length
          ).toFixed(1)
        : 0;

    return {
      totalBooks,
      totalViews: totalReviews,
      averageRating: avgRating,
    };
  }, []);

  /* -----------------------------------------
       LOAD BOOKS
  -------------------------------------------- */
  useEffect(() => {
    const load = async () => {
      page === 0 ? setLoading(true) : setLoadingMore(true);
      const res = await fetchBooks(page);

      setTotalPages(res.totalPages);
      setBooks((prev) =>
        page === 0 ? res.content : [...prev, ...res.content]
      );

      if (page === 0) setStats(calculateStats(res.content));
      page === 0 ? setLoading(false) : setLoadingMore(false);
    };

    load();
  }, [page, fetchBooks, calculateStats]);

  /* -----------------------------------------
      NEW BOOK BTN
  -------------------------------------------- */
  const handleNewBook = () =>
    navigate("/Screens/dashboard/AuthorPages/newBookPublish");

  /* -----------------------------------------
      KEEP ALL BOOK FIELDS
  -------------------------------------------- */
  const formattedBooks = books.map((book) => ({
    ...book,
    views: book.totalReviews || 0,
    rating: book.averageRating || 0,
  }));

  /* -----------------------------------------
      UI RENDER
  -------------------------------------------- */
  return (
    <div className="min-h-screen bg-[var(--earth-cream)] rtl">
      <Navbar
        mobileButtonTitle="رفع كتاب جديد"
        onMobileButtonPress={handleNewBook}
        pageName={pageName}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* MAIN LAYOUT */}
      <div
        className={`flex flex-col md:flex-row-reverse min-h-screen transition-all duration-300 ${
          collapsed ? "md:mr-20" : "md:mr-64"
        }`}
      >
        <main className="flex-1 flex flex-col w-full">
          {/* HEADER */}
          <PageHeader
            mainTitle={pageName}
            buttonTitle={"رفع كتاب جديد"}
            onPress={handleNewBook}
          />

          <div className="px-4 md:px-10 py-10 max-w-6xl mx-auto w-full space-y-14">
            {/* LOADING */}
            {loading ? (
              <SkeletonLoader />
            ) : (
              <div className="space-y-14 fade-up">
                {/* GREETING */}
                <section className="text-right space-y-2">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--earth-brown-dark)]">
                    <span className="text-[var(--earth-brown-dark)]">
                      !أهلاً{" "}
                    </span>
                    <span className="text-[var(--earth-olive)]"> بعودتك</span>{" "}
                  </h1>
                  <p className="text-[var(--earth-brown)]/70 text-lg">
                    إليك لمحة سريعة عن أداء كتبك.
                  </p>
                </section>

                {/* STATS */}
                <CardStates stats={stats} />

                {/* BOOKS */}
                <BooksList
                  books={formattedBooks}
                  page={page}
                  setPage={setPage}
                  totalPages={totalPages}
                  loadingMore={loadingMore}
                />
              </div>
            )}
          </div>
        </main>
      </div>

      {/* TOAST */}
      <AlertToast
        open={toast.open}
        variant={toast.variant}
        title={toast.title}
        description={toast.description}
        onClose={closeToast}
        autoClose={true}
        autoCloseDelay={4000}
      />
    </div>
  );
}
