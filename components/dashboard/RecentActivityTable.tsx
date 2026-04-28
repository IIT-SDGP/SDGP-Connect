// © 2026 SDGP.lk
// Licensed under the GNU Affero General Public License v3.0 or later,
// with an additional restriction: Non-commercial use only.
// See <https://www.gnu.org/licenses/agpl-3.0.html> for details.
'use client'
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell 
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '../ui/loading-spinner';
import { Activity } from '@/hooks/dashboard/useGetActivity';
import { History } from 'lucide-react';

interface RecentActivityTableProps {
  activities: Activity[];
  isLoading?: boolean;
  error?: string | null;
}

const RecentActivityTable: React.FC<RecentActivityTableProps> = ({ activities, isLoading = false, error = null }) => {
  const getActionBadgeColor = (actionType: string) => {
    switch(actionType) {
      case 'Approved': return 'border-emerald-500/30 bg-emerald-500/15 text-emerald-500';
      case 'Rejected': return 'border-red-500/30 bg-red-500/15 text-red-500';
      case 'Featured': return 'border-indigo-500/30 bg-indigo-500/15 text-indigo-500';
      case 'Submitted': return 'border-amber-500/30 bg-amber-500/15 text-amber-500';
      default: return 'border-slate-500/30 bg-slate-500/15 text-slate-500';
    }
  };

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      // Yesterday
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays < 7) {
      // Less than a week
      return `${diffDays} days ago`;
    } else {
      // More than a week
      return date.toLocaleDateString();
    }
  };

  return (
    <Card className="admin-surface w-full overflow-hidden rounded-2xl">
      <CardHeader className="border-b border-border/50 bg-muted/20 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <History className="size-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold tracking-tight">
                Recent activity
              </CardTitle>
              <CardDescription className="mt-1 text-sm leading-relaxed">
                Latest moderation events and project updates.
              </CardDescription>
            </div>
          </div>
          {!isLoading && !error && activities.length > 0 ? (
            <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground tabular-nums">
              {activities.length} {activities.length === 1 ? 'entry' : 'entries'}
            </span>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center py-16 text-sm text-destructive">
            {error}
          </div>
        ) : activities.length === 0 ? (
          <div className="admin-empty-hint m-4">
            No recent activity yet. Approvals and submissions will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="admin-table-thead">
                <TableRow className="border-b border-border/70 hover:bg-transparent">
                  <TableHead className="font-semibold text-muted-foreground">Project</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">Group</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">Updated</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">Action</TableHead>
                  <TableHead className="font-semibold text-muted-foreground">By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity, index) => (
                  <TableRow
                    key={activity.id}
                    className={cn(
                      'border-border/40 transition-colors hover:bg-muted/40',
                      index % 2 === 0 ? 'bg-transparent' : 'bg-muted/10'
                    )}
                  >
                    <TableCell className="max-w-[200px] truncate font-medium">
                      {activity.projectTitle}
                    </TableCell>
                    <TableCell className="tabular-nums text-muted-foreground">
                      {activity.groupNumber}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(activity.lastUpdated)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          'rounded-lg font-medium',
                          getActionBadgeColor(activity.actionType)
                        )}
                      >
                        {activity.actionType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{activity.actionBy}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityTable;