import { getHelper, postHelper, patchHelper, deleteHelper } from "@/core/api/apiHelpers";

const API_BASE = import.meta.env.VITE_API_URL || "https://sanded-scrutiny-wool.ngrok-free.dev/api/v1";

/**
 * Service for Library Organization Admin API
 * Swagger endpoints: /api/v1/library-admin/*
 */
export const libraryAdminService = {
  /**
   * Fetches current administrator's library organization profile.
   * GET /api/v1/library-admin/organization
   */
  async getOrganization() {
    return await getHelper({
      url: `${API_BASE}/library-admin/organization`,
    });
  },

  /**
   * Updates current administrator's library organization profile.
   * PATCH /api/v1/library-admin/organization
   * @param {Object} payload - { name, description, city, country, address, website, email, phone, status, admin: { ... } }
   */
  async updateOrganization(payload) {
    return await patchHelper({
      url: `${API_BASE}/library-admin/organization`,
      body: payload,
    });
  },

  /**
   * Lists all staff members belonging to the library organization.
   * GET /api/v1/library-admin/staff
   */
  async getStaff() {
    return await getHelper({
      url: `${API_BASE}/library-admin/staff`,
    });
  },

  /**
   * Invites or assigns a new staff member to the library organization.
   * POST /api/v1/library-admin/staff
   * @param {Object} payload - { email, firstName, middleName, lastName, password }
   */
  async addStaff(payload) {
    return await postHelper({
      url: `${API_BASE}/library-admin/staff`,
      body: payload,
    });
  },

  /**
   * Removes a staff member from the library organization.
   * DELETE /api/v1/library-admin/staff/{userId}
   * @param {string|number} userId
   */
  async removeStaff(userId) {
    return await deleteHelper({
      url: `${API_BASE}/library-admin/staff/${userId}`,
    });
  },

  /**
   * Lists books belonging to the library organization (Scoped for Admin Librarian).
   * GET /api/v1/librarians/me/books
   * @param {Object} params - { page, size, status }
   */
  async getBooks({ page = 0, size = 50, status } = {}) {
    const query = new URLSearchParams();
    query.set("page", String(page));
    query.set("size", String(size));
    if (status && status !== "ALL") {
      query.set("status", status);
    }
    return await getHelper({
      url: `${API_BASE}/librarians/me/books?${query.toString()}`,
    });
  },

  /**
   * Retrieves a single library book by ID.
   * GET /api/v1/librarians/me/books/{id}
   * @param {string|number} id
   */
  async getBookById(id) {
    return await getHelper({
      url: `${API_BASE}/librarians/me/books/${id}`,
    });
  },

  /**
   * Deletes a book from the library organization (Exclusive to ADMIN_LIBRARIAN).
   * DELETE /api/v1/librarians/me/books/{id}
   * @param {string|number} id
   */
  async deleteBook(id) {
    return await deleteHelper({
      url: `${API_BASE}/librarians/me/books/${id}`,
    });
  },

  /**
   * Gets secure ephemeral download URL for library book source file.
   * GET /api/v1/librarians/me/books/{id}/source-file
   * @param {string|number} id
   */
  async getSourceFile(id) {
    return await getHelper({
      url: `${API_BASE}/librarians/me/books/${id}/source-file`,
    });
  },
};

export default libraryAdminService;
