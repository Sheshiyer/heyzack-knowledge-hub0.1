'use client';

import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className
}) => {
  const baseClasses = 'inline-flex items-center font-medium transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-white/10 text-white/90 border border-white/20',
    primary: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 border border-purple-400/30',
    secondary: 'bg-blue-500/20 text-blue-200 border border-blue-400/30',
    success: 'bg-green-500/20 text-green-200 border border-green-400/30',
    warning: 'bg-yellow-500/20 text-yellow-200 border border-yellow-400/30',
    error: 'bg-red-500/20 text-red-200 border border-red-400/30',
    glass: 'bg-white/5 text-white/90 border border-white/10 backdrop-blur-xl shadow-lg'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs rounded-lg',
    md: 'px-3 py-1.5 text-sm rounded-xl',
    lg: 'px-4 py-2 text-base rounded-xl'
  };
  
  return (
    <span
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default Badge;