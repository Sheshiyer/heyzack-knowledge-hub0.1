'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import {
  MagnifyingGlassIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { Card } from '../ui/Card';

export const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };
  
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/5 border-b border-white/10">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <form onSubmit={handleSearch}>
              <Input
                type="text"
                placeholder="Search documents, categories, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<MagnifyingGlassIcon className="w-5 h-5" />}
                variant="glass"
                fullWidth
              />
            </form>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-4 ml-6">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2"
            >
              {mounted ? (
                theme === 'dark' ? (
                  <SunIcon className="w-5 h-5" />
                ) : (
                  <MoonIcon className="w-5 h-5" />
                )
              ) : (
                <div className="w-5 h-5" />
              )}
            </Button>
            
            {/* Notifications */}
            <Button
              variant="ghost"
              size="sm"
              className="p-2 relative"
            >
              <BellIcon className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
            </Button>
            
            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-1"
              >
                <Avatar
                  size="sm"
                  fallback="U"
                  variant="gradient"
                />
              </Button>
              
              {showUserMenu && (
                <Card
                  className="absolute right-0 top-12 w-48 py-2"
                  variant="glass"
                  padding="none"
                >
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-white font-medium text-sm">John Doe</p>
                    <p className="text-white/60 text-xs">john@example.com</p>
                  </div>
                  
                  <div className="py-2">
                    <button className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/5 transition-colors flex items-center space-x-2">
                      <UserCircleIcon className="w-4 h-4" />
                      <span className="text-sm">Profile</span>
                    </button>
                    
                    <button className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/5 transition-colors flex items-center space-x-2">
                      <Cog6ToothIcon className="w-4 h-4" />
                      <span className="text-sm">Settings</span>
                    </button>
                  </div>
                  
                  <div className="border-t border-white/10 py-2">
                    <button className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                      <span className="text-sm">Sign out</span>
                    </button>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;