'use client';

import React from 'react';

const primaryColor = '#70001A';
const secondaryColor = '#C89446';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

export default function Loader({ size = 'medium', text, fullScreen = false }: LoaderProps) {
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16',
    large: 'w-24 h-24'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const loader = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Spinning circle with gradient */}
      <div className="relative">
        <div 
          className={`${sizeClasses[size]} rounded-full border-4 border-gray-200`}
          style={{ borderTopColor: primaryColor, borderRightColor: secondaryColor }}
        >
          <div className="absolute inset-0 rounded-full animate-spin" 
               style={{
                 border: '4px solid transparent',
                 borderTopColor: primaryColor,
                 borderRightColor: secondaryColor,
               }}
          />
        </div>
        {/* Inner pulsing dot */}
        <div 
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse"
          style={{
            width: size === 'small' ? '8px' : size === 'medium' ? '16px' : '24px',
            height: size === 'small' ? '8px' : size === 'medium' ? '16px' : '24px',
            backgroundColor: secondaryColor,
          }}
        />
      </div>
      
      {text && (
        <div className={`font-medium ${textSizes[size]} animate-pulse`} style={{ color: primaryColor }}>
          {text}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
        {loader}
      </div>
    );
  }

  return loader;
}

// Mini inline loader for buttons
export function ButtonLoader() {
  return (
    <div className="inline-flex items-center gap-2">
      <div 
        className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin"
      />
      <span>Loading...</span>
    </div>
  );
}

// Card skeleton loader
export function CardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" style={{ backgroundColor: '#f0f0f0' }} />
      <div className="h-4 bg-gray-200 rounded w-full mb-2" style={{ backgroundColor: '#f0f0f0' }} />
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2" style={{ backgroundColor: '#f0f0f0' }} />
      <div className="h-4 bg-gray-200 rounded w-4/6" style={{ backgroundColor: '#f0f0f0' }} />
    </div>
  );
}

// Table skeleton loader
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg animate-pulse">
          <div className="w-12 h-12 rounded-full" style={{ backgroundColor: '#e0e0e0' }} />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3" style={{ backgroundColor: '#e0e0e0' }} />
            <div className="h-3 bg-gray-200 rounded w-1/4" style={{ backgroundColor: '#e0e0e0' }} />
          </div>
          <div className="h-8 w-20 bg-gray-200 rounded" style={{ backgroundColor: '#e0e0e0' }} />
        </div>
      ))}
    </div>
  );
}
