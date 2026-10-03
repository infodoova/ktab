import { getHelper, postHelper, putHelper, deleteHelper } from "@/core/api/apiHelpers";
import { sanitizeId } from "@/lib/sanitize";

const RAW_API_BASE = (import.meta.env.VITE_API_URL || "").trim().replace(/\/$/, "");
const API_BASE = RAW_API_BASE
  ? (RAW_API_BASE.endsWith("/api/v1") ? RAW_API_BASE : `${RAW_API_BASE}/api/v1`)
  : "/api/v1";

/**
 * Storybook API Service.
 * Connects directly to backend endpoints under /api/v1/storybook:
 * - Books listing, detail, reader manifest, and download
 * - Story and character approval/regeneration workflows
 * - Child profile CRUD operations
 * - Curated age-band blueprints
 */
export const storyBooksService = {
  /**
   * Retrieves all personalized storybooks owned by the authenticated parent.
   * Backend: GET /api/v1/storybook/books
   * @returns {Promise<{ success: boolean, data: Array }>}
   */
  async getStoryBooks({ searchQuery = "", ageGroup = "ALL" } = {}) {
    const res = await getHelper({
      url: `${API_BASE}/storybook/books`,
    });

    const isSuccess = res?.success === true || res?.status === "OK" || res?.messageStatus === "SUCCESS";
    let list = Array.isArray(res?.data) ? res.data : [];

    // Map backend StorybookSummary to view model
    let items = list.map((b) => ({
      id: b.id,
      title: b.titleAr,
      titleAr: b.titleAr,
      childName: b.childNameAr,
      childNameAr: b.childNameAr,
      author: b.childNameAr ? `قصة بطلنا ${b.childNameAr}` : "قصة مخصصة",
      cover: b.coverUrl || null,
      coverUrl: b.coverUrl || null,
      status: b.status,
      pageCount: b.pageCount,
      pages: b.pageCount,
      createdAt: b.createdAt,
    }));

    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      items = items.filter(
        (b) =>
          b.title?.toLowerCase().includes(q) ||
          b.childName?.toLowerCase().includes(q)
      );
    }

    return {
      success: isSuccess,
      data: items,
      total: items.length,
    };
  },

  /**
   * Retrieves detailed storybook information including pages, character sheet, status, and edit tokens.
   * Backend: GET /api/v1/storybook/books/{id}
   */
  async getStoryBook(id) {
    const safeId = encodeURIComponent(sanitizeId(id));
    const res = await getHelper({
      url: `${API_BASE}/storybook/books/${safeId}`,
    });

    const isSuccess = res?.success === true || res?.status === "OK" || res?.messageStatus === "SUCCESS";
    return {
      success: isSuccess,
      data: res?.data || null,
      message: res?.message,
    };
  },

  /**
   * Retrieves reader manifest when storybook is in READY status.
   * Backend: GET /api/v1/storybook/books/{id}/reader
   */
  async getStoryBookReader(id) {
    const safeId = encodeURIComponent(sanitizeId(id));
    const res = await getHelper({
      url: `${API_BASE}/storybook/books/${safeId}/reader`,
    });

    const isSuccess = res?.success === true || res?.status === "OK" || res?.messageStatus === "SUCCESS";
    return {
      success: isSuccess,
      data: res?.data || null,
      message: res?.message,
    };
  },

  /**
   * Retrieves presigned PDF download URL for ready storybook.
   * Backend: GET /api/v1/storybook/books/{id}/download
   */
  async getStoryBookDownloadUrl(id) {
    const safeId = encodeURIComponent(sanitizeId(id));
    const res = await getHelper({
      url: `${API_BASE}/storybook/books/${safeId}/download`,
    });

    const isSuccess = res?.success === true || res?.status === "OK" || res?.messageStatus === "SUCCESS";
    return {
      success: isSuccess,
      url: res?.data?.url || null,
    };
  },

  /**
   * Initiates personalized storybook generation job.
   * Backend: POST /api/v1/storybook/books
   * Payload: CreateStorybookRequest
   */
  async createStoryBook(payload) {
    const res = await postHelper({
      url: `${API_BASE}/storybook/books`,
      body: {
        childProfileId: payload.childProfileId,
        blueprintKey: payload.blueprintKey,
        interests: payload.interests || [],
        setting: payload.setting || null,
        timeOfDay: payload.timeOfDay || null,
        place: payload.place || null,
        style: payload.style || "SOFT_WATERCOLOR",
        pageCount: Number(payload.pageCount) || 10,
        variety: payload.variety || "MSA",
        tashkeelLevel: payload.tashkeelLevel || "FULL",
        dedication: payload.dedication?.trim() || null,
        companion: payload.companion || null,
      },
    });

    const isSuccess = res?.success === true || res?.status === "OK" || res?.status === 201 || res?.messageStatus === "SUCCESS";
    if (!isSuccess) {
      throw new Error(res?.message || "فشل بدء إنشاء القصة");
    }

    return {
      success: true,
      data: res?.data || null,
    };
  },

  /**
   * Approves story text generated for review.
   * Backend: POST /api/v1/storybook/books/{id}/story/approve
   */
  async approveStory(id) {
    const safeId = encodeURIComponent(sanitizeId(id));
    const res = await postHelper({
      url: `${API_BASE}/storybook/books/${safeId}/story/approve`,
      body: {},
    });
    return res;
  },

  /**
   * Requests regeneration of story text if user rejects the draft.
   * Backend: POST /api/v1/storybook/books/{id}/story/regenerate
   */
  async regenerateStory(id) {
    const safeId = encodeURIComponent(sanitizeId(id));
    const res = await postHelper({
      url: `${API_BASE}/storybook/books/${safeId}/story/regenerate`,
      body: {},
    });
    return res;
  },

  /**
   * Approves child character appearance sheet.
   * Backend: POST /api/v1/storybook/books/{id}/character/approve
   */
  async approveCharacter(id) {
    const safeId = encodeURIComponent(sanitizeId(id));
    const res = await postHelper({
      url: `${API_BASE}/storybook/books/${safeId}/character/approve`,
      body: {},
    });
    return res;
  },

  /**
   * Requests regeneration of character appearance sheet.
   * Backend: POST /api/v1/storybook/books/{id}/character/regenerate
   */
  async regenerateCharacter(id) {
    const safeId = encodeURIComponent(sanitizeId(id));
    const res = await postHelper({
      url: `${API_BASE}/storybook/books/${safeId}/character/regenerate`,
      body: {},
    });
    return res;
  },

  /**
   * Requests single page illustration regeneration.
   * Backend: POST /api/v1/storybook/books/{id}/pages/{pageIndex}/regenerate
   */
  async regeneratePage(id, pageIndex) {
    const safeId = encodeURIComponent(sanitizeId(id));
    const res = await postHelper({
      url: `${API_BASE}/storybook/books/${safeId}/pages/${pageIndex}/regenerate`,
      body: {},
    });
    return res;
  },

  /**
   * Resumes failed storybook job pipeline.
   * Backend: POST /api/v1/storybook/books/{id}/resume
   */
  async resumeStoryBook(id) {
    const safeId = encodeURIComponent(sanitizeId(id));
    const res = await postHelper({
      url: `${API_BASE}/storybook/books/${safeId}/resume`,
      body: {},
    });
    return res;
  },

  /**
   * Cancels storybook generation job.
   * Backend: POST /api/v1/storybook/books/{id}/cancel
   */
  async cancelStoryBook(id) {
    const safeId = encodeURIComponent(sanitizeId(id));
    const res = await postHelper({
      url: `${API_BASE}/storybook/books/${safeId}/cancel`,
      body: {},
    });
    return res;
  },

  /**
   * Retrieves all child profiles owned by authenticated user.
   * Backend: GET /api/v1/storybook/children
   */
  async getChildren() {
    const res = await getHelper({
      url: `${API_BASE}/storybook/children`,
    });

    const isSuccess = res?.success === true || res?.status === "OK" || res?.messageStatus === "SUCCESS";
    return {
      success: isSuccess,
      data: Array.isArray(res?.data) ? res.data : [],
    };
  },

  /**
   * Creates a new child profile.
   * Backend: POST /api/v1/storybook/children
   * Payload: CreateChildProfileRequest (nameAr, gender, ageBand, appearance)
   */
  async createChild(payload) {
    const res = await postHelper({
      url: `${API_BASE}/storybook/children`,
      body: {
        nameAr: payload.nameAr?.trim(),
        gender: payload.gender,
        ageBand: payload.ageBand,
        appearance: {
          skinTone: payload.appearance?.skinTone,
          hairColor: payload.appearance?.hairColor,
          hairStyle: payload.appearance?.hairStyle,
          eyeColor: payload.appearance?.eyeColor,
          hijab: Boolean(payload.appearance?.hijab),
          glasses: Boolean(payload.appearance?.glasses),
        },
      },
    });

    const isSuccess = res?.success === true || res?.status === "OK" || res?.status === 201 || res?.messageStatus === "SUCCESS";
    if (!isSuccess) {
      throw new Error(res?.message || "تعذر حفظ الملف التعريفي للطفل");
    }

    return {
      success: true,
      data: res?.data,
    };
  },

  /**
   * Updates an existing child profile.
   * Backend: PUT /api/v1/storybook/children/{childId}
   */
  async updateChild(childId, payload) {
    const safeId = encodeURIComponent(sanitizeId(childId));
    const res = await putHelper({
      url: `${API_BASE}/storybook/children/${safeId}`,
      body: payload,
    });
    return res;
  },

  /**
   * Deletes a child profile.
   * Backend: DELETE /api/v1/storybook/children/{childId}
   */
  async deleteChild(childId) {
    const safeId = encodeURIComponent(sanitizeId(childId));
    const res = await deleteHelper({
      url: `${API_BASE}/storybook/children/${safeId}`,
    });
    return res;
  },

  /**
   * Retrieves age-band curated story blueprints.
   * Backend: GET /api/v1/storybook/blueprints?ageBand={ageBand}
   */
  async getBlueprints(ageBand) {
    if (!ageBand) return { success: true, data: [] };
    const res = await getHelper({
      url: `${API_BASE}/storybook/blueprints?ageBand=${encodeURIComponent(ageBand)}`,
    });

    const isSuccess = res?.success === true || res?.status === "OK" || res?.messageStatus === "SUCCESS";
    return {
      success: isSuccess,
      data: Array.isArray(res?.data) ? res.data : [],
    };
  },

  /**
   * Retrieves all storybook creation filter options and appearance enums dynamically from backend.
   * Backend: GET /api/v1/storybook/filters
   */
  async getFilters() {
    const res = await getHelper({
      url: `${API_BASE}/storybook/filters`,
    });
    const isSuccess = res?.success === true || res?.status === "OK" || res?.messageStatus === "SUCCESS";
    return {
      success: isSuccess,
      data: res?.data || null,
    };
  },
};

export default storyBooksService;
