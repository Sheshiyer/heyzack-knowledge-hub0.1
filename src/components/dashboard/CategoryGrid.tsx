'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DocumentService } from '@/lib/document-service';
import {
  DocumentTextIcon,
  BuildingOfficeIcon,
  PhotoIcon,
  ChartBarIcon,
  CogIcon,
  BookOpenIcon,
  LightBulbIcon,
  ArrowRightIcon,
  ArchiveBoxIcon,
  ClipboardDocumentListIcon,
  PresentationChartLineIcon
} from '@heroicons/react/24/outline';
import { Card } from '../ui/Card';

interface Category {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  href: string;
}

// Category metadata mapping
const getCategoryMetadata = (category: string) => {
  const metadata: Record<string, { description: string; icon: React.ComponentType<{ className?: string }>; gradient: string }> = {
    'foundation': {
      description: 'Brand guidelines, personas, and core messaging framework',
      icon: BuildingOfficeIcon,
      gradient: 'from-purple-500 to-pink-500'
    },
    'campaign-core': {
      description: 'Campaign strategies, messaging, and marketing frameworks',
      icon: LightBulbIcon,
      gradient: 'from-blue-500 to-cyan-500'
    },
    'email-marketing': {
      description: 'Email sequences, automation, and marketing communications',
      icon: ClipboardDocumentListIcon,
      gradient: 'from-green-500 to-emerald-500'
    },
    'advertising': {
      description: 'Ad copy, creative briefs, and advertising strategies',
      icon: PresentationChartLineIcon,
      gradient: 'from-yellow-500 to-orange-500'
    },
    'visual-assets': {
      description: 'Design guidelines, visual elements, and brand assets',
      icon: PhotoIcon,
      gradient: 'from-orange-500 to-red-500'
    },
    'supporting-materials': {
      description: 'Research, analysis, and supporting documentation',
      icon: BookOpenIcon,
      gradient: 'from-teal-500 to-cyan-500'
    },
    'project-management': {
      description: 'Project plans, timelines, and management frameworks',
      icon: CogIcon,
      gradient: 'from-indigo-500 to-blue-500'
    },
    'templates-master': {
      description: 'Reusable templates and standardized frameworks',
      icon: ClipboardDocumentListIcon,
      gradient: 'from-pink-500 to-rose-500'
    },
    'strategic-analysis': {
      description: 'Business model analysis, strategic frameworks, and insights',
      icon: ChartBarIcon,
      gradient: 'from-indigo-500 to-purple-500'
    },
    'reference-materials': {
      description: 'Reference guides, documentation, and knowledge base',
      icon: ArchiveBoxIcon,
      gradient: 'from-gray-500 to-slate-500'
    },
    'general': {
      description: 'General documentation and miscellaneous resources',
      icon: DocumentTextIcon,
      gradient: 'from-gray-400 to-gray-600'
    }
  };
  
  return metadata[category] || {
    description: 'Documentation and resources',
    icon: DocumentTextIcon,
    gradient: 'from-gray-400 to-gray-600'
  };
};

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const Icon = category.icon;
  
  return (
    <Link href={category.href}>
      <Card 
        variant="glass" 
        className="relative overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-[1.02] h-full p-8"
        hover
      >
        {/* Background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-5 group-hover:opacity-15 transition-opacity`} />
        
        {/* Content */}
        <div className="relative h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${category.gradient} bg-opacity-20 flex-shrink-0`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
            
            <div className="flex items-center space-x-3 flex-shrink-0">
              <ArrowRightIcon className="w-5 h-5 text-white/40 group-hover:text-white/80 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
          
          {/* Title and Description */}
          <div className="mb-6 flex-1">
            <h3 className="text-white font-bold text-2xl mb-4 group-hover:text-white transition-colors line-clamp-2">
              {category.name}
            </h3>
            <p className="text-white/70 text-base leading-relaxed line-clamp-3">
              {category.description}
            </p>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
            <div className="flex items-center space-x-3">
              <DocumentTextIcon className="w-5 h-5 text-white/60 flex-shrink-0" />
              <span className="text-white/60 text-base font-medium">
                {category.documentCount} documents
              </span>
            </div>
            
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${category.gradient} flex-shrink-0`} />
          </div>
        </div>
      </Card>
    </Link>
  );
};

export const CategoryGrid: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalDocuments, setTotalDocuments] = useState(0);

  useEffect(() => {
    async function loadCategories() {
      try {
        setIsLoading(true);
        setError(null);
        
        const documentService = DocumentService.getInstance();
        await documentService.initialize();
        
        const availableCategories = documentService.getAvailableCategories();
        const stats = documentService.getStats();
        
        // Map to our Category interface
        const mappedCategories: Category[] = availableCategories.map(cat => {
          const metadata = getCategoryMetadata(cat.category);
          return {
            id: cat.category,
            name: cat.displayName,
            description: metadata.description,
            documentCount: cat.count,
            icon: metadata.icon,
            gradient: metadata.gradient,
            href: `/categories?category=${cat.category}`
          };
        });
        
        // Add "All Documents" category
        const allDocumentsCategory: Category = {
          id: 'all-documents',
          name: 'All Documents',
          description: 'Browse and search through all available documents',
          documentCount: stats.totalDocuments,
          icon: DocumentTextIcon,
          gradient: 'from-indigo-500 to-purple-500',
          href: '/documents'
        };
        
        setCategories([...mappedCategories, allDocumentsCategory]);
        setTotalDocuments(stats.totalDocuments);
      } catch (err) {
        console.error('Failed to load categories:', err);
        setError('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    }

    loadCategories();
  }, []);

  if (isLoading) {
    return (
      <div>
        <div className="text-center mb-8">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Knowledge Categories</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">Explore our comprehensive collection of business strategy, technical documentation, and strategic analysis</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(6)].map((_, i) => (
            <Card key={i} variant="glass" className="p-8 animate-pulse h-64">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex-shrink-0"></div>
                <div className="w-6 h-6 bg-white/10 rounded flex-shrink-0"></div>
              </div>
              <div className="mb-6 flex-1">
                <div className="h-8 bg-white/10 rounded mb-4 w-3/4"></div>
                <div className="h-4 bg-white/10 rounded mb-2 w-full"></div>
                <div className="h-4 bg-white/10 rounded w-2/3"></div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div className="h-4 bg-white/10 rounded w-1/3"></div>
                <div className="w-3 h-3 bg-white/10 rounded-full"></div>
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
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Knowledge Categories</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">Explore our comprehensive collection of business strategy, technical documentation, and strategic analysis</p>
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
        <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Knowledge Categories</h2>
        <p className="text-white/60 text-lg max-w-2xl mx-auto">
          {categories.length > 0 
            ? `Explore ${totalDocuments} documents across ${categories.length - 1} knowledge categories`
            : 'No categories available'
          }
        </p>
      </div>
      
      {categories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 auto-rows-fr">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      ) : (
        <Card variant="glass" className="p-8 text-center">
          <DocumentTextIcon className="w-12 h-12 text-white/40 mx-auto mb-4" />
          <p className="text-white/70 mb-4">No categories found</p>
        </Card>
      )}
    </div>
  );
};

export default CategoryGrid;