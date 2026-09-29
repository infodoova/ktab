import {
  fetchAllReaderImages,
  fetchReaderImagesGrouped,
  fetchReaderImageBooks,
  fetchImageDetails,
  deleteBookGeneratedImage,
  fetchImageFilters,
} from "../../book-reader/services/bookImageGenService";

/**
 * Service orchestrating all Reader Image Library API calls.
 * Communicates with /api/v1/reader/images and /api/v1/books/{bookId}/images.
 */

export async function getReaderImages({ bookId, page = 0, size = 12, sort } = {}) {
  return fetchAllReaderImages({ bookId, page, size, sort });
}

export async function getReaderImagesGrouped() {
  return fetchReaderImagesGrouped();
}

export async function getReaderImageBooks() {
  return fetchReaderImageBooks();
}

export async function getImageDetails(bookId, imageId) {
  return fetchImageDetails(bookId, imageId);
}

export async function deleteReaderImage(bookId, imageId) {
  return deleteBookGeneratedImage(bookId, imageId);
}

export async function getImageFilters(bookId) {
  return fetchImageFilters(bookId);
}
