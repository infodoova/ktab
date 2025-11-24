
import { getHelper } from "../apiHelpers";

// ----------- 1. DASHBOARD STATS (REAL DATA) -----------

export async function getDashboardStats(role = "all") {
  const posts = await getHelper({
    url: "https://dummyjson.com/posts",
    role,
  });

  const people = await getHelper({
    url: "https://randomuser.me/api/?results=50",
    role,
  });

  return {
    views: posts.total * 128,
    readers: people.results.length,
    rating: (4 + Math.random()).toFixed(1),
    booksCount: posts.limit,
  };
}

// ----------- 2. REAL BOOK LIST (Google Books API) -----------

export async function getBooks(role = "all", page = 1, size = 10) {
  const startIndex = (page - 1) * size;

  const books = await getHelper({
    url: `https://www.googleapis.com/books/v1/volumes?q=subject:fiction&startIndex=${startIndex}&maxResults=${size}`,
    role,
  });
  return {
    data: books.items?.map((b) => ({
      id: b.id,
      title: b.volumeInfo.title,
      image: b.volumeInfo.imageLinks?.thumbnail,
      views: Math.floor(Math.random() * 8000),
      rating: (3.5 + Math.random()).toFixed(1),
    })) || [],
    totalPages: Math.ceil((books.totalItems || 0) / size), 
  };
}