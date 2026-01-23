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
import AgeBarGraphContainer from "@/components/myui/Users/AuthorPages/ControlBoard/ageBarGraphComponent";
import MostReadPieChartContainer from "@/components/myui/Users/AuthorPages/ControlBoard/mostriddenpiechart";

export default function ControlBoard({ pageName = "لوحة التحكم" }) {
  const navigate = useNavigate();
  const userData = getUserData();

  const [collapsed, setCollapsed] = useState(false);

  /* =======================
      AUTHOR ANALYTICS (TOP)
  ======================== */
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  /* =======================
      BOOKS LIST
  ======================== */
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [booksLoading, setBooksLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  /* =======================
      FETCH AUTHOR STATS
  ======================== */
  useEffect(() => {
    
    if (!userData?.userId) return;

    const getStats = async () => {
      setStatsLoading(true);
      try {
        // Fixed double slash in URL
        const res = await getHelper({
          url: `${import.meta.env.VITE_API_URL}/authors/me/analytics`,
        });
        setStats(res?.data || null);
        if (res.messageStatus != "SUCCESS") {
          AlertToast(res?.message, res?.messageStatus);
          return;
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    getStats();
  }, [userData?.userId]);

  /* =======================
      FETCH BOOKS FUNCTION
  ======================== */
  const fetchBooksAPI = useCallback(async () => {
    try {
      const res = await getHelper({
        url: `${import.meta.env.VITE_API_URL}/authors/me/book-analytics`,
      });

      console.log("fetchBooksAPI raw response:", res);

      const payload = res?.data ?? res ?? {};
      const content = payload.content ?? payload?.content ?? payload;
      const totalPages = payload.totalPages ?? payload?.totalPages ?? 1;

      // Ensure content is an array
      const normalizedContent = Array.isArray(content) ? content : [];
      console.log(
        "fetchBooksAPI normalized content length:",
        normalizedContent.length
      );
       if (res.messageStatus != "SUCCESS") {
         AlertToast(res?.message, res?.messageStatus);
         return;
       }

      return {
        content: normalizedContent,
        totalPages,
      };
    } catch (error) {
      console.error("Error fetching books:", error);
      return { content: [], totalPages: 0 };
    }
  }, []);

  /* =======================
      TRIGGER BOOKS FETCH
  ======================== */
  useEffect(() => {
    const loadBooks = async () => {
      if (page === 0) {
        setBooksLoading(true);
      } else {
        setLoadingMore(true);
      }

      const { content, totalPages: total } = await fetchBooksAPI(page);

      console.log("loadBooks received content:", content);
      setTotalPages(total);
      setBooks((prev) => {
        const combined = page === 0 ? content : [...prev, ...content];
        const uniqueByKey = new Map();
        combined.forEach((b) => {
          const key = b.bookId ?? b.id ?? `${b.title}-${b.publishDate ?? ""}`;
          if (!uniqueByKey.has(key)) uniqueByKey.set(key, b);
        });
        return Array.from(uniqueByKey.values());
      });

      if (page === 0) {
        setBooksLoading(false);
      } else {
        setLoadingMore(false);
      }
    };

    loadBooks();
  }, [page, fetchBooksAPI]);

  /* =======================
      ACTIONS
  ======================== */
  const handleNewBook = () =>
    navigate("/Screens/dashboard/AuthorPages/newBookPublish");

  /* =======================
      RENDER
  ======================== */
  return (
    <div className="min-h-screen bg-[#fafffe] rtl">
      <Navbar
        pageName={pageName}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        className={`flex flex-col md:flex-row-reverse min-h-screen transition-all duration-300 ${
          collapsed ? "md:mr-20" : "md:mr-64"
        }`}
      >
        <main className="flex-1 w-full">
          <PageHeader
            mainTitle={pageName}
            buttonTitle="رفع كتاب جديد"
            onPress={handleNewBook}
          />

          <div className="px-4 md:px-10 py-10 max-w-6xl mx-auto space-y-14">
            {/* AUTHOR STATS */}
            {statsLoading ? <SkeletonLoader /> : <CardStates stats={stats} />}

            {/* BOOKS */}
            {booksLoading ? (
              <SkeletonLoader />
            ) : (
              <BooksList
                books={books}
                page={page}
                setPage={setPage}
                totalPages={totalPages}
                loadingMore={loadingMore}
              />
            )}
            <div
              className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6"
              dir="rtl"
            >
              <MostReadPieChartContainer bookId={123} />
              <AgeBarGraphContainer bookId={123} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
