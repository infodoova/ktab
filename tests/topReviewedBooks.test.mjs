import test from "node:test";
import assert from "node:assert/strict";
import { mapTopReviewedBooks } from "../src/features/home/services/topReviewedBooksService.js";

test("maps top-reviewed books payload according to specification", () => {
  const payload = [
    {
      id: 110,
      title: "رحلة ابن بطوطة",
      coverImageUrl: "https://cdn.example/covers/110.jpg",
      aboutAudio: {
        url: "https://cdn.example/audio/110.mp3",
        description: "مقدمة صوتية موجزة عن الكتاب",
        durationSeconds: 39,
      },
    },
    {
      id: 122,
      title: "مقدمة ابن خلدون",
      coverImageUrl: "https://cdn.example/covers/122.jpg",
      // aboutAudio missing
    },
  ];

  const cards = mapTopReviewedBooks(payload);

  assert.equal(cards.length, 2);
  assert.deepEqual(cards[0], {
    id: 110,
    bookId: 110,
    title: "رحلة ابن بطوطة",
    cover: "https://cdn.example/covers/110.jpg",
    audioSrc: "https://cdn.example/audio/110.mp3",
    audioDescription: "مقدمة صوتية موجزة عن الكتاب",
    audioDuration: 39,
  });

  assert.deepEqual(cards[1], {
    id: 122,
    bookId: 122,
    title: "مقدمة ابن خلدون",
    cover: "https://cdn.example/covers/122.jpg",
    audioSrc: null,
    audioDescription: "",
    audioDuration: null,
  });

  // Verify there is no author field on either card
  assert.equal(cards[0].author, undefined);
  assert.equal(cards[1].author, undefined);
});

test("filters out books with missing, null, or empty coverImageUrl", () => {
  const payload = [
    { id: 1, title: "Book 1", coverImageUrl: "https://cdn.example/1.jpg" },
    { id: 2, title: "Book 2", coverImageUrl: "" },
    { id: 3, title: "Book 3", coverImageUrl: "   " },
    { id: 4, title: "Book 4", coverImageUrl: null },
    { id: 5, title: "Book 5" },
    { id: 6, title: "Book 6", coverImageUrl: "https://cdn.example/6.jpg" },
  ];

  const cards = mapTopReviewedBooks(payload);
  assert.equal(cards.length, 2);
  assert.deepEqual(cards.map((c) => c.bookId), [1, 6]);
});

test("deduplicates books by id preserving first occurrence order", () => {
  const payload = [
    { id: 110, title: "Book 110 First", coverImageUrl: "https://cdn.example/110-1.jpg" },
    { id: 122, title: "Book 122", coverImageUrl: "https://cdn.example/122.jpg" },
    { id: 110, title: "Book 110 Duplicate", coverImageUrl: "https://cdn.example/110-2.jpg" },
    { id: 118, title: "Book 118", coverImageUrl: "https://cdn.example/118.jpg" },
    { id: 122, title: "Book 122 Duplicate", coverImageUrl: "https://cdn.example/122-2.jpg" },
  ];

  const cards = mapTopReviewedBooks(payload);
  assert.equal(cards.length, 3);
  assert.deepEqual(cards.map((c) => c.bookId), [110, 122, 118]);
  assert.equal(cards[0].title, "Book 110 First");
  assert.equal(cards[0].cover, "https://cdn.example/110-1.jpg");
});

