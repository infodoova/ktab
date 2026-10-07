/**
 * Transformer converting backend StorybookDetail or ReaderManifest
 * into flipboard pages consumed by the 3D reader.
 * Zero hardcoded stories or mock assets.
 */
export function getStoryPages(story) {
  if (!story) return [];

  // 1. If pages are directly supplied from ReaderManifest or StorybookDetail
  const sourcePages =
    (Array.isArray(story.pages) && story.pages.length > 0)
      ? story.pages
      : (Array.isArray(story.pagesContent) && story.pagesContent.length > 0)
      ? story.pagesContent
      : [];

  if (sourcePages.length > 0) {
    return sourcePages.map((p, idx) => {
      const kindStr = String(p.kind || p.type || "STORY").toUpperCase();
      let type = "story";
      if (kindStr === "COVER" || p.order === 0 || p.pageIndex === 0) {
        type = "cover";
      } else if (kindStr === "ENDING" || kindStr === "BACK_COVER") {
        type = "ending";
      }

      return {
        pageNumber: typeof p.order === "number" ? p.order : (typeof p.pageIndex === "number" ? p.pageIndex : idx + 1),
        type,
        textZone: p.textZone || "BOTTOM_SPAN",
        image: p.imageUrl || p.image || story?.coverImageUrl || story?.coverUrl || story?.cover || "",
        narrative: p.textAr || p.narrative || "",
        celebrationText: type === "ending" ? "النهاية" : "",
        title: story.title || story.titleAr || "",
      };
    });
  }

  // 2. Fallback single cover page if no pages generated yet
  const fallbackCover = story?.coverImageUrl || story?.coverUrl || story?.cover;
  if (fallbackCover) {
    return [
      {
        pageNumber: 1,
        type: "cover",
        image: fallbackCover,
        title: story.title || story.titleAr || "قصة مخصصة",
        narrative: "",
      },
    ];
  }

  return [];
}

export default getStoryPages;
