'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DocumentService, SimpleDocument } from '@/lib/document-service';
import {
  CpuChipIcon,
  DocumentTextIcon,
  CodeBracketIcon,
  ArrowRightIcon,
  ClockIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';

interface DocumentGroup {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  documents: SimpleDocument[];
}

export default function TechnicalDocsPage() {
  const [documentGroups, setDocumentGroups] = useState<DocumentGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDocuments() {
      try {
        const documentService = DocumentService.getInstance();
        await documentService.initialize();
        
        // Get all documents and filter by relevant categories
        const allDocuments = documentService.getAllDocuments();
        
        const visualAssetDocs = allDocuments.filter(doc => 
          doc.category === '05_Visual_Assets' || doc.path.includes('05_Visual_Assets')
        );
        
        const templateDocs = allDocuments.filter(doc => 
          doc.category === '08_Templates_Master' || doc.path.includes('08_Templates_Master')
        );
        
        const referenceDocs = allDocuments.filter(doc => 
          doc.category === '10_Reference_Materials' || doc.path.includes('10_Reference_Materials')
        );
        
        setDocumentGroups([
          {
            title: 'Visual Assets & Guidelines',
            description: 'Design guidelines, visual templates, and brand asset specifications.',
            icon: DocumentTextIcon,
            color: 'blue',
            documents: visualAssetDocs
          },
          {
            title: 'Template System',
            description: 'Master templates, design systems, and reusable components.',
            icon: CodeBracketIcon,
            color: 'green',
            documents: templateDocs
          },
          {
            title: 'Reference Materials',
            description: 'Technical specifications, brand guidelines, and reference documentation.',
            icon: WrenchScrewdriverIcon,
            color: 'purple',
            documents: referenceDocs
          }
        ]);
      } catch (error) {
        console.error('Failed to load documents:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadDocuments();
  }, []);

  const formatReadingTime = (minutes: number) => {
    return minutes < 1 ? '< 1 min' : `${Math.round(minutes)} min`;
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-8">
          <div className="animate-pulse">
            <div className="h-8 bg-white/10 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-white/5 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-48 bg-white/5 rounded-xl"></div>
              </div>
            ))}
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
            <h1 className="text-3xl font-bold text-white mb-2">Technical Documentation</h1>
            <p className="text-white/60">Development guides, design systems, and technical resources</p>
          </div>
          <Badge variant="primary" className="flex items-center space-x-2">
            <CpuChipIcon className="w-4 h-4" />
            <span>Tech Hub</span>
          </Badge>
        </div>

        {/* Document Groups */}
        <div className="space-y-8">
          {documentGroups.map((group, groupIndex) => {
            const Icon = group.icon;
            const colorClasses = {
              blue: 'bg-blue-500/20 text-blue-300',
              green: 'bg-green-500/20 text-green-300',
              purple: 'bg-purple-500/20 text-purple-300'
            };
            
            return (
              <div key={groupIndex}>
                {/* Group Header */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`p-2 rounded-lg ${colorClasses[group.color as keyof typeof colorClasses]}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-white font-semibold text-xl">{group.title}</h2>
                    <p className="text-white/60 text-sm">{group.description}</p>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="glass" className="text-xs">
                      {group.documents.length} documents
                    </Badge>
                  </div>
                </div>
                
                {/* Documents Grid */}
                {group.documents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.documents.map((doc) => (
                      <Link key={doc.id} href={`/document/${doc.id}`}>
                        <Card variant="glass" className="p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer group">
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-white font-medium text-sm line-clamp-2 group-hover:text-blue-300 transition-colors">
                              {doc.title}
                            </h3>
                            <ArrowRightIcon className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors flex-shrink-0 ml-2" />
                          </div>
                          
                          <div className="flex items-center space-x-4 text-xs text-white/50">
                            <div className="flex items-center space-x-1">
                              <ClockIcon className="w-3 h-3" />
                              <span>{formatReadingTime(doc.readingTime)}</span>
                            </div>
                            <div>
                              {doc.wordCount} words
                            </div>
                          </div>
                          
                          {doc.tags.length > 0 && (
                            <div className="mt-3 flex flex-wrap gap-1">
                              {doc.tags.slice(0, 2).map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="glass" className="text-xs px-2 py-0.5">
                                  {tag}
                                </Badge>
                              ))}
                              {doc.tags.length > 2 && (
                                <Badge variant="glass" className="text-xs px-2 py-0.5">
                                  +{doc.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <Card variant="glass" className="p-6 text-center">
                    <DocumentTextIcon className="w-8 h-8 text-white/40 mx-auto mb-2" />
                    <p className="text-white/60 text-sm">No documents found in this category</p>
                  </Card>
                )}
              </div>
            );
          })}
        </div>


      </div>
    </AppLayout>
  );
}