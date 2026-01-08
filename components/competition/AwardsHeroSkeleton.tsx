// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
import React from "react";

export function AwardsHeroSkeleton() {
  return (
    <div className="w-full bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-lg p-8 animate-pulse flex flex-col md:flex-row items-center gap-8 min-h-[320px]">
      {/* Image Skeleton */}
      <div className="w-40 h-40 bg-gray-700 rounded-xl flex-shrink-0" />
      {/* Content Skeleton */}
      <div className="flex-1 w-full space-y-4">
        <div className="h-8 w-2/3 bg-gray-700 rounded" />
        <div className="h-5 w-1/2 bg-gray-700 rounded" />
        <div className="h-4 w-1/3 bg-gray-700 rounded" />
        <div className="h-4 w-1/4 bg-gray-700 rounded" />
        <div className="flex gap-4 mt-6">
          <div className="h-10 w-32 bg-gray-700 rounded" />
          <div className="h-10 w-40 bg-gray-700 rounded" />
        </div>
      </div>
    </div>
  );
}
