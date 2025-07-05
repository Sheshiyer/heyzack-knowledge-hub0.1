'use client';

import React, { useState, useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { SearchSection } from '@/components/dashboard/SearchSection';
import { CategoryGrid } from '@/components/dashboard/CategoryGrid';
import { RecentDocs } from '@/components/dashboard/RecentDocs';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DocumentService, DocumentStats } from '@/lib/document-service';
import {
  SparklesIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export default function Page() {
  const [stats, setStats] = useState<DocumentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        setIsLoading(true);
        const documentService = DocumentService.getInstance();
        await documentService.initialize();
        const documentStats = documentService.getStats();
        setStats(documentStats);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setIsLoading(false);
      }
    }

    loadStats();
  }, []);

  const formatLastUpdated = (lastUpdated: string): string => {
    const date = new Date(lastUpdated);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffHours < 1) return 'Just updated';
    if (diffHours < 24) return `Updated ${diffHours}h ago`;
    if (diffDays < 7) return `Updated ${diffDays}d ago`;
    return `Updated ${date.toLocaleDateString()}`;
  };

  return (
    <AppLayout>
      <div className="space-y-12">
        {/* Hero Section - Consolidated Welcome & Stats */}
        <Card variant="gradient" className="relative overflow-hidden">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl" />
          
          <div className="relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Badge variant="primary" className="flex items-center space-x-2">
                  <SparklesIcon className="w-4 h-4" />
                  <span>Knowledge Hub</span>
                </Badge>
                <Badge variant="glass">v2.0</Badge>
              </div>
              
              <div className="flex items-center space-x-6 text-white/60">
                <div className="flex items-center space-x-2">
                  <DocumentTextIcon className="w-5 h-5" />
                  {isLoading ? (
                    <div className="w-20 h-4 bg-white/10 rounded animate-pulse"></div>
                  ) : (
                    <span className="text-sm font-medium">{stats?.totalDocuments || 0} Documents</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-5 h-5" />
                  {isLoading ? (
                    <div className="w-24 h-4 bg-white/10 rounded animate-pulse"></div>
                  ) : (
                    <span className="text-sm font-medium">{stats ? formatLastUpdated(stats.lastUpdated) : 'Loading...'}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-sm font-medium">Online</span>
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-6">
              HeyZack Knowledge Hub
            </h1>
            
            <p className="text-white/80 text-xl md:text-2xl max-w-4xl leading-relaxed mb-8">
              Your centralized hub for HeyZack&apos;s AI-powered smart home automation platform. Access comprehensive business strategy, 
              technical documentation, market research, and strategic analysis for our revolutionary solution that unifies 11+ smart home apps 
              into one intelligent conversation interface.
            </p>
            
            {/* Integrated Platform Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">🏠</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Smart Home Unification</h4>
                <p className="text-white/60 text-sm">11+ platforms unified</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">🤖</span>
                </div>
                <h4 className="text-white font-semibold mb-2">AI Conversation</h4>
                <p className="text-white/60 text-sm">Natural language control</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">📱</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Cross-Platform</h4>
                <p className="text-white/60 text-sm">Seamless connectivity</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <span className="text-3xl">⚡</span>
                </div>
                <h4 className="text-white font-semibold mb-2">Smart Automation</h4>
                <p className="text-white/60 text-sm">Predictive & contextual</p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* Search Section */}
        <SearchSection />
        
        {/* Knowledge Categories */}
        <CategoryGrid />
        
        {/* Recent Documents */}
        <RecentDocs />
      </div>
    </AppLayout>
  );
}