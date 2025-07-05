'use client';

import React, { useState } from 'react';
import {
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

export const SearchSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const popularSearches = [
    'Business Strategy',
    'Technical Documentation', 
    'Market Research',
    'Strategic Analysis',
    'Smart Home Automation'
  ];
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic here
    console.log('Searching for:', searchQuery);
  };
  
  return (
    <Card variant="gradient" className="relative overflow-hidden text-center">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="mb-8">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">Search Knowledge Base</h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">Find documents, templates, and resources across all knowledge areas</p>
        </div>
        
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="max-w-2xl mx-auto flex space-x-4">
            <div className="flex-1">
              <Input
                type="text"
                placeholder="Search documents, templates, or topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<MagnifyingGlassIcon className="w-6 h-6" />}
                variant="glass"
                fullWidth
                className="text-lg py-4"
              />
            </div>
            
            <Button
              type="submit"
              variant="primary"
              className="px-8 py-4 text-lg"
            >
              Search
            </Button>
          </div>
        </form>
        
        {/* Popular Searches */}
         <div>
           <h3 className="text-white/80 text-lg font-medium mb-4">Popular Searches</h3>
           <div className="flex flex-wrap justify-center gap-3">
             {popularSearches.map((search, index) => (
               <button
                 key={index}
                 onClick={() => setSearchQuery(search)}
                 className="transition-all duration-200 hover:scale-105"
               >
                 <Badge
                   variant="glass"
                   className="cursor-pointer hover:bg-white/10 px-4 py-2 text-base"
                 >
                   {search}
                 </Badge>
               </button>
             ))}
           </div>
         </div>
      </div>
    </Card>
  );
};

export default SearchSection;