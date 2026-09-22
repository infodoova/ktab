import { getHelper, postHelper, putHelper, deleteHelper } from "@/core/api/apiHelpers";

const API_BASE = import.meta.env.VITE_API_URL || "https://sanded-scrutiny-wool.ngrok-free.dev/api/v1";

/**
 * Service for Admin Publisher Management API
 * Swagger endpoints: /api/v1/admin/publishers
 */
export const publisherService = {
  /**
   * Fetches paginated publisher accounts with optional search query.
   * @param {Object} params - { page = 0, size = 10, search = "" }
   */
  async getPublishers({ page = 0, size = 20, search = "" } = {}) {
    const url = new URL(`${API_BASE}/admin/publishers`);
    url.searchParams.set("page", String(page));
    url.searchParams.set("size", String(size));
    if (search && search.trim()) {
      url.searchParams.set("search", search.trim());
    }

    return await getHelper({
      url: url.toString(),
      pagination: false, // params already constructed on URL
    });
  },

  /**
   * Provisions or assigns a new publisher user account.
   * @param {Object} payload - { email, firstName, middleName, lastName, password }
   */
  async assignPublisher(payload) {
    return await postHelper({
      url: `${API_BASE}/admin/publishers`,
      body: payload,
    });
  },

  /**
   * Updates an existing publisher account by user ID.
   * @param {string|number} userId
   * @param {Object} payload - { email, firstName, middleName, lastName, password }
   */
  async updatePublisher(userId, payload) {
    return await putHelper({
      url: `${API_BASE}/admin/publishers/${userId}`,
      body: payload,
    });
  },

  /**
   * Deletes a publisher account by user ID.
   * @param {string|number} userId
   */
  async removePublisher(userId) {
    return await deleteHelper({
      url: `${API_BASE}/admin/publishers/${userId}`,
    });
  },
};

export default publisherService;
