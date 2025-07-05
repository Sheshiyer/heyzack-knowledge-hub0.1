'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DocumentTextIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { DocumentService, SimpleDocument } from '@/lib/document-service';

// Category color mapping
const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'foundation': 'from-purple-500 to-pink-500',
    'campaign-core': 'from-blue-500 to-cyan-500',
    'email-marketing': 'from-green-500 to-emerald-500',
    'advertising': 'from-yellow-500 to-orange-500',
    'visual-assets': 'from-orange-500 to-red-500',
    'supporting-materials': 'from-teal-500 to-cyan-500',
    'project-management': 'from-indigo-500 to-blue-500',
    'templates-master': 'from-pink-500 to-rose-500',
    'strategic-analysis': 'from-indigo-500 to-purple-500',
    'reference-materials': 'from-gray-500 to-slate-500',
    'general': 'from-gray-400 to-gray-600'
  };
  return colorMap[category] || 'from-gray-400 to-gray-600';
};

// Format relative time
const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return date.toLocaleDateString();
};

// Generate excerpt from content
const generateExcerpt = (content: string, maxLength: number = 150): string => {
  // Remove markdown syntax
  const cleanContent = content
    .replace(/#{1,6}\s+/g, '') // Remove headings
    .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.+?)\*/g, '$1') // Remove italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`(.+?)`/g, '$1') // Remove inline code
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim();
  
  if (cleanContent.length <= maxLength) return cleanContent;
  return cleanContent.substring(0, maxLength).trim() + '...';
};

interface DocumentCardProps {
  document: SimpleDocument;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document }) => {
  const categoryColor = getCategoryColor(document.category);
  const relativeTime = formatRelativeTime(document.lastModified);
  const excerpt = generateExcerpt(document.content);
  const displayCategory = document.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return (
    <Link href={`/document/${document.id}`}>
      <Card 
        variant="glass" 
        className="group cursor-pointer transition-all duration-300 hover:scale-[1.01] p-6"
        hover
      >
        <div className="flex items-start space-x-6">
          {/* Document Icon */}
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${categoryColor} bg-opacity-20 flex-shrink-0`}>
            <DocumentTextIcon className="w-8 h-8 text-white" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-bold text-xl mb-3 group-hover:text-white transition-colors line-clamp-2">
                  {document.title}
                </h3>
                <div className="flex items-center space-x-4 mb-3">
                  <Badge 
                    variant="glass" 
                    size="sm"
                    className={`bg-gradient-to-r ${categoryColor} bg-opacity-20 flex-shrink-0`}
                  >
                    {displayCategory}
                  </Badge>
                  <span className="text-white/60 text-sm font-medium">{document.wordCount} words • {document.readingTime} min read</span>
                </div>
              </div>
              
              <ArrowRightIcon className="w-6 h-6 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all flex-shrink-0 ml-4" />
            </div>
            
            {/* Excerpt */}
            <p className="text-white/70 text-base leading-relaxed mb-4 line-clamp-2">
              {excerpt}
            </p>
            
            {/* Footer */}
            <div className="flex items-center space-x-6 text-white/60 text-sm pt-3 border-t border-white/10">
              <div className="flex items-center space-x-2">
                <ClockIcon className="w-4 h-4" />
                <span>{relativeTime}</span>
              </div>
              {document.tags.length > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-white/40">•</span>
                  <span>{document.tags.slice(0, 2).join(', ')}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export const RecentDocs: React.FC = () => {
  const [documents, setDocuments] = useState<SimpleDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadRecentDocuments() {
      try {
        setIsLoading(true);
        setError(null);
        
        const documentService = DocumentService.getInstance();
        await documentService.initialize();
        
        const allDocs = documentService.getAllDocuments();
        // Sort by last modified date and take the 5 most recent
        const recentDocs = allDocs
          .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
          .slice(0, 5);
        
        setDocuments(recentDocs);
      } catch (err) {
        console.error('Failed to load recent documents:', err);
        setError('Failed to load recent documents');
      } finally {
        setIsLoading(false);
      }
    }

    loadRecentDocuments();
  }, []);

  if (isLoading) {
    return (
      <div>
        <div className="text-center mb-8">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Recent Documents</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">Recently viewed and updated documents from across all knowledge areas</p>
        </div>
        
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} variant="glass" className="p-6 animate-pulse">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-6 bg-white/10 rounded mb-3 w-3/4"></div>
                  <div className="h-4 bg-white/10 rounded mb-4 w-1/2"></div>
                  <div className="h-4 bg-white/10 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-white/10 rounded w-2/3"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="text-center mb-8">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Recent Documents</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">Recently viewed and updated documents from across all knowledge areas</p>
        </div>
        
        <Card variant="glass" className="p-8 text-center">
          <DocumentTextIcon className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-white/70 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Try Again
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Recent Documents</h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          {documents.length > 0 
            ? `Recently updated documents from across all knowledge areas`
            : 'No documents available'
          }
        </p>
      </div>
      
      {documents.length > 0 ? (
        <>
          <div className="space-y-6">
            {documents.map((document) => (
              <DocumentCard key={document.id} document={document} />
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link href="/documents">
              <Badge variant="primary" className="cursor-pointer hover:opacity-90 px-6 py-3 text-base">
                View All Documents
              </Badge>
            </Link>
          </div>
        </>
      ) : (
        <Card variant="glass" className="p-8 text-center">
          <DocumentTextIcon className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <p className="text-white/70 mb-4">No documents found</p>
          <Link href="/documents">
            <Badge variant="primary" className="cursor-pointer hover:opacity-90 px-4 py-2">
              Browse Documents
            </Badge>
          </Link>
        </Card>
      )}
    </div>
  );
};

export default RecentDocs;