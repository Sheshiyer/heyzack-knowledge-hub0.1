'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ProcessedDocument } from '@/types/document';
import { 
  ChevronRightIcon,
  Bars3Icon,
  XMarkIcon,
  BookmarkIcon,
  ShareIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  ClockIcon,
  DocumentTextIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { MermaidRenderer } from './MermaidRenderer';
import 'highlight.js/styles/github.css';

interface TableOfContentsItem {
  id: string;
  text: string;
  level: number;
  anchor: string;
}

interface EnhancedDocumentViewerProps {
  document: ProcessedDocument;
  content: string;
  relatedDocuments?: ProcessedDocument[];
  onDocumentClick?: (document: ProcessedDocument) => void;
}

export function EnhancedDocumentViewer({ 
  document, 
  content, 
  relatedDocuments = [], 
  onDocumentClick 
}: EnhancedDocumentViewerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [viewCount, setViewCount] = useState(document.metadata.views || 0);
  const contentRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Extract table of contents from content
  const tableOfContents = useMemo(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: TableOfContentsItem[] = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const anchor = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      headings.push({
        id: `heading-${headings.length}`,
        text,
        level,
        anchor
      });
    }
    
    return headings;
  }, [content]);

  // Set up intersection observer for active section tracking
  useEffect(() => {
    if (!contentRef.current) return;

    const headingElements = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
    
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const headingText = entry.target.textContent || '';
            const anchor = headingText
              .toLowerCase()
              .replace(/[^a-z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .replace(/-+/g, '-')
              .replace(/^-|-$/g, '');
            setActiveSection(anchor);
          }
        });
      },
      {
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
      }
    );

    headingElements.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [content]);

  // Track view count
  useEffect(() => {
    const timer = setTimeout(() => {
      setViewCount(prev => prev + 1);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToSection = (anchor: string) => {
    const element = window.document.getElementById(anchor);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle body scroll lock when sidebar is open on mobile
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (sidebarOpen && window.innerWidth < 768) {
        window.document.body.style.overflow = 'hidden';
      } else {
        window.document.body.style.overflow = 'unset';
      }
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.document.body.style.overflow = 'unset';
      }
    };
  }, [sidebarOpen]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.metadata.title,
          text: document.metadata.description || 'Check out this document',
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.metadata.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(dateObj);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Collapsible Sidebar */}
      <div className={`${sidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden bg-white/80 backdrop-blur-xl border-r border-white/20 flex flex-col shadow-lg`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/20 bg-gradient-to-r from-blue-50/50 to-purple-50/50 flex items-center justify-between">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Table of Contents</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Table of Contents */}
        <div className="flex-1 overflow-y-auto p-4">
          {tableOfContents.length > 0 ? (
            <nav className="space-y-1">
              {tableOfContents.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.anchor)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                    activeSection === item.anchor
                      ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-700 border-l-2 border-blue-500 backdrop-blur-sm'
                      : 'text-gray-700 hover:bg-white/50 hover:backdrop-blur-sm'
                  }`}
                  style={{ paddingLeft: `${(item.level - 1) * 12 + 12}px` }}
                >
                  {item.text}
                </button>
              ))}
            </nav>
          ) : (
            <p className="text-gray-500/80 text-sm">No headings found in this document.</p>
          )}
        </div>

        {/* Related Documents */}
        {relatedDocuments.length > 0 && (
          <div className="border-t border-white/20 p-4 bg-gradient-to-b from-transparent to-gray-50/50">
            <h3 className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">Related Documents</h3>
            <div className="space-y-2">
              {relatedDocuments.slice(0, 3).map((relatedDoc) => (
                <button
                  key={relatedDoc.id}
                  onClick={() => onDocumentClick?.(relatedDoc)}
                  className="w-full text-left p-2 rounded-md hover:bg-white/50 hover:backdrop-blur-sm transition-all duration-200"
                >
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {relatedDoc.metadata.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {relatedDoc.metadata.category}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-white/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!sidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Bars3Icon className="w-5 h-5 text-gray-500" />
                </button>
              )}
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{document.metadata.title}</h1>
                {document.metadata.description && (
                  <p className="text-gray-600/80 mt-1">{document.metadata.description}</p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  isBookmarked 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-600 backdrop-blur-sm' 
                    : 'bg-white/50 text-gray-600 hover:bg-white/80 backdrop-blur-sm'
                }`}
                title="Bookmark"
              >
                {isBookmarked ? (
                  <BookmarkSolidIcon className="w-5 h-5" />
                ) : (
                  <BookmarkIcon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg bg-white/50 text-gray-600 hover:bg-white/80 backdrop-blur-sm transition-all duration-200"
                title="Share"
              >
                <ShareIcon className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownload}
                className="p-2 rounded-lg bg-white/50 text-gray-600 hover:bg-white/80 backdrop-blur-sm transition-all duration-200"
                title="Download"
              >
                <ArrowDownTrayIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Document Metadata */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500/80">
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              <span>Updated {document.metadata.lastModified ? formatDate(document.metadata.lastModified) : 'Unknown'}</span>
            </div>
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4" />
              <span>{document.metadata.readTime || 5} min read</span>
            </div>
            <div className="flex items-center gap-1">
              <EyeIcon className="w-4 h-4" />
              <span>{viewCount} views</span>
            </div>
            <div className="flex items-center gap-1">
              <DocumentTextIcon className="w-4 h-4" />
              <span>{document.metadata.wordCount || 0} words</span>
            </div>
          </div>

          {/* Tags */}
          {document.metadata.tags && document.metadata.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-3">
              <TagIcon className="w-4 h-4 text-gray-400" />
              <div className="flex flex-wrap gap-2">
                {document.metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-800 text-xs rounded-full backdrop-blur-sm border border-blue-200/50"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Document Content */}
        <div className="flex-1 overflow-y-auto bg-gradient-to-br from-blue-50/30 to-purple-50/30">
          <div className="max-w-4xl mx-auto px-6 py-8">
            <div className="bg-white/80 backdrop-blur-xl rounded-lg shadow-lg border border-white/20">
              <div ref={contentRef} className="prose prose-lg max-w-none p-8">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight, rehypeRaw]}
                  components={{
                    h1: ({ children }) => {
                      const text = children?.toString() || '';
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                      return (
                        <h1 id={id} className="text-3xl font-bold text-gray-900 mb-6 scroll-mt-20">
                          {children}
                        </h1>
                      );
                    },
                    h2: ({ children }) => {
                      const text = children?.toString() || '';
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                      return (
                        <h2 id={id} className="text-2xl font-semibold text-gray-900 mt-8 mb-4 scroll-mt-20">
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children }) => {
                      const text = children?.toString() || '';
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                      return (
                        <h3 id={id} className="text-xl font-semibold text-gray-900 mt-6 mb-3 scroll-mt-20">
                          {children}
                        </h3>
                      );
                    },
                    h4: ({ children }) => {
                      const text = children?.toString() || '';
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                      return (
                        <h4 id={id} className="text-lg font-semibold text-gray-900 mt-5 mb-2 scroll-mt-20">
                          {children}
                        </h4>
                      );
                    },
                    h5: ({ children }) => {
                      const text = children?.toString() || '';
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                      return (
                        <h5 id={id} className="text-base font-semibold text-gray-900 mt-4 mb-2 scroll-mt-20">
                          {children}
                        </h5>
                      );
                    },
                    h6: ({ children }) => {
                      const text = children?.toString() || '';
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                      return (
                        <h6 id={id} className="text-sm font-semibold text-gray-900 mt-3 mb-2 scroll-mt-20">
                          {children}
                        </h6>
                      );
                    },
                    p: ({ children }) => <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>,
                    ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
                    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
                    li: ({ children }) => <li className="text-gray-700">{children}</li>,
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 text-gray-700 italic">
                        {children}
                      </blockquote>
                    ),
                    code: ({ className, children }) => {
                      const isInline = !className?.includes('language-');
                      const match = /language-(\w+)/.exec(className || '');
                      const language = match ? match[1] : '';
                      
                      if (!isInline && language === 'mermaid') {
                        return (
                          <MermaidRenderer 
                            chart={String(children).replace(/\n$/, '')} 
                            className="my-6"
                          />
                        );
                      }
                      
                      return isInline ? (
                        <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">
                          {children}
                        </code>
                      ) : (
                        <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
                          {children}
                        </code>
                      );
                    },
                    table: ({ children }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="min-w-full divide-y divide-gray-200">{children}</table>
                      </div>
                    ),
                    thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
                    th: ({ children }) => (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {children}
                      </th>
                    ),
                    td: ({ children }) => <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{children}</td>,
                  }}
                >
                  {content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Toggle Button (when closed) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-xl border border-white/20 rounded-full p-2 shadow-lg hover:shadow-xl transition-all z-10 hover:bg-white/90"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-600" />
        </button>
      )}
    </div>
  );
}