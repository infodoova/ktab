import React, { useEffect, useState } from "react";
import Navbar from "../../../components/myui/Users/AuthorPages/navbar";
import PageHeader from "../../../components/myui/Users/AuthorPages/sideHeader";
import SkeletonLoader from "../../../components/myui/Users/AuthorPages/ControlBoard/skeletonLoader";
import { AlertToast } from "../../../components/myui/AlertToast";
import CardStates from "../../../components/myui/Users/AuthorPages/ControlBoard/CardStates";
import BooksList from "../../../components/myui/Users/AuthorPages/ControlBoard/BooksList";
import { useNavigate } from "react-router-dom";

// --- 1. FAKE DATA DEFINITIONS ---
const FAKE_STATS = {
  totalBooks: 24,
  totalViews: 15420,
  monthlySales: 340,
  earnings: "4,250",
  currency: "د.إ"
};

const FAKE_BOOKS_DATA = [
  {
    id: 1,
    title: "فن اللامبالاة",
    cover: "https://via.placeholder.com/150",
    status: "published", 
    price: 15.00,
    views: 1205,
    date: "2023-10-01"
  },
  {
    id: 2,
    title: "قواعد العشق الأربعون",
    cover: "https://via.placeholder.com/150",
    status: "pending",
    price: 20.00,
    views: 0,
    date: "2023-11-15"
  },
  {
    id: 3,
    title: "رحلتي من الشك إلى الإيمان",
    cover: "https://via.placeholder.com/150",
    status: "draft",
    price: 0,
    views: 50,
    date: "2023-09-20"
  },
  {
    id: 4,
    title: "أرض زيكولا",
    cover: "https://via.placeholder.com/150",
    status: "published",
    price: 12.50,
    views: 3400,
    date: "2023-08-10"
  },
  {
    id: 5,
    title: "شيفرة دافنشي",
    cover: "https://via.placeholder.com/150",
    status: "rejected",
    price: 18.00,
    views: 10,
    date: "2023-01-05"
  }
];

function ControlBoard({ pageName = "لوحة التحكم" }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // Data State
  const [stats, setStats] = useState(null);
  const [books, setBooks] = useState([]); // Initialize as empty array
  const [page, setPage] = useState(1);
  const [totalPages] = useState(3); // Hardcoded total pages

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

  // --- 2. UPDATED EFFECT TO LOAD FAKE DATA ---
  useEffect(() => {
    let isMounted = true;

    const loadFakeData = () => {
      // Simulate network delay (1.5 seconds)
      const delay = 1500;

      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      setTimeout(() => {
        if (!isMounted) return;

        // 1. Set Stats (only needs to happen once really, but kept here for simplicity)
        setStats(FAKE_STATS);

        // 2. Set Books (Simulating pagination)
        // We generate new IDs for pages > 1 so React keys don't conflict
        const newBatchOfBooks = FAKE_BOOKS_DATA.map(book => ({
            ...book,
            id: book.id + ((page - 1) * 100) // fake unique ID generation
        }));

        setBooks((prevBooks) => {
          if (page === 1) return newBatchOfBooks;
          return [...prevBooks, ...newBatchOfBooks];
        });

        // 3. Turn off loading
        if (page === 1) setLoading(false);
        else setLoadingMore(false);

      }, delay);
    };

    loadFakeData();

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