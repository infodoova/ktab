import React, { useState, useCallback } from "react";
import Navbar from "../../../components/myui/Users/ReaderPages/navbar";
import PageHeader from "../../../components/myui/Users/ReaderPages/sideHeader";
import { AlertToast } from "../../../components/myui/AlertToast";
import BooksGrid from "../../../components/myui/Users/ReaderPages/Library/BooksCardComponent";
import BookSearchModal from "../../../components/myui/Users/ReaderPages/Library/BookSearchComponent"; 
import SortBar from "../../../components/myui/Users/ReaderPages/Library/SortBarComponent";

import { getHelper,postHelper } from "../../../../apis/apiHelpers";
import { getUserData } from "../../../../store/authToken";

export default function MyBooks({ pageName = "المكتبة" }) {
  const [collapsed, setCollapsed] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
const [activeFilters, setActiveFilters] = useState({
  query: "",
  mainGenreIds: [],
  subGenreIds: [],
  rating: 0,
  age: null,
});

  const [sortOptions, setSortOptions] = useState({
    field: "title",
    ascending: true,
  });

  const [alert, setAlert] = useState({
    open: false,
    variant: "info",
    title: "",
    description: "",
  });

  const handleSearchClick = () => setIsSearchOpen(true);
  const showAlert = (variant, title, description) => {
  setAlert({
    open: true,
    variant,
    title,
    description,
  });
};

const fetchBooks = useCallback(
  async (page = 0) => {
    try {
      const user = getUserData();
      if (!user?.userId) {
        showAlert("error", "غير مسجل", "يرجى تسجيل الدخول لرؤية مكتبتك.");
        return { content: [], totalPages: 1 };
      }

      const hasActiveFilters =
        activeFilters.query ||
        activeFilters.mainGenreIds?.length > 0 ||
        activeFilters.subGenreIds?.length > 0 ||
        activeFilters.age ||
        activeFilters.rating >= 0;

      /* ===========================
       NO FILTERS
    ============================ */
      if (!hasActiveFilters) {
        const res = await getHelper({
          url: `${import.meta.env.VITE_API_URL}/reader/viewBooks`,
          pagination: true,
          page,
          size: 8,
        });

        const data = res?.data;

        if (!data?.content) {
          showAlert("error", "خطأ في الاستجابة", "فشل تحميل بيانات الكتب.");
          return { content: [], totalPages: 1 };
        }

        return {
          content: data.content,
          totalPages: data.totalPages || 1,
        };
      }

      /* ===========================
       SEARCH
    ============================ */
      const requestBody = {
        title: activeFilters.query || null,
        mainGenreIds: activeFilters.mainGenreIds || [],
        subGenreIds: activeFilters.subGenreIds || [],
        age: activeFilters.age ? Number(activeFilters.age) : null,
        minAverageRating: activeFilters.rating || 0,
        page,
        size: 8,
      };

      const res = await postHelper({
        url: `${import.meta.env.VITE_API_URL}/reader/search`,
        method: "POST",
        body: requestBody,
      });

      const data = res?.data;

      if (!data?.content) {
        showAlert("error", "خطأ في الاستجابة", "تعذر تحميل نتائج البحث.");
        return { content: [], totalPages: 1 };
      }

      return {
        content: data.content,
        totalPages: data.totalPages || 1,
      };
    } catch (error) {
      console.error("BOOKS API ERROR:", error);

      showAlert("error", "خطأ في الشبكة", "تعذر الاتصال بالخادم، حاول لاحقاً.");

      return { content: [], totalPages: 1 };
    }
  },
  [activeFilters]
);






  return (
    <div dir="rtl" className="bg-[var(--earth-cream)] min-h-screen">
      <div dir="ltr">
        <Navbar
          pageName={pageName}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          onSearchClick={handleSearchClick}
        />
      </div>

      <div
        className={`flex min-h-screen transition-all duration-300 md:flex-row-reverse ${
          collapsed ? "md:mr-20" : "md:mr-64"
        }`}
      >
        <main className="flex-1">
          {/* DESKTOP HEADER with Search Trigger */}
          <PageHeader mainTitle={pageName} onSearchClick={handleSearchClick} />
          <SortBar
            sortField={sortOptions.field}
            ascending={sortOptions.ascending}
            onSortChange={({ field, ascending }) => {
              setSortOptions({ field, ascending });
            }}
          />

          {/* GRID - receives filters */}
          <BooksGrid
            fetchFunction={fetchBooks}
            activeFilters={activeFilters}
            sortOptions={sortOptions}
          />

          {/* SEARCH MODAL */}
          <BookSearchModal
            isOpen={isSearchOpen}
            onClose={() => setIsSearchOpen(false)}
            onApply={(newFilters) => {
              setActiveFilters({
                query: newFilters.title || "",
                mainGenreIds: newFilters.mainGenreIds || [],
                subGenreIds: newFilters.subGenreIds || [],
                age: newFilters.age,
                rating: newFilters.minAverageRating || 0,
              });

              setIsSearchOpen(false);
            }}
          />
        </main>
      </div>

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