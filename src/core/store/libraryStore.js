import { create } from "zustand";

/**
 * Reactive Zustand store for tracking saved library book assignments in real time.
 */
export const useLibraryStore = create((set, get) => ({
  assignedBookIds: new Set(),
  lastUpdated: Date.now(),

  setAssignedBookIds: (ids) =>
    set({
      assignedBookIds: new Set(ids.map(String)),
      lastUpdated: Date.now(),
    }),

  markBookAssigned: (bookId) => {
    if (!bookId) return;
    const current = new Set(get().assignedBookIds);
    current.add(String(bookId));
    set({ assignedBookIds: current, lastUpdated: Date.now() });
  },

  markBookUnassigned: (bookId) => {
    if (!bookId) return;
    const current = new Set(get().assignedBookIds);
    current.delete(String(bookId));
    set({ assignedBookIds: current, lastUpdated: Date.now() });
  },

  isBookAssigned: (bookId) => {
    if (!bookId) return false;
    return get().assignedBookIds.has(String(bookId));
  },
}));

export default useLibraryStore;
