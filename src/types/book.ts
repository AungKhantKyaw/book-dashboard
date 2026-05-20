export interface Book {
  id: string;           // Open Library key: /works/OL12345W
  title: string;
  authors: string[];    // Array of author names
  firstPublishYear?: number;
  isbn?: string[];
  coverId?: number;     // For cover image: covers.openlibrary.org/b/id/{coverId}-M.jpg
  subject?: string[];
  description?: string;
}

export interface SearchFilters {
  query: string;
  author?: string;
  subject?: string;
}