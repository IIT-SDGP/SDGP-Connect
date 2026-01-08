// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const StatusPieChartSkeleton: React.FC = () => {
  return (
    <Card className="neo-card overflow-hidden w-full h-[350px]">
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          <Skeleton className="h-6 w-48" />
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="flex items-center justify-center h-[250px] relative">
          {/* Outer ring */}
          <div className="absolute w-[160px] h-[160px] rounded-full border-8 border-muted/30 backdrop-blur-sm"></div>
          
          {/* Inner circle with hole */}
          <div className="relative w-[160px] h-[160px] rounded-full">
            <div className="absolute inset-[30px] bg-background rounded-full z-10"></div>
            
            {/* Pie segments */}
            <div className="absolute inset-0 bg-transparent">
              <div className="absolute inset-0 bg-[#20462c]/40 rounded-full clip-segment-120"></div>
              <div className="absolute inset-0 bg-[#533d1c]/40 rounded-full clip-segment-90 rotate-120"></div>
              <div className="absolute inset-0 bg-[#522727]/40 rounded-full clip-segment-150 rotate-210"></div>
            </div>
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-0 w-full flex justify-center space-x-6">
            {['Approved', 'Pending', 'Rejected'].map((label, index) => (
              <div key={index} className="flex items-center">
                <Skeleton className="w-3 h-3 rounded-sm mr-2" 
                  style={{
                    backgroundColor: index === 0 ? '#20462c' : index === 1 ? '#533d1c' : '#522727',
                    opacity: 0.4
                  }}
                />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusPieChartSkeleton;

// Add some required styles to your global CSS file
const styles = `
/* Add these to your CSS */
.clip-segment-120 {
  clip-path: polygon(50% 50%, 0 0, 0 50%, 0 100%, 50% 100%, 100% 100%, 100% 50%);
}
.clip-segment-90 {
  clip-path: polygon(50% 50%, 100% 0, 100% 100%, 50% 100%);
}
.clip-segment-150 {
  clip-path: polygon(50% 50%, 0 0, 50% 0, 100% 0, 100% 50%);
}
.rotate-120 {
  transform: rotate(120deg);
}
.rotate-210 {
  transform: rotate(210deg);
}
`;
