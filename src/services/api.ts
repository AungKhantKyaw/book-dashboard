import type { Book, SearchFilters } from '../types/book';

const BASE_URL = 'https://openlibrary.org';

// Helper: Build cover image URL
export const getCoverUrl = (coverId?: number, size: 'S' | 'M' | 'L' = 'M') =>
  coverId ? `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg` : null;

// Helper: Parse Open Library search result → our Book type
function parseDocToBook(doc: any): Book {
  return {
    id: doc.key,
    title: doc.title || 'Untitled',
    authors: Array.isArray(doc.author_name) ? doc.author_name : [],
    firstPublishYear: doc.first_publish_year?.[0], // Sometimes it's an array
    isbn: Array.isArray(doc.isbn) ? doc.isbn : undefined,
    coverId: doc.cover_i,
    subject: Array.isArray(doc.subject) ? doc.subject : undefined,
    description: doc.first_sentence?.[0],
  };
}

export const openLibraryAPI = {
  /**
   * Search books by title/author/subject
   * Docs: https://openlibrary.org/dev/docs/api/search
   */
  async searchBooks(filters: SearchFilters, page = 1, limit = 20): Promise<Book[]> {   
    if (!filters.query || filters.query.trim() === '') {
      return [];
    }

    const params = new URLSearchParams({
      q: filters.query.trim(),
      page: page.toString(),
      limit: limit.toString(),      
    });

    if (filters.author) {
      params.append('author', filters.author);
    }

    const response = await fetch(`${BASE_URL}/search.json?${params}`);
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    const data = await response.json();
    return (data.docs || []).map(parseDocToBook);
  },

  /**
   * Get detailed book info by Open Library ID (e.g., /works/OL12345W)
   * Docs: https://openlibrary.org/dev/docs/api/books
   */
  async getBookDetails(workKey: string): Promise<Book | null> {
    // workKey format: "/works/OL12345W"
    const response = await fetch(`${BASE_URL}${workKey}.json`);
    if (!response.ok) return null;
    
    const data = await response.json();
    
    // Extract authors (can be nested references)
    const authors = await Promise.all(
      (data.authors || []).map(async (a: any) => {
        if (typeof a.author === 'string') return a.author;
        if (a.author?.key) {
          const res = await fetch(`${BASE_URL}${a.author.key}.json`);
          const authorData = await res.json();
          return authorData.name;
        }
        return 'Unknown';
      })
    );

    return {
      id: data.key,
      title: data.title || 'Untitled',
      authors,
      firstPublishYear: data.first_publish_date?.slice(0, 4),
      isbn: data.isbn_10 || data.isbn_13,
      coverId: data.covers?.[0],
      subject: data.subjects,
      description: typeof data.description === 'string' 
        ? data.description 
        : data.description?.value,
    };
  }
};