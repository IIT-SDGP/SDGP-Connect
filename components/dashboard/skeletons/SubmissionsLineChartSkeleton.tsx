// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const SubmissionsLineChartSkeleton: React.FC = () => {
  return (
   
      <div className="pb-4">
        <div className="relative h-[250px] w-full">
          {/* Vertical grid lines */}
          <div className="absolute inset-0 flex justify-between px-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-px h-full bg-white/5" />
            ))}
          </div>
          
          {/* Horizontal grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between py-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-full h-px bg-white/5" />
            ))}
          </div>
          
          {/* X-axis */}
          <div className="absolute bottom-0 inset-x-0 h-8">
            <div className="flex justify-between px-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-8" />
              ))}
            </div>
          </div>
          
          {/* Y-axis */}
          <div className="absolute left-0 inset-y-0 w-8 flex flex-col justify-between py-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-10" />
            ))}
          </div>
          
          {/* Chart line placeholder */}
          <div className="absolute inset-x-8 top-1/2 right-4 h-px bg-primary/30 backdrop-blur-sm" />
          
          {/* Chart area placeholder */}
          <div className="absolute inset-x-8 top-[40%] bottom-8 right-4 bg-gradient-to-t from-primary/10 to-transparent rounded-sm" />
          
          {/* Data points */}
          <div className="absolute inset-0 flex justify-between items-center px-8 py-[40%]">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-3 w-3 rounded-full bg-primary/40" />
            ))}
          </div>
          
          {/* Reference line */}
          <div className="absolute inset-x-0 top-[40%] h-px border-t border-dashed border-white/20">
            <Skeleton className="absolute right-4 -top-3 h-6 w-16" />
          </div>
        </div>
      </div>
    
  );
};

export default SubmissionsLineChartSkeleton;
