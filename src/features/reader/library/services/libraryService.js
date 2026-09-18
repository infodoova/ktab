import { getHelper, postHelper } from "@/core/api/apiHelpers";

const API_BASE = import.meta.env.VITE_API_URL || "";

const PAGE_SIZE = 8;
const SAFE_EMPTY = { content: [], totalPages: 1 };

const formatSortParam = ({ field = "title", ascending = true } = {}) =>
  `${field},${ascending ? "asc" : "desc"}`;

/**
 * Fetches general reader catalog books without search filters.
 *
 * @param {{ page?: number, size?: number, sortOptions?: { field: string, ascending: boolean } }} params
 * @returns {Promise<{ content: any[], totalPages: number }>}
 */
export async function fetchReaderBooks({ page = 0, size = PAGE_SIZE, sortOptions } = {}) {
  const sort = formatSortParam(sortOptions);
  const res = await getHelper({
    url: `${API_BASE}/reader/viewBooks`,
    pagination: true,
    page,
    size,
    sort,
  });

  const data = res?.data;
  if (!data) return SAFE_EMPTY;

  return {
    content: data.content ?? [],
    totalPages: data.totalPages ?? 1,
  };
}

/**
 * Searches reader catalog books with advanced filters.
 *
 * @param {{ filters: Object, page?: number, size?: number, sortOptions?: { field: string, ascending: boolean } }} params
 * @returns {Promise<{ content: any[], totalPages: number }>}
 */
export async function searchReaderBooks({ filters = {}, page = 0, size = PAGE_SIZE, sortOptions } = {}) {
  const sort = formatSortParam(sortOptions);

  const res = await postHelper({
    url: `${API_BASE}/reader/search`,
    body: {
      title: filters.query || null,
      mainGenreIds: filters.mainGenreIds || [],
      subGenreIds: filters.subGenreIds || [],
      age: filters.age ? Number(filters.age) : null,
      minAge: filters.minAge != null ? Number(filters.minAge) : null,
      maxAge: filters.maxAge != null ? Number(filters.maxAge) : null,
      ageRange: filters.ageRange || null,
      minAverageRating: filters.rating || 0,
      page,
      size,
      sort,
    },
  });

  const data = res?.data;
  if (!data) return SAFE_EMPTY;

  return {
    content: data.content ?? [],
    totalPages: data.totalPages ?? 1,
  };
}

/**
 * Fetches genres list for book filtering.
 */
export async function fetchBookGenres() {
  const res = await getHelper({
    url: `${API_BASE}/genres/viewAll`,
  });

  return res?.data ?? [];
}
