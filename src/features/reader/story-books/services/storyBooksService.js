import { getHelper, postHelper, putHelper, patchHelper, deleteHelper, postFormDataHelper } from "@/core/api/apiHelpers";
import { sanitizeId } from "@/lib/sanitize";
import { COMPANION_TYPES, PET_COLORS, STORYBOOK_VALIDATION } from "../constants/storyBooksConstants";

const RAW_API_BASE = (import.meta.env.VITE_API_URL || "").trim().replace(/\/$/, "");
const API_BASE = RAW_API_BASE
  ? (RAW_API_BASE.endsWith("/api/v1") ? RAW_API_BASE : `${RAW_API_BASE}/api/v1`)
  : "/api/v1";

/**
 * Validates storybook creation payload against backend constraints before submission.
 * @param {import("@/types/storybook").CreateStorybookRequest} payload
 * @param {{ childPhoto?: File, companionPhoto?: File, characterPhotos?: File[] }} [files]
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateStorybookPayload(payload = {}, files = {}) {
  const errors = {};

  // 1. Page Count (strictly 15 to 20)
  const pageCount = Number(payload.pageCount);
  if (
    !Number.isInteger(pageCount) ||
    pageCount < STORYBOOK_VALIDATION.MIN_PAGE_COUNT ||
    pageCount > STORYBOOK_VALIDATION.MAX_PAGE_COUNT
  ) {
    errors.pageCount = `عدد الصفحات يجب أن يكون بين ${STORYBOOK_VALIDATION.MIN_PAGE_COUNT} و ${STORYBOOK_VALIDATION.MAX_PAGE_COUNT} صفحة حصراً.`;
  }

  // 2. Child Name (if inline child profile is provided)
  if (payload.child) {
    const trimmed = typeof payload.child.nameAr === "string" ? payload.child.nameAr.trim() : "";
    if (!STORYBOOK_VALIDATION.ARABIC_NAME_REGEX.test(trimmed)) {
      errors.nameAr = STORYBOOK_VALIDATION.ARABIC_NAME_ERROR;
    }
  } else if (!payload.childProfileId && !payload.child) {
    errors.child = "يرجى تحديد ملف الطفل أو إدخال بياناته الأساسية.";
  }

  // The frontend supports pets only; sibling appearance is not collected yet.
  if (payload.companion) {
    if (!COMPANION_TYPES.some((option) => option.value === payload.companion.type)) {
      errors.companion = "يرجى اختيار حيوان أليف مرافق للقصة.";
    } else if (!PET_COLORS.some((option) => option.value === payload.companion.petColor)) {
      errors.petColor = "يرجى اختيار لون الحيوان الأليف.";
    }
  }

  // 3. Interests count (0 - 3)
  if (Array.isArray(payload.interests) && payload.interests.length > STORYBOOK_VALIDATION.MAX_INTERESTS) {
    errors.interests = `يمكن اختيار ${STORYBOOK_VALIDATION.MAX_INTERESTS} اهتمامات كحد أقصى.`;
  }

  // 4. Supporting Characters count (0 - 4)
  if (Array.isArray(payload.characters) && payload.characters.length > STORYBOOK_VALIDATION.MAX_CHARACTERS) {
    errors.characters = `يمكن إضافة حتى ${STORYBOOK_VALIDATION.MAX_CHARACTERS} شخصيات مساعدة فقط.`;
  }

  // 5. Dialect requires TashkeelLevel: NONE
  const isDialect = ["LEBANESE", "EGYPTIAN", "GULF"].includes(payload.variety);
  if (isDialect && payload.tashkeelLevel && payload.tashkeelLevel !== "NONE") {
    errors.tashkeelLevel = "عند اختيار لهجة محكية يجب أن يكون مستوى التشكيل (بدون تشكيل).";
  }

  // 6. Photo Consent check
  const hasAttachedPhotos = Boolean(
    files?.childPhoto ||
    files?.companionPhoto ||
    (files?.characterPhotos && files.characterPhotos.length > 0) ||
    payload.childPhotoBase64 ||
    payload.companionPhotoBase64 ||
    payload.child?.photoBase64 ||
    payload.companion?.photoBase64 ||
    (payload.characters && payload.characters.some((c) => Boolean(c.photoBase64)))
  );

  if (hasAttachedPhotos && !payload.photoConsent) {
    errors.photoConsent = "الموافقة على استخدام الصور ضرورية لإتمام رسم شخصيات القصة.";
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Storybook API Service.
 * Implements the Personalized Storybook Platform API Specification:
 * - Single-request Creation via Multipart Form Data or Application/JSON
 * - Lifecycle HITL steps (Story Approval, Character Look Sheet Approval/Regeneration)
 * - Page Regeneration
 * - Interactive Reader Manifest & High-Res PDF Download
 * - Child Profiles CRUD Management
 */
