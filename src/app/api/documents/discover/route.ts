import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * API endpoint to dynamically discover all markdown files in data-sources directory
 * This enables automatic detection of new files without manual updates to the indexer
 */
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  try {
    const dataSourcesPath = path.join(process.cwd(), 'data-sources');
    const markdownFiles = await discoverMarkdownFiles(dataSourcesPath);
    
    return NextResponse.json({
      success: true,
      files: markdownFiles,
      count: markdownFiles.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error discovering markdown files:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to discover markdown files',
        files: [],
        count: 0
      },
      { status: 500 }
    );
  }
}

/**
 * Recursively discover all markdown files in a directory
 */
async function discoverMarkdownFiles(dirPath: string, relativePath = ''): Promise<string[]> {
  const files: string[] = [];
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativeFilePath = path.join(relativePath, entry.name).replace(/\\/g, '/');
      
      if (entry.isDirectory()) {
        // Skip hidden directories and node_modules
        if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
          const subFiles = await discoverMarkdownFiles(fullPath, relativeFilePath);
          files.push(...subFiles);
        }
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        // Add markdown files with data-sources prefix for frontend consumption
        files.push(`data-sources/${relativeFilePath}`);
      }
    }
  } catch (error) {
    console.warn(`Failed to read directory ${dirPath}:`, error);
  }
  
  return files.sort(); // Sort for consistent ordering
}

/**
 * POST endpoint to trigger manual refresh of document index
 */
export async function POST() {
  try {
    const dataSourcesPath = path.join(process.cwd(), 'data-sources');
    const markdownFiles = await discoverMarkdownFiles(dataSourcesPath);
    
    // Get file modification times for change detection
    const filesWithStats = await Promise.all(
      markdownFiles.map(async (file) => {
        try {
          const fullPath = path.join(process.cwd(), file);
          const stats = await fs.stat(fullPath);
          return {
            path: file,
            lastModified: stats.mtime.toISOString(),
            size: stats.size
          };
        } catch (error) {
          console.warn(`Failed to get stats for ${file}:`, error);
          return {
            path: file,
            lastModified: new Date().toISOString(),
            size: 0
          };
        }
      })
    );
    
    return NextResponse.json({
      success: true,
      files: filesWithStats,
      count: filesWithStats.length,
      timestamp: new Date().toISOString(),
      action: 'refresh_triggered'
    });
  } catch (error) {
    console.error('Error refreshing document index:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to refresh document index'
      },
      { status: 500 }
    );
  }
}