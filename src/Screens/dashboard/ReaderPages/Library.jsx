import React, { useState, useCallback } from "react";
import Navbar from "../../../components/myui/Users/ReaderPages/navbar";
import PageHeader from "../../../components/myui/Users/ReaderPages/sideHeader";
import { AlertToast } from "../../../components/myui/AlertToast";
import BooksGrid from "../../../components/myui/Users/ReaderPages/Library/BooksCardComponent";
import BookSearchModal from "../../../components/myui/Users/ReaderPages/Library/BookSearchComponent";
import SortBar from "../../../components/myui/Users/ReaderPages/Library/SortBarComponent";

import { getHelper, postHelper } from "../../../../apis/apiHelpers";
import { getUserData } from "../../../../store/authToken";

const PAGE_SIZE = 8;
const SAFE_EMPTY = { content: [], totalPages: 1 };

const buildSortParam = ({ field, ascending }) =>
  `${field},${ascending ? "asc" : "desc"}`;

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

  const handleSearchClick = () => setIsSearchOpen(true);

  const fetchBooks = useCallback(
    async (page = 0) => {
      try {
        const user = getUserData();
        if (!user?.userId) {
          AlertToast("يرجى تسجيل الدخول لرؤية مكتبتك.", "ERROR");
          return SAFE_EMPTY;
        }

        const hasActiveFilters =
          activeFilters.query ||
          activeFilters.mainGenreIds.length > 0 ||
          activeFilters.subGenreIds.length > 0 ||
          activeFilters.age ||
          activeFilters.rating >= 0;

        const sort = buildSortParam(sortOptions);

        /* ===========================
           VIEW (NO FILTERS)
        ============================ */
        if (!hasActiveFilters) {
          const res = await getHelper({
            url: `${import.meta.env.VITE_API_URL}/reader/viewBooks`,
            pagination: true,
            page,
            size: PAGE_SIZE,
            sort,
          });

          const data = res?.data;
          if (!data) return SAFE_EMPTY;
          if (data.messageStatus != "SUCCESS") {
            AlertToast(data?.message, data?.messageStatus);
          }
          return {
            content: data.content ?? [],
            totalPages: data.totalPages ?? 1,
          };
        }

        /* ===========================
           SEARCH
        ============================ */
        const res = await postHelper({
          url: `${import.meta.env.VITE_API_URL}/reader/search`,
          body: {
            title: activeFilters.query || null,
            mainGenreIds: activeFilters.mainGenreIds,
            subGenreIds: activeFilters.subGenreIds,
            age: activeFilters.age ? Number(activeFilters.age) : null,
            minAverageRating: activeFilters.rating || 0,
            page,
            size: PAGE_SIZE,
            sort,
          },
        });

        const data = res?.data;
        if (!data) return SAFE_EMPTY;

        return {
          content: data.content ?? [],
          totalPages: data.totalPages ?? 1,
        };
      } catch (error) {
        console.error("BOOKS API ERROR:", error);
        AlertToast("تعذر الاتصال بالخادم، حاول لاحقاً.", "ERROR");
        return SAFE_EMPTY;
      }
    },
    [activeFilters, sortOptions]
  );

  return (
    <div dir="rtl" className="bg-white min-h-screen">
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
          <PageHeader mainTitle={pageName} onSearchClick={handleSearchClick} />

          <SortBar
            sortField={sortOptions.field}
            ascending={sortOptions.ascending}
            onSortChange={({ field, ascending }) =>
              setSortOptions({ field, ascending })
            }
          />

          <BooksGrid
            fetchFunction={fetchBooks}
            activeFilters={activeFilters}
            sortOptions={sortOptions}
          />

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
    </div>
  );
}
