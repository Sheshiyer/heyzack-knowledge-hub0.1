/**
 * File Reader Utility for HeyZack Knowledge Hub
 * Handles reading markdown files from the data-sources directory
 */

export interface FileMetadata {
  path: string;
  name: string;
  size: number;
  lastModified: Date;
  category: string;
}

export class FileReader {
  private static instance: FileReader;
  private fileCache = new Map<string, string>();
  private metadataCache = new Map<string, FileMetadata>();

  private constructor() {}

  static getInstance(): FileReader {
    if (!FileReader.instance) {
      FileReader.instance = new FileReader();
    }
    return FileReader.instance;
  }

  /**
   * Read a markdown file from the data-sources directory
   */
  async readFile(filePath: string): Promise<string> {
    // Check cache first
    if (this.fileCache.has(filePath)) {
      return this.fileCache.get(filePath)!;
    }

    try {
      // Ensure the path starts with data-sources/
      const normalizedPath = filePath.startsWith('data-sources/') 
        ? filePath 
        : `data-sources/${filePath}`;

      const response = await fetch(`/${normalizedPath}`);
      
      if (!response.ok) {
        throw new Error(`Failed to read file: ${response.status} ${response.statusText}`);
      }

      const content = await response.text();
      
      // Cache the content
      this.fileCache.set(filePath, content);
      
      return content;
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      throw new Error(`Failed to read file: ${filePath}`);
    }
  }

  /**
   * Get file metadata
   */
  async getFileMetadata(filePath: string): Promise<FileMetadata> {
    // Check cache first
    if (this.metadataCache.has(filePath)) {
      return this.metadataCache.get(filePath)!;
    }

    try {
      const normalizedPath = filePath.startsWith('data-sources/') 
        ? filePath 
        : `data-sources/${filePath}`;

      const response = await fetch(`/${normalizedPath}`, { method: 'HEAD' });
      
      if (!response.ok) {
        throw new Error(`Failed to get file metadata: ${response.status}`);
      }

      const metadata: FileMetadata = {
        path: filePath,
        name: filePath.split('/').pop() || '',
        size: parseInt(response.headers.get('content-length') || '0'),
        lastModified: new Date(response.headers.get('last-modified') || Date.now()),
        category: this.extractCategoryFromPath(filePath)
      };

      // Cache the metadata
      this.metadataCache.set(filePath, metadata);
      
      return metadata;
    } catch (error) {
      console.error(`Error getting metadata for ${filePath}:`, error);
      // Return default metadata
      return {
        path: filePath,
        name: filePath.split('/').pop() || '',
        size: 0,
        lastModified: new Date(),
        category: this.extractCategoryFromPath(filePath)
      };
    }
  }

  /**
   * Extract category from file path
   */
  private extractCategoryFromPath(filePath: string): string {
    const pathParts = filePath.split('/');
    
    if (pathParts.length < 2) {
      return 'general';
    }

    // Map directory names to categories
    const dirName = pathParts[1];
    const categoryMap: Record<string, string> = {
      '01_Foundation': 'foundation',
      '02_Campaign_Core': 'campaign-core',
      '03_Email_Marketing': 'email-marketing',
      '04_Advertising': 'advertising',
      '05_Visual_Assets': 'visual-assets',
      '06_Supporting_Materials': 'supporting-materials',
      '07_Project_Management': 'project-management',
      '08_Templates_Master': 'templates-master',
      '09_Strategic_Analysis': 'strategic-analysis',
      '10_Reference_Materials': 'reference-materials'
    };

    return categoryMap[dirName] || 'general';
  }

  /**
   * Check if a file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    try {
      const normalizedPath = filePath.startsWith('data-sources/') 
        ? filePath 
        : `data-sources/${filePath}`;

      const response = await fetch(`/${normalizedPath}`, { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.fileCache.clear();
    this.metadataCache.clear();
  }

  /**
   * Get all available markdown files
   */
  getAvailableFiles(): string[] {
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
      'data-sources/06_Supporting_Materials/HeyZack_PressRelease.md',
      'data-sources/06_Supporting_Materials/HeyZack_PricingCalculator.md',
      'data-sources/06_Supporting_Materials/HeyZack_SocialMediaContentCalendar.md',

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
      'data-sources/10_Reference_Materials/AI_Ready_Business_Context.txt',

      // Campaign Core Subdirectory
      'data-sources/02_Campaign_Core/launch_campaign_idea_drafts/idea_oldvsnew.md'
    ];
  }
}