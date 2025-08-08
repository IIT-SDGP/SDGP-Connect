/* Copyright (c) 2025, the contributors of the SDGP Connect project. All Rights Reserved.

This software is the joint property of the contributors to the SDGP Connect project.
Unauthorized distribution, commercial use, or reproduction of any part of this material
in any form is strictly prohibited without the explicit written consent of all contributors.
You may not alter or remove any copyright or attribution notice from this content. */

import { Skeleton } from "@/components/ui/skeleton";

export function FeaturedBlogCardSkeleton() {
  return (
    <div className="group cursor-pointer h-full">
      <div className="relative h-full bg-card border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
        {/* Featured image skeleton */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Skeleton className="w-full h-full" />
          {/* Category badge skeleton */}
          <div className="absolute top-4 left-4">
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
        
        {/* Content area */}
        <div className="p-6 flex flex-col justify-between h-[calc(100%-200px)]">
          <div>
            {/* Title skeleton */}
            <Skeleton className="h-6 w-full mb-2" />
            <Skeleton className="h-6 w-4/5 mb-3" />
            
            {/* Excerpt skeleton */}
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-3/4 mb-4" />
          </div>
          
          {/* Author section skeleton */}
          <div className="flex items-center gap-3 mt-auto">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <div className="ml-auto">
              <Skeleton className="w-8 h-8 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
