'use client';

import React, { useState } from 'react';
import { useDocuments } from '@/hooks/useDocuments';

interface RefreshResult {
  success: boolean;
  newCount: number;
  previousCount: number;
}

export default function DocumentRefreshControl() {
  const { forceRefresh, stopAutoRefresh, isAutoRefreshEnabled } = useDocuments();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshResult, setLastRefreshResult] = useState<RefreshResult | null>(null);

  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await forceRefresh();
      setLastRefreshResult(result);
    } catch (error) {
      console.error('Refresh failed:', error);
      setLastRefreshResult({ success: false, newCount: 0, previousCount: 0 });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleStopAutoRefresh = () => {
    stopAutoRefresh();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Document Refresh Control
        </h3>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isAutoRefreshEnabled 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
          }`}>
            {isAutoRefreshEnabled ? '🔄 Auto-refresh ON' : '⏸️ Auto-refresh OFF'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex space-x-3">
          <button
            onClick={handleForceRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Refreshing...
              </>
            ) : (
              '🔄 Force Refresh'
            )}
          </button>

          {isAutoRefreshEnabled && (
            <button
              onClick={handleStopAutoRefresh}
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              ⏸️ Stop Auto-refresh
            </button>
          )}
        </div>

        {lastRefreshResult && (
          <div className={`p-3 rounded-md ${
            lastRefreshResult.success 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <div className="flex">
              <div className="flex-shrink-0">
                {lastRefreshResult.success ? (
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${
                  lastRefreshResult.success 
                    ? 'text-green-800 dark:text-green-200'
                    : 'text-red-800 dark:text-red-200'
                }`}>
                  {lastRefreshResult.success ? 'Refresh Successful' : 'Refresh Failed'}
                </p>
                {lastRefreshResult.success && (
                  <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                    Documents: {lastRefreshResult.previousCount} → {lastRefreshResult.newCount}
                    {lastRefreshResult.newCount > lastRefreshResult.previousCount && (
                      <span className="ml-2 font-medium">
                        (+{lastRefreshResult.newCount - lastRefreshResult.previousCount} new)
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>• Auto-refresh checks for new .md files every 30 seconds</p>
          <p>• Add files to <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">/data-sources/</code> subfolders to see them appear automatically</p>
          <p>• Use &quot;Force Refresh&quot; to manually check for changes immediately</p>
        </div>
      </div>
    </div>
  );
}