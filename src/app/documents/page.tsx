'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { DocumentService, SimpleDocument } from '@/lib/document-service';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  DocumentTextIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  TagIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<SimpleDocument[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<SimpleDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'category'>('date');
  const [showFilters, setShowFilters] = useState(false);

  // Load documents on mount
  useEffect(() => {
    async function loadDocuments() {
      try {
        setIsLoading(true);
        setError(null);
        
        const documentService = DocumentService.getInstance();
        await documentService.initialize();
        
        const allDocs = documentService.getAllDocuments();
        setDocuments(allDocs);
        setFilteredDocuments(allDocs);
      } catch (err) {
        console.error('Failed to load documents:', err);
        setError('Failed to load documents');
      } finally {
        setIsLoading(false);
      }
    }

    loadDocuments();
  }, []);

  // Filter documents when search or filters change
  useEffect(() => {
    let filtered = documents;

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.title.toLowerCase().includes(query) ||
        doc.content.toLowerCase().includes(query) ||
        doc.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'date':
          return b.lastModified.getTime() - a.lastModified.getTime();
        case 'category':
          return a.category.localeCompare(b.category);
        default:
          return 0;
      }
    });

    setFilteredDocuments(filtered);
  }, [documents, selectedCategory, searchQuery, sortBy]);

  const categories = React.useMemo(() => {
    const categorySet = new Set(documents.map(doc => doc.category));
    return Array.from(categorySet).sort();
  }, [documents]);

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('date');
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
            <p className="mt-4 text-white/70">Loading documents...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <DocumentTextIcon className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Error Loading Documents</h1>
            <p className="text-white/70 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Documents</h1>
            <p className="text-white/60">
              Browse and search through {documents.length} documents across {categories.length} categories
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Badge variant="primary">
              {filteredDocuments.length} documents
            </Badge>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                showFilters 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              <FunnelIcon className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <Card variant="glass" className="p-4">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search documents, content, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
            />
          </div>
        </Card>

        {/* Filters */}
        {showFilters && (
          <Card variant="glass" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-white font-medium mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-white font-medium mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'title' | 'date' | 'category')}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-white/40"
                >
                  <option value="date">Last Modified</option>
                  <option value="title">Title</option>
                  <option value="category">Category</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </Card>
        )}

        {/* Active Filters */}
        {(selectedCategory !== 'all' || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-white/60 text-sm">Active filters:</span>
            {selectedCategory !== 'all' && (
              <Badge variant="primary" className="flex items-center space-x-1">
                <span>Category: {selectedCategory.replace('-', ' ')}</span>
                <button 
                  onClick={() => setSelectedCategory('all')}
                  className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            {searchQuery && (
              <Badge variant="glass" className="flex items-center space-x-1">
                <MagnifyingGlassIcon className="w-3 h-3" />
                <span>&quot;{searchQuery}&quot;</span>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            )}
            <button
              onClick={clearFilters}
              className="text-purple-400 hover:text-purple-300 text-sm underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Documents Grid */}
        {filteredDocuments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <Link key={document.id} href={`/document/${document.id}`}>
                <Card variant="glass" className="p-6 hover:bg-white/10 transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-purple-300 transition-colors">
                        {document.title}
                      </h3>
                      <Badge variant="glass" size="sm">
                        {document.category.replace('-', ' ')}
                      </Badge>
                    </div>
                    <DocumentTextIcon className="w-6 h-6 text-white/40 group-hover:text-white/60 transition-colors" />
                  </div>
                  
                  <p className="text-white/60 text-sm mb-4 line-clamp-3">
                    {document.content.substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{formatDate(document.lastModified)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-3 h-3" />
                        <span>{document.readingTime} min</span>
                      </div>
                    </div>
                    
                    {document.tags.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <TagIcon className="w-3 h-3" />
                        <span>{document.tags.length} tags</span>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card variant="glass" className="text-center py-12">
            <DocumentTextIcon className="h-16 w-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No documents found</h3>
            <p className="text-white/60 mb-4">
              {searchQuery || selectedCategory !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'No documents are available at the moment'}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            )}
          </Card>
        )}
      </div>
    </AppLayout>
  );
}