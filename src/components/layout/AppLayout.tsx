'use client';

import React from 'react';
import { FloatingNav, NavProvider, useNavContext } from './FloatingNav';
import { Header } from './Header';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayoutContent: React.FC<AppLayoutProps> = ({ children }) => {
  const { isCollapsed } = useNavContext();
  
  return (
    <div className="min-h-screen bg-background">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-from/20 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to/20 rounded-full blur-3xl animate-float-fast" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-via/10 rounded-full blur-3xl animate-shimmer" style={{ animationDelay: '4s' }} />
      </div>
      
      {/* Floating Navigation */}
      <FloatingNav />
      
      {/* Main Content Area */}
      <div className={`transition-all duration-300 ${
        isCollapsed ? 'pl-20' : 'pl-20 lg:pl-72'
      }`}>
        {/* Header */}
        <Header />
        
        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <NavProvider>
      <AppLayoutContent>{children}</AppLayoutContent>
    </NavProvider>
  );
};

export default AppLayout;