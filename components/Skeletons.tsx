// ============================================================================
// Skeletons.tsx — Reusable skeleton loading components
// Used in: CategoryView, FavoritesPage, ProductDetailsPage
// ============================================================================

import React from 'react';

// ============================================================================
// Base shimmer block
// ============================================================================

const Shimmer: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-stone-200 rounded ${className}`} />
);

// ============================================================================
// SkeletonHeader — sticky header bar skeleton
// Used in: CategoryView, FavoritesPage, ProductDetailsPage
// ============================================================================

export const SkeletonHeader: React.FC = () => (
  <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-stone-200">
    <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
      {/* Back button placeholder */}
      <Shimmer className="w-16 h-5 rounded-full" />
      {/* Separator */}
      <div className="w-px h-4 bg-stone-200" />
      {/* Breadcrumb placeholder */}
      <Shimmer className="w-24 h-4 rounded-full" />
    </div>
  </header>
);

// ============================================================================
// SkeletonHero — page hero section skeleton
// Used in: CategoryView, FavoritesPage
// ============================================================================

export const SkeletonHero: React.FC = () => (
  <div className="bg-gradient-to-b from-white to-stone-50 py-16">
    <div className="max-w-7xl mx-auto px-6 text-center flex flex-col items-center gap-4">
      <Shimmer className="w-72 h-12 rounded-2xl" />
      <Shimmer className="w-96 h-5 rounded-full" />
    </div>
  </div>
);

// ============================================================================
// SkeletonProductCard — single product card placeholder
// Used in: CategoryView, FavoritesPage
// ============================================================================

export const SkeletonProductCard: React.FC = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col h-full">
    {/* Image area */}
    <Shimmer className="aspect-square w-full rounded-none" />
    {/* Content area */}
    <div className="p-5 flex-1 flex flex-col gap-3">
      {/* Title */}
      <Shimmer className="h-5 w-3/4 rounded-full" />
      {/* Description lines */}
      <Shimmer className="h-3.5 w-full rounded-full" />
      <Shimmer className="h-3.5 w-2/3 rounded-full" />
      {/* Price + button row */}
      <div className="flex items-center justify-between mt-auto pt-2">
        <Shimmer className="h-5 w-24 rounded-full" />
        <Shimmer className="h-8 w-20 rounded-full" />
      </div>
    </div>
  </div>
);

// ============================================================================
// SkeletonGrid — a full grid of placeholder cards
// ============================================================================

interface SkeletonGridProps {
  count?: number;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonProductCard key={i} />
    ))}
  </div>
);

// ============================================================================
// SkeletonProductDetails — full product detail page skeleton
// Used in: ProductDetailsPage (while products context is loading)
// ============================================================================

export const SkeletonProductDetails: React.FC = () => (
  <div className="max-w-6xl mx-auto px-6 py-10 md:py-16">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
      {/* Image column */}
      <Shimmer className="aspect-square w-full rounded-2xl" />

      {/* Details column */}
      <div className="flex flex-col gap-6">
        {/* Category breadcrumb */}
        <Shimmer className="h-3.5 w-20 rounded-full" />
        {/* Title */}
        <Shimmer className="h-10 w-4/5 rounded-xl" />
        {/* Price + badge */}
        <div className="flex items-center gap-4">
          <Shimmer className="h-7 w-28 rounded-full" />
          <Shimmer className="h-6 w-20 rounded-full" />
        </div>
        {/* Description */}
        <div className="flex flex-col gap-2">
          <Shimmer className="h-4 w-full rounded-full" />
          <Shimmer className="h-4 w-full rounded-full" />
          <Shimmer className="h-4 w-3/4 rounded-full" />
        </div>
        {/* Divider */}
        <div className="w-full h-px bg-stone-200" />
        {/* Action buttons */}
        <div className="flex gap-3">
          <Shimmer className="h-12 flex-1 rounded-full" />
          <Shimmer className="h-12 w-32 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

// ============================================================================
// SkeletonSearchResult — single search result row placeholder
// Used in: SearchModal (while loading initial products)
// ============================================================================

export const SkeletonSearchResult: React.FC = () => (
  <div className="flex items-center gap-4 px-5 py-3">
    <Shimmer className="w-12 h-12 rounded-xl flex-shrink-0" />
    <div className="flex-1 flex flex-col gap-2">
      <Shimmer className="h-4 w-2/3 rounded-full" />
      <Shimmer className="h-3 w-1/3 rounded-full" />
    </div>
    <div className="flex flex-col items-end gap-2 flex-shrink-0">
      <Shimmer className="h-4 w-16 rounded-full" />
      <Shimmer className="h-3.5 w-14 rounded-full" />
    </div>
  </div>
);
