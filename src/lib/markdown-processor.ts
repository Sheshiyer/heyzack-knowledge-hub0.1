import matter from 'gray-matter';
import { ProcessedDocument, DocumentMetadata, MermaidDiagram, DocumentHeading } from '@/types/document';

export class MarkdownProcessor {
  private static instance: MarkdownProcessor;
  private documents: Map<string, ProcessedDocument> = new Map();

  static getInstance(): MarkdownProcessor {
    if (!MarkdownProcessor.instance) {
      MarkdownProcessor.instance = new MarkdownProcessor();
    }
    return MarkdownProcessor.instance;
  }

  /**
   * Process a markdown file and extract all relevant information
   */
  processMarkdownFile(filePath: string, rawContent: string): ProcessedDocument {
    const { data: frontmatter, content } = matter(rawContent);
    
    const slug = this.generateSlug(filePath);
    const id = this.generateId(filePath);
    const category = this.extractCategory(filePath);
    
    const metadata: DocumentMetadata = {
      title: frontmatter.title || this.extractTitleFromContent(content) || this.generateTitleFromPath(filePath),
      description: frontmatter.description || this.extractDescription(content),
      category,
      tags: frontmatter.tags || this.extractTags(content),
      author: frontmatter.author,
      lastModified: frontmatter.lastModified || new Date().toISOString(),
      difficulty: frontmatter.difficulty || 'intermediate',
      estimatedReadTime: this.calculateReadTime(content),
      relatedDocuments: frontmatter.relatedDocuments || []
    };

    const mermaidDiagrams = this.extractMermaidDiagrams(content);
    const headings = this.extractHeadings(content);
    const searchableContent = this.createSearchableContent(metadata, content);
    
    const processedDoc: ProcessedDocument = {
      id,
      slug,
      filePath,
      metadata,
      content,
      rawContent,
      wordCount: this.countWords(content),
      hasMermaidDiagrams: mermaidDiagrams.length > 0,
      mermaidDiagrams,
      headings,
      searchableContent
    };

    this.documents.set(id, processedDoc);
    return processedDoc;
  }

  /**
   * Extract mermaid diagrams from markdown content
   */
  private extractMermaidDiagrams(content: string): MermaidDiagram[] {
    const mermaidRegex = /```mermaid\s*\n([\s\S]*?)\n```/g;
    const diagrams: MermaidDiagram[] = [];
    let match;
    let index = 0;

    while ((match = mermaidRegex.exec(content)) !== null) {
      const diagramContent = match[1].trim();
      const type = this.detectMermaidType(diagramContent);
      const title = this.extractDiagramTitle(diagramContent);
      
      diagrams.push({
        id: `mermaid-${index++}`,
        type,
        content: diagramContent,
        title
      });
    }

    return diagrams;
  }

  /**
   * Detect the type of mermaid diagram
   */
  private detectMermaidType(content: string): MermaidDiagram['type'] {
    const firstLine = content.split('\n')[0].toLowerCase().trim();
    
    if (firstLine.includes('graph') || firstLine.includes('flowchart')) return 'flowchart';
    if (firstLine.includes('sequencediagram')) return 'sequence';
    if (firstLine.includes('gantt')) return 'gantt';
    if (firstLine.includes('pie')) return 'pie';
    if (firstLine.includes('gitgraph')) return 'gitgraph';
    
    return 'other';
  }

  /**
   * Extract title from mermaid diagram if present
   */
  private extractDiagramTitle(content: string): string | undefined {
    const titleMatch = content.match(/title\s+(.+)/i);
    return titleMatch ? titleMatch[1].trim() : undefined;
  }

  /**
   * Extract headings from markdown content
   */
  private extractHeadings(content: string): DocumentHeading[] {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: DocumentHeading[] = [];
    let match;
    let index = 0;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const anchor = this.generateAnchor(text);
      
      headings.push({
        id: `heading-${index++}`,
        level,
        text,
        anchor
      });
    }

