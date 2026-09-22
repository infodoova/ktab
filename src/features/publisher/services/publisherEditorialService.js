import { getHelper, postHelper } from "@/core/api/apiHelpers";
import { sanitizeId } from "@/lib/sanitize";

const API_BASE =
  import.meta.env.VITE_API_URL ||
  "https://sanded-scrutiny-wool.ngrok-free.dev/api/v1";

/**
 * Service encapsulating Publisher Editorial Review operations:
 * - Review Queue retrieval and multi-facet filtering
 * - Full book detail inspection
 * - Ephemeral secure source PDF download
 * - Book approval for public release
 * - Book rejection with editorial note
 */
export const publisherEditorialService = {
  /**
   * Get books currently in the editorial review queue ordered by submission time.
   * @param {Object} params - { page = 0, size = 10 }
   * @returns {Promise<Object>}
   */
  getReviewQueue: async ({ page = 0, size = 10 } = {}) => {
    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
    });

    return getHelper({
      url: `${API_BASE}/publishers/review-queue?${query.toString()}`,
    });
  },

  /**
   * Multi-facet search across the publisher review queue.
   * @param {Object} filters - { q, status, authorId, mainGenreId, subGenreId, language, submittedAfter, submittedBefore, page, size, sortBy, sortDirection }
   * @returns {Promise<Object>}
   */
  searchReviewQueue: async (filters = {}) => {
    return postHelper({
      url: `${API_BASE}/publishers/review-queue/search`,
      body: {
        page: 0,
        size: 20,
        ...filters,
      },
    });
  },

  /**
   * Retrieve full book details for editorial review.
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  getBookById: async (id) => {
    const safeId = encodeURIComponent(sanitizeId(id));
    return getHelper({
      url: `${API_BASE}/publishers/books/${safeId}`,
    });
  },

  /**
   * Request secure ephemeral download URL for the book source PDF.
   * @param {string|number} id
   * @returns {Promise<Object>}
   */
  getSourceFile: async (id) => {
    const safeId = encodeURIComponent(sanitizeId(id));
    const res = await getHelper({
      url: `${API_BASE}/publishers/books/${safeId}/source-file`,
    });

    if (
      res?.success === false ||
      res?.messageStatus === "ERROR" ||
      (res?.statusCode && res.statusCode >= 400)
    ) {
      const err = new Error(
        res?.message ||
          (res?.errors && Object.values(res.errors)[0]) ||
          "تعذر الحصول على رابط تنزيل الملف المصدري"
      );
      err.response = res;
      throw err;
    }

    return res;
  },

  /**
   * Approve a submitted book for public release.
   * @param {string|number} id
   * @param {string} [note=""]
   * @returns {Promise<Object>}
   */
  approveBook: async (id, note = "") => {
    const safeId = encodeURIComponent(sanitizeId(id));
    const res = await postHelper({
      url: `${API_BASE}/publishers/books/${safeId}/approve`,
      body: { note: note?.trim() || "" },
    });

    if (
      res?.success === false ||
      res?.messageStatus === "ERROR" ||
      (res?.statusCode && res.statusCode >= 400)
    ) {
      const err = new Error(
        res?.message ||
          (res?.errors && Object.values(res.errors)[0]) ||
          "فشل اعتماد وقبول الكتاب"
      );
      err.response = res;
      throw err;
    }

    return res;
  },

  /**
   * Reject a submitted book with an editorial note and return it to draft.
   * @param {string|number} id
   * @param {string} note
   * @returns {Promise<Object>}
   */
  rejectBook: async (id, note = "") => {
    const safeId = encodeURIComponent(sanitizeId(id));
    const res = await postHelper({
      url: `${API_BASE}/publishers/books/${safeId}/reject`,
      body: { note: note?.trim() || "" },
    });

    if (
      res?.success === false ||
      res?.messageStatus === "ERROR" ||
      (res?.statusCode && res.statusCode >= 400)
    ) {
      const err = new Error(
        res?.message ||
          (res?.errors && Object.values(res.errors)[0]) ||
          "فشل إعادة الكتاب كمسودة"
      );
      err.response = res;
      throw err;
    }

    return res;
  },
};

export default publisherEditorialService;
