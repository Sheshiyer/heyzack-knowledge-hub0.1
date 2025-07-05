import Fuse from 'fuse.js';
import { ProcessedDocument, SearchResult, SearchMatch } from '@/types/document';
import { DocumentIndexer } from './document-indexer';

interface FuseSearchResult {
  item: ProcessedDocument;
  score?: number;
  matches?: Array<{
    indices: [number, number][];
    value?: string;
    key?: string;
  }>;
}

export class SearchEngine {
  private static instance: SearchEngine;
  private fuse: Fuse<ProcessedDocument> | null = null;
  private indexer: DocumentIndexer;

  private constructor() {
    this.indexer = DocumentIndexer.getInstance();
  }

  static getInstance(): SearchEngine {
    if (!SearchEngine.instance) {
      SearchEngine.instance = new SearchEngine();
    }
    return SearchEngine.instance;
  }

  /**
   * Initialize the search engine with documents
   */
  async initialize(): Promise<void> {
    await this.indexer.indexDocuments();
    const documents = this.indexer.getAllDocuments();
    
    const options = {
      keys: [
        {
          name: 'metadata.title',
          weight: 0.4
        },
        {
          name: 'metadata.description',
          weight: 0.3
        },
        {
          name: 'searchableContent',
          weight: 0.2
        },
        {
          name: 'metadata.tags',
          weight: 0.1
        }
      ],
      threshold: 0.4, // Lower = more strict matching
      distance: 100,
      maxPatternLength: 32,
      minMatchCharLength: 2,
      includeScore: true,
      includeMatches: true,
      findAllMatches: true
    };

    this.fuse = new Fuse(documents, options);
  }

  /**
   * Search documents with query
   */
  search(query: string, limit: number = 10): SearchResult[] {
    if (!this.fuse || !query.trim()) {
      return [];
    }

    const fuseResults = this.fuse.search(query, { limit }) as FuseSearchResult[];
    
    return fuseResults.map(result => {
      const matches: SearchMatch[] = [];
      
      if (result.matches) {
        result.matches.forEach(match => {
          if (match.key && match.indices) {
            const field = this.mapFuseKeyToSearchField(match.key);
            matches.push({
              field,
              value: match.value || '',
              indices: match.indices as [number, number][]
            });
          }
        });
      }

      return {
        document: result.item,
        score: 1 - (result.score || 0), // Invert score so higher is better
        matches
      };
    });
  }

  /**
   * Search within a specific category
   */
  searchInCategory(query: string, category: string, limit: number = 10): SearchResult[] {
    const categoryDocuments = this.indexer.getDocumentsByCategory(category);
    
    if (!query.trim()) {
      return categoryDocuments.slice(0, limit).map(doc => ({
        document: doc,
        score: 1,
        matches: []
      }));
    }

    const categoryFuse = new Fuse(categoryDocuments, {
      keys: [
        { name: 'metadata.title', weight: 0.4 },
        { name: 'metadata.description', weight: 0.3 },
        { name: 'searchableContent', weight: 0.2 },
        { name: 'metadata.tags', weight: 0.1 }
      ],
      threshold: 0.4,
      includeScore: true,
      includeMatches: true
    });

    const results = categoryFuse.search(query, { limit }) as FuseSearchResult[];
    
    return results.map(result => {
      const matches: SearchMatch[] = [];
      
      if (result.matches) {
        result.matches.forEach(match => {
          if (match.key && match.indices) {
            const field = this.mapFuseKeyToSearchField(match.key);
            matches.push({
              field,
              value: match.value || '',
              indices: match.indices as [number, number][]
            });
          }
        });
      }

      return {
        document: result.item,
        score: 1 - (result.score || 0),
        matches
      };
    });
  }

