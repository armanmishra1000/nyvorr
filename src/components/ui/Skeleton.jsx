import React from 'react';

export const Skeleton = ({ className = '', ...props }) => (
  <div 
    className={`bg-[#2a3238] animate-pulse rounded-lg ${className}`}
    style={{
      background: 'linear-gradient(90deg, #2a3238 0%, #3a434a 50%, #2a3238 100%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
    }}
    {...props}
  />
);

const ProductSkeleton = () => (
  <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Image Skeleton */}
      <div className="space-y-4">
        <Skeleton className="w-full aspect-square rounded-2xl" />
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 w-16 rounded-lg" />
          ))}
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4 rounded-md" />
          <Skeleton className="h-6 w-1/2 rounded-md" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-5 w-1/3 rounded-md" />
          <Skeleton className="h-5 w-1/4 rounded-md" />
        </div>
        
        <div className="pt-4">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>
        
        <div className="space-y-4 pt-4">
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          <Skeleton className="h-4 w-4/6 rounded" />
        </div>
        
        <div className="flex items-center gap-4 pt-4">
          <Skeleton className="h-12 w-32 rounded-lg" />
          <Skeleton className="h-12 flex-1 rounded-lg" />
        </div>
      </div>
    </div>
  </div>
);

export default ProductSkeleton;
