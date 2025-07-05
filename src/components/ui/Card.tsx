'use client';

import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient' | 'minimal';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'glass',
  padding = 'md',
  hover = false,
  onClick
}) => {
  const baseClasses = 'rounded-2xl transition-all duration-300';
  
  const variantClasses = {
    default: 'bg-white/10 border border-white/20 backdrop-blur-md',
    glass: 'bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg',
    gradient: 'bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-md shadow-xl',
    minimal: 'bg-white/5 backdrop-blur-sm'
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const hoverClasses = hover ? 'hover:bg-white/10 hover:shadow-xl hover:scale-[1.02] cursor-pointer' : '';
  
  return (
    <div
      className={clsx(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        hoverClasses,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;