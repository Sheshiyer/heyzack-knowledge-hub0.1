'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DocumentService } from '@/lib/document-service';
import {
  FolderIcon,
  DocumentTextIcon,
  TagIcon,
  ArrowRightIcon,
  ChartBarIcon,
  AcademicCapIcon,
  BookOpenIcon,
  PresentationChartLineIcon,
  ArchiveBoxIcon,
  BriefcaseIcon,
  PaintBrushIcon,
  ClipboardDocumentListIcon,
  CogIcon
} from '@heroicons/react/24/outline';

interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  count: number;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalDocuments, setTotalDocuments] = useState(0);

  useEffect(() => {
    async function loadCategories() {
      try {
        const documentService = DocumentService.getInstance();
        await documentService.initialize();
        const allDocuments = documentService.getAllDocuments();
        const availableCategories = documentService.getAvailableCategories();
        
        setTotalDocuments(allDocuments.length);
        
        // Category metadata mapping
        const categoryMetadata: Record<string, { description: string; path: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
          'foundation': {
            description: 'Core foundational documents, brand guidelines, and essential business materials.',
            icon: BookOpenIcon,
            color: 'blue',
            path: '/business-strategy'
          },
          'campaign-core': {
            description: 'Core campaign documentation, messaging frameworks, and marketing strategies.',
            icon: PresentationChartLineIcon,
            color: 'purple',
            path: '/business-strategy'
          },
          'email-marketing': {
            description: 'Email marketing templates, campaigns, and automation workflows.',
            icon: DocumentTextIcon,
            color: 'green',
            path: '/market-research'
          },
          'advertising': {
            description: 'Advertising campaigns, ad copy, and promotional materials.',
            icon: ChartBarIcon,
            color: 'orange',
            path: '/market-research'
          },
          'visual-assets': {
            description: 'Design assets, visual guidelines, and creative materials.',
            icon: PaintBrushIcon,
            color: 'pink',
            path: '/technical-docs'
          },
          'supporting-materials': {
            description: 'Supporting documentation, resources, and supplementary materials.',
            icon: FolderIcon,
            color: 'cyan',
            path: '/market-research'
          },
          'project-management': {
            description: 'Project plans, timelines, and management documentation.',
            icon: ClipboardDocumentListIcon,
            color: 'indigo',
            path: '/documents'
          },
          'templates-master': {
            description: 'Master templates, frameworks, and reusable document structures.',
            icon: CogIcon,
            color: 'gray',
            path: '/technical-docs'
          },
          'strategic-analysis': {
            description: 'Business frameworks, strategic planning, and analytical tools.',
            icon: AcademicCapIcon,
            color: 'violet',
            path: '/strategic-analysis'
          },
          'reference-materials': {
            description: 'External resources, documentation, and reference guides.',
            icon: ArchiveBoxIcon,
            color: 'emerald',
            path: '/reference-materials'
          },
          'general': {
            description: 'General documents and miscellaneous materials.',
            icon: DocumentTextIcon,
            color: 'gray',
            path: '/documents'
          }
        };
        
        // Map available categories to CategoryInfo format
        const categoriesWithMetadata = availableCategories.map(({ category, count, displayName }) => {
          const metadata = categoryMetadata[category] || categoryMetadata['general'];
          return {
            id: category,
            name: displayName,
            description: metadata.description,
            path: metadata.path,
            icon: metadata.icon,
            color: metadata.color,
            count
          };
        });
        
        setCategories(categoriesWithMetadata);
      } catch (error) {
        console.error('Failed to load categories:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500/20 text-blue-300',
      purple: 'bg-purple-500/20 text-purple-300',
      green: 'bg-green-500/20 text-green-300',
      orange: 'bg-orange-500/20 text-orange-300',
      pink: 'bg-pink-500/20 text-pink-300',
      cyan: 'bg-cyan-500/20 text-cyan-300',
      indigo: 'bg-indigo-500/20 text-indigo-300',
      gray: 'bg-gray-500/20 text-gray-300',
      violet: 'bg-violet-500/20 text-violet-300',
      emerald: 'bg-emerald-500/20 text-emerald-300'
    };
    return colorMap[color] || 'bg-gray-500/20 text-gray-300';
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
            {[1, 2, 3, 4, 5, 6].map(i => (
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
            <h1 className="text-3xl font-bold text-white mb-2">Categories</h1>
            <p className="text-white/60">Browse documents by category and topic</p>
          </div>
          <Badge variant="primary" className="flex items-center space-x-2">
            <FolderIcon className="w-4 h-4" />
            <span>Category Hub</span>
          </Badge>
        </div>

        {/* Overview Stats */}
        <Card variant="gradient" className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BriefcaseIcon className="w-6 h-6 text-white" />
            <h3 className="text-white font-semibold text-lg">Knowledge Base Overview</h3>
          </div>
          <p className="text-white/80 mb-4">
            Comprehensive collection of documents organized across {categories.length} main categories, covering all aspects of HeyZack&apos;s smart home AI platform development and strategy.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Total Documents</h4>
              <p className="text-2xl font-bold text-white">{totalDocuments}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Categories</h4>
              <p className="text-2xl font-bold text-white">{categories.length}</p>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">Active Categories</h4>
              <p className="text-2xl font-bold text-white">{categories.filter(c => c.count > 0).length}</p>
            </div>
          </div>
        </Card>

        {/* Categories Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-semibold text-xl">Document Categories</h2>
            <Badge variant="glass" className="text-xs">
              {categories.filter(c => c.count > 0).length} active categories
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              const colorClasses = getColorClasses(category.color);
              
              return (
                <Link key={category.id} href={category.path}>
                  <Card variant="glass" className="p-6 hover:bg-white/10 transition-all duration-200 cursor-pointer group h-full">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className={`p-2 rounded-lg ${colorClasses}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold group-hover:text-purple-300 transition-colors">
                          {category.name}
                        </h3>
                      </div>
                      <ArrowRightIcon className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors" />
                    </div>
                    
                    <p className="text-white/60 text-sm mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className={`text-sm font-medium ${category.count > 0 ? 'text-white' : 'text-white/40'}`}>
                        {category.count} {category.count === 1 ? 'document' : 'documents'}
                      </div>
                      {category.count > 0 && (
                        <Badge variant="glass" className="text-xs">
                          Active
                        </Badge>
                      )}
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Access */}
        <Card variant="glass" className="p-6">
          <h3 className="text-white font-semibold mb-4">Quick Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/documents" className="group">
              <div className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <div className="flex items-center space-x-2 mb-2">
                  <DocumentTextIcon className="w-4 h-4 text-blue-300" />
                  <span className="text-white font-medium group-hover:text-blue-300 transition-colors">All Documents</span>
                </div>
                <p className="text-white/60 text-xs">Browse and search all available documents</p>
              </div>
            </Link>
            
            <Link href="/search" className="group">
              <div className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <div className="flex items-center space-x-2 mb-2">
                  <TagIcon className="w-4 h-4 text-orange-300" />
                  <span className="text-white font-medium group-hover:text-orange-300 transition-colors">Search</span>
                </div>
                <p className="text-white/60 text-xs">Find documents across all categories</p>
              </div>
            </Link>
            
            <Link href="/" className="group">
              <div className="p-4 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                <div className="flex items-center space-x-2 mb-2">
                  <FolderIcon className="w-4 h-4 text-purple-300" />
                  <span className="text-white font-medium group-hover:text-purple-300 transition-colors">Home</span>
                </div>
                <p className="text-white/60 text-xs">Return to the knowledge hub homepage</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}