'use client';

import { useState } from 'react';
import { 
  CogIcon, 
  ArrowLeftIcon,
  BellIcon,
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  PaintBrushIcon,
  ServerIcon,
  TrashIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { AppLayout } from '@/components/layout/AppLayout';

type SettingsTab = 'general' | 'appearance' | 'search' | 'notifications' | 'privacy' | 'data';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'HeyZack Knowledge Hub',
    siteDescription: 'Your centralized repository for business documents, strategic analysis, and technical documentation.',
    defaultLanguage: 'en',
    timezone: 'UTC',
    
    // Appearance Settings
    theme: 'dark',
    accentColor: 'purple',
    compactMode: false,
    showAnimations: true,
    
    // Search Settings
    searchResultsPerPage: 10,
    enableFuzzySearch: true,
    searchSuggestions: true,
    indexFullContent: true,
    
    // Notification Settings
    emailNotifications: true,
    documentUpdates: true,
    systemAlerts: true,
    weeklyDigest: false,
    
    // Privacy Settings
    analyticsEnabled: true,
    shareUsageData: false,
    cookieConsent: true,
    dataRetention: '2years',
    
    // Data Settings
    autoBackup: true,
    backupFrequency: 'daily',
    compressionEnabled: true,
    maxFileSize: '10MB'
  });

  const updateSetting = (key: string, value: boolean | string | number) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'appearance', name: 'Appearance', icon: PaintBrushIcon },
    { id: 'search', name: 'Search', icon: MagnifyingGlassIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'privacy', name: 'Privacy', icon: ShieldCheckIcon },
    { id: 'data', name: 'Data', icon: ServerIcon }
  ] as const;

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Site Name</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => updateSetting('siteName', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Site Description</label>
              <textarea
                value={settings.siteDescription}
                onChange={(e) => updateSetting('siteDescription', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Default Language</label>
                <select
                  value={settings.defaultLanguage}
                  onChange={(e) => updateSetting('defaultLanguage', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={(e) => updateSetting('timezone', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>
          </div>
        );
        
      case 'appearance':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-4">Theme</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => updateSetting('theme', 'dark')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.theme === 'dark'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/20 bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <div className="w-full h-16 bg-gradient-to-br from-gray-900 to-gray-800 rounded mb-2"></div>
                  <span className="text-white text-sm">Dark Theme</span>
                </button>
                
                <button
                  onClick={() => updateSetting('theme', 'light')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    settings.theme === 'light'
                      ? 'border-purple-500 bg-purple-500/20'
                      : 'border-white/20 bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <div className="w-full h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-2"></div>
                  <span className="text-white text-sm">Light Theme</span>
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-4">Accent Color</label>
              <div className="grid grid-cols-4 gap-3">
                {['purple', 'blue', 'green', 'orange'].map(color => (
                  <button
                    key={color}
                    onClick={() => updateSetting('accentColor', color)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      settings.accentColor === color
                        ? 'border-white/50'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <div className={`w-full h-8 rounded bg-gradient-to-r ${
                      color === 'purple' ? 'from-purple-500 to-pink-500' :
                      color === 'blue' ? 'from-blue-500 to-cyan-500' :
                      color === 'green' ? 'from-green-500 to-emerald-500' :
                      'from-orange-500 to-red-500'
                    }`}></div>
                    <span className="text-white text-xs mt-2 block capitalize">{color}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Compact Mode</h4>
                  <p className="text-white/70 text-sm">Reduce spacing and padding for more content</p>
                </div>
                <button
                  onClick={() => updateSetting('compactMode', !settings.compactMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.compactMode ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.compactMode ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Animations</h4>
                  <p className="text-white/70 text-sm">Enable smooth transitions and animations</p>
                </div>
                <button
                  onClick={() => updateSetting('showAnimations', !settings.showAnimations)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.showAnimations ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.showAnimations ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'search':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Search Results Per Page</label>
              <select
                value={settings.searchResultsPerPage}
                onChange={(e) => updateSetting('searchResultsPerPage', parseInt(e.target.value))}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value={5}>5 results</option>
                <option value={10}>10 results</option>
                <option value={20}>20 results</option>
                <option value={50}>50 results</option>
              </select>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Fuzzy Search</h4>
                  <p className="text-white/70 text-sm">Find results even with typos and partial matches</p>
                </div>
                <button
                  onClick={() => updateSetting('enableFuzzySearch', !settings.enableFuzzySearch)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.enableFuzzySearch ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.enableFuzzySearch ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Search Suggestions</h4>
                  <p className="text-white/70 text-sm">Show autocomplete suggestions while typing</p>
                </div>
                <button
                  onClick={() => updateSetting('searchSuggestions', !settings.searchSuggestions)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.searchSuggestions ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.searchSuggestions ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Index Full Content</h4>
                  <p className="text-white/70 text-sm">Search within document content, not just titles</p>
                </div>
                <button
                  onClick={() => updateSetting('indexFullContent', !settings.indexFullContent)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.indexFullContent ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.indexFullContent ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Email Notifications</h4>
                  <p className="text-white/70 text-sm">Receive notifications via email</p>
                </div>
                <button
                  onClick={() => updateSetting('emailNotifications', !settings.emailNotifications)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.emailNotifications ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Document Updates</h4>
                  <p className="text-white/70 text-sm">Get notified when documents are modified</p>
                </div>
                <button
                  onClick={() => updateSetting('documentUpdates', !settings.documentUpdates)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.documentUpdates ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.documentUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">System Alerts</h4>
                  <p className="text-white/70 text-sm">Important system notifications and updates</p>
                </div>
                <button
                  onClick={() => updateSetting('systemAlerts', !settings.systemAlerts)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.systemAlerts ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.systemAlerts ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Weekly Digest</h4>
                  <p className="text-white/70 text-sm">Weekly summary of activity and updates</p>
                </div>
                <button
                  onClick={() => updateSetting('weeklyDigest', !settings.weeklyDigest)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.weeklyDigest ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.weeklyDigest ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        );
        
      case 'privacy':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Analytics</h4>
                  <p className="text-white/70 text-sm">Enable usage analytics and insights</p>
                </div>
                <button
                  onClick={() => updateSetting('analyticsEnabled', !settings.analyticsEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.analyticsEnabled ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.analyticsEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Share Usage Data</h4>
                  <p className="text-white/70 text-sm">Help improve the platform by sharing anonymous usage data</p>
                </div>
                <button
                  onClick={() => updateSetting('shareUsageData', !settings.shareUsageData)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.shareUsageData ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.shareUsageData ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Cookie Consent</h4>
                  <p className="text-white/70 text-sm">Allow cookies for enhanced functionality</p>
                </div>
                <button
                  onClick={() => updateSetting('cookieConsent', !settings.cookieConsent)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.cookieConsent ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.cookieConsent ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-white mb-2">Data Retention Period</label>
              <select
                value={settings.dataRetention}
                onChange={(e) => updateSetting('dataRetention', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="1year">1 Year</option>
                <option value="2years">2 Years</option>
                <option value="5years">5 Years</option>
                <option value="indefinite">Indefinite</option>
              </select>
            </div>
          </div>
        );
        
      case 'data':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Auto Backup</h4>
                  <p className="text-white/70 text-sm">Automatically backup your data</p>
                </div>
                <button
                  onClick={() => updateSetting('autoBackup', !settings.autoBackup)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.autoBackup ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Compression</h4>
                  <p className="text-white/70 text-sm">Compress files to save storage space</p>
                </div>
                <button
                  onClick={() => updateSetting('compressionEnabled', !settings.compressionEnabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.compressionEnabled ? 'bg-purple-500' : 'bg-white/20'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.compressionEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Backup Frequency</label>
                <select
                  value={settings.backupFrequency}
                  onChange={(e) => updateSetting('backupFrequency', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Max File Size</label>
                <select
                  value={settings.maxFileSize}
                  onChange={(e) => updateSetting('maxFileSize', e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="5MB">5 MB</option>
                  <option value="10MB">10 MB</option>
                  <option value="25MB">25 MB</option>
                  <option value="50MB">50 MB</option>
                  <option value="100MB">100 MB</option>
                </select>
              </div>
            </div>
            
            <div className="pt-6 border-t border-white/20">
              <h4 className="text-white font-medium mb-4">Data Management</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="flex items-center justify-center px-6 py-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-colors">
                  <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                  Export Data
                </button>
                
                <button className="flex items-center justify-center px-6 py-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-colors">
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Clear Cache
                </button>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl"></div>
          <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="inline-flex items-center text-sm font-medium text-white/70 hover:text-white transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <CogIcon className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                <p className="text-white/70">Customize your knowledge hub experience</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-xl blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as SettingsTab)}
                        className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-all ${
                          activeTab === tab.id
                            ? 'bg-purple-500/20 text-white border border-purple-500/30'
                            : 'text-white/70 hover:text-white hover:bg-white/10'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-2xl blur-xl"></div>
              <div className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {tabs.find(tab => tab.id === activeTab)?.name}
                  </h2>
                  <p className="text-white/70">
                    {activeTab === 'general' && 'Configure basic application settings'}
                    {activeTab === 'appearance' && 'Customize the look and feel of your interface'}
                    {activeTab === 'search' && 'Adjust search behavior and preferences'}
                    {activeTab === 'notifications' && 'Manage your notification preferences'}
                    {activeTab === 'privacy' && 'Control your privacy and data sharing settings'}
                    {activeTab === 'data' && 'Manage data storage and backup options'}
                  </p>
                </div>
                
                {renderTabContent()}
                
                <div className="mt-8 pt-6 border-t border-white/20 flex justify-end space-x-4">
                  <button className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors">
                    Reset to Defaults
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}