    return headings;
  }

  /**
   * Generate URL-friendly anchor from heading text
   */
  private generateAnchor(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }

  /**
   * Extract title from markdown content (first h1)
   */
  private extractTitleFromContent(content: string): string | null {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    return titleMatch ? titleMatch[1].trim() : null;
  }

  /**
   * Generate title from file path
   */
  private generateTitleFromPath(filePath: string): string {
    const fileName = filePath.split('/').pop() || '';
    return fileName
      .replace(/\.md$/, '')
      .replace(/HeyZack_/, '')
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .trim()
      .replace(/\s+/g, ' ');
  }

  /**
   * Extract description from content (first paragraph)
   */
  private extractDescription(content: string): string | undefined {
    // Remove title and find first substantial paragraph
    const withoutTitle = content.replace(/^#\s+.+$/m, '').trim();
    const paragraphs = withoutTitle.split('\n\n');
    
    for (const paragraph of paragraphs) {
      const cleaned = paragraph.trim().replace(/^[#>\-*+]\s*/, '');
      if (cleaned.length > 50 && !cleaned.startsWith('```')) {
        return cleaned.substring(0, 200) + (cleaned.length > 200 ? '...' : '');
      }
    }
    
    return undefined;
  }

  /**
   * Extract tags from content
   */
  private extractTags(content: string): string[] {
    const tags = new Set<string>();
    
    // Extract from common patterns
    const tagPatterns = [
      /\*\*([A-Z][a-zA-Z\s]+)\*\*/g, // Bold text
      /#([a-zA-Z]+)/g, // Hashtags
      /\[([A-Z][a-zA-Z\s]+)\]/g // Bracketed text
    ];
    
    tagPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        const tag = match[1].trim().toLowerCase();
        if (tag.length > 2 && tag.length < 20) {
          tags.add(tag);
        }
      }
    });
    
    return Array.from(tags).slice(0, 10); // Limit to 10 tags
  }

  /**
   * Calculate estimated reading time
   */
  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = this.countWords(content);
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Count words in content
   */
  private countWords(content: string): number {
    return content
      .replace(/```[\s\S]*?```/g, '') // Remove code blocks
      .replace(/[^\w\s]/g, ' ') // Replace non-word chars with spaces
      .split(/\s+/)
      .filter(word => word.length > 0)
      .length;
  }

  /**
   * Extract category from file path
   */
  private extractCategory(filePath: string): string {
    const pathParts = filePath.split('/');
    const folderName = pathParts.find(part => part.match(/^\d{2}_/));
    
    if (folderName) {
      return folderName.replace(/^\d{2}_/, '').replace(/_/g, ' ').toLowerCase();
    }
    
    return 'uncategorized';
  }

  /**
   * Generate unique ID from file path
   */
  private generateId(filePath: string): string {
    return filePath
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .toLowerCase();
  }

  /**
   * Generate URL slug from file path
   */
  private generateSlug(filePath: string): string {
    const fileName = filePath.split('/').pop() || '';
    return fileName
      .replace(/\.md$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-');
  }

  /**
   * Create searchable content combining all text
   */
  private createSearchableContent(metadata: DocumentMetadata, content: string): string {
    const parts = [
      metadata.title,
      metadata.description || '',
      metadata.tags?.join(' ') || '',
      content.replace(/```[\s\S]*?```/g, '') // Remove code blocks
    ];
    
    return parts.join(' ').toLowerCase();
  }

  /**
   * Get all processed documents
   */
  getAllDocuments(): ProcessedDocument[] {
    return Array.from(this.documents.values());
  }

  /**
   * Get document by ID
   */
  getDocument(id: string): ProcessedDocument | undefined {
    return this.documents.get(id);
  }

  /**
   * Get documents by category
   */
  getDocumentsByCategory(category: string): ProcessedDocument[] {
    return this.getAllDocuments().filter(doc => doc.metadata.category === category);
  }

  /**
   * Clear all processed documents
   */
  clear(): void {
    this.documents.clear();
  }
}