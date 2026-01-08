// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { useGetSubmissions } from '@/hooks/dashboard/useGetSubmissions';
import SubmissionsLineChartSkeleton from './skeletons/SubmissionsLineChartSkeleton';

const SubmissionsLineChart: React.FC = () => {
  // Fetch real data using custom hook
  const { data, isLoading, error } = useGetSubmissions();
  
  // Calculate the average if data is available
  const average = data.length > 0 
    ? data.reduce((sum, item) => sum + item.submissions, 0) / data.length
    : 0;
  return (
    <Card className="neo-card overflow-hidden w-full h-[350px]">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Submissions Over Time</CardTitle>
      </CardHeader>      <CardContent className="pb-4">
        {isLoading ? (
          <SubmissionsLineChartSkeleton />
        ) : error ? (
          <div className="flex items-center justify-center h-[250px] text-destructive">
            Failed to load submission data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 5,
              }}
              className="animate-fade-in"
            >
              <defs>
                <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#054afc" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#054afc" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="#64748b" 
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <YAxis 
                stroke="#64748b" 
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '8px', 
                  backgroundColor: 'rgba(0, 0, 0, 0.8)', 
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }} 
                itemStyle={{ color: '#fff' }}
                labelStyle={{ color: '#64748b' }}
              />
              {data.length > 0 && (
                <ReferenceLine 
                  y={average} 
                  stroke="rgba(255,255,255,0.3)" 
                  strokeDasharray="3 3"
                  label={{ 
                    position: 'right', 
                    value: 'Average', 
                    fill: 'rgba(255,255,255,0.6)',
                    fontSize: 12 
                  }} 
                />
              )}
              <Line
                type="monotone"
                dataKey="submissions"
                stroke="#054afc"
                activeDot={{ r: 6, fill: '#054afc', stroke: '#fff', strokeWidth: 2 }}
                strokeWidth={2}
                dot={{ r: 4, fill: '#054afc', stroke: '#fff', strokeWidth: 1 }}
                fillOpacity={1}
                fill="url(#colorSubmissions)"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default SubmissionsLineChart;