test("handles fixed production order with mixed audio availability", () => {
  const featuredIds = [110, 122, 118, 120, 109, 113];
  const payload = featuredIds.map((id, index) => ({
    id,
    title: `Featured Book ${id}`,
    coverImageUrl: `https://signed.example.com/cover/${id}.png`,
    // Alternate having audio or not
    aboutAudio: index % 2 === 0 ? {
      url: `https://signed.example.com/audio/${id}.mp3`,
      description: `وصف الكتاب ${id}`,
      durationSeconds: 40 + index,
    } : null,
  }));

  const cards = mapTopReviewedBooks(payload);
  assert.equal(cards.length, 6);
  assert.deepEqual(cards.map((c) => c.bookId), featuredIds);

  // Books with audio have audioSrc, books without audio have audioSrc: null
  assert.equal(cards[0].audioSrc, "https://signed.example.com/audio/110.mp3");
  assert.equal(cards[1].audioSrc, null);
  assert.equal(cards[2].audioSrc, "https://signed.example.com/audio/118.mp3");
  assert.equal(cards[3].audioSrc, null);
  assert.equal(cards[4].audioSrc, "https://signed.example.com/audio/109.mp3");
  assert.equal(cards[5].audioSrc, null);
});

test("safely handles non-array or invalid rawData inputs", () => {
  assert.deepEqual(mapTopReviewedBooks(null), []);
  assert.deepEqual(mapTopReviewedBooks(undefined), []);
  assert.deepEqual(mapTopReviewedBooks({}), []);
  assert.deepEqual(mapTopReviewedBooks("not an array"), []);
  assert.deepEqual(mapTopReviewedBooks([null, undefined, {}]), []);
});

