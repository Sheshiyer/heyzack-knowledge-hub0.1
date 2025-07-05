'use client';

import React, { useState, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { clsx } from 'clsx';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpenIcon,
  LightBulbIcon,
  CpuChipIcon,
  ChartPieIcon,
  ArchiveBoxIcon
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const navigationItems: NavItem[] = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Search', href: '/search', icon: MagnifyingGlassIcon },
  { name: 'Business Strategy', href: '/business-strategy', icon: LightBulbIcon },
  { name: 'Technical Documentation', href: '/technical-docs', icon: CpuChipIcon },
  { name: 'Market Research', href: '/market-research', icon: ChartPieIcon },
  { name: 'Strategic Analysis', href: '/strategic-analysis', icon: BookOpenIcon },
  { name: 'Reference Materials', href: '/reference-materials', icon: ArchiveBoxIcon }
];

const quickActions: NavItem[] = [
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon }
];

// Create context for navigation state
interface NavContextType {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

const NavContext = createContext<NavContextType | undefined>(undefined);

export const useNavContext = () => {
  const context = useContext(NavContext);
  if (!context) {
    throw new Error('useNavContext must be used within a NavProvider');
  }
  return context;
};

export const NavProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <NavContext.Provider value={{ isCollapsed, setIsCollapsed }}>
      {children}
    </NavContext.Provider>
  );
};

export const FloatingNav: React.FC = () => {
  const { isCollapsed, setIsCollapsed } = useNavContext();
  const pathname = usePathname();
  
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };
  
  return (
    <div className={clsx(
      'fixed left-4 top-4 bottom-4 z-50 transition-all duration-300',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      <div className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <BookOpenIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-white font-semibold text-sm">HeyZack</h2>
                  <p className="text-white/60 text-xs">Knowledge Hub</p>
                </div>
              </div>
            )}
            
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="w-4 h-4 text-white/80" />
              ) : (
                <ChevronLeftIcon className="w-4 h-4 text-white/80" />
              )}
            </button>
          </div>
        </div>
        
        {/* Navigation Items */}
        <div className="flex-1 p-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                  active
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/30'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className={clsx(
                  'w-5 h-5 transition-colors',
                  active ? 'text-purple-300' : 'text-white/70 group-hover:text-white'
                )} />
                
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.name}</span>
                )}
                
                {!isCollapsed && item.badge && (
                  <span className="ml-auto px-2 py-0.5 bg-purple-500/20 text-purple-200 text-xs rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
        
        {/* Quick Actions */}
        <div className="p-4 border-t border-white/10 space-y-2">
          {quickActions.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                  active
                    ? 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-white border border-purple-400/30'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className={clsx(
                  'w-5 h-5 transition-colors',
                  active ? 'text-purple-300' : 'text-white/70 group-hover:text-white'
                )} />
                
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.name}</span>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FloatingNav;