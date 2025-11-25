import React, { useEffect, useState } from "react";
import Navbar from "../../AuthorPages/navbar";
import PageHeader from "../../AuthorPages/sideHeader";
import SkeletonLoader from "../../AuthorPages/ControlBoard/skeletonLoader";
import { AlertToast } from "../../../AlertToast";
import {
  getDashboardStats,
  getBooks,
} from "../../../../../../apis/pageHelpers/controlBoardHelper";

import CardStates from "../../AuthorPages/ControlBoard/CardStates";
import BooksList from "../../AuthorPages/ControlBoard/BooksList";
import {  useNavigate } from "react-router-dom";



function ControlBoard({ pageName = "لوحة التحكم" }) {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  
  // Data State
  const [stats, setStats] = useState(null);
  const [books, setBooks] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);

  // Loading & UI State
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [toast, setToast] = useState({
    open: false,
    variant: "info",
    title: "",
    description: "",
  });


  const handleCloseToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  // Fetch Data
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        if (page === 1) setLoading(true);
        else setLoadingMore(true);

        const [statsRes, booksRes] = await Promise.all([
          getDashboardStats(),
          getBooks(page, 10),
        ]);

        if (!isMounted) return;

        setStats(statsRes);

        const incomingBooks = booksRes.data || booksRes;
        setTotalPages(booksRes.totalPages || 3);

        setBooks((prevBooks) => {
          if (!prevBooks || page === 1) {
            return incomingBooks;
          }
          const existingIds = new Set(prevBooks.map((b) => b.id));
          const filtered = incomingBooks.filter((b) => !existingIds.has(b.id));
          return [...prevBooks, ...filtered];
        });
      } catch (err) {
        if (!isMounted) return;
        console.error(err);
        setToast({
          open: true,
          variant: "error",
          title: "خطأ في الاتصال",
          description: "فشل في تحميل البيانات من الخادم. يرجى المحاولة لاحقاً.",
        });
      } finally {
        if (isMounted) {
          if (page === 1) setLoading(false);
          else setLoadingMore(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [page]);

  const handleButtonPress = () => {
navigate('/Screens/dashboard/AuthorPages/newBookPublish');
  };

  return (
    <div className="min-h-screen bg-[var(--earth-cream)] rtl">
      {/* NAVBAR */}
      <Navbar
        mobileButtonTitle="رفع كتاب جديد"
        onMobileButtonPress={handleButtonPress}
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
          
          <PageHeader
            mainTitle={pageName}
            buttonTitle={"رفع كتاب جديد"}
            onPress={handleButtonPress}
          />

          <div className="px-4 md:px-10 py-10 max-w-7xl mx-auto w-full">
            {loading ? (
              <SkeletonLoader />
            ) : (
              <div className="space-y-14 fade-up">
                {/* Greeting */}
                <header className="space-y-3 text-right w-full">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--earth-brown-dark)]">
                    مرحباً، <span className="text-[var(--earth-olive)]">أحمد!</span>{" "}
                    👋
                  </h1>
                  <p className="text-[var(--earth-brown)]/70 text-lg font-medium">
                    إليك ملخص نشاطك وأداء كتبك لهذا الشهر.
                  </p>
                </header>

                {/* Stats Grid */}
                <CardStates stats={stats} />

                {/* Books Section */}
                <BooksList 
                  books={books} 
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

      {/* ALERT TOAST */}
      <AlertToast
        open={toast.open}
        variant={toast.variant}
        title={toast.title}
        description={toast.description}
        onClose={handleCloseToast}
        autoClose={true}
        autoCloseDelay={4000}
      />
    </div>
  );
}

export default ControlBoard;