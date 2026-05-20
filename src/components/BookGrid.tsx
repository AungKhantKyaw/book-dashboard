import type { Book } from '../types/book';
import { getCoverUrl } from '../services/api';

interface Props {
  books: Book[];
  loading: boolean;
  error: string | null;
  onToggleSave?: (book: Book) => void;
  isSaved?: (bookId: string) => boolean;
}


export default function BookGrid({ 
  books, 
  loading, 
  error,
  onToggleSave,
  isSaved
}: Props) {

  // Empty state: No search yet
  if (!loading && books.length === 0 && !error) {
    return (
      <div className="text-center py-16 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Start exploring</h3>
        <p className="text-gray-600 mb-1">Search by title, author, or subject</p>
        <p className="text-sm text-gray-500">Try: "harry potter", "tolkien", or "science fiction"</p>
      </div>
    );
  }

  // Loading state
  if (loading && books.length === 0) {
    return (
      <div role="status" aria-live="polite" className="flex flex-col items-center justify-center py-16">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600">Loading books...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div role="alert" className="max-w-md mx-auto p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Unable to load books</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-3 text-sm font-medium text-red-800 underline hover:no-underline focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No results found
  if (books.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No results found</h3>
        <p className="text-gray-600">Try adjusting your search terms or filters</p>
      </div>
    );
  }

  // Results grid
  return (
    <div>
      <p className="text-sm text-gray-600 mb-4">
        Showing <span className="font-medium text-gray-900">{books.length}</span> result{books.length !== 1 ? 's' : ''}
      </p>
      
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" role="list">
        {books.map(book => (
          <li 
            key={book.id} 
            className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
          >
            <article className="p-4 flex flex-col h-full">
              {/* Cover Image Container */}
              <div className="relative aspect-[3/4] mb-4 rounded-lg overflow-hidden bg-gray-100">
                {book.coverId ? (
                  <>
                    <img 
                      src={getCoverUrl(book.coverId, 'M')} 
                      alt={`Cover of ${book.title}`}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-200"
                      loading="lazy"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.style.display = 'none';
                        const placeholder = img.nextElementSibling as HTMLElement;
                        if (placeholder) {
                          placeholder.classList.remove('hidden');
                        }
                      }}
                    />
                    <div className="absolute inset-0 hidden items-center justify-center bg-gray-50">
                      <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 leading-tight group-hover:text-blue-700 transition-colors">
                  {book.title}
                </h3>
                
                {book.authors?.length > 0 && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                    by {book.authors.slice(0, 2).join(', ')}
                    {book.authors.length > 2 && <span className="text-gray-400"> +{book.authors.length - 2}</span>}
                  </p>
                )}

                {/* Meta badges */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {book.firstPublishYear && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                      {book.firstPublishYear}
                    </span>
                  )}
                  {book.subject?.[0] && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                      {book.subject[0]}
                    </span>
                  )}
                  {book.isbn?.[0] && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-500 font-mono">
                      ISBN
                    </span>
                  )}
                </div>
              </div>

              {/* Save Button - safely check optional props */}
              {onToggleSave && isSaved && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSave(book);
                  }}
                  className={`mt-3 w-full py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    isSaved(book.id)
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  aria-pressed={isSaved(book.id)}
                  aria-label={isSaved(book.id) ? `Remove ${book.title} from saved` : `Save ${book.title}`}
                >
                  {isSaved(book.id) ? (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      Saved
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      Save
                    </>
                  )}
                </button>
              )}
            </article>

            {/* Subtle hover indicator */}
            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </li>
        ))}
      </ul>
    </div>
  );
}