export const storyBooksService = {
  /**
   * Validates payload locally before submitting.
   */
  validatePayload: validateStorybookPayload,

  /**
   * Retrieves all personalized storybooks owned by the authenticated parent.
   * Backend: GET /api/v1/storybook/books
   * @param {{ searchQuery?: string }} [params]
   * @returns {Promise<{ success: boolean, data: Array, total: number }>}
   */
  async getStoryBooks({ searchQuery = "" } = {}) {
    const res = await getHelper({
      url: `${API_BASE}/storybook/books`,
    });

    const isSuccess = res?.success === true || res?.status === "OK" || res?.messageStatus === "SUCCESS";
    const list = Array.isArray(res?.data) ? res.data : [];

    let items = list.map((b) => {
      const cover = b.coverImageUrl || b.coverUrl || null;
      return {
        id: b.id,
        title: b.titleAr || "قصة مخصصة",
        titleAr: b.titleAr || "قصة مخصصة",
        childName: b.childNameAr || "",
        childNameAr: b.childNameAr || "",
        author: b.childNameAr ? `قصة بطلنا ${b.childNameAr}` : "قصة مخصصة",
        coverImageUrl: cover,
        coverUrl: cover,
        cover: cover,
        status: b.status,
        pageCount: b.pageCount || 16,
        pages: b.pageCount || 16,
        createdAt: b.createdAt,
      };
    });

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
      raw: res,
    };
  },

  /**
   * Retrieves detailed storybook information including pages, character sheet, status, and statusMessage.
   * Backend: GET /api/v1/storybook/books/{id}
   * @param {string|number} id
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
      message: res?.message || "",
      statusMessage: res?.data?.statusMessage || res?.message,
      raw: res,
    };
  },

  /**
   * Polls storybook until a terminal state or an action-required state is reached.
   * Stops polling on: COMPLETED, READY, STORY_READY, CHARACTER_READY, FAILED, CANCELLED.
   * @param {string|number} id
   * @param {{ onUpdate?: (data: any) => void, intervalMs?: number, signal?: AbortSignal }} options
   */
  async pollStorybookStatus(id, { onUpdate, intervalMs = 3000, signal } = {}) {
    return new Promise((resolve, reject) => {
      let isDone = false;
      const safeId = encodeURIComponent(sanitizeId(id));

      const check = async () => {
        if (isDone || signal?.aborted) return;
        try {
          const res = await storyBooksService.getStoryBook(safeId);
          if (!res.success) {
            isDone = true;
            return reject(new Error(res.message || "فشل جلب تفاصيل القصة"));
          }

          const data = res.data;
          if (onUpdate && typeof onUpdate === "function") {
            onUpdate(data);
          }

          const terminalOrActionStates = [
            "COMPLETED",
            "READY",
            "STORY_READY",
            "CHARACTER_READY",
            "FAILED",
            "CANCELLED",
          ];

          if (terminalOrActionStates.includes(data?.status)) {
            isDone = true;
            resolve(data);
            return;
          }

          if (!signal?.aborted && !isDone) {
            timer = setTimeout(check, intervalMs);
          }
        } catch (err) {
          isDone = true;
          reject(err);
        }
      };

      let timer = setTimeout(check, intervalMs);

      if (signal) {
        signal.addEventListener("abort", () => {
          isDone = true;
          clearTimeout(timer);
        });
      }
    });
  },

  /**
   * Creates a storybook in a single HTTP request.
   * Supports Option A: multipart/form-data (recommended when File objects are provided)
   * or Option B: application/json (when Base64 strings or no photos are used).
   *
   * @param {import("@/types/storybook").CreateStorybookRequest} payload
   * @param {{ childPhoto?: File|null, companionPhoto?: File|null, characterPhotos?: File[] }} [files]
   */
  async createStoryBook(payload, files = {}) {
    payload = {
      ...payload,
      ...(payload.child && {
        child: { ...payload.child, nameAr: typeof payload.child.nameAr === "string" ? payload.child.nameAr.trim() : "" },
      }),
      // Also protect callers restoring drafts outside the creation wizard.
      ...(["BROTHER", "SISTER"].includes(payload.companion?.type) && {
        companion: {
          ...payload.companion,
          type: "CAT",
          petColor: payload.companion.petColor || "ORANGE",
          siblingAppearance: undefined,
        },
      }),
    };
    // 1. Pre-flight validation
    const validation = validateStorybookPayload(payload, files);
    if (!validation.valid) {
      const firstError = Object.values(validation.errors)[0];
      throw new Error(firstError || "البيانات المدخلة غير مكتملة");
    }

    const hasBinaryFiles = Boolean(
      files?.childPhoto ||
      files?.companionPhoto ||
      (files?.characterPhotos && files.characterPhotos.length > 0)
    );

    let res;

    if (hasBinaryFiles) {
      // Option A: multipart/form-data
      const formData = new FormData();

      // Append request payload as application/json Blob
      const jsonBlob = new Blob([JSON.stringify(payload)], {
        type: "application/json",
      });
      formData.append("request", jsonBlob);

      if (files?.childPhoto) {
        formData.append("childPhoto", files.childPhoto);
      }
      if (files?.companionPhoto) {
        formData.append("companionPhoto", files.companionPhoto);
      }
      if (Array.isArray(files?.characterPhotos)) {
        files.characterPhotos.forEach((file) => {
          if (file) formData.append("characterPhotos", file);
        });
      }

      if (payload.photoConsent || hasBinaryFiles) {
        formData.append("consent", "true");
      }

      res = await postFormDataHelper({
        url: `${API_BASE}/storybook/books`,
        formData,
      });
    } else {
      // Option B: application/json
      res = await postHelper({
        url: `${API_BASE}/storybook/books`,
        body: payload,
      });
    }

    const isSuccess =
      res?.success === true ||
      res?.status === "OK" ||
      res?.statusCode === 201 ||
      res?.messageStatus === "SUCCESS";

    if (!isSuccess) {
      const message =
        res?.message ||
        (res?.errors && Object.values(res.errors).flat().join(" - ")) ||
        "فشل بدء تأليف القصة";
      throw new Error(message);
    }

    return {
      success: true,
      data: res?.data || null,
      message: res?.message || "",
      correlationId: res?.correlationId,
    };
  },

  /**
   * Approves Arabic Story Script (Advances book from STORY_READY to CHARACTER_READY).
   * Optionally sends updated page texts if user edited them.
   * Backend: POST /api/v1/storybook/books/{id}/story/approve
   */
  async approveStory(id, body = {}) {
    const safeId = encodeURIComponent(sanitizeId(id));
    const res = await postHelper({
      url: `${API_BASE}/storybook/books/${safeId}/story/approve`,
      body: body || {},
    });

    const isSuccess = res?.success === true || res?.status === "OK" || res?.messageStatus === "SUCCESS" || res?.statusCode === 202;
    if (!isSuccess) {
      throw new Error(res?.message || "تعذر اعتماد القصة");
    }

    return res;
  },

  /**
   * Edit story text and title before Gate 1 approval (STORY_READY status).
   * Backend: PUT /api/v1/storybook/books/{id}/story
   * @param {string|number} id
   * @param {{ titleAr?: string, pages?: Array<{ pageIndex: number, textAr: string, sceneEn?: string }> }} payload
   * @returns {Promise<{ success: boolean, data: import("@/types/storybook").StorybookDetail, message?: string }>}
   */
  async editStory(id, { titleAr, pages } = {}) {
    const safeId = encodeURIComponent(sanitizeId(id));
    const body = {};

    if (typeof titleAr === "string" && titleAr.trim()) {
      body.titleAr = titleAr.trim();
    }

    if (Array.isArray(pages)) {
      body.pages = pages.map((p, idx) => ({
        pageIndex: Number.isInteger(p.pageIndex) ? p.pageIndex : idx + 1,
        textAr: p.textAr ?? "",
        ...(p.sceneEn ? { sceneEn: p.sceneEn } : {}),
      }));
    }

    const res = await putHelper({
      url: `${API_BASE}/storybook/books/${safeId}/story`,
      body,
    });

    const isSuccess =
      res?.success === true ||
      res?.status === "OK" ||
      res?.messageStatus === "SUCCESS" ||
      res?.statusCode === 200;

    if (!isSuccess) {
      throw new Error(res?.message || "تعذر تحديث نص القصة");
    }

    return res;
  },

  /**
   * Updates text for a single storybook page during the review step.
   * Calls editStory under the hood.
   * @param {string|number} id
   * @param {number} pageIndex
   * @param {string} textAr
   * @param {Array} [allPages]
   */
  async updatePageText(id, pageIndex, textAr, allPages = []) {
    const pagesPayload = Array.isArray(allPages) && allPages.length > 0
      ? allPages.map((p, idx) => {
          const pIdx = Number.isInteger(p.pageIndex) ? p.pageIndex : idx;
          return {
            pageIndex: pIdx,
            textAr: pIdx === pageIndex ? textAr : (p.textAr || ""),
            ...(p.sceneEn ? { sceneEn: p.sceneEn } : {}),
          };
        })
      : [{ pageIndex, textAr }];

    return this.editStory(id, { pages: pagesPayload });
  },

  /**
   * Approves Character Design Sheet (Advances book from CHARACTER_READY to ILLUSTRATING).
   * Backend: POST /api/v1/storybook/books/{id}/character/approve
   */
  async approveCharacter(id) {
    const safeId = encodeURIComponent(sanitizeId(id));
    const res = await postHelper({
      url: `${API_BASE}/storybook/books/${safeId}/character/approve`,
      body: {},
    });

    const isSuccess = res?.success === true || res?.status === "OK" || res?.messageStatus === "SUCCESS" || res?.statusCode === 202;
    if (!isSuccess) {
      throw new Error(res?.message || "تعذر اعتماد رسم الشخصية");
    }

    return res;
  },

  /**
   * Requests newly painted character look sheet. Decrements lookRegenerationsLeft.
   * Backend: POST /api/v1/storybook/books/{id}/character/regenerate
   */
  async regenerateCharacter(id) {
    const safeId = encodeURIComponent(sanitizeId(id));
    const res = await postHelper({
      url: `${API_BASE}/storybook/books/${safeId}/character/regenerate`,
      body: {},
    });

    const isSuccess = res?.success === true || res?.status === "OK" || res?.messageStatus === "SUCCESS" || res?.statusCode === 202;
    if (!isSuccess) {
      throw new Error(res?.message || "تعذر طلب إعادة رسم الشخصية");
    }

    return res;
  },

  /**
   * Requests single page illustration regeneration.
   * Backend: POST /api/v1/storybook/books/{id}/pages/{pageIndex}/regenerate
   * @param {string|number} id
   * @param {number} pageIndex
   */
  async regeneratePage(id, pageIndex) {
    const safeId = encodeURIComponent(sanitizeId(id));
    const safeIdx = encodeURIComponent(String(pageIndex ?? 0));
    const res = await postHelper({
      url: `${API_BASE}/storybook/books/${safeId}/pages/${safeIdx}/regenerate`,
      body: {},
    });

    const isSuccess =
      res?.success === true ||
      res?.status === "OK" ||
      res?.messageStatus === "SUCCESS" ||
      res?.statusCode === 200 ||
      res?.statusCode === 202;
    if (!isSuccess) {
      throw new Error(res?.message || "تعذر طلب إعادة رسم الصفحة");
    }

    return res;
  },

  /**
   * Retrieves reader manifest structured for web flipping book readers (RTL).
   * Backend: GET /api/v1/storybook/books/{id}/reader
   * @param {string|number} id
   * @returns {Promise<{ success: boolean, data: import("@/types/storybook").ReaderManifest }>}
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
   * Retrieves presigned PDF download URL for 300 DPI square print PDF.
   * Backend: GET /api/v1/storybook/books/{id}/download
   * @param {string|number} id
   * @returns {Promise<{ success: boolean, url: string }>}
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
      message: res?.message,
    };
  },

  /**
   * Cancels storybook generation job.
   * Backend: POST /api/v1/storybook/books/{id}/cancel
   * @param {string|number} id
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
   * Resumes failed storybook job pipeline.
   * Backend: POST /api/v1/storybook/books/{id}/resume
   * @param {string|number} id
   */
  async resumeStoryBook(id) {
    const safeId = encodeURIComponent(sanitizeId(id));
    const res = await postHelper({
      url: `${API_BASE}/storybook/books/${safeId}/resume`,
      body: {},
    });
    return res;
  },

  // ==========================================================================
  // Child Profiles Standalone Management (CRUD)
  // ==========================================================================

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
   * Payload: CreateChildProfileRequest (nameAr, gender, ageBand, appearance, photoBase64)
   */
  async createChild(payload) {
    const nameAr = typeof payload.nameAr === "string" ? payload.nameAr.trim() : "";
    if (!STORYBOOK_VALIDATION.ARABIC_NAME_REGEX.test(nameAr)) {
      throw new Error(STORYBOOK_VALIDATION.ARABIC_NAME_ERROR);
    }
    const res = await postHelper({
      url: `${API_BASE}/storybook/children`,
      body: {
        nameAr,
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
        photoBase64: payload.photoBase64 || undefined,
      },
    });

    const isSuccess =
      res?.success === true ||
      res?.status === "OK" ||
      res?.statusCode === 201 ||
      res?.messageStatus === "SUCCESS";

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
};

export default storyBooksService;
