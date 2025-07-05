'use client';

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  chart: string;
  id?: string;
  className?: string;
}

export function MermaidRenderer({ chart, id, className = '' }: MermaidRendererProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Mermaid with custom configuration
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      securityLevel: 'loose',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: 14,
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        padding: 20
      },
      sequence: {
        useMaxWidth: true,
        wrap: true,
        messageFontSize: 14,
        noteFontSize: 12
      },
      gantt: {
        useMaxWidth: true,
        fontSize: 12,
        gridLineStartPadding: 350
      },
      pie: {
        useMaxWidth: true
      },
      journey: {
        useMaxWidth: true
      },
      gitGraph: {
        useMaxWidth: true
      }
    });
  }, []);

  useEffect(() => {
    const renderChart = async () => {
      if (!chart.trim()) {
        setError('Empty chart content');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError('');
        
        // Generate a unique ID for this diagram
        const diagramId = id || `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        
        // Validate and render the chart
        const { svg: renderedSvg } = await mermaid.render(diagramId, chart);
        setSvg(renderedSvg);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError(`Failed to render diagram: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    renderChart();
  }, [chart, id]);

  if (isLoading) {
    return (
      <div className={`mermaid-container ${className}`}>
        <div className="flex items-center justify-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Rendering diagram...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`mermaid-container ${className}`}>
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-800">Diagram Rendering Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <details className="mt-2">
                <summary className="text-xs text-red-600 cursor-pointer hover:text-red-800">Show diagram source</summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-100 p-2 rounded overflow-x-auto">
                  <code>{chart}</code>
                </pre>
              </details>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`mermaid-container ${className}`}>
      <div className="mermaid-wrapper bg-white border border-gray-200 rounded-lg p-4 my-6 overflow-x-auto">
        <div 
          ref={elementRef}
          className="mermaid-diagram flex justify-center"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </div>
  );
}

// Custom hook for mermaid theme management
export function useMermaidTheme() {
  const [theme, setTheme] = useState<'default' | 'dark' | 'forest' | 'neutral'>('default');

  const updateTheme = (newTheme: typeof theme) => {
    setTheme(newTheme);
    mermaid.initialize({
      theme: newTheme,
      startOnLoad: false
    });
  };

  return { theme, updateTheme };
}

// Export types for external use
export type MermaidTheme = 'default' | 'dark' | 'forest' | 'neutral';
export type { MermaidRendererProps };