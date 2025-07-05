'use client';

import { useState, useMemo } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { 
  BookOpenIcon, 
  ArrowLeftIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  Squares2X2Icon,
  ListBulletIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';

type ViewMode = 'grid' | 'list';
type SortOption = 'title' | 'category' | 'lastModified' | 'wordCount';

export default function KnowledgeBasePage() {
  const { documents, isLoading } = useDocuments();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('lastModified');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => {
    const categorySet = new Set(documents.map(doc => doc.metadata.category));
    return Array.from(categorySet).sort();
  }, [documents]);

  const tags = useMemo(() => {
    const tagSet = new Set<string>();
    documents.forEach(doc => {
      doc.metadata.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [documents]);

  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = documents;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(doc => 
        doc.metadata.title.toLowerCase().includes(query) ||
        doc.metadata.description?.toLowerCase().includes(query) ||
        doc.metadata.category.toLowerCase().includes(query) ||
        doc.metadata.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.metadata.category === selectedCategory);
    }

    // Apply tag filter
    if (selectedTag !== 'all') {
      filtered = filtered.filter(doc => doc.metadata.tags?.includes(selectedTag));
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.metadata.title.localeCompare(b.metadata.title);
        case 'category':
          return a.metadata.category.localeCompare(b.metadata.category);
        case 'lastModified':
          const dateA = a.metadata.lastModified ? new Date(a.metadata.lastModified).getTime() : 0;
          const dateB = b.metadata.lastModified ? new Date(b.metadata.lastModified).getTime() : 0;
          return dateB - dateA;
        case 'wordCount':
          return b.wordCount - a.wordCount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [documents, searchQuery, selectedCategory, selectedTag, sortBy]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
            <p className="mt-4 text-white/70">Loading knowledge base...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <BookOpenIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Knowledge Base</h1>
                <p className="text-white/70">Comprehensive repository of all knowledge resources</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
            {/* Search Bar */}
            <div className="relative mb-6">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/50" />
              <input
                type="text"
                placeholder="Search knowledge base..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            {/* Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
                >
                  <FunnelIcon className="h-4 w-4 mr-2" />
                  Filters
                </button>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="lastModified">Sort by Last Modified</option>
                  <option value="title">Sort by Title</option>
                  <option value="category">Sort by Category</option>
                  <option value="wordCount">Sort by Word Count</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <Squares2X2Icon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-purple-500 text-white' 
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Category</label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category} className="capitalize">
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Tag</label>
                    <select
                      value={selectedTag}
                      onChange={(e) => setSelectedTag(e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">All Tags</option>
                      {tags.map(tag => (
                        <option key={tag} value={tag}>
                          {tag}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-white/70">
            Showing {filteredAndSortedDocuments.length} of {documents.length} documents
          </p>
        </div>

        {/* Documents Grid/List */}
        {filteredAndSortedDocuments.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
          }>
            {filteredAndSortedDocuments.map((doc) => (
              <Link
                key={doc.id}
                href={`/document/${doc.id}`}
                className={`group block ${
                  viewMode === 'grid'
                    ? 'relative'
                    : 'relative'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-xl blur-xl group-hover:blur-2xl transition-all"></div>
                <div className={`relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 group-hover:bg-white/20 transition-all ${
                  viewMode === 'list' ? 'flex items-center space-x-6' : ''
                }`}>
                  {viewMode === 'grid' ? (
                    <>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                          <DocumentTextIcon className="h-6 w-6 text-purple-300" />
                        </div>
                        <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full capitalize">
                          {doc.metadata.category}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                        {doc.metadata.title}
                      </h3>
                      
                      {doc.metadata.description && (
                        <p className="text-white/70 text-sm mb-4 line-clamp-3">
                          {doc.metadata.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-white/60">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center">
                            <ClockIcon className="h-3 w-3 mr-1" />
                            {doc.wordCount} words
                          </span>
                          {doc.metadata.lastModified && (
                            <span className="flex items-center">
                              <CalendarIcon className="h-3 w-3 mr-1" />
                              {new Date(doc.metadata.lastModified).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {doc.metadata.tags && doc.metadata.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1">
                          {doc.metadata.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-full">
                              {tag}
                            </span>
                          ))}
                          {doc.metadata.tags.length > 3 && (
                            <span className="text-xs text-white/50">+{doc.metadata.tags.length - 3} more</span>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex-shrink-0">
                        <div className="p-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                          <DocumentTextIcon className="h-6 w-6 text-purple-300" />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors truncate">
                            {doc.metadata.title}
                          </h3>
                          <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded-full capitalize ml-4 flex-shrink-0">
                            {doc.metadata.category}
                          </span>
                        </div>
                        
                        {doc.metadata.description && (
                          <p className="text-white/70 text-sm mb-2 line-clamp-2">
                            {doc.metadata.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-xs text-white/60">
                            <span className="flex items-center">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {doc.wordCount} words
                            </span>
                            {doc.metadata.lastModified && (
                              <span className="flex items-center">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                {new Date(doc.metadata.lastModified).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          
                          {doc.metadata.tags && doc.metadata.tags.length > 0 && (
                            <div className="flex items-center space-x-1">
                              {doc.metadata.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-full">
                                  {tag}
                                </span>
                              ))}
                              {doc.metadata.tags.length > 2 && (
                                <span className="text-xs text-white/50">+{doc.metadata.tags.length - 2}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-600/10 to-gray-600/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
              <BookOpenIcon className="h-16 w-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No documents found</h3>
              <p className="text-white/70 mb-6">Try adjusting your search criteria or filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedTag('all');
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}