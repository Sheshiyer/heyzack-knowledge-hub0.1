'use client';

import { useMemo } from 'react';
import { useDocuments } from '@/hooks/useDocuments';
import { ChartBarIcon, ArrowLeftIcon, DocumentTextIcon, FolderIcon, TagIcon, ClockIcon, ArrowTrendingUpIcon, EyeIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';

export default function AnalyticsPage() {
  const { documents, isLoading } = useDocuments();

  const analytics = useMemo(() => {
    if (documents.length === 0) {
      return {
        totalDocuments: 0,
        totalWords: 0,
        averageWordsPerDocument: 0,
        categoriesCount: 0,
        tagsCount: 0,
        categoryBreakdown: [],
        tagFrequency: [],
        recentActivity: [],
        wordCountDistribution: []
      };
    }

    const totalWords = documents.reduce((sum, doc) => sum + doc.wordCount, 0);
    const averageWordsPerDocument = Math.round(totalWords / documents.length);

    // Category breakdown
    const categoryMap = new Map<string, { count: number; words: number }>();
    documents.forEach(doc => {
      const category = doc.metadata.category;
      const existing = categoryMap.get(category) || { count: 0, words: 0 };
      categoryMap.set(category, {
        count: existing.count + 1,
        words: existing.words + doc.wordCount
      });
    });
    
    const categoryBreakdown = Array.from(categoryMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count);

    // Tag frequency
    const tagMap = new Map<string, number>();
    documents.forEach(doc => {
      doc.metadata.tags?.forEach(tag => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
      });
    });
    
    const tagFrequency = Array.from(tagMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivity = documents
      .filter(doc => doc.metadata.lastModified && new Date(doc.metadata.lastModified) > thirtyDaysAgo)
      .sort((a, b) => new Date(b.metadata.lastModified || 0).getTime() - new Date(a.metadata.lastModified || 0).getTime())
      .slice(0, 10);

    // Word count distribution
    const wordCountRanges = [
      { range: '0-500', min: 0, max: 500, count: 0 },
      { range: '501-1000', min: 501, max: 1000, count: 0 },
      { range: '1001-2000', min: 1001, max: 2000, count: 0 },
      { range: '2001-5000', min: 2001, max: 5000, count: 0 },
      { range: '5000+', min: 5001, max: Infinity, count: 0 }
    ];
    
    documents.forEach(doc => {
      const range = wordCountRanges.find(r => doc.wordCount >= r.min && doc.wordCount <= r.max);
      if (range) range.count++;
    });

    return {
      totalDocuments: documents.length,
      totalWords,
      averageWordsPerDocument,
      categoriesCount: categoryMap.size,
      tagsCount: tagMap.size,
      categoryBreakdown,
      tagFrequency,
      recentActivity,
      wordCountDistribution: wordCountRanges
    };
  }, [documents]);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mx-auto"></div>
            <p className="mt-4 text-white/70">Loading analytics...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <ChartBarIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
                <p className="text-white/70">Insights and statistics about your knowledge base</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Total Documents</p>
                  <p className="text-3xl font-bold text-white mt-1">{analytics.totalDocuments.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg">
                  <DocumentTextIcon className="h-6 w-6 text-blue-300" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-emerald-600/20 rounded-xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Total Words</p>
                  <p className="text-3xl font-bold text-white mt-1">{analytics.totalWords.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-lg">
                  <ArrowTrendingUpIcon className="h-6 w-6 text-green-300" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-red-600/20 rounded-xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Categories</p>
                  <p className="text-3xl font-bold text-white mt-1">{analytics.categoriesCount}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg">
                  <FolderIcon className="h-6 w-6 text-orange-300" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm font-medium">Avg Words/Doc</p>
                  <p className="text-3xl font-bold text-white mt-1">{analytics.averageWordsPerDocument.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-lg">
                  <EyeIcon className="h-6 w-6 text-pink-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Breakdown */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <FolderIcon className="h-5 w-5 mr-2 text-purple-400" />
                Documents by Category
              </h3>
              <div className="space-y-4">
                {analytics.categoryBreakdown.map((category) => {
                  const percentage = (category.count / analytics.totalDocuments) * 100;
                  return (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white capitalize">{category.name}</span>
                        <span className="text-white/70">{category.count} docs ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Word Count Distribution */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <ChartBarIcon className="h-5 w-5 mr-2 text-blue-400" />
                Word Count Distribution
              </h3>
              <div className="space-y-4">
                {analytics.wordCountDistribution.map((range) => {
                  const percentage = analytics.totalDocuments > 0 ? (range.count / analytics.totalDocuments) * 100 : 0;
                  return (
                    <div key={range.range} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white">{range.range} words</span>
                        <span className="text-white/70">{range.count} docs ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Tags */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-emerald-600/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <TagIcon className="h-5 w-5 mr-2 text-green-400" />
                Most Used Tags
              </h3>
              <div className="space-y-3">
                {analytics.tagFrequency.slice(0, 8).map((tag) => (
                  <div key={tag.name} className="flex items-center justify-between">
                    <span className="text-white text-sm">{tag.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white/70 text-sm">{tag.count}</span>
                      <div className="w-16 bg-white/10 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-green-500 to-emerald-500 h-1.5 rounded-full"
                          style={{ width: `${(tag.count / analytics.tagFrequency[0]?.count || 1) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10 rounded-2xl blur-xl"></div>
            <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-orange-400" />
                Recent Activity (30 days)
              </h3>
              <div className="space-y-3">
                {analytics.recentActivity.length > 0 ? (
                  analytics.recentActivity.map((doc) => (
                    <Link
                      key={doc.id}
                      href={`/document/${doc.id}`}
                      className="block p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-white text-sm font-medium group-hover:text-purple-300 transition-colors line-clamp-1">
                            {doc.metadata.title}
                          </h4>
                          <p className="text-white/60 text-xs mt-1 capitalize">{doc.metadata.category}</p>
                        </div>
                        <span className="text-white/50 text-xs">
                          {doc.metadata.lastModified ? new Date(doc.metadata.lastModified).toLocaleDateString() : 'Unknown'}
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-white/60 text-sm text-center py-8">No recent activity in the last 30 days</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}