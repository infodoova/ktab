import { FAKE_CHILDREN_STORY_BOOKS } from "@/fakedataorassets/testData";

/**
 * Service managing children storybook data.
 * Consumes centralized mock assets with simulated asynchronous responses.
 */
export const storyBooksService = {
  /**
   * Retrieves children's storybooks with simulated network latency.
   */
  async getStoryBooks({ searchQuery = "", ageGroup = "ALL", category = "ALL" } = {}) {
    await new Promise((resolve) => setTimeout(resolve, 150));

    let items = [...FAKE_CHILDREN_STORY_BOOKS];

    if (ageGroup && ageGroup !== "ALL") {
      items = items.filter((book) => book.ageGroup === ageGroup);
    }

    if (category && category !== "ALL") {
      items = items.filter((book) => book.category === category);
    }

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter(
        (book) =>
          book.title?.toLowerCase().includes(q) ||
          book.subtitle?.toLowerCase().includes(q) ||
          book.author?.toLowerCase().includes(q) ||
          book.category?.toLowerCase().includes(q) ||
          book.summary?.toLowerCase().includes(q)
      );
    }

    return {
      success: true,
      data: items,
      total: items.length,
    };
  },

  /**
   * Simulates generating a new children's storybook.
   */
  async createStoryBook(payload) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newBook = {
      id: `custom-child-story-${Date.now()}`,
      title: payload.title || "مغامرة جديدة للأبطال",
      subtitle: payload.subtitle || "قصة مبتكرة خصيصاً لك",
      author: payload.heroName ? `مغامرة بطلنا ${payload.heroName}` : "مؤلف صغير",
      illustrator: "استوديو الذكاء الاصطناعي",
      cover: FAKE_CHILDREN_STORY_BOOKS[0]?.cover,
      ageGroup: payload.ageGroup || "3-6",
      ageLabel: payload.ageGroup === "9-12" ? "٩-١٢ سنة" : payload.ageGroup === "6-9" ? "٦-٩ سنوات" : "٣-٦ سنوات",
      category: payload.category || "مغامرات وخيال",
      pages: 16,
      isInteractive: true,
      accentColor: "var(--brand-teal)",
      summary: payload.summary || `انطلق في هذه القصة الشائقة في عالم ${payload.theme || "السحر والمرح"}!`,
    };

    return {
      success: true,
      data: newBook,
    };
  },
};

export default storyBooksService;
