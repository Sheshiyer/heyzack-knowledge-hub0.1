'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DocumentService, SimpleDocument } from '@/lib/document-service';
import {
  BookOpenIcon,
  DocumentTextIcon,
  ChartBarIcon,
  ArrowRightIcon,
  ClockIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';

export default function StrategicAnalysisPage() {
  const [documents, setDocuments] = useState<SimpleDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDocuments() {
      try {
        const documentService = DocumentService.getInstance();
        await documentService.initialize();
        
        // Get all documents and filter by strategic analysis category
        const allDocuments = documentService.getAllDocuments();
        const strategicDocs = allDocuments.filter(doc => 
          doc.category === '09_Strategic_Analysis' || doc.path.includes('09_Strategic_Analysis')
        );
        
        setDocuments(strategicDocs);
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

  const getDocumentIcon = (title: string) => {
    if (title.toLowerCase().includes('business model')) {
      return ChartBarIcon;
    } else if (title.toLowerCase().includes('porter')) {
      return PresentationChartLineIcon;
    } else if (title.toLowerCase().includes('market')) {
      return BookOpenIcon;
    }
    return DocumentTextIcon;
  };

  const getDocumentColor = (title: string) => {
    if (title.toLowerCase().includes('business model')) {
      return 'purple';
    } else if (title.toLowerCase().includes('porter')) {
      return 'blue';
    } else if (title.toLowerCase().includes('market')) {
      return 'green';
    }
    return 'gray';
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
            <h1 className="text-3xl font-bold text-white mb-2">Strategic Analysis</h1>
            <p className="text-white/60">Business frameworks, strategic planning, and analytical tools</p>
          </div>
          <Badge variant="primary" className="flex items-center space-x-2">
            <BookOpenIcon className="w-4 h-4" />
            <span>Analysis Hub</span>
          </Badge>
        </div>

        {/* Strategic Analysis Overview */}
        <Card variant="gradient" className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <PresentationChartLineIcon className="w-6 h-6 text-white" />
            <h3 className="text-white font-semibold text-lg">Strategic Business Analysis</h3>
          </div>
          <p className="text-white/80 mb-4">
            Comprehensive strategic analysis frameworks including Business Model Canvas, Porter&apos;s Five Forces, and Go-to-Market strategies for HeyZack&apos;s smart home AI platform.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Business Model</h4>
              <p className="text-white/60 text-sm">Value propositions, customer segments, and revenue streams analysis</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Competitive Analysis</h4>
              <p className="text-white/60 text-sm">Porter&apos;s Five Forces framework for industry structure evaluation</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Market Strategy</h4>
              <p className="text-white/60 text-sm">Go-to-market optimization and strategic execution planning</p>
            </div>
          </div>
        </Card>

        {/* Documents Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold text-xl">Strategic Analysis Documents</h2>
            <Badge variant="glass" className="text-xs">
              {documents.length} documents
            </Badge>
          </div>
          
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => {
                const Icon = getDocumentIcon(doc.title);
                const color = getDocumentColor(doc.title);
                const colorClasses = {
                  purple: 'bg-purple-500/20 text-purple-300',
                  blue: 'bg-blue-500/20 text-blue-300',
                  green: 'bg-green-500/20 text-green-300',
                  gray: 'bg-gray-500/20 text-gray-300'
                };
                
                return (
                  <Link key={doc.id} href={`/document/${doc.id}`}>
                    <Card variant="glass" className="p-6 hover:bg-white/10 transition-all duration-200 cursor-pointer group h-full">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors">
                            {doc.title}
                          </h3>
                        </div>
                        <ArrowRightIcon className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors" />
                      </div>
                      
                      <div className="flex items-center space-x-4 text-xs text-white/50 mb-4">
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-3 h-3" />
                          <span>{formatReadingTime(doc.readingTime)}</span>
                        </div>
                        <div>
                          {doc.wordCount} words
                        </div>
                      </div>
                      
                      {doc.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
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
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Card variant="glass" className="p-8 text-center">
              <DocumentTextIcon className="w-12 h-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-white font-semibold mb-2">No Strategic Analysis Documents</h3>
              <p className="text-white/60">
                Strategic analysis documents are being processed and will be available soon.
              </p>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
}