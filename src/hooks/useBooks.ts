import { useState, useEffect, useCallback } from 'react';
import type { Book, SearchFilters } from '../types/book';
import { openLibraryAPI } from '../services/api';

// src/hooks/useBooks.ts
export function useBooks(initialFilters: SearchFilters) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = useCallback(async (q: string, pageNum: number) => {
    if (!q.trim()) {
      setBooks([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const results = await openLibraryAPI.searchBooks({ query: q }, pageNum);
      setBooks(prev => pageNum === 1 ? results : [...prev, ...results]);
      setHasMore(results.length === 20);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {    
    fetchBooks(initialFilters.query, page);
  }, [initialFilters.query, page, fetchBooks]); 

  return { books, loading, error, page, setPage, hasMore, refresh: () => { setBooks([]); setPage(1); setHasMore(true); fetchBooks(initialFilters.query, 1); } };
}