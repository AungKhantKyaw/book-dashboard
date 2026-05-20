import { useState, useEffect, useRef } from 'react';
import { useBooks } from './hooks/useBooks';
import { useDebounce } from './hooks/useDebounce';
import { useBookStore } from './store/useBookStore';
import BookGrid from './components/BookGrid';
import SearchHistory from './components/SearchHistory';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  
  const debouncedQuery = useDebounce(searchQuery, 300);
  const filters = { query: debouncedQuery };
  
  const { books, loading, error, page, setPage, hasMore } = useBooks(filters);
  
  // Zustand
  const { searchHistory, addSearchQuery, clearSearchHistory, savedBooks, toggleSaveBook, isBookSaved } = useBookStore();
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Close history on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowHistory(false);
      }
    };
    if (showHistory) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showHistory]);

  // Close history on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowHistory(false);
    };
    if (showHistory) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showHistory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      addSearchQuery(searchQuery.trim());
      setShowHistory(false);
    }
  };

  const handleHistorySelect = (query: string) => {
    setSearchQuery(query);
    addSearchQuery(query);
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Open Library Explorer
          </h1>
          <p className="mt-2 text-gray-600">
            Search millions of books via the Open Library API
          </p>
        </header>

        {/* Search Form with History */}
        <div ref={searchRef} className="mb-6 relative">
          <form onSubmit={handleSearchSubmit} role="search">
            <div className="relative mx-auto max-w-xl">
              {/* Search Icon */}
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                <svg className="h-5 w-5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <input
                type="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowHistory(true);
                }}
                onFocus={() => setShowHistory(true)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowUp' && !showHistory && searchHistory.length > 0) {
                    e.preventDefault();
                    setShowHistory(true);
                  }
                }}
                placeholder="Search books, authors, or subjects..."               
                className="block w-full rounded-xl border-0 bg-white py-3 pl-12 pr-24 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                aria-label="Search books"
                aria-autocomplete="list"
                aria-controls="search-history"
                autoComplete="off"
              />
              
              {/* Clear Button - appears when typing */}
              {searchQuery && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    setSearchQuery(''); 
                    setShowHistory(false);
                  }}
                  className="absolute right-12 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full transition-colors z-10"
                  aria-label="Clear search"
                  data-testid="clear-search-btn"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}

              {/* Search Button */}
              <button 
                type="submit"
                className="absolute right-2 top-2 bottom-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {/* Search History Dropdown */}
          {showHistory && searchHistory.length > 0 && (
            <SearchHistory
              queries={searchHistory}
              onSelect={handleHistorySelect}
              onClear={clearSearchHistory}
              onClose={() => setShowHistory(false)}
            />
          )}
        </div>

        {/* Results Grid */}
        <BookGrid 
          books={books} 
          loading={loading} 
          error={error}
          onToggleSave={toggleSaveBook}
          isSaved={isBookSaved}
        />

        {/* Pagination */}
        {books.length > 0 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              data-testid="pagination-prev"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50 transition"
              aria-label="Previous page"
            >
              ← Prev
            </button>
            <span className="px-4 py-2 text-gray-600">Page {page}</span>
            <button
              data-testid="pagination-next"
              onClick={() => setPage(p => p + 1)}
              disabled={loading || !hasMore}
              className="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-50 transition"
              aria-label="Next page"
            >
              Next →
            </button>
          </div>
        )}

        {/* Saved Books Section */}
        {savedBooks.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">💾 Saved Books</h2>
              <span className="text-sm text-gray-500">{savedBooks.length} saved</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {savedBooks.slice(0, 10).map(book => (
                <button
                  key={book.id}
                  onClick={() => toggleSaveBook(book)}
                  className="group relative aspect-[3/4] rounded-lg overflow-hidden border border-gray-200 hover:border-blue-300 transition-colors text-left"
                  title={`Remove "${book.title}" from saved`}
                >
                  {book.coverId ? (
                    <img 
                      src={`https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`}
                      alt={book.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                  {/* Remove overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-medium">✕ Remove</span>
                  </div>
                  {/* Title overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-xs font-medium truncate">{book.title}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}