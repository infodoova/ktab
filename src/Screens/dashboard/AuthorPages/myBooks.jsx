import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Loader2, 
  BookOpen, 
  Star, 
  Eye, 
  MoreVertical, 
  Edit3, 
  ExternalLink
} from "lucide-react";

// --- IMPORTS ---
import { AlertToast } from "../../../components/myui/AlertToast";
import Navbar from "../../../components/myui/Users/AuthorPages/navbar";
import PageHeader from "../../../components/myui/Users/AuthorPages/sideHeader";

// --- 1. FAKE LOCAL DATA ---
const ALL_FAKE_BOOKS = [
  { id: 1, title: "فن اللامبالاة", image: "https://via.placeholder.com/300x450", rating: 4.5, views: 1205 },
  { id: 2, title: "قواعد العشق الأربعون", image: "https://via.placeholder.com/300x450", rating: 4.8, views: 3400 },
  { id: 3, title: "أرض زيكولا", image: "", rating: 4.2, views: 890 }, // No image test
  { id: 4, title: "شيفرة دافنشي", image: "https://via.placeholder.com/300x450", rating: 4.0, views: 1500 },
  { id: 5, title: "الخيميائي", image: "https://via.placeholder.com/300x450", rating: 4.9, views: 5200 },
  { id: 6, title: "1984", image: "https://via.placeholder.com/300x450", rating: 4.7, views: 2100 },
  { id: 7, title: "الجريمة والعقاب", image: "https://via.placeholder.com/300x450", rating: 4.6, views: 1800 },
  { id: 8, title: "مائة عام من العزلة", image: "https://via.placeholder.com/300x450", rating: 4.3, views: 900 },
  { id: 9, title: "الأب الغني والأب الفقير", image: "https://via.placeholder.com/300x450", rating: 4.8, views: 4100 },
  { id: 10, title: "نظرية الفستق", image: "https://via.placeholder.com/300x450", rating: 4.4, views: 1350 },
  { id: 11, title: "كافكا على الشاطئ", image: "https://via.placeholder.com/300x450", rating: 4.1, views: 780 },
  { id: 12, title: "البؤساء", image: "https://via.placeholder.com/300x450", rating: 4.9, views: 6000 },
  { id: 13, title: "عالم صوفي", image: "", rating: 4.0, views: 500 },
  { id: 14, title: "أن تقتل طائراً بريئاً", image: "https://via.placeholder.com/300x450", rating: 4.7, views: 2200 },
  { id: 15, title: "أماريتا", image: "https://via.placeholder.com/300x450", rating: 4.2, views: 1100 },
  { id: 16, title: "شيفرة بلال", image: "https://via.placeholder.com/300x450", rating: 4.5, views: 1600 },
  { id: 17, title: "ليطمئن قلبي", image: "https://via.placeholder.com/300x450", rating: 4.6, views: 1950 },
];

const ITEMS_PER_PAGE = 8; // Adjust to test pagination

// --- SUB-COMPONENTS ---

