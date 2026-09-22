import { getHelper, postHelper, patchHelper, deleteHelper } from "@/core/api/apiHelpers";

const API_BASE = import.meta.env.VITE_API_URL || "https://sanded-scrutiny-wool.ngrok-free.dev/api/v1";

/**
 * Service for Admin Library Management API
 * Swagger endpoints: /api/v1/admin/libraries
 */
export const libraryService = {
  /**
   * Fetches all libraries
   */
  async getLibraries({ page = 0, size = 50 } = {}) {
    return await getHelper({
      url: `${API_BASE}/admin/libraries`,
      pagination: true,
      page,
      size,
    });
  },

  /**
   * Gets a single library organization by ID
   */
  async getLibraryById(id) {
    return await getHelper({
      url: `${API_BASE}/admin/libraries/${id}`,
    });
  },

  /**
   * Creates a new library organization with its admin
   * @param {Object} payload - { name, description, city, country, address, website, email, phone, admin: { email, firstName, middleName, lastName, password, role } }
   */
  async createLibrary(payload) {
    return await postHelper({
      url: `${API_BASE}/admin/libraries`,
      body: payload,
    });
  },

  /**
   * Updates an existing library organization
   * @param {string|number} id
   * @param {Object} payload - { name, description, city, country, address, website, email, phone, status, admin: { ... } }
   */
  async updateLibrary(id, payload) {
    return await patchHelper({
      url: `${API_BASE}/admin/libraries/${id}`,
      body: payload,
    });
  },

  /**
   * Deletes a library organization along with its admin, staff, and books
   * @param {string|number} id
   */
  async deleteLibrary(id) {
    return await deleteHelper({
      url: `${API_BASE}/admin/libraries/${id}`,
    });
  },
};

export default libraryService;
