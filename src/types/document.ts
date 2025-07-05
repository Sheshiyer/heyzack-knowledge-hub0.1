import React from 'react';

export interface DocumentMetadata {
  title: string;
  description?: string;
  category: string;
  tags?: string[];
  author?: string;
  lastModified?: Date;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime?: number;
  relatedDocuments?: string[];
  version?: string;
  readTime?: number;
  views?: number;
  wordCount?: number;
}

export interface ProcessedDocument {
  id: string;
  slug: string;
  filePath: string;
  metadata: {
    title: string;
    description?: string;
    category: string;
    lastModified?: Date;
    readTime?: number;
    views?: number;
    wordCount?: number;
    tags?: string[];
  };
  content: string;
  htmlContent?: string;
  body?: string;
  rawContent: string;
  wordCount: number;
  hasMermaidDiagrams: boolean;
  mermaidDiagrams: MermaidDiagram[];
  headings: DocumentHeading[];
  searchableContent: string;
  createElement?: React.ComponentType<Record<string, unknown>>;
}

export interface MermaidDiagram {
  id: string;
  type: 'flowchart' | 'sequence' | 'gantt' | 'pie' | 'graph' | 'gitgraph' | 'other';
  content: string;
  title?: string;
}

export interface DocumentHeading {
  id: string;
  level: number;
  text: string;
  anchor: string;
}

export interface DocumentCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  documentCount: number;
  folderPath: string;
}

export interface SearchResult {
  document: ProcessedDocument;
  score: number;
  matches: SearchMatch[];
}

export interface SearchMatch {
  field: 'title' | 'content' | 'description' | 'tags';
  value: string;
  text?: string;
  indices: [number, number][];
}

export interface DocumentStats {
  totalDocuments: number;
  totalCategories: number;
  totalWords: number;
  lastUpdated: string;
  mostViewedDocuments: ProcessedDocument[];
  recentlyUpdated: ProcessedDocument[];
}

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  {
    id: 'foundation',
    name: 'Foundation',
    description: 'Brand guidelines, personas, and core messaging',
    icon: '🏗️',
    color: 'bg-blue-500',
    documentCount: 0,
    folderPath: '01_Foundation'
  },
  {
    id: 'campaign-core',
    name: 'Campaign Core',
    description: 'Campaign strategies, copy, and implementation guides',
    icon: '🎯',
    color: 'bg-green-500',
    documentCount: 0,
    folderPath: '02_Campaign_Core'
  },
  {
    id: 'email-marketing',
    name: 'Email Marketing',
    description: 'Email sequences, templates, and guidelines',
    icon: '📧',
    color: 'bg-purple-500',
    documentCount: 0,
    folderPath: '03_Email_Marketing'
  },
  {
    id: 'advertising',
    name: 'Advertising',
    description: 'Ad copy, campaign materials, and advertising strategies',
    icon: '📢',
    color: 'bg-orange-500',
    documentCount: 0,
    folderPath: '04_Advertising'
  },
  {
    id: 'visual-assets',
    name: 'Visual Assets',
    description: 'Design guidelines, visual timelines, and asset checklists',
    icon: '🎨',
    color: 'bg-pink-500',
    documentCount: 0,
    folderPath: '05_Visual_Assets'
  },
  {
    id: 'supporting-materials',
    name: 'Supporting Materials',
    description: 'Research, calculators, and additional resources',
    icon: '📊',
    color: 'bg-indigo-500',
    documentCount: 0,
    folderPath: '06_Supporting_Materials'
  },
  {
    id: 'templates-master',
    name: 'Templates Master',
    description: 'Master templates and template system documentation',
    icon: '📋',
    color: 'bg-teal-500',
    documentCount: 0,
    folderPath: '08_Templates_Master'
  },
  {
    id: 'strategic-analysis',
    name: 'Strategic Analysis',
    description: 'Business models, market analysis, and strategic frameworks',
    icon: '🧠',
    color: 'bg-red-500',
    documentCount: 0,
    folderPath: '09_Strategic_Analysis'
  },
  {
    id: 'reference-materials',
    name: 'Reference Materials',
    description: 'Brand guidelines, logos, and reference documents',
    icon: '📚',
    color: 'bg-yellow-500',
    documentCount: 0,
    folderPath: '10_Reference_Materials'
  }
];