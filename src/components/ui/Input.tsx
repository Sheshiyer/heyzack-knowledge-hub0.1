'use client';

import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'glass' | 'minimal';
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  variant = 'glass',
  fullWidth = false,
  className,
  ...props
}) => {
  const baseClasses = 'px-4 py-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500/50 placeholder-white/50';
  
  const variantClasses = {
    default: 'bg-white/10 border border-white/20 text-white backdrop-blur-md',
    glass: 'bg-white/5 border border-white/10 text-white backdrop-blur-xl shadow-lg',
    minimal: 'bg-transparent border-b border-white/20 text-white rounded-none px-0'
  };
  
  const widthClasses = fullWidth ? 'w-full' : '';
  const iconPadding = icon ? 'pl-12' : '';
  
  return (
    <div className={clsx('relative', fullWidth && 'w-full')}>
      {label && (
        <label className="block text-sm font-medium text-white/80 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60">
            {icon}
          </div>
        )}
        
        <input
          className={clsx(
            baseClasses,
            variantClasses[variant],
            widthClasses,
            iconPadding,
            error && 'border-red-400 focus:ring-red-500/50',
            className
          )}
          {...props}
        />
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
};

export default Input;