// Modern Book Card with Earth Theme
const BookCard = ({ book, index }) => (
  <div 
    className="group relative flex flex-col fade-up"
    style={{ animationDelay: `${index * 50}ms` }} 
  >
    <div className="relative overflow-hidden rounded-xl border border-[var(--earth-sand)] bg-[var(--earth-paper)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[var(--earth-brown)]/30">
      
      {/* Image Container (2:3 Aspect Ratio) */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[var(--earth-sand)]/20">
        {book.image ? (
          <img
            src={book.image}
            alt={book.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center text-[var(--earth-sand)]">
            <BookOpen size={48} strokeWidth={1.5} />
            <span className="mt-2 text-xs font-bold text-[var(--earth-brown)]/60">لا توجد صورة</span>
          </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[var(--earth-brown-dark)]/80 opacity-0 backdrop-blur-[2px] transition-all duration-300 group-hover:opacity-100">
          <button className="flex h-9 w-32 items-center justify-center gap-2 rounded-full bg-[var(--earth-olive)] text-xs text-white transition-colors hover:bg-[var(--earth-olive-dark)]">
            <Edit3 size={14} />
            <span>تعديل الكتاب</span>
          </button>
          <button className="flex h-9 w-32 items-center justify-center gap-2 rounded-full border border-white text-xs text-white transition-colors hover:bg-white hover:text-[var(--earth-brown-dark)]">
            <ExternalLink size={14} />
            <span>عرض الصفحة</span>
          </button>
        </div>

        {/* Rating Badge */}
        <div className="glass absolute top-3 left-3 flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold text-[var(--earth-brown-dark)] shadow-sm opacity-0 transform -translate-x-2 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
          <span>{book.rating}</span>
          <Star size={10} className="fill-yellow-500 text-yellow-500" />
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 
          className="line-clamp-2 min-h-[2.5rem] font-bold text-[var(--earth-brown-dark)] transition-colors group-hover:text-[var(--earth-brown)] text-sm"
          title={book.title}
        >
          {book.title}
        </h3>
        
        <div className="mt-4 flex items-center justify-between border-t border-[var(--earth-sand)]/30 pt-3 text-[var(--earth-brown)]/80">
          <div className="flex items-center gap-1.5 text-xs font-medium bg-[var(--earth-cream)] px-2 py-1 rounded-md">
            <Eye size={14} className="text-[var(--earth-olive)]" />
            <span>{book.views ? book.views.toLocaleString() : 0}</span>
          </div>
          
          <button className="rounded-full p-1.5 hover:bg-[var(--earth-sand)]/30 text-[var(--earth-brown)] transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Custom Skeleton Loader
const BookSkeleton = () => (
  <div className="flex flex-col space-y-3 rounded-xl border border-[var(--earth-sand)]/40 bg-[var(--earth-paper)] p-3">
    <div className="aspect-[2/3] w-full animate-pulse rounded-lg bg-[var(--earth-sand)]/20" />
    <div className="h-4 w-3/4 animate-pulse rounded bg-[var(--earth-sand)]/20" />
    <div className="h-3 w-1/2 animate-pulse rounded bg-[var(--earth-sand)]/20" />
    <div className="mt-auto h-8 w-full animate-pulse rounded bg-[var(--earth-sand)]/10" />
  </div>
);

// --- MAIN COMPONENT ---
function MyBooks({ pageName = "كتبي" }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  
  // Data State
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotal] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadMore, setLoadMore] = useState(false);
  
  // Refs for Infinite Scroll
  const observerTarget = useRef(null);

  // Alert State
  const [alert, setAlert] = useState({
    open: false,
    variant: "info",
    title: "",
    description: "",
  });

  // --- SIMULATED FETCH FUNCTION ---
  useEffect(() => {
    let isMounted = true;

    const fetchFakeData = () => {
      // 1. Set Loading State
      if (page === 1) setLoading(true);
      else setLoadMore(true);

      // 2. Simulate Network Delay (1.2 seconds)
      setTimeout(() => {
        if (!isMounted) return;

        // 3. Logic to slice data based on page
        const startIndex = (page - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const newBatch = ALL_FAKE_BOOKS.slice(startIndex, endIndex);

        const calculatedTotalPages = Math.ceil(ALL_FAKE_BOOKS.length / ITEMS_PER_PAGE);

        // 4. Update State
        setTotal(calculatedTotalPages);
        
        setBooks((prev) => {
          if (page === 1) return newBatch;
          return [...prev, ...newBatch];
        });

        // 5. Turn off loaders
        if (page === 1) setLoading(false);
        else setLoadMore(false);

      }, 1200);
    };

    fetchFakeData();

    return () => {
      isMounted = false;
    };
  }, [page]);

  // Infinite Scroll Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages && !loading && !loadMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1, rootMargin: "100px" }
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, [totalPages, page, loading, loadMore]);

  // Actions
  const handleButtonPress = () => {
    navigate("/Screens/dashboard/AuthorPages/newBookPublish");
  };
  const buttonTitleText = "رفع كتاب جديد";

  return (
    <div className="min-h-screen bg-[var(--earth-cream)] text-[var(--earth-brown-dark)]" dir="rtl">
      {/* 1. Navbar */}
      <Navbar
        mobileButtonTitle={buttonTitleText}
        onMobileButtonPress={handleButtonPress}
        pageName={pageName}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* 2. Main Layout Structure */}
      <div 
        className={`flex min-h-screen flex-col transition-all duration-300 md:flex-row-reverse 
          ${collapsed ? "md:mr-20" : "md:mr-64"}
        `}
      >
        <main className="flex flex-1 flex-col">
          
          {/* 3. PageHeader */}
          <PageHeader
            mainTitle={pageName}
            buttonTitle={buttonTitleText}
            onPress={handleButtonPress}
          />

          {/* 4. Content Area */}
          <div className="p-6">
            {loading ? (
              // Loading State
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <BookSkeleton key={i} />
                ))}
              </div>
            ) : books.length > 0 ? (
              // Success State
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {books.map((book, index) => (
                  <BookCard key={book.id || index} book={book} index={index} />
                ))}
              </div>
            ) : (
              // Empty State (Styled)
              <div className="mt-20 flex flex-col items-center justify-center text-center fade-up">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--earth-paper)] shadow-inner border border-[var(--earth-sand)] mb-4">
                  <BookOpen size={40} className="text-[var(--earth-sand)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--earth-brown-dark)]">لا توجد كتب منشورة</h3>
                <p className="mt-2 max-w-xs text-[var(--earth-brown)]/60 text-sm">
                  لم تقم بنشر أي أعمال أدبية بعد.
                </p>
              </div>
            )}

            {/* Infinite Scroll Trigger/Loader */}
            <div ref={observerTarget} className="mt-8 flex h-20 w-full items-center justify-center">
              {loadMore && (
                <div className="flex items-center gap-2 text-[var(--earth-brown)]/60">
                  <Loader2 className="animate-spin" size={20} />
                  <span className="text-sm font-medium">جاري تحميل المزيد...</span>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* 5. Alert Toast */}
      <AlertToast
        open={alert.open}
        variant={alert.variant}
        title={alert.title}
        description={alert.description}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </div>
  );
}

export default MyBooks;