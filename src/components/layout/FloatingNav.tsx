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
      <div className="h-full glass rounded-2xl shadow-glass flex flex-col animate-glass-float">
        {/* Header */}
        <div className="p-4 border-b border-border/20">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                  <BookOpenIcon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-foreground font-display font-semibold text-sm">HeyZack</h2>
                  <p className="text-muted-foreground text-xs">Knowledge Hub</p>
                </div>
              </div>
            )}
            
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="btn-glass p-1.5 rounded-lg transition-all duration-200 hover:shadow-glow"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
              ) : (
                <ChevronLeftIcon className="w-4 h-4 text-muted-foreground hover:text-foreground transition-colors" />
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
                  'nav-item flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                  active
                    ? 'bg-primary/20 text-foreground border border-primary/30 shadow-glow-pink'
                    : 'text-muted-foreground hover:text-foreground hover:bg-glass-light'
                )}
              >
                <Icon className={clsx(
                  'w-5 h-5 transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                )} />
                
                {!isCollapsed && (
                  <span className="font-medium text-sm">{item.name}</span>
                )}
                
                {!isCollapsed && item.badge && (
                  <span className="ml-auto px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
        
        {/* Quick Actions */}
        <div className="p-4 border-t border-border/20 space-y-2">
          {quickActions.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'nav-item flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                  active
                    ? 'bg-primary/20 text-foreground border border-primary/30 shadow-glow-pink'
                    : 'text-muted-foreground hover:text-foreground hover:bg-glass-light'
                )}
              >
                <Icon className={clsx(
                  'w-5 h-5 transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
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