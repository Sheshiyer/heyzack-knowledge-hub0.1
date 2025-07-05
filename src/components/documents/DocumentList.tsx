'use client';

import React, { useState, useMemo } from 'react';
import { ProcessedDocument, DocumentCategory } from '@/types/document';
import { Clock, Calendar, Eye, FileText, Grid, List, Filter, SortAsc, SortDesc } from 'lucide-react';

interface DocumentListProps {
  documents: ProcessedDocument[];
  categories?: DocumentCategory[];
  onDocumentClick?: (document: ProcessedDocument) => void;
  showFilters?: boolean;
  defaultView?: 'grid' | 'list';
  title?: string;
}

type SortOption = 'title' | 'date' | 'readTime' | 'views' | 'category';
type SortDirection = 'asc' | 'desc';

export function DocumentList({ 
  documents, 
  categories = [], 
  onDocumentClick, 
  showFilters = true,
  defaultView = 'grid',
  title = 'Documents'
}: DocumentListProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>(defaultView);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Get all unique tags from documents
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    documents.forEach(doc => {
      if (doc.metadata.tags) {
        doc.metadata.tags.forEach(tag => tagSet.add(tag));
      }
    });
    return Array.from(tagSet).sort();
  }, [documents]);

  // Filter and sort documents
  const filteredAndSortedDocuments = useMemo(() => {
    let filtered = documents;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(doc => doc.metadata.category === selectedCategory);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
        filtered = filtered.filter(doc => 
          doc.metadata.tags && selectedTags.some(tag => doc.metadata.tags!.includes(tag))
        );
      }

    // Sort documents
    const sorted = [...filtered].sort((a, b) => {
      let aValue: string | number, bValue: string | number;

      switch (sortBy) {
        case 'title':
          aValue = a.metadata.title.toLowerCase();
          bValue = b.metadata.title.toLowerCase();
          break;
        case 'date':
          aValue = a.metadata.lastModified ? a.metadata.lastModified.getTime() : 0;
          bValue = b.metadata.lastModified ? b.metadata.lastModified.getTime() : 0;
          break;
        case 'readTime':
          aValue = a.metadata.readTime || 0;
          bValue = b.metadata.readTime || 0;
          break;
        case 'views':
          aValue = a.metadata.views || 0;
          bValue = b.metadata.views || 0;
          break;
        case 'category':
          aValue = a.metadata.category.toLowerCase();
          bValue = b.metadata.category.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [documents, selectedCategory, selectedTags, sortBy, sortDirection]);

  // const handleSortChange = (newSortBy: SortOption) => {
  //   if (sortBy === newSortBy) {
  //     setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  //   } else {
  //     setSortBy(newSortBy);
  //     setSortDirection('desc');
  //   }
  // };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedTags([]);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getCategoryInfo = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  const DocumentCard = ({ document }: { document: ProcessedDocument }) => {
    const categoryInfo = getCategoryInfo(document.metadata.category);
    
    return (
      <div
        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
        onClick={() => onDocumentClick?.(document)}
      >
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
            {document.metadata.title}
          </h3>
          {categoryInfo && (
            <span 
              className="px-2 py-1 text-xs rounded-full flex-shrink-0 ml-2"
              style={{ 
                backgroundColor: `${categoryInfo.color}20`, 
                color: categoryInfo.color 
              }}
            >
              {categoryInfo.name}
            </span>
          )}
        </div>
        
        {document.metadata.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
            {document.metadata.description}
          </p>
        )}
        
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {document.metadata.lastModified ? formatDate(document.metadata.lastModified) : 'Unknown'}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {document.metadata.readTime || 5} min
          </span>
          <span className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {document.metadata.views || 0}
          </span>
        </div>
        
        {document.metadata.tags && document.metadata.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {document.metadata.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {document.metadata.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded">
                +{document.metadata.tags.length - 3}
              </span>
            )}
          </div>
        )}
        
        {document.mermaidDiagrams.length > 0 && (
          <div className="mt-2 text-xs text-blue-600">
            📊 Contains {document.mermaidDiagrams.length} diagram{document.mermaidDiagrams.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
    );
  };

  const DocumentListItem = ({ document }: { document: ProcessedDocument }) => {
    const categoryInfo = getCategoryInfo(document.metadata.category);
    
    return (
      <div
        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
        onClick={() => onDocumentClick?.(document)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="font-semibold text-gray-900 text-lg">
                {document.metadata.title}
              </h3>
              {categoryInfo && (
                <span 
                  className="px-2 py-1 text-xs rounded-full"
                  style={{ 
                    backgroundColor: `${categoryInfo.color}20`, 
                    color: categoryInfo.color 
                  }}
                >
                  {categoryInfo.name}
                </span>
              )}
            </div>
            
            {document.metadata.description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {document.metadata.description}
              </p>
            )}
            
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {document.metadata.lastModified ? formatDate(document.metadata.lastModified) : 'Unknown'}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {document.metadata.readTime || 5} min read
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {document.metadata.views || 0} views
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {document.metadata.wordCount || 0} words
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2 ml-4">
            {document.metadata.tags && document.metadata.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-end">
                {document.metadata.tags.slice(0, 4).map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
            
            {document.mermaidDiagrams.length > 0 && (
              <div className="text-xs text-blue-600">
                📊 {document.mermaidDiagrams.length} diagram{document.mermaidDiagrams.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">
            {filteredAndSortedDocuments.length} of {documents.length} documents
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          
          {/* Filters Toggle */}
          {showFilters && (
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                showFiltersPanel || selectedCategory || selectedTags.length > 0
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {(selectedCategory || selectedTags.length > 0) && (
                <span className="bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {(selectedCategory ? 1 : 0) + selectedTags.length}
                </span>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && showFiltersPanel && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.documentCount})
                  </option>
                ))}
              </select>
            </div>
            
            {/* Sort Options */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort by
              </label>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="date">Date modified</option>
                  <option value="title">Title</option>
                  <option value="readTime">Read time</option>
                  <option value="views">Views</option>
                  <option value="category">Category</option>
                </select>
                <button
                  onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          
          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      setSelectedTags(prev => 
                        prev.includes(tag) 
                          ? prev.filter(t => t !== tag)
                          : [...prev, tag]
                      );
                    }}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Clear Filters */}
          {(selectedCategory || selectedTags.length > 0) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* Documents */}
      {filteredAndSortedDocuments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
          <p className="text-gray-600">
            {selectedCategory || selectedTags.length > 0 
              ? 'Try adjusting your filters to see more results.'
              : 'No documents are available in this collection.'
            }
          </p>
        </div>
      ) : (
        <div className={`${
          viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }`}>
          {filteredAndSortedDocuments.map((document) => 
            viewMode === 'grid' ? (
              <DocumentCard key={document.id} document={document} />
            ) : (
              <DocumentListItem key={document.id} document={document} />
            )
          )}
        </div>
      )}
    </div>
  );
}