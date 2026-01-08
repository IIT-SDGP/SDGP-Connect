// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import { Skeleton } from "@/components/ui/skeleton";

export function BlogCardSkeleton() {
  return (
    <div className="group transition-all duration-300 h-full">
      <div className="relative flex flex-col h-full">
        {/* Image skeleton */}
        <div className="w-full flex justify-start mb-4">
          <div className="max-w-[60%] w-full aspect-video bg-muted rounded-xl overflow-hidden relative">
            <Skeleton className="w-full h-full" />
            {/* Category badge skeleton */}
            <div className="absolute top-4 left-4">
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>
        
        {/* Content skeleton */}
        <div className="flex flex-col gap-2 mb-auto">
          {/* Title skeleton */}
          <Skeleton className="h-8 w-full mb-1" />
          <Skeleton className="h-8 w-3/4 mb-1" />
          
          {/* Excerpt skeleton */}
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6 mb-2" />
        </div>
        
        {/* Author section skeleton */}
        <div className="flex items-center gap-3 mt-3">
          <Skeleton className="w-8 h-8 rounded-full" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="ml-2">
            <Skeleton className="w-10 h-10 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
