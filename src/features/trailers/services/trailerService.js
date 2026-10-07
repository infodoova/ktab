import { safeMediaUrl } from "../utils/trailerUtils";
import { getHelper, postHelper } from "@/core/api/apiHelpers";

const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
const pathId = (id) => {
  if (id == null || !String(id).trim()) throw new Error("معرف الكتاب أو الإعلان غير صالح.");
  return encodeURIComponent(String(id));
};

export function unwrapTrailerResponse(response) {
  if (!response || response.success === false || response.messageStatus === "ERROR" || Number(response.statusCode) >= 400) {
    const error = new Error((Number(response?.statusCode || response?.status) >= 500 ? "خدمة الإنتاج غير متاحة حالياً. يرجى المحاولة لاحقاً." : response?.message) || "تعذر الاتصال بخدمة إعلانات الكتب. يرجى المحاولة مجددًا.");
    error.status = Number(response?.statusCode || response?.httpStatus || response?.status) || null;
    throw error;
  }
  return response.data;
}

async function get(path) {
  try { return unwrapTrailerResponse(await getHelper({ url: `${API_BASE}${path}` })); }
  catch (error) {
    if (error instanceof TypeError) throw new Error("تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مجددًا.");
    throw error;
  }
}
async function post(path) {
  try { return unwrapTrailerResponse(await postHelper({ url: `${API_BASE}${path}` })); }
  catch (error) {
    if (error instanceof TypeError) throw new Error("تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مجددًا.");
    throw error;
  }
}

function trailerLinks(data) {
  const nested = data?.trailer ?? data?.links ?? data;
  const video = nested?.videoUrl ?? nested?.video ?? nested?.playbackUrl ?? nested?.downloadUrl ?? nested?.url;
  const videoClean = nested?.videoCleanUrl ?? nested?.videoClean ?? nested?.cleanVideoUrl ?? nested?.cleanVideo ?? nested?.videoWithoutSubtitlesUrl;
  return {
    video: safeMediaUrl(videoClean) || safeMediaUrl(video),
    videoClean: safeMediaUrl(videoClean),
    captions: safeMediaUrl(nested?.captionsUrl ?? nested?.captions),
  };
}

export const trailerService = {
  list: async (bookId) => {
    const data = await get(`/trailers/books/${pathId(bookId)}`);
    if (!Array.isArray(data)) throw new Error("تعذر تحميل قائمة إعلانات الكتاب.");
    return data;
  },
  get: (id) => get(`/trailers/${pathId(id)}`),
  create: (bookId) => post(`/trailers/books/${pathId(bookId)}`),
  readerTrailer: async (bookId) => {
    const data = await get(`/books/${pathId(bookId)}/trailer`);
    return {
      ...trailerLinks(data),
      id: data?.id ?? data?.trailerId ?? null,
    };
  },
  readerDownload: async (bookId) => trailerService.readerTrailer(bookId),
  download: async (id) => trailerLinks(await get(`/trailers/${pathId(id)}/download`)),
  cancel: (id) => post(`/trailers/${pathId(id)}/cancel`),
  review: (id, approve) => post(`/trailers/${pathId(id)}/review?approve=${Boolean(approve)}`),
  retry: (id) => post(`/trailers/${pathId(id)}/retry`),
  connect: () => post("/admin/trailer-agent/higgsfield/connect"),
};

export async function fetchTrailerBooks({ role, page = 0, status = "PUBLISHED" }) {
  const path = role === "AUTHOR" ? "/authors/me/books"
    : ["LIBRARIAN", "LIBRARY_ADMIN"].includes(role) ? "/librarians/me/books" : "/books";
  const params = new URLSearchParams({ page: String(page), size: "12" });
  if (role !== "ADMIN") params.set("status", status);
  const data = unwrapTrailerResponse(await getHelper({ url: `${API_BASE}${path}?${params}` }));
  const books = Array.isArray(data) ? data : data?.content;
  if (!Array.isArray(books)) throw new Error("تعذر تحميل الكتب المتاحة.");
  return {
    books: books.map((book) => ({
      ...book,
      id: book.id ?? book.bookId,
      title: book.title || book.titleAr || "كتاب بدون عنوان",
      coverImageUrl: book.coverImageUrl || book.coverUrl || book.cover || null,
    })).filter((book) => book.id != null),
    totalPages: data?.totalPages ?? 1,
  };
}
