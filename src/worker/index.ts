/**
 * Cloudflare Worker for HeyZack Knowledge Hub
 * Handles document discovery, caching, and search functionality
 */

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
  delete(key: string): Promise<void>;
  list(): Promise<{ keys: { name: string }[] }>;
}

interface Env {
  DOCUMENTS_KV: KVNamespace;
  SEARCH_INDEX_KV: KVNamespace;
  GITHUB_REPO: string;
  GITHUB_OWNER: string;
  GITHUB_TOKEN?: string;
}



interface DiscoveryResponse {
  success: boolean;
  files: string[];
  count: number;
  lastUpdated: string;
}

interface GitHubFileItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  content?: string;
}

interface GitHubContentResponse {
  content: string;
}

const worker = {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Enable CORS for all requests
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Route handling
      if (path === '/api/documents/discover') {
        if (request.method === 'GET') {
          return await handleDocumentDiscovery(env, corsHeaders);
        } else if (request.method === 'POST') {
          return await handleForceRefresh(env, corsHeaders);
        }
      }

      if (path === '/api/documents/search') {
        return await handleSearch(request, env, corsHeaders);
      }

      if (path.startsWith('/api/documents/content/')) {
        const filePath = path.replace('/api/documents/content/', '');
        return await handleDocumentContent(filePath, env, corsHeaders);
      }

      // Default response for unknown routes
      return new Response('Not Found', { 
        status: 404, 
        headers: corsHeaders 
      });

    } catch (error) {
      console.error('Worker error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: error instanceof Error ? error.message : 'Unknown error' 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
  },
};

export default worker;

/**
 * Discover markdown files from GitHub repository
 */
