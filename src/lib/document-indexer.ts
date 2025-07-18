import { ProcessedDocument, DocumentStats, DOCUMENT_CATEGORIES } from '@/types/document';
import { MarkdownProcessor } from './markdown-processor';

export class DocumentIndexer {
  private static instance: DocumentIndexer;
  private processor: MarkdownProcessor;
  private isIndexed = false;
  private indexingPromise: Promise<void> | null = null;
  private lastFileCount = 0;
  private autoRefreshInterval: NodeJS.Timeout | null = null;
  private lastRefreshTime = 0;

  private constructor() {
    this.processor = MarkdownProcessor.getInstance();
    this.startAutoRefresh();
  }

  static getInstance(): DocumentIndexer {
    if (!DocumentIndexer.instance) {
      DocumentIndexer.instance = new DocumentIndexer();
    }
    return DocumentIndexer.instance;
  }

  /**
   * Index all markdown files in the data-sources directory
   */
  async indexDocuments(): Promise<void> {
    if (this.isIndexed) return;
    if (this.indexingPromise) return this.indexingPromise;

    this.indexingPromise = this.performIndexing();
    await this.indexingPromise;
    this.isIndexed = true;
  }

  private async performIndexing(): Promise<void> {
    try {
      // Clear existing documents
      this.processor.clear();

      // Define the markdown files to process
      const markdownFiles = await this.getMarkdownFileList();

      // Process each file
      for (const filePath of markdownFiles) {
        try {
          const content = await this.readMarkdownFile(filePath);
          this.processor.processMarkdownFile(filePath, content);
        } catch (error) {
          console.warn(`Failed to process file ${filePath}:`, error);
        }
      }

      // Update file count for auto-refresh tracking
      this.lastFileCount = markdownFiles.length;
      console.log(`Successfully indexed ${markdownFiles.length} documents`);
    } catch (error) {
      console.error('Failed to index documents:', error);
      throw error;
    }
  }