test("fetchTopReviewedBooks sends credentials: 'omit' and parses successfully", async () => {
  const { fetchTopReviewedBooks } = await import("../src/features/home/services/topReviewedBooksService.js");
  const originalFetch = globalThis.fetch;

  let capturedOptions = null;
  globalThis.fetch = async (url, options) => {
    capturedOptions = options;
    return {
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        data: [
          { id: 110, title: "Book 110", coverImageUrl: "https://cdn.example/110.jpg" }
        ],
      }),
    };
  };

  try {
    const cards = await fetchTopReviewedBooks(10);
    assert.equal(capturedOptions?.credentials, "omit");
    assert.equal(cards.length, 1);
    assert.equal(cards[0].bookId, 110);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("fetchTopReviewedBooks throws 'rate-limit' on HTTP 429", async () => {
  const { fetchTopReviewedBooks } = await import("../src/features/home/services/topReviewedBooksService.js");
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () => ({
    ok: false,
    status: 429,
  });

  try {
    await assert.rejects(async () => {
      await fetchTopReviewedBooks(10);
    }, (err) => {
      assert.equal(err.message, "rate-limit");
      assert.equal(err.status, 429);
      return true;
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("fetchTopReviewedBooks throws 'load-failed' on HTTP 500 or success: false", async () => {
  const { fetchTopReviewedBooks } = await import("../src/features/home/services/topReviewedBooksService.js");
  const originalFetch = globalThis.fetch;

  // 1. HTTP 500
  globalThis.fetch = async () => ({
    ok: false,
    status: 500,
  });

  try {
    await assert.rejects(async () => {
      await fetchTopReviewedBooks(10);
    }, (err) => {
      assert.equal(err.message, "load-failed");
      assert.equal(err.status, 500);
      return true;
    });
  } finally {
    globalThis.fetch = originalFetch;
  }

  // 2. success: false
  globalThis.fetch = async () => ({
    ok: true,
    status: 200,
    json: async () => ({ success: false, data: [] }),
  });

  try {
    await assert.rejects(async () => {
      await fetchTopReviewedBooks(10);
    }, (err) => {
      assert.equal(err.message, "load-failed");
      return true;
    });
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("successfully parses real production payload with R2 signed URLs and aboutAudio", () => {
  const productionPayload = [
    {
      id: 110,
      title: "صمود الدبلوماسية: مذكرات ثماني سنوات في وزارة الخارجية",
      coverImageUrl: "https://r2.cloudflarestorage.com/ktab-bucket/libraries/1/books/cover/92bd986a.jpg?signature=test",
      description: "مذكرات محمد جواد ظريف عن ثماني سنوات في وزارة الخارجية الإيرانية",
      aboutAudio: {
        url: "https://r2.cloudflarestorage.com/ktab-bucket/books/110/about-audio/7eedf807.mp3?signature=test",
        description: "في «صمود الدبلوماسية» يروي محمد جواد ظريف، من الداخل، ثماني سنوات قضاها وزيرًا لخارجية إيران",
        durationSeconds: 24,
        mimeType: "audio/mpeg",
      },
    },
    {
      id: 122,
      title: "بعض الصوت",
      coverImageUrl: "https://r2.cloudflarestorage.com/ktab-bucket/libraries/1/books/cover/61d6ef0b.jpg?signature=test",
      description: "رواية تركية مترجمة",
      aboutAudio: {
        url: "https://r2.cloudflarestorage.com/ktab-bucket/books/122/about-audio/0e082032.mp3?signature=test",
        description: "«بعض الصوت» رواية تركية لبيلغهان أوتشاك",
        durationSeconds: 26,
        mimeType: "audio/mpeg",
      },
    },
    {
      id: 118,
      title: "الرسائل المصرية",
      coverImageUrl: "https://r2.cloudflarestorage.com/ktab-bucket/libraries/1/books/cover/9ca61c7e.jpg?signature=test",
      description: "كتاب جماعي يضم شهادات 24 كاتبًا",
      aboutAudio: {
        url: "https://r2.cloudflarestorage.com/ktab-bucket/books/118/about-audio/522a319f.mp3?signature=test",
        description: "«الرسائل المصرية» السابع في سلسلة الرسائل العربية",
        durationSeconds: 25,
        mimeType: "audio/mpeg",
      },
    },
    {
      id: 120,
      title: "الصين والولايات المتحدة",
      coverImageUrl: "https://r2.cloudflarestorage.com/ktab-bucket/libraries/1/books/cover/ad0395eb.jpg?signature=test",
      description: "قراءة في الصراع البنيوي",
      aboutAudio: {
        url: "https://r2.cloudflarestorage.com/ktab-bucket/books/120/about-audio/6a2ebd88.mp3?signature=test",
        description: "اتركوا الصين نائمة",
        durationSeconds: 26,
        mimeType: "audio/mpeg",
      },
    },
    {
      id: 109,
      title: "سيرة ملك",
      coverImageUrl: "https://r2.cloudflarestorage.com/ktab-bucket/libraries/1/books/cover/c0f1e2d2.jpg?signature=test",
      description: "سيرة سياسية",
      aboutAudio: {
        url: "https://r2.cloudflarestorage.com/ktab-bucket/books/109/about-audio/84594bfd.mp3?signature=test",
        description: "كيف استطاع ملك أن يبقى على رأس دولة صغيرة",
        durationSeconds: 35,
        mimeType: "audio/mpeg",
      },
    },
    {
      id: 113,
      title: "قوة التفاوض",
      coverImageUrl: "https://r2.cloudflarestorage.com/ktab-bucket/libraries/1/books/cover/3a55e471.jpg?signature=test",
      description: "دليل عملي",
      aboutAudio: {
        url: "https://r2.cloudflarestorage.com/ktab-bucket/books/113/about-audio/8609bfde.mp3?signature=test",
        description: "في كتاب «قوة التفاوض» يقدم عباس عراقجي خلاصة ثلاثة عقود",
        durationSeconds: 47,
        mimeType: "audio/mpeg",
      },
    },
  ];

  const cards = mapTopReviewedBooks(productionPayload);
  assert.equal(cards.length, 6);
  assert.deepEqual(cards.map((c) => c.bookId), [110, 122, 118, 120, 109, 113]);
  for (const card of cards) {
    assert.ok(card.cover.includes("r2.cloudflarestorage.com"));
    assert.ok(card.audioSrc.includes(".mp3"));
    assert.ok(card.audioDuration > 0);
    assert.ok(card.audioDescription.length > 0);
    assert.equal(card.author, undefined);
  }
});
