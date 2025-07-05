'use client';

import React from 'react';
import {
  DocumentTextIcon,
  FolderIcon,
  ClockIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { Card } from '../ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  gradient
}) => {
  const changeColors = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-white/60'
  };
  
  return (
    <Card variant="glass" className="relative overflow-hidden group hover:scale-[1.02]" hover>
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity`} />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} bg-opacity-20`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          
          {change && (
            <div className={`flex items-center space-x-1 ${changeColors[changeType]}`}>
              <ArrowTrendingUpIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        
        <div>
          <h3 className="text-white/80 text-sm font-medium mb-1">{title}</h3>
          <p className="text-white text-2xl font-bold">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export const StatsCards: React.FC = () => {
  const stats = [
    {
      title: 'Total Documents',
      value: '45',
      change: '+5',
      changeType: 'positive' as const,
      icon: DocumentTextIcon,
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Categories',
      value: '10',
      icon: FolderIcon,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Last Updated',
      value: '2 hours ago',
      icon: ClockIcon,
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Knowledge Areas',
      value: '5',
      change: 'Strategic Focus',
      changeType: 'neutral' as const,
      icon: EyeIcon,
      gradient: 'from-orange-500 to-red-500'
    },
    {
      title: 'Business Docs',
      value: '15',
      change: 'Core Strategy',
      changeType: 'neutral' as const,
      icon: UserGroupIcon,
      gradient: 'from-indigo-500 to-purple-500'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

export default StatsCards;