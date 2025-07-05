'use client';

import React, { useState } from 'react';
import { SimpleDocument } from '@/lib/document-service';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeftIcon,
  ClockIcon,
  DocumentTextIcon,
  TagIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';


interface SimpleDocumentReaderProps {
  document: SimpleDocument;
  onBack?: () => void;
}

export function SimpleDocumentReader({ document, onBack }: SimpleDocumentReaderProps) {
  const [activeSection, setActiveSection] = useState<string>('');

  // Extract headings for table of contents
  const headings = React.useMemo(() => {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: Array<{ level: number; text: string; id: string }> = [];
    let match;
    
    while ((match = headingRegex.exec(document.content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      headings.push({ level, text, id });
    }
    
    return headings;
  }, [document.content]);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const scrollToSection = (id: string) => {
      const element = window.document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setActiveSection(id);
      }
    };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex">
        {/* Sidebar - Table of Contents */}
        <div className="w-80 bg-white/5 backdrop-blur-xl border-r border-white/10 h-screen overflow-y-auto fixed left-0 top-0 z-10">
          <div className="p-6">
            {/* Back Button */}
            {onBack && (
              <button
                onClick={onBack}
                className="flex items-center space-x-2 text-white/70 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                <span>Back to Documents</span>
              </button>
            )}

            {/* Document Info */}
            <div className="mb-6">
              <h2 className="text-white font-semibold text-lg mb-2">{document.title}</h2>
              <div className="space-y-2 text-sm text-white/60">
                <div className="flex items-center space-x-2">
                  <CalendarIcon className="w-4 h-4" />
                  <span>{formatDate(document.lastModified)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-4 h-4" />
                  <span>{document.readingTime} min read</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DocumentTextIcon className="w-4 h-4" />
                  <span>{document.wordCount} words</span>
                </div>
              </div>
              
              {/* Category Badge */}
              <div className="mt-3">
                <Badge variant="glass" size="sm">
                  {document.category.replace('-', ' ')}
                </Badge>
              </div>

              {/* Tags */}
              {document.tags.length > 0 && (
                <div className="mt-3">
                  <div className="flex items-center space-x-1 mb-2">
                    <TagIcon className="w-4 h-4 text-white/60" />
                    <span className="text-white/60 text-sm">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {document.tags.map((tag, index) => (
                      <Badge key={index} variant="glass" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Table of Contents */}
            {headings.length > 0 && (
              <div>
                <h3 className="text-white font-medium mb-3">Table of Contents</h3>
                <nav className="space-y-1">
                  {headings.map((heading, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(heading.id)}
                      className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === heading.id
                          ? 'bg-white/10 text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                      style={{ paddingLeft: `${(heading.level - 1) * 12 + 12}px` }}
                    >
                      {heading.text}
                    </button>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto ml-80">
          <div className="max-w-4xl mx-auto p-8">
            <Card variant="glass" className="p-8">
              {/* Document Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-4">{document.title}</h1>
                <div className="flex items-center space-x-6 text-white/60">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4" />
                    <span>Updated {formatDate(document.lastModified)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ClockIcon className="w-4 h-4" />
                    <span>{document.readingTime} min read</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DocumentTextIcon className="w-4 h-4" />
                    <span>{document.wordCount} words</span>
                  </div>
                </div>
              </div>

              {/* Document Content */}
              <div className="prose prose-invert prose-lg max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children, ...props }) => {
                      const text = children?.toString() || '';
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                      return (
                        <h1 id={id} className="text-3xl font-bold text-white mb-6 mt-8" {...props}>
                          {children}
                        </h1>
                      );
                    },
                    h2: ({ children, ...props }) => {
                      const text = children?.toString() || '';
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                      return (
                        <h2 id={id} className="text-2xl font-semibold text-white mb-4 mt-6" {...props}>
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children, ...props }) => {
                      const text = children?.toString() || '';
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                      return (
                        <h3 id={id} className="text-xl font-semibold text-white mb-3 mt-5" {...props}>
                          {children}
                        </h3>
                      );
                    },
                    h4: ({ children, ...props }) => {
                      const text = children?.toString() || '';
                      const id = text
                        .toLowerCase()
                        .replace(/[^a-z0-9\s-]/g, '')
                        .replace(/\s+/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                      return (
                        <h4 id={id} className="text-lg font-semibold text-white mb-2 mt-4" {...props}>
                          {children}
                        </h4>
                      );
                    },
                    p: ({ children, ...props }) => (
                      <p className="text-white/80 mb-4 leading-relaxed" {...props}>
                        {children}
                      </p>
                    ),
                    ul: ({ children, ...props }) => (
                      <ul className="text-white/80 mb-4 space-y-2" {...props}>
                        {children}
                      </ul>
                    ),
                    ol: ({ children, ...props }) => (
                      <ol className="text-white/80 mb-4 space-y-2" {...props}>
                        {children}
                      </ol>
                    ),
                    li: ({ children, ...props }) => (
                      <li className="text-white/80" {...props}>
                        {children}
                      </li>
                    ),
                    blockquote: ({ children, ...props }) => (
                      <blockquote className="border-l-4 border-purple-400 pl-4 py-2 bg-white/5 rounded-r-lg mb-4" {...props}>
                        {children}
                      </blockquote>
                    ),
                    code: ({ children, ...props }) => (
                      <code className="bg-white/10 px-2 py-1 rounded text-purple-300 text-sm" {...props}>
                        {children}
                      </code>
                    ),
                    pre: ({ children, ...props }) => (
                      <pre className="bg-white/5 p-4 rounded-lg overflow-x-auto mb-4" {...props}>
                        {children}
                      </pre>
                    ),
                    table: ({ children, ...props }) => (
                      <div className="overflow-x-auto mb-4">
                        <table className="w-full border-collapse border border-white/20" {...props}>
                          {children}
                        </table>
                      </div>
                    ),
                    th: ({ children, ...props }) => (
                      <th className="border border-white/20 px-4 py-2 bg-white/10 text-white font-semibold" {...props}>
                        {children}
                      </th>
                    ),
                    td: ({ children, ...props }) => (
                      <td className="border border-white/20 px-4 py-2 text-white/80" {...props}>
                        {children}
                      </td>
                    ),
                    a: ({ children, href, ...props }) => (
                      <a
                        href={href}
                        className="text-purple-400 hover:text-purple-300 underline"
                        target={href?.startsWith('http') ? '_blank' : undefined}
                        rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
                        {...props}
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {document.content}
                </ReactMarkdown>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}