  /**
   * Get list of all markdown files to process using dynamic discovery
   */
  private async getMarkdownFileList(): Promise<string[]> {
    try {
      // Try to use dynamic file discovery API
      // Use Cloudflare Worker endpoint when deployed, fallback to local API
      const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || '';
      const apiUrl = workerUrl ? `${workerUrl}/api/documents/discover` : '/api/documents/discover';
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.files)) {
          console.log(`Dynamically discovered ${data.files.length} markdown files`);
          return data.files;
        }
      }
      
      console.warn('Dynamic file discovery failed, falling back to static list');
    } catch (error) {
      console.warn('Error during dynamic file discovery:', error);
    }
    
    // Fallback to static list if dynamic discovery fails
    return this.getStaticMarkdownFileList();
  }

  /**
   * Static fallback list of markdown files
   */
  private getStaticMarkdownFileList(): string[] {
    return [
      // Wiki Hub
      'data-sources/00_Wiki_Hub_README.md',
      'data-sources/README.md',
      'data-sources/tasks.md',
      'data-sources/HEYZACK_REPOSITORY_ANALYSIS_REPORT.md',
      'data-sources/REACT_DASHBOARD_IMPLEMENTATION_PROMPT.md',

      // Foundation documents
      'data-sources/01_Foundation/HeyZack_BrandVisualIdentityGuide.md',
      'data-sources/01_Foundation/HeyZack_Brand_Reference.md',
      'data-sources/01_Foundation/HeyZack_BuyerPersonaTemplate.md',
      'data-sources/01_Foundation/HeyZack_MDS_MessagingDirectionSummary.md',
      'data-sources/01_Foundation/HeyZack_ProductPositioningSummary.md',
      'data-sources/01_Foundation/david-chen.md',
      'data-sources/01_Foundation/stage1-early-adopters-personas.md',
      'data-sources/01_Foundation/stage2-hype-cycle-personas.md',
      'data-sources/01_Foundation/stage3-validation-personas.md',

      // Campaign Core
      'data-sources/02_Campaign_Core/HeyZack_CampaignPageCopy_Customized.md',
      'data-sources/02_Campaign_Core/HeyZack_CampaignPageVisualHierarchy.md',
      'data-sources/02_Campaign_Core/HeyZack_CampaignVideoScript_Customized.md',
      'data-sources/02_Campaign_Core/HeyZack_DetailedProductDescriptions.md',
      'data-sources/02_Campaign_Core/HeyZack_Implementation_Roadmap.md',
      'data-sources/02_Campaign_Core/HeyZack_LandingPageCopy.md',
      'data-sources/02_Campaign_Core/HeyZack_StageSpecific_CampaignConcepts.md',
      'data-sources/02_Campaign_Core/HeyZack_ThreeStage_CampaignStrategy.md',
      'data-sources/02_Campaign_Core/HeyZack_VideoScript_Templates.md',
      'data-sources/02_Campaign_Core/enhanced_founder_script.md',
      'data-sources/02_Campaign_Core/founder_story_framework.md',
      'data-sources/02_Campaign_Core/gary_founder_scripts.md',

      // Email Marketing
      'data-sources/03_Email_Marketing/HeyZack_EmailTemplateVisualGuidelines.md',
      'data-sources/03_Email_Marketing/HeyZack_LaunchEmailSequence.md',
      'data-sources/03_Email_Marketing/HeyZack_PreLaunchEmailSequence.md',
      'data-sources/03_Email_Marketing/HeyZack_WelcomeEmailSequence.md',

      // Advertising
      'data-sources/04_Advertising/HeyZack_AdCopyVariations.md',
      'data-sources/04_Advertising/HeyZack_LiveCampaignAdsCopy.md',
      'data-sources/04_Advertising/HeyZack_PreLaunchAdsCopy.md',

      // Visual Assets
      'data-sources/05_Visual_Assets/HeyZack_CampaignVisualTimeline.md',
      'data-sources/05_Visual_Assets/HeyZack_InfographicTemplates.md',
      'data-sources/05_Visual_Assets/HeyZack_PackagingProductPhotographyGuidelines.md',
      'data-sources/05_Visual_Assets/HeyZack_VideoProductionBrief.md',
      'data-sources/05_Visual_Assets/HeyZack_VisualAssetChecklist.md',

      // Supporting Materials
      'data-sources/06_Supporting_Materials/HeyZack_CompetitorResearch.md',
      'data-sources/06_Supporting_Materials/HeyZack_Kickstarter_Kit_Concepts.md',
      'data-sources/06_Supporting_Materials/HeyZack_PressRelease.md',
      'data-sources/06_Supporting_Materials/HeyZack_PricingCalculator.md',
      'data-sources/06_Supporting_Materials/HeyZack_SocialMediaContentCalendar.md',
      'data-sources/06_Supporting_Materials/HeyZack_Unconventional_Kit_Concepts.md',

      // Project Management
      'data-sources/07_Project_Management/memory.md',
      'data-sources/07_Project_Management/product-list.md',
      'data-sources/07_Project_Management/todo.md',

      // Templates Master
      'data-sources/08_Templates_Master/README_Template_System.md',

      // Strategic Analysis
      'data-sources/09_Strategic_Analysis/HeyZack_Business_Model_Canvas.md',
      'data-sources/09_Strategic_Analysis/HeyZack_Go-to-Market_Strategy_Stage1_Optimization.md',
      'data-sources/09_Strategic_Analysis/HeyZack_Porters_Five_Forces_Analysis.md',

      // Reference Materials
      'data-sources/10_Reference_Materials/AI_Ready_Business_Context.txt'
    ];
  }

  /**
   * Read markdown file content
   */
  private async readMarkdownFile(filePath: string): Promise<string> {
    try {
      const response = await fetch(`/${filePath}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error(`Failed to read file ${filePath}:`, error);
      throw error;
    }
  }

  /**
   * Get all processed documents
   */
  getAllDocuments(): ProcessedDocument[] {
    return this.processor.getAllDocuments();
  }

  /**
   * Get document by ID
   */
  getDocument(id: string): ProcessedDocument | undefined {
    return this.processor.getDocument(id);
  }

  /**
   * Get documents by category
   */
  getDocumentsByCategory(category: string): ProcessedDocument[] {
    return this.processor.getDocumentsByCategory(category);
  }

  /**
   * Get document statistics
   */
  getDocumentStats(): DocumentStats {
    const documents = this.getAllDocuments();
    const totalWords = documents.reduce((sum, doc) => sum + doc.wordCount, 0);
    const lastUpdated = documents
      .map(doc => new Date(doc.metadata.lastModified || 0))
      .reduce((latest, date) => date > latest ? date : latest, new Date(0))
      .toISOString();

    // Get most viewed documents (mock data for now)
    const mostViewedDocuments = documents
      .slice(0, 5)
      .sort((a, b) => b.wordCount - a.wordCount);

    // Get recently updated documents
    const recentlyUpdated = documents
      .sort((a, b) => {
        const dateA = new Date(a.metadata.lastModified || 0);
        const dateB = new Date(b.metadata.lastModified || 0);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 5);

    return {
      totalDocuments: documents.length,
      totalCategories: DOCUMENT_CATEGORIES.length,
      totalWords,
      lastUpdated,
      mostViewedDocuments,
      recentlyUpdated
    };
  }

  /**
   * Get category statistics
   */
  getCategoryStats() {
    const documents = this.getAllDocuments();
    const categoryStats = new Map<string, number>();

    documents.forEach(doc => {
      const category = doc.metadata.category;
      categoryStats.set(category, (categoryStats.get(category) || 0) + 1);
    });

    return DOCUMENT_CATEGORIES.map(category => ({
      ...category,
      documentCount: categoryStats.get(category.name.toLowerCase()) || 0
    }));
  }

  /**
   * Check if documents are indexed
   */
  isDocumentsIndexed(): boolean {
    return this.isIndexed;
  }

  /**
   * Force re-indexing of all documents
   */
  async reindex(): Promise<void> {
    this.isIndexed = false;
    this.indexingPromise = null;
    this.lastRefreshTime = Date.now();
    await this.indexDocuments();
  }

  /**
   * Start automatic refresh checking for new files
   */
  private startAutoRefresh(): void {
    // Check for new files every 30 seconds
    this.autoRefreshInterval = setInterval(async () => {
      await this.checkForUpdates();
    }, 30000);
  }

  /**
   * Stop automatic refresh
   */
  stopAutoRefresh(): void {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
      this.autoRefreshInterval = null;
    }
  }

  /**
   * Check for file updates and refresh if needed
   */
  private async checkForUpdates(): Promise<void> {
    try {
      // Avoid too frequent checks
      const now = Date.now();
      if (now - this.lastRefreshTime < 10000) { // 10 second minimum interval
        return;
      }

      const workerUrl = process.env.NEXT_PUBLIC_WORKER_URL || '';
      const apiUrl = workerUrl ? `${workerUrl}/api/documents/discover` : '/api/documents/discover';
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.files)) {
          // Check if file count changed
          if (data.files.length !== this.lastFileCount) {
            console.log(`File count changed: ${this.lastFileCount} → ${data.files.length}. Refreshing...`);
            this.lastFileCount = data.files.length;
            await this.reindex();
          }
        }
      }
    } catch (error) {
      console.warn('Auto-refresh check failed:', error);
    }
  }

  /**
   * Manual refresh trigger with force option
   */
  async refreshDocuments(force = false): Promise<{ success: boolean; newCount: number; previousCount: number }> {
    try {
      const previousCount = this.getAllDocuments().length;
      
      if (force) {
        await this.reindex();
      } else {
        await this.checkForUpdates();
      }
      
      const newCount = this.getAllDocuments().length;
      
      return {
        success: true,
        newCount,
        previousCount
      };
    } catch (error) {
      console.error('Manual refresh failed:', error);
      return {
        success: false,
        newCount: 0,
        previousCount: 0
      };
    }
  }

  /**
   * Get documents with mermaid diagrams
   */
  getDocumentsWithDiagrams(): ProcessedDocument[] {
    return this.getAllDocuments().filter(doc => doc.hasMermaidDiagrams);
  }

  /**
   * Get all unique tags
   */
  getAllTags(): string[] {
    const tagSet = new Set<string>();
    this.getAllDocuments().forEach(doc => {
      doc.metadata.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }

  /**
   * Get documents by tag
   */
  getDocumentsByTag(tag: string): ProcessedDocument[] {
    return this.getAllDocuments().filter(doc => 
      doc.metadata.tags?.includes(tag)
    );
  }
}