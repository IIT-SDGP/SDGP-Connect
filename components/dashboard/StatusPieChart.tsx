// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'
import React, { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import useGetCountByStatus from '@/hooks/dashboard/useGetCountByStatus';
import StatusPieChartSkeleton from './skeletons/StatusPieChartSkeleton';
import { PieChartIcon } from 'lucide-react';

const StatusPieChart = () => {
  const { statusCounts, isLoading, error } = useGetCountByStatus();
  const statusData = !isLoading && statusCounts ? [
    { name: 'Approved', value: statusCounts.approvedCount, color: 'var(--chart-3)' },
    { name: 'Pending', value: statusCounts.pendingCount, color: 'var(--chart-4)' },
    { name: 'Rejected', value: statusCounts.rejectedCount, color: 'var(--chart-5)' },
  ] : [];

  const total = useMemo(() => {
    if (!statusCounts) return 0;
    return (
      (statusCounts.approvedCount ?? 0) +
      (statusCounts.pendingCount ?? 0) +
      (statusCounts.rejectedCount ?? 0)
    );
  }, [statusCounts]);

  return (
    <Card className="admin-surface flex h-[380px] w-full flex-col overflow-hidden rounded-2xl">
      <CardHeader className="flex-shrink-0 space-y-1 pb-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <PieChartIcon className="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold tracking-tight">
                Projects by status
              </CardTitle>
              <CardDescription className="mt-1 text-sm leading-relaxed">
                Distribution of moderation outcomes across all submissions.
              </CardDescription>
            </div>
          </div>
          {!isLoading && !error && statusCounts ? (
            <div className="hidden shrink-0 rounded-xl border border-border/70 bg-muted/30 px-3 py-1.5 text-right sm:block">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Total
              </p>
              <p className="text-lg font-semibold tabular-nums tracking-tight">{total}</p>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col pb-4 pt-0">
        {isLoading ? (
          <div className="h-[260px] flex-1">
            <StatusPieChartSkeleton />
          </div>
        ) : error ? (
          <div className="flex flex-1 items-center justify-center text-sm text-destructive">
            Error loading status data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" minHeight={260}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={88}
                innerRadius={54}
                paddingAngle={4}
                cornerRadius={4}
                dataKey="value"
                animationBegin={0}
                animationDuration={1500}
                className="animate-fade-in"
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="var(--card)"
                    strokeWidth={2}
                    className="cursor-pointer transition-opacity hover:opacity-90"
                  />
                ))}
              </Pie>
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
                formatter={(value: number) => [`${value} projects`, 'Count']}
              />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                formatter={(value) => <span className="text-muted-foreground">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

export default StatusPieChart