async function handleDocumentDiscovery(env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    // Check cache first
    const cacheKey = 'document-discovery';
    const cached = await env.DOCUMENTS_KV.get(cacheKey);
    
    if (cached) {
      const cachedData = JSON.parse(cached);
      // Return cached data if less than 5 minutes old
      if (Date.now() - new Date(cachedData.lastUpdated).getTime() < 5 * 60 * 1000) {
        return new Response(cached, {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
    }

    // Fetch fresh data from GitHub
    const files = await discoverMarkdownFiles(env);
    
    const response: DiscoveryResponse = {
      success: true,
      files,
      count: files.length,
      lastUpdated: new Date().toISOString()
    };

    // Cache the response
    await env.DOCUMENTS_KV.put(cacheKey, JSON.stringify(response), {
      expirationTtl: 300 // 5 minutes
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Document discovery error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Discovery failed',
        files: [],
        count: 0
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

/**
 * Force refresh of document cache
 */
async function handleForceRefresh(env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    // Clear cache
    await env.DOCUMENTS_KV.delete('document-discovery');
    
    // Fetch fresh data
    const files = await discoverMarkdownFiles(env);
    
    const response: DiscoveryResponse = {
      success: true,
      files,
      count: files.length,
      lastUpdated: new Date().toISOString()
    };

    // Cache the fresh response
    await env.DOCUMENTS_KV.put('document-discovery', JSON.stringify(response), {
      expirationTtl: 300
    });

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Force refresh error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Refresh failed' 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

/**
 * Discover markdown files from GitHub repository
 */
async function discoverMarkdownFiles(env: Env): Promise<string[]> {
  const files: string[] = [];
  
  // GitHub API endpoint for repository contents
  const apiUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/data-sources`;
  
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'HeyZack-Knowledge-Hub-Worker',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const contents = await response.json() as GitHubFileItem[];
    
    // Process each item in the directory
    for (const item of contents) {
      if (item.type === 'file' && item.name.endsWith('.md')) {
        files.push(item.path);
      } else if (item.type === 'dir') {
        // Recursively get files from subdirectories
        const subFiles = await getFilesFromDirectory(item.path, env);
        files.push(...subFiles);
      }
    }

    return files;

  } catch (error) {
    console.error('Error discovering files:', error);
    // Return fallback list if GitHub API fails
    return getFallbackFileList();
  }
}

/**
 * Recursively get files from a directory
 */
async function getFilesFromDirectory(dirPath: string, env: Env): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const apiUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${dirPath}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'HeyZack-Knowledge-Hub-Worker',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      return files;
    }

    const contents = await response.json() as GitHubFileItem[];
    
    for (const item of contents) {
      if (item.type === 'file' && item.name.endsWith('.md')) {
        files.push(item.path);
      } else if (item.type === 'dir') {
        const subFiles = await getFilesFromDirectory(item.path, env);
        files.push(...subFiles);
      }
    }

  } catch (error) {
    console.error(`Error getting files from directory ${dirPath}:`, error);
  }

  return files;
}

/**
 * Handle document content requests
 */
async function handleDocumentContent(filePath: string, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    // Check cache first
    const cacheKey = `content:${filePath}`;
    const cached = await env.DOCUMENTS_KV.get(cacheKey);
    
    if (cached) {
      return new Response(cached, {
        headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
      });
    }

    // Fetch from GitHub
    const apiUrl = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${filePath}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'HeyZack-Knowledge-Hub-Worker',
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }

    const data = await response.json() as GitHubContentResponse;
    const content = atob(data.content.replace(/\s/g, ''));

    // Cache the content
    await env.DOCUMENTS_KV.put(cacheKey, content, {
      expirationTtl: 3600 // 1 hour
    });

    return new Response(content, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' }
    });

  } catch (error) {
    console.error('Document content error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Content fetch failed' 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

/**
 * Handle search requests
 */
async function handleSearch(request: Request, env: Env, corsHeaders: Record<string, string>): Promise<Response> {
  try {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');
    
    if (!query) {
      return new Response(
        JSON.stringify({ success: false, error: 'Query parameter required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Simple search implementation - can be enhanced with full-text search
    const files = await discoverMarkdownFiles(env);
    const results = files.filter(file => 
      file.toLowerCase().includes(query.toLowerCase())
    );

    return new Response(
      JSON.stringify({ 
        success: true, 
        results, 
        query, 
        count: results.length 
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Search failed' 
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}

/**
 * Fallback file list when GitHub API is unavailable
 */
function getFallbackFileList(): string[] {
  return [
    'data-sources/00_Wiki_Hub_README.md',
    'data-sources/01_Foundation/HeyZack_BrandVisualIdentityGuide.md',
    'data-sources/01_Foundation/HeyZack_Brand_Reference.md',
    'data-sources/01_Foundation/HeyZack_BuyerPersonaTemplate.md',
    'data-sources/01_Foundation/HeyZack_MDS_MessagingDirectionSummary.md',
    'data-sources/01_Foundation/HeyZack_ProductPositioningSummary.md',
    'data-sources/02_Campaign_Core/HeyZack_CampaignPageCopy_Customized.md',
    'data-sources/02_Campaign_Core/HeyZack_CampaignPageVisualHierarchy.md',
    'data-sources/02_Campaign_Core/HeyZack_CampaignVideoScript_Customized.md',
    'data-sources/02_Campaign_Core/HeyZack_DetailedProductDescriptions.md',
    'data-sources/02_Campaign_Core/HeyZack_VideoScript_Templates.md',
    'data-sources/02_Campaign_Core/enhanced_founder_script.md',
    'data-sources/02_Campaign_Core/founder_story_framework.md',
    'data-sources/02_Campaign_Core/gary_founder_scripts.md',
    'data-sources/03_Email_Marketing/HeyZack_EmailTemplateVisualGuidelines.md',
    'data-sources/03_Email_Marketing/HeyZack_LaunchEmailSequence.md',
    'data-sources/03_Email_Marketing/HeyZack_PreLaunchEmailSequence.md',
    'data-sources/03_Email_Marketing/HeyZack_WelcomeEmailSequence.md',
    'data-sources/04_Advertising/HeyZack_AdCopyVariations.md',
    'data-sources/04_Advertising/HeyZack_LiveCampaignAdsCopy.md',
    'data-sources/04_Advertising/HeyZack_PreLaunchAdsCopy.md',
    'data-sources/05_Visual_Assets/HeyZack_CampaignVisualTimeline.md',
    'data-sources/05_Visual_Assets/HeyZack_InfographicTemplates.md',
    'data-sources/05_Visual_Assets/HeyZack_PackagingProductPhotographyGuidelines.md',
    'data-sources/05_Visual_Assets/HeyZack_VideoProductionBrief.md',
    'data-sources/05_Visual_Assets/HeyZack_VisualAssetChecklist.md',
    'data-sources/06_Supporting_Materials/HeyZack_CompetitorResearch.md',
    'data-sources/06_Supporting_Materials/HeyZack_Kickstarter_Kit_Concepts.md',
    'data-sources/06_Supporting_Materials/HeyZack_PressRelease.md',
    'data-sources/06_Supporting_Materials/HeyZack_PricingCalculator.md',
    'data-sources/06_Supporting_Materials/HeyZack_SocialMediaContentCalendar.md',
    'data-sources/06_Supporting_Materials/HeyZack_Unconventional_Kit_Concepts.md',
    'data-sources/07_Project_Management/memory.md',
    'data-sources/07_Project_Management/todo.md',
    'data-sources/08_Templates_Master/README_Template_System.md',
    'data-sources/09_Strategic_Analysis/HeyZack_Business_Model_Canvas.md',
    'data-sources/09_Strategic_Analysis/HeyZack_Go-to-Market_Strategy_Stage1_Optimization.md',
    'data-sources/09_Strategic_Analysis/HeyZack_Porters_Five_Forces_Analysis.md',
    'data-sources/10_Reference_Materials/AI_Ready_Business_Context.txt'
  ];
}