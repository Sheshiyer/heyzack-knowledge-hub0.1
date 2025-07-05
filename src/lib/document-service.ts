/**
 * Document Service for HeyZack Knowledge Hub
 * Provides a simplified interface for loading and processing documents
 */

import { FileReader } from './file-reader';

export interface SimpleDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  path: string;
  lastModified: Date;
  wordCount: number;
  readingTime: number;
  tags: string[];
}

export interface DocumentStats {
  totalDocuments: number;
  totalCategories: number;
  totalWords: number;
  lastUpdated: string;
}

export class DocumentService {
  private static instance: DocumentService;
  private fileReader: FileReader;
  private documentCache = new Map<string, SimpleDocument>();
  private isInitialized = false;

  private constructor() {
    this.fileReader = FileReader.getInstance();
  }

  static getInstance(): DocumentService {
    if (!DocumentService.instance) {
      DocumentService.instance = new DocumentService();
    }
    return DocumentService.instance;
  }

  /**
   * Initialize the document service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const availableFiles = this.fileReader.getAvailableFiles();
      
      // Process all available files for complete indexing
      for (const filePath of availableFiles) {
        try {
          await this.loadDocument(filePath);
        } catch (error) {
          console.warn(`Failed to load document ${filePath}:`, error);
        }
      }

      this.isInitialized = true;
      console.log(`Document service initialized with ${this.documentCache.size} documents`);
    } catch (error) {
      console.error('Failed to initialize document service:', error);
      throw error;
    }
  }

  /**
   * Load a single document
   */
  async loadDocument(filePath: string): Promise<SimpleDocument> {
    const documentId = this.generateDocumentId(filePath);
    
    // Check cache first
    if (this.documentCache.has(documentId)) {
      return this.documentCache.get(documentId)!;
    }

    try {
      const content = await this.fileReader.readFile(filePath);
      const metadata = await this.fileReader.getFileMetadata(filePath);
      
      const document: SimpleDocument = {
        id: documentId,
        title: this.extractTitle(content, metadata.name),
        content,
        category: metadata.category,
        path: filePath,
        lastModified: metadata.lastModified,
        wordCount: this.countWords(content),
        readingTime: this.calculateReadingTime(content),
        tags: this.extractTags(content)
      };

      // Cache the document
      this.documentCache.set(documentId, document);
      
      return document;
    } catch (error) {
      console.error(`Failed to load document ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Get a document by ID
   */
  async getDocument(id: string): Promise<SimpleDocument | null> {
    // Check cache first
    if (this.documentCache.has(id)) {
      return this.documentCache.get(id)!;
    }

    // Try to find the document by ID in available files
    const availableFiles = this.fileReader.getAvailableFiles();
    const filePath = availableFiles.find(path => this.generateDocumentId(path) === id);
    
    if (filePath) {
      try {
        return await this.loadDocument(filePath);
      } catch (error) {
        console.error(`Failed to load document ${id}:`, error);
      }
    }

    return null;
  }

  /**
   * Get all loaded documents
   */
  getAllDocuments(): SimpleDocument[] {
    return Array.from(this.documentCache.values());
  }

  /**
   * Get documents by category
   */
  getDocumentsByCategory(category: string): SimpleDocument[] {
    return this.getAllDocuments().filter(doc => doc.category === category);
  }

  /**
   * Get available categories with document counts
   */
  getAvailableCategories(): Array<{ category: string; count: number; displayName: string }> {
    const documents = this.getAllDocuments();
    const categoryMap = new Map<string, number>();
    
    // Count documents per category
    documents.forEach(doc => {
      categoryMap.set(doc.category, (categoryMap.get(doc.category) || 0) + 1);
    });
    
    // Category display names mapping
    const categoryDisplayNames: Record<string, string> = {
      'foundation': 'Foundation',
      'campaign-core': 'Campaign Core',
      'email-marketing': 'Email Marketing',
      'advertising': 'Advertising',
      'visual-assets': 'Visual Assets',
      'supporting-materials': 'Supporting Materials',
      'project-management': 'Project Management',
      'templates-master': 'Templates Master',
      'strategic-analysis': 'Strategic Analysis',
      'reference-materials': 'Reference Materials',
      'general': 'General'
    };
    
    // Return only categories that have documents
    return Array.from(categoryMap.entries())
      .filter(([, count]) => count > 0)
      .map(([category, count]) => ({
        category,
        count,
        displayName: categoryDisplayNames[category] || category
      }))
      .sort((a, b) => a.displayName.localeCompare(b.displayName));
  }

  /**
   * Search documents by title or content
   */
  searchDocuments(query: string): SimpleDocument[] {
    const searchTerm = query.toLowerCase();
    return this.getAllDocuments().filter(doc => 
      doc.title.toLowerCase().includes(searchTerm) ||
      doc.content.toLowerCase().includes(searchTerm) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  /**
   * Get document statistics
   */
  getStats(): DocumentStats {
    const documents = this.getAllDocuments();
    const categories = new Set(documents.map(doc => doc.category));
    const totalWords = documents.reduce((sum, doc) => sum + doc.wordCount, 0);
    const lastUpdated = documents
      .map(doc => doc.lastModified)
      .reduce((latest, date) => date > latest ? date : latest, new Date(0))
      .toISOString();

    return {
      totalDocuments: documents.length,
      totalCategories: categories.size,
      totalWords,
      lastUpdated
    };
  }

  /**
   * Generate a unique document ID from file path
   */
  private generateDocumentId(filePath: string): string {
    return filePath
      .replace('data-sources/', '')
      .replace(/\//g, '-')
      .replace(/\.(md|txt)$/, '')
      .toLowerCase();
  }

  /**
   * Extract title from content
   */
  private extractTitle(content: string, fileName: string): string {
    // Try to find the first H1 heading (markdown)
    const h1Match = content.match(/^#\s+(.+)$/m);
    if (h1Match) {
      return h1Match[1].trim();
    }

    // Try to find any heading (markdown)
    const headingMatches = content.match(/^#{1,6}\s+(.+)$/gm);
    if (headingMatches) {
      return headingMatches[0].replace(/^#{1,6}\s+/, '').trim();
    }

    // For text files, try to find the first line that looks like a title
    const lines = content.split('\n').filter(line => line.trim());
    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      // If first line is all caps or has title-like formatting, use it
      if (firstLine.length < 100 && (firstLine === firstLine.toUpperCase() || firstLine.includes('Knowledge Base') || firstLine.includes('DOCUMENT'))) {
        return firstLine.replace(/^#+\s*/, '').replace(/\s*-+\s*$/, '').trim();
      }
    }

    // Fall back to filename
    return fileName.replace(/\.(md|txt)$/, '').replace(/[_-]/g, ' ');
  }

  /**
   * Count words in content
   */
  private countWords(content: string): number {
    // Remove markdown syntax and count words
    const cleanContent = content
      .replace(/#{1,6}\s+/g, '') // Remove headings
      .replace(/\*\*(.+?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.+?)\*/g, '$1') // Remove italic
      .replace(/\[(.+?)\]\(.+?\)/g, '$1') // Remove links
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/`(.+?)`/g, '$1') // Remove inline code
      .replace(/\n/g, ' ') // Replace newlines with spaces
      .trim();

    return cleanContent.split(/\s+/).filter(word => word.length > 0).length;
  }

  /**
   * Calculate reading time in minutes
   */
  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = this.countWords(content);
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Extract tags from content
   */
  private extractTags(content: string): string[] {
    const tags: string[] = [];
    
    // Look for tags in frontmatter
    const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const tagsMatch = frontmatterMatch[1].match(/tags:\s*\[(.*?)\]/);
      if (tagsMatch) {
        const tagList = tagsMatch[1].split(',').map(tag => tag.trim().replace(/["']/g, ''));
        tags.push(...tagList);
      }
    }

    // Extract category-based tags
    // const categoryTags = {
    //   'foundation': ['brand', 'persona', 'messaging'],
    //   'campaign-core': ['campaign', 'marketing', 'strategy'],
    //   'email-marketing': ['email', 'sequence', 'automation'],
    //   'advertising': ['ads', 'copy', 'paid-marketing'],
    //   'visual-assets': ['design', 'visual', 'branding'],
    //   'supporting-materials': ['research', 'analysis', 'support'],
    //   'project-management': ['project', 'management', 'planning'],
    //   'templates-master': ['template', 'system', 'framework'],
    //   'strategic-analysis': ['strategy', 'analysis', 'business'],
    //   'reference-materials': ['reference', 'documentation', 'guide']
    // };

    // Add default tags based on content
    if (content.toLowerCase().includes('heyzack')) tags.push('heyzack');
    if (content.toLowerCase().includes('smart home')) tags.push('smart-home');
    if (content.toLowerCase().includes('ai')) tags.push('ai');
    if (content.toLowerCase().includes('automation')) tags.push('automation');

    return [...new Set(tags)]; // Remove duplicates
  }

  /**
   * Clear cache and reload
   */
  async reload(): Promise<void> {
    this.documentCache.clear();
    this.isInitialized = false;
    await this.initialize();
  }
}