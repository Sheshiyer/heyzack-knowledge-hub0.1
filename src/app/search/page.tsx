'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DocumentService, SimpleDocument } from '@/lib/document-service';
import {
  MagnifyingGlassIcon,
  DocumentTextIcon,
  FolderIcon,
  TagIcon,
  ArrowRightIcon,
  ClockIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SimpleDocument[]>([]);
  const [allDocuments, setAllDocuments] = useState<SimpleDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; category: string }>>([]);

  useEffect(() => {
    async function loadDocuments() {
      try {
        const documentService = DocumentService.getInstance();
        await documentService.initialize();
        const docs = documentService.getAllDocuments();
        const availableCategories = documentService.getAvailableCategories();
        
        setAllDocuments(docs);
        setSearchResults(docs.slice(0, 10)); // Show first 10 documents initially
        
        // Add "All Documents" option and map available categories
        const categoryOptions = [
          { id: 'all', name: 'All Documents', category: 'all' },
          ...availableCategories.map(cat => ({
            id: cat.category,
            name: cat.displayName,
            category: cat.category
          }))
        ];
        setCategories(categoryOptions);
      } catch (error) {
        console.error('Failed to load documents:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDocuments();
    
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = (term: string) => {
    if (!term.trim()) {
      setSearchResults(allDocuments.slice(0, 10));
      return;
    }

    const documentService = DocumentService.getInstance();
    const results = documentService.searchDocuments(term);
    
    // Filter by category if selected
    const filteredResults = selectedCategory === 'all' 
      ? results 
      : results.filter(doc => doc.category === selectedCategory);
    
    setSearchResults(filteredResults);
    
    // Add to recent searches
    const newRecentSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (searchTerm) {
      handleSearch(searchTerm);
    } else {
      if (categoryId === 'all') {
        setSearchResults(allDocuments.slice(0, 10));
      } else {
        const filtered = allDocuments.filter(doc => doc.category === categoryId);
        setSearchResults(filtered);
      }
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const formatReadingTime = (minutes: number) => {
    return minutes < 1 ? '< 1 min' : `${Math.round(minutes)} min`;
  };

  const getDocumentIcon = (path: string) => {
    if (path.includes('01_Foundation')) return FolderIcon;
    if (path.includes('02_Campaign_Core')) return DocumentTextIcon;
    if (path.includes('09_Strategic_Analysis')) return TagIcon;
    return DocumentTextIcon;
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-white/5 rounded w-1/2"></div>
          </div>
          <div className="h-20 bg-white/5 rounded-xl animate-pulse"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-white/5 rounded-xl animate-pulse"></div>
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="h-48 bg-white/5 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Search</h1>
            <p className="text-white/60">Find documents, categories, and content across the knowledge base</p>
          </div>
          <Badge variant="primary" className="flex items-center space-x-2">
            <MagnifyingGlassIcon className="w-4 h-4" />
            <span>Search Hub</span>
          </Badge>
        </div>

        {/* Search Interface */}
        <Card variant="glass" className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  handleSearch(e.target.value);
                }}
                placeholder="Search documents, categories, or topics..."
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.slice(0, 6).map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white/80'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Search Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card variant="glass" className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold">Search Results</h3>
                <Badge variant="glass" className="text-xs">
                  {searchResults.length} documents
                </Badge>
              </div>
              
              {searchResults.length > 0 ? (
                <div className="space-y-4">
                  {searchResults.map((doc) => {
                    const Icon = getDocumentIcon(doc.path);
                    
                    return (
                      <Link key={doc.id} href={`/document/${doc.id}`}>
                        <div className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-all duration-200 cursor-pointer group">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 rounded-lg bg-purple-500/20">
                              <Icon className="w-4 h-4 text-purple-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-medium group-hover:text-purple-300 transition-colors">
                                {doc.title}
                              </h4>
                              <div className="flex items-center space-x-4 text-xs text-white/50 mt-1 mb-2">
                                <div className="flex items-center space-x-1">
                                  <ClockIcon className="w-3 h-3" />
                                  <span>{formatReadingTime(doc.readingTime)}</span>
                                </div>
                                <div>{doc.wordCount} words</div>
                                <div className="capitalize">{doc.category.replace(/\d+_/, '').replace(/_/g, ' ')}</div>
                              </div>
                              {doc.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {doc.tags.slice(0, 3).map((tag, tagIndex) => (
                                    <Badge key={tagIndex} variant="glass" className="text-xs px-2 py-0.5">
                                      {tag}
                                    </Badge>
                                  ))}
                                  {doc.tags.length > 3 && (
                                    <Badge variant="glass" className="text-xs px-2 py-0.5">
                                      +{doc.tags.length - 3}
                                    </Badge>
                                  )}
                                </div>
                              )}
                            </div>
                            <ArrowRightIcon className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <MagnifyingGlassIcon className="w-16 h-16 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">
                    {searchTerm ? `No documents found for "${searchTerm}"` : 'Enter a search term to find relevant documents'}
                  </p>
                </div>
              )}
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card variant="glass" className="p-6">
              <h3 className="text-white font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryFilter(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-purple-600/20 text-purple-300'
                        : 'hover:bg-white/5 text-white/80'
                    }`}
                  >
                    <div className="text-sm">{category.name}</div>
                  </button>
                ))}
              </div>
            </Card>
            
            {recentSearches.length > 0 && (
              <Card variant="glass" className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Recent Searches</h3>
                  <button
                    onClick={clearRecentSearches}
                    className="text-white/40 hover:text-white/80 transition-colors"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchTerm(search);
                        handleSearch(search);
                      }}
                      className="w-full text-left px-3 py-2 text-white/60 hover:text-white/80 hover:bg-white/5 rounded-lg transition-colors text-sm"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}