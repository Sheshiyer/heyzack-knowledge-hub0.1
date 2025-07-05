'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ProcessedDocument } from '@/types/document';
import { Clock, Tag, Calendar, Eye, FileText, Share2, Download, Bookmark } from 'lucide-react';
import mermaid from 'mermaid';

interface DocumentViewerProps {
  document: ProcessedDocument;
  relatedDocuments?: ProcessedDocument[];
  onDocumentClick?: (document: ProcessedDocument) => void;
}

export function DocumentViewer({ document, relatedDocuments = [], onDocumentClick }: DocumentViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [viewCount, setViewCount] = useState(document.metadata.views || 0);

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 14,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis'
      },
      sequence: {
        useMaxWidth: true,
        wrap: true
      },
      gantt: {
        useMaxWidth: true
      }
    });
  }, []);

  // Render Mermaid diagrams
  useEffect(() => {
    if (contentRef.current && document.mermaidDiagrams && document.mermaidDiagrams.length > 0) {
      const renderDiagrams = async () => {
        const mermaidElements = contentRef.current?.querySelectorAll('.language-mermaid');
        if (mermaidElements) {
          for (let i = 0; i < mermaidElements.length; i++) {
            const element = mermaidElements[i] as HTMLElement;
            const diagramId = `mermaid-${document.id}-${i}`;
            
            try {
              const code = element.textContent || '';
              const { svg } = await mermaid.render(diagramId, code);
              if (typeof window !== 'undefined') {
                const wrapper = window.document.createElement('div');
                wrapper.innerHTML = svg;
                if (wrapper.firstChild) {
                  element.replaceWith(wrapper.firstChild);
                }
              }
            } catch (error) {
              console.error('Error rendering Mermaid diagram:', error);
              const errorDiv = window.document.createElement('div');
              errorDiv.className = 'text-red-500 p-4 border border-red-200 rounded';
              errorDiv.textContent = `Error rendering diagram: ${error}`;
              element.replaceWith(errorDiv);
            }
          }
        }
      };

      renderDiagrams();
    }
  }, [document]);

  // Track view count
  useEffect(() => {
    // Simulate view tracking
    const timer = setTimeout(() => {
      setViewCount(prev => prev + 1);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.metadata.title,
          text: document.metadata.description,
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
    const blob = new Blob([document.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = window.document.createElement('a');
    a.href = url;
    a.download = `${document.metadata.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    window.document.body.appendChild(a);
    a.click();
    window.document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Document Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {document.metadata.title}
            </h1>
            {document.metadata.description && (
              <p className="text-lg text-gray-600 mb-4">
                {document.metadata.description}
              </p>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked 
                  ? 'bg-blue-100 text-blue-600' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title="Bookmark"
            >
              <Bookmark className="w-5 h-5" />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              title="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Metadata */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Updated {document.metadata.lastModified ? formatDate(document.metadata.lastModified) : 'Unknown'}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{document.metadata.readTime || 5} min read</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-4 h-4" />
            <span>{viewCount} views</span>
          </div>
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4" />
            <span>{document.metadata.wordCount || 0} words</span>
          </div>
        </div>

        {/* Tags */}
        {document.metadata.tags && document.metadata.tags.length > 0 && (
          <div className="flex items-center gap-2 mt-4">
            <Tag className="w-4 h-4 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {document.metadata.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Document Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div 
          ref={contentRef}
          className="prose prose-lg max-w-none p-6"
          dangerouslySetInnerHTML={{ __html: document.htmlContent || '' }}
        />
      </div>

      {/* Related Documents */}
      {relatedDocuments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Related Documents
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {relatedDocuments.map((relatedDoc) => (
              <div
                key={relatedDoc.id}
                className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all cursor-pointer"
                onClick={() => onDocumentClick?.(relatedDoc)}
              >
                <h4 className="font-medium text-gray-900 mb-1">
                  {relatedDoc.metadata.title}
                </h4>
                {relatedDoc.metadata.description && (
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                    {relatedDoc.metadata.description}
                  </p>
                )}
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {relatedDoc.metadata.readTime} min
                  </span>
                  <span className="capitalize">
                    {relatedDoc.metadata.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Styles for Mermaid diagrams
const mermaidStyles = `
  .mermaid {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
  }
  
  .mermaid-rendered {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 1rem;
  }
  
  .mermaid svg {
    max-width: 100%;
    height: auto;
  }
`;

// Inject styles
if (typeof window !== 'undefined') {
  const styleElement = window.document.createElement('style');
  styleElement.textContent = mermaidStyles;
  window.document.head.appendChild(styleElement);
}