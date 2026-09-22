import {
  getHelper,
  postFormDataHelper,
  patchHelper,
  deleteHelper,
} from "@/core/api/apiHelpers";
import { sanitizeId } from "@/lib/sanitize";

const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Service handling all Librarian Book Management operations:
 * - Listing librarian books (scoped to uploaded books for regular librarian)
 * - Fetching single book details
 * - Ephemeral source file secure download URL
 * - Uploading (creating) new book (multipart/form-data)
 * - Updating an existing book (multipart/form-data)
 * - Deleting a book
 */
export const librarianService = {
  /**
   * List books scoped to uploaded books for regular librarian.
   * @param {Object} params - { page = 0, size = 50, status }
   */
  getBooks: async (params = {}) => {
    const { page = 0, size = 50, status } = params;
    const queryParams = new URLSearchParams();
    queryParams.append("page", page);
    queryParams.append("size", size);
    if (status) queryParams.append("status", status);

    return getHelper({
      url: `${API_BASE}/librarians/me/books?${queryParams.toString()}`,
    });
  },

  /**
   * Get a single library book by ID.
   * @param {string|number} id
   */
  getBookById: async (id) => {
    const safeId = encodeURIComponent(sanitizeId(id));
    return getHelper({
      url: `${API_BASE}/librarians/me/books/${safeId}`,
    });
  },

  /**
   * Get secure ephemeral download URL for library book source file.
   * @param {string|number} id
   */
  getSourceFile: async (id) => {
    const safeId = encodeURIComponent(sanitizeId(id));
    return getHelper({
      url: `${API_BASE}/librarians/me/books/${safeId}/source-file`,
    });
  },

  /**
   * Upload a book for the librarian's library organization.
   * Request body: multipart/form-data
   * - bookDto (JSON Blob)
   * - coverImage (File)
   * - pdfFile (File)
   * @param {FormData} formData
   * @param {Function} [onProgress]
   */
  createBook: async (formData, onProgress) => {
    return postFormDataHelper({
      url: `${API_BASE}/librarians/me/books`,
      formData,
      onUploadProgress: onProgress,
    });
  },

  /**
   * Update a library book.
   * Request body: multipart/form-data
   * - bookDto (JSON Blob)
   * - coverImage (optional File)
   * - pdfFile (optional File)
   * @param {string|number} id
   * @param {FormData} formData
   */
  updateBook: async (id, formData) => {
    const safeId = encodeURIComponent(sanitizeId(id));
    return patchHelper({
      url: `${API_BASE}/librarians/me/books/${safeId}`,
      body: formData,
    });
  },

  /**
   * Delete a book from the library organization.
   * @param {string|number} id
   */
  deleteBook: async (id) => {
    const safeId = encodeURIComponent(sanitizeId(id));
    return deleteHelper({
      url: `${API_BASE}/librarians/me/books/${safeId}`,
    });
  },
};

export default librarianService;