  /**
   * Search by tags
   */
  searchByTags(tags: string[], limit: number = 10): SearchResult[] {
    const documents = this.indexer.getAllDocuments();
    
    const matchingDocs = documents.filter(doc => {
      if (!doc.metadata.tags) return false;
      return tags.some(tag => 
        doc.metadata.tags!.some(docTag => 
          docTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
    });

    // Sort by number of matching tags
    const sortedDocs = matchingDocs
      .map(doc => {
        const matchCount = tags.filter(tag => 
          doc.metadata.tags!.some(docTag => 
            docTag.toLowerCase().includes(tag.toLowerCase())
          )
        ).length;
        
        return {
          document: doc,
          score: matchCount / tags.length,
          matches: tags.map(tag => ({
            field: 'tags' as const,
            value: tag,
            indices: [[0, tag.length]] as [number, number][]
          }))
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return sortedDocs;
  }

  /**
   * Get search suggestions based on partial query
   */
  getSuggestions(partialQuery: string, limit: number = 5): string[] {
    if (!partialQuery.trim() || partialQuery.length < 2) {
      return this.getPopularSearchTerms(limit);
    }

    const documents = this.indexer.getAllDocuments();
    const suggestions = new Set<string>();

    // Extract suggestions from titles
    documents.forEach(doc => {
      const title = doc.metadata.title.toLowerCase();
      if (title.includes(partialQuery.toLowerCase())) {
        suggestions.add(doc.metadata.title);
      }

      // Extract suggestions from tags
      doc.metadata.tags?.forEach(tag => {
        if (tag.toLowerCase().includes(partialQuery.toLowerCase())) {
          suggestions.add(tag);
        }
      });
    });

    return Array.from(suggestions).slice(0, limit);
  }

  /**
   * Get popular search terms (mock implementation)
   */
  private getPopularSearchTerms(limit: number): string[] {
    const popularTerms = [
      'campaign strategy',
      'email templates',
      'brand guidelines',
      'persona',
      'launch sequence',
      'visual assets',
      'competitor research',
      'pricing calculator',
      'business model',
      'go-to-market'
    ];
    
    return popularTerms.slice(0, limit);
  }

  /**
   * Map Fuse.js key to our SearchMatch field type
   */
  private mapFuseKeyToSearchField(key: string): SearchMatch['field'] {
    if (key.includes('title')) return 'title';
    if (key.includes('description')) return 'description';
    if (key.includes('tags')) return 'tags';
    return 'content';
  }

  /**
   * Highlight search matches in text
   */
  highlightMatches(text: string, matches: SearchMatch[]): string {
    if (!matches.length) return text;

    let highlightedText = text;
    let offset = 0;

    // Sort matches by start position (descending) to avoid offset issues
    const sortedMatches = matches
      .flatMap(match => match.indices)
      .sort((a, b) => b[0] - a[0]);

    sortedMatches.forEach(([start, end]) => {
      const before = highlightedText.slice(0, start + offset);
      const match = highlightedText.slice(start + offset, end + 1 + offset);
      const after = highlightedText.slice(end + 1 + offset);
      
      highlightedText = before + `<mark class="bg-yellow-200 dark:bg-yellow-800">${match}</mark>` + after;
      offset += '<mark class="bg-yellow-200 dark:bg-yellow-800"></mark>'.length;
    });

    return highlightedText;
  }

  /**
   * Get related documents based on tags and content similarity
   */
  getRelatedDocuments(document: ProcessedDocument, limit: number = 5): ProcessedDocument[] {
    const allDocuments = this.indexer.getAllDocuments()
      .filter(doc => doc.id !== document.id);

    if (!document.metadata.tags?.length) {
      // If no tags, return documents from same category
      return this.indexer.getDocumentsByCategory(document.metadata.category)
        .filter(doc => doc.id !== document.id)
        .slice(0, limit);
    }

    // Score documents based on tag overlap
    const scoredDocuments = allDocuments.map(doc => {
      let score = 0;
      
      // Tag similarity
      if (doc.metadata.tags) {
        const commonTags = document.metadata.tags!.filter(tag => 
          doc.metadata.tags!.includes(tag)
        );
        score += commonTags.length * 2;
      }
      
      // Category similarity
      if (doc.metadata.category === document.metadata.category) {
        score += 1;
      }
      
      return { document: doc, score };
    });

    return scoredDocuments
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.document);
  }

  /**
   * Check if search engine is initialized
   */
  isInitialized(): boolean {
    return this.fuse !== null;
  }

  /**
   * Re-initialize search engine (useful after document updates)
   */
  async reinitialize(): Promise<void> {
    this.fuse = null;
    await this.initialize();
  }
}