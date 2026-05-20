import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Book } from '../types/book';

interface BookState {
  // Search history (last 10 queries)
  searchHistory: string[];
  addSearchQuery: (query: string) => void;
  clearSearchHistory: () => void;

  // Saved/favorite books
  savedBooks: Book[];
  toggleSaveBook: (book: Book) => void;
  isBookSaved: (bookId: string) => boolean;
  removeSavedBook: (bookId: string) => void;

  // UI state
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useBookStore = create<BookState>()(
  persist(
    (set, get) => ({
      // Search History
      searchHistory: [],
      addSearchQuery: (query) => {
        if (!query.trim()) return;
        set((state) => {
          const history = [query, ...state.searchHistory.filter(q => q !== query)].slice(0, 10);
          return { searchHistory: history };
        });
      },
      clearSearchHistory: () => set({ searchHistory: [] }),

      // Saved Books
      savedBooks: [],
      toggleSaveBook: (book) => {
        set((state) => {
          const exists = state.savedBooks.some(b => b.id === book.id);
          return {
            savedBooks: exists
              ? state.savedBooks.filter(b => b.id !== book.id)
              : [book, ...state.savedBooks]
          };
        });
      },
      isBookSaved: (bookId) => get().savedBooks.some(b => b.id === bookId),
      removeSavedBook: (bookId) => 
        set((state) => ({ savedBooks: state.savedBooks.filter(b => b.id !== bookId) })),

      // UI
      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'book-dashboard-storage', // localStorage key
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist these keys
        searchHistory: state.searchHistory,
        savedBooks: state.savedBooks,
      }),
    }
  )
);