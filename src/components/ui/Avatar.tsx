'use client';

import React from 'react';
import Image from 'next/image';
import { clsx } from 'clsx';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
  variant?: 'default' | 'glass' | 'gradient';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  fallback,
  className,
  variant = 'glass'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };
  
  const variantClasses = {
    default: 'bg-white/10 border border-white/20',
    glass: 'bg-white/5 border border-white/10 backdrop-blur-xl shadow-lg',
    gradient: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-400/30'
  };
  
  const baseClasses = 'rounded-full flex items-center justify-center font-medium text-white transition-all duration-200';
  
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        width={40}
        height={40}
        className={clsx(
          baseClasses,
          sizeClasses[size],
          variantClasses[variant],
          'object-cover',
          className
        )}
      />
    );
  }
  
  return (
    <div
      className={clsx(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {fallback ? (
        fallback.charAt(0).toUpperCase()
      ) : (
        <svg className="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      )}
    </div>
  );
};

export default Avatar;