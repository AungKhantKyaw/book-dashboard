
interface Props {
  queries: string[];
  onSelect: (query: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export default function SearchHistory({ queries, onSelect, onClear, onClose }: Props) {
  if (queries.length === 0) return null;

  return (
    <div 
      className="absolute z-20 mt-2 w-full max-w-xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
      role="dialog"
      aria-label="Search history"
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Recent searches</span>
        </div>
        <button
          type="button"
          onClick={() => {
            onClear();
            onClose();
          }}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
          aria-label="Clear search history"
        >
          Clear all
        </button>
      </div>

      {/* List */}
      <ul className="max-h-60 overflow-auto py-1" role="listbox">
        {queries.map((query, idx) => (
          <li key={idx} role="option">
            <button
              type="button"
              data-testid="clear-history-btn"
              onClick={() => {
                onSelect(query);
                onClose();
              }}
              className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 focus:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 flex items-center gap-3 transition-colors"
            >
              {/* Clock icon */}
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate">{query}</span>
              {/* Arrow indicator */}
              <svg className="w-4 h-4 text-gray-300 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </li>
        ))}
      </ul>    
    </div>
  );
}