// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import useGetCountByStatus from '@/hooks/dashboard/useGetCountByStatus';
import StatusPieChartSkeleton from './skeletons/StatusPieChartSkeleton';

interface Props {
    
}

const StatusPieChart = (props: Props) => {
  const { statusCounts, isLoading, error } = useGetCountByStatus();  // Create the data for the pie chart from the API response
  const statusData = !isLoading && statusCounts ? [
    { name: 'Approved', value: statusCounts.approvedCount, color: '#20462c' },
    { name: 'Pending', value: statusCounts.pendingCount, color: '#533d1c' },
    { name: 'Rejected', value: statusCounts.rejectedCount, color: '#522727' },
  ] : [];
  
  return (
    <Card className="neo-card overflow-hidden w-full h-[350px]">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Projects by Status</CardTitle>
      </CardHeader>      <CardContent className="pb-4">
        {isLoading ? (
          <div className="h-[250px]">
            <StatusPieChartSkeleton />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-[250px] text-destructive">
            Error loading status data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                innerRadius={50}
                paddingAngle={5}
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
                className="animate-fade-in"
              >
                {statusData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color}
                    stroke="transparent"
                    className="hover:opacity-90 transition-opacity cursor-pointer"
                  />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }} 
                itemStyle={{ color: '#fff' }}
                formatter={(value: number) => [`${value} projects`, '']}
              />
              <Legend 
                layout="horizontal" 
                verticalAlign="bottom" 
                align="center"
                formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

export default StatusPieChart
