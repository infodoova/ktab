import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { librarianService } from "../../services/librarianService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Custom hook orchestrating book listing, reactive search query filtering,
 * navigation to create/edit pages, delete modal, details drawer, and data refreshes.
 */
export function useLibrarianBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal / Drawer states
  const [selectedBook, setSelectedBook] = useState(null); // Details Drawer

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await librarianService.getBooks({ page: 0, size: 100 });
      if (res && (res.success || res.status === "OK" || res.data)) {
        const items = res.data?.content || (Array.isArray(res.data) ? res.data : []);
        setBooks(items);
      } else {
        setBooks([]);
      }
    } catch (err) {
      console.error("Failed to fetch librarian books:", err);
      AlertToast("تعذر جلب قائمة الكتب من الخادم", "error");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  // Reactive search filtering by title, author, genre, or description
  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    const query = searchQuery.trim().toLowerCase();

    return books.filter((book) => {
      const title = String(book.title || "").toLowerCase();
      const author = String(book.customAuthorName || book.authorName || "").toLowerCase();

      const genre = String(book.mainGenreName || book.subGenreName || "").toLowerCase();
      const desc = String(book.description || "").toLowerCase();

      return (
        title.includes(query) ||
        author.includes(query) ||
        genre.includes(query) ||
        desc.includes(query)
      );
    });
  }, [books, searchQuery]);

  // Handlers for UI actions
  const handleOpenCreate = useCallback(() => {
    navigate("/librarian/books/create");
  }, [navigate]);

  const handleOpenEdit = useCallback(
    (book) => {
      setSelectedBook(null);
      navigate(`/librarian/books/${book.id}/edit`, { state: { book } });
    },
    [navigate]
  );

  return {
    books: filteredBooks,
    allBooksCount: books.length,
    loading,
    searchQuery,
    setSearchQuery,
    selectedBook,
    setSelectedBook,
    handleOpenCreate,
    handleOpenEdit,
    refreshBooks: fetchBooks,
  };
}


export default useLibrarianBooks;
