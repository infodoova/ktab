import { useState, useEffect, useCallback, useMemo } from "react";
import { libraryAdminService } from "../../services/libraryAdminService";
import { AlertToast } from "@/components/myui/AlertToast";

/**
 * Custom hook orchestrating book listing, search query filtering,
 * and deletion lifecycle for the Library Admin Book Management.
 */
export function useLibraryAdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [bookToDelete, setBookToDelete] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await libraryAdminService.getBooks({ page: 0, size: 100 });
      if (res && (res.success || res.status === "OK" || res.data)) {
        const items = res.data?.content || (Array.isArray(res.data) ? res.data : []);
        setBooks(items);
      } else {
        setBooks([]);
      }
    } catch (err) {
      console.error("Failed to load library organization books:", err);
      AlertToast("تعذر جلب قائمة كتب المكتبة من الخادم", "error");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const filteredBooks = useMemo(() => {
    if (!searchQuery.trim()) return books;
    const query = searchQuery.trim().toLowerCase();
    return books.filter((book) => {
      const title = String(book.title || "").toLowerCase();
      const author = String(book.authorName || book.customAuthorName || "").toLowerCase();
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

  return {
    books: filteredBooks,
    allBooksCount: books.length,
    loading,
    searchQuery,
    setSearchQuery,
    bookToDelete,
    setBookToDelete,
    selectedBook,
    setSelectedBook,
    refreshBooks: fetchBooks,
  };
}

export default useLibraryAdminBooks;
