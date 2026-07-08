// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { TrendingUp } from 'lucide-react';

const SubmissionsLineChart: React.FC = () => {
  const { data, isLoading, error } = useGetSubmissions();

  const average = data.length > 0
    ? data.reduce((sum, item) => sum + item.submissions, 0) / data.length
    : 0;

  return (
    <Card className="admin-surface flex h-[380px] w-full flex-col overflow-hidden rounded-2xl">
      <CardHeader className="flex-shrink-0 space-y-1 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <TrendingUp className="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold tracking-tight">
                Submissions over time
              </CardTitle>
              <CardDescription className="mt-1 text-sm leading-relaxed">
                Volume trend by period. The dashed line shows the average for quick comparison.
              </CardDescription>
            </div>
          </div>
          {!isLoading && !error && data.length > 0 ? (
            <div className="hidden shrink-0 rounded-xl border border-border/70 bg-muted/30 px-3 py-1.5 text-right sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Avg / period
              </p>
              <p className="text-lg font-semibold tabular-nums tracking-tight">
                {average.toFixed(1)}
              </p>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pb-4 pt-0">
        {isLoading ? (
          <div className="h-[260px] flex-1">
            <SubmissionsLineChartSkeleton />
          </div>
        ) : error ? (
          <div className="flex flex-1 items-center justify-center text-sm text-destructive">
            Failed to load submission data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minHeight={260}>
            <LineChart
              data={data}
              margin={{
                top: 8,
                right: 12,
                left: 0,
                bottom: 4,
              }}
              className="animate-fade-in"
            >
              <defs>
                <linearGradient id="colorSubmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis
                dataKey="name"
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <YAxis
                stroke="var(--muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={{ stroke: 'var(--border)' }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  backgroundColor: 'var(--card)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid var(--border)',
                  boxShadow: '0 12px 40px color-mix(in oklch, var(--foreground) 8%, transparent)',
                }}
                itemStyle={{ color: 'var(--foreground)' }}
                labelStyle={{ color: 'var(--muted-foreground)' }}
              />
              {data.length > 0 && (
                <ReferenceLine
                  y={average}
                  stroke="var(--border)"
                  strokeDasharray="3 3"
                  label={{
                    position: 'right',
                    value: 'Average',
                    fill: 'var(--muted-foreground)',
                    fontSize: 12
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey="submissions"
                stroke="var(--chart-1)"
                activeDot={{ r: 6, fill: 'var(--chart-1)', stroke: 'var(--card)', strokeWidth: 2 }}
                strokeWidth={2}
                dot={{ r: 4, fill: 'var(--chart-1)', stroke: 'var(--card)', strokeWidth: 1 }}
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
