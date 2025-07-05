'use client';

import { useState, useEffect, useCallback } from 'react';
import { ProcessedDocument, DocumentStats, SearchResult, DocumentCategory } from '@/types/document';
import { DocumentIndexer } from '@/lib/document-indexer';
import { SearchEngine } from '@/lib/search-engine';

interface UseDocumentsReturn {
  // Documents
  documents: ProcessedDocument[];
  documentStats: DocumentStats | null;
  categories: DocumentCategory[];
  
  // Loading states
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  
  // Document operations
  getDocument: (id: string) => ProcessedDocument | undefined;
  getDocumentsByCategory: (category: string) => ProcessedDocument[];
  getDocumentsByTag: (tag: string) => ProcessedDocument[];
  getRelatedDocuments: (document: ProcessedDocument, limit?: number) => ProcessedDocument[];
  
  // Search operations
  search: (query: string, limit?: number) => SearchResult[];
  searchInCategory: (query: string, category: string, limit?: number) => SearchResult[];
  searchByTags: (tags: string[], limit?: number) => SearchResult[];
  getSuggestions: (partialQuery: string, limit?: number) => string[];
  
  // Utility functions
  refresh: () => Promise<void>;
  getAllTags: () => string[];
  getDocumentsWithDiagrams: () => ProcessedDocument[];
}

export function useDocuments(): UseDocumentsReturn {
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [documentStats, setDocumentStats] = useState<DocumentStats | null>(null);
  const [categories, setCategories] = useState<DocumentCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [indexer] = useState(() => DocumentIndexer.getInstance());
  const [searchEngine] = useState(() => SearchEngine.getInstance());

  // Initialize documents and search engine
  const initializeDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Initialize indexer and search engine
      await indexer.indexDocuments();
      await searchEngine.initialize();
      
      // Get documents and stats
      const allDocuments = indexer.getAllDocuments();
      const stats = indexer.getDocumentStats();
      const categoryStats = indexer.getCategoryStats();
      
      setDocuments(allDocuments);
      setDocumentStats(stats);
      setCategories(categoryStats);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load documents';
      setError(errorMessage);
      console.error('Error initializing documents:', err);
    } finally {
      setIsLoading(false);
    }
  }, [indexer, searchEngine]);

  // Initialize on mount
  useEffect(() => {
    initializeDocuments();
  }, [initializeDocuments]);

  // Document operations
  const getDocument = useCallback((id: string): ProcessedDocument | undefined => {
    return indexer.getDocument(id);
  }, [indexer]);

  const getDocumentsByCategory = useCallback((category: string): ProcessedDocument[] => {
    return indexer.getDocumentsByCategory(category);
  }, [indexer]);

  const getDocumentsByTag = useCallback((tag: string): ProcessedDocument[] => {
    return indexer.getDocumentsByTag(tag);
  }, [indexer]);

  const getRelatedDocuments = useCallback((document: ProcessedDocument, limit = 5): ProcessedDocument[] => {
    return searchEngine.getRelatedDocuments(document, limit);
  }, [searchEngine]);

  // Search operations
  const search = useCallback((query: string, limit = 10): SearchResult[] => {
    if (!searchEngine.isInitialized()) {
      return [];
    }
    
    setIsSearching(true);
    try {
      return searchEngine.search(query, limit);
    } finally {
      setIsSearching(false);
    }
  }, [searchEngine]);

  const searchInCategory = useCallback((query: string, category: string, limit = 10): SearchResult[] => {
    if (!searchEngine.isInitialized()) {
      return [];
    }
    
    setIsSearching(true);
    try {
      return searchEngine.searchInCategory(query, category, limit);
    } finally {
      setIsSearching(false);
    }
  }, [searchEngine]);

  const searchByTags = useCallback((tags: string[], limit = 10): SearchResult[] => {
    if (!searchEngine.isInitialized()) {
      return [];
    }
    
    setIsSearching(true);
    try {
      return searchEngine.searchByTags(tags, limit);
    } finally {
      setIsSearching(false);
    }
  }, [searchEngine]);

  const getSuggestions = useCallback((partialQuery: string, limit = 5): string[] => {
    if (!searchEngine.isInitialized()) {
      return [];
    }
    
    return searchEngine.getSuggestions(partialQuery, limit);
  }, [searchEngine]);

  // Utility functions
  const refresh = useCallback(async (): Promise<void> => {
    await initializeDocuments();
  }, [initializeDocuments]);

  const getAllTags = useCallback((): string[] => {
    return indexer.getAllTags();
  }, [indexer]);

  const getDocumentsWithDiagrams = useCallback((): ProcessedDocument[] => {
    return indexer.getDocumentsWithDiagrams();
  }, [indexer]);

  return {
    // Documents
    documents,
    documentStats,
    categories,
    
    // Loading states
    isLoading,
    isSearching,
    error,
    
    // Document operations
    getDocument,
    getDocumentsByCategory,
    getDocumentsByTag,
    getRelatedDocuments,
    
    // Search operations
    search,
    searchInCategory,
    searchByTags,
    getSuggestions,
    
    // Utility functions
    refresh,
    getAllTags,
    getDocumentsWithDiagrams
  };
}

// Hook for individual document
export function useDocument(id: string) {
  const { getDocument, getRelatedDocuments, isLoading } = useDocuments();
  const [document, setDocument] = useState<ProcessedDocument | undefined>(undefined);
  const [relatedDocuments, setRelatedDocuments] = useState<ProcessedDocument[]>([]);

  useEffect(() => {
    if (!isLoading && id) {
      const doc = getDocument(id);
      setDocument(doc);
      
      if (doc) {
        const related = getRelatedDocuments(doc);
        setRelatedDocuments(related);
      }
    }
  }, [id, getDocument, getRelatedDocuments, isLoading]);

  return {
    document,
    relatedDocuments,
    isLoading
  };
}

// Hook for category documents
export function useCategoryDocuments(category: string) {
  const { getDocumentsByCategory, categories, isLoading } = useDocuments();
  const [documents, setDocuments] = useState<ProcessedDocument[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<DocumentCategory | undefined>(undefined);

  useEffect(() => {
    if (!isLoading && category) {
      const docs = getDocumentsByCategory(category);
      const info = categories.find(cat => cat.id === category || cat.name.toLowerCase() === category.toLowerCase());
      
      setDocuments(docs);
      setCategoryInfo(info);
    }
  }, [category, getDocumentsByCategory, categories, isLoading]);

  return {
    documents,
    categoryInfo,
    isLoading
  };
}

// Hook for search functionality
export function useSearch() {
  const { search, searchInCategory, searchByTags, getSuggestions, isSearching } = useDocuments();
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const performSearch = useCallback((query: string, category?: string, limit = 10) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = category 
      ? searchInCategory(query, category, limit)
      : search(query, limit);
    
    setSearchResults(results);
  }, [search, searchInCategory]);

  const updateSuggestions = useCallback((partialQuery: string) => {
    const newSuggestions = getSuggestions(partialQuery);
    setSuggestions(newSuggestions);
  }, [getSuggestions]);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setSuggestions([]);
  }, []);

  return {
    searchResults,
    searchQuery,
    suggestions,
    isSearching,
    performSearch,
    updateSuggestions,
    clearSearch,
    searchByTags
